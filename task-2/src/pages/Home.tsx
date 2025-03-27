import React, { useEffect, useState } from "react";
import CreateProductForm from "../components/CreateProductForm";
import EditProductForm from "../components/EditProductForm";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";
import constants from "../constants";
import { IPreviewProduct, IProduct } from "../interfaces/product";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<IPreviewProduct | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const fetchProduct = async (page: number = currentPage) => {
    try {
      const res = await axiosInstance.get(`/products?page=${page}`);
      const data = res?.data.data;
      if (data) {
        const _data = data?.map((el: IProduct, idx: number) => ({
          ...el,
          prev: `#slide${idx === 0 ? data.length : idx}`,
          next: `#slide${idx === data.length - 1 ? 1 : idx + 2}`,
        }));
        setProducts(_data);
        setCurrentPage(res?.data?.current_page);
        setTotalPage(res?.data?.last_page);
      }
      return;
    } catch (e) {
      console.log(e);
      Swal.fire({
        title: "Error!",
        text: "Failed fetch product. Please check your internet connection.",
        icon: "error",
      });

      return;
    }
  };

  const previewProduct = (productImg: string | null, price: number) => {
    (
      document?.getElementById("modalPreview") as HTMLDialogElement
    )?.showModal();
    const previewProperty = {
      image: productImg,
      price: price,
    };
    setCurrentProduct(previewProperty);
  };

  const handleDelete = async (productId: number) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axiosInstance.delete("/products/" + productId);
          fetchProduct(currentPage);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
    }
  };

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    fetchProduct(page);
  };

  const handleModalUpdate = (isCreated: boolean) => {
    (
      document.getElementById(constants.UpdateModalId)! as HTMLDialogElement
    ).close();
    if (isCreated) fetchProduct();
    setOpenUpdate(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <input
        type="checkbox"
        id={constants.CreateModalId}
        className="modal-toggle"
        checked={open}
        onChange={() => setOpen(!open)}
      />

      <dialog id={constants.CreateModalId} className="modal">
        <div className="modal-box w-full max-w-3xl p-6 sm:p-8">
          <CreateProductForm
            callback={(isCreated) => {
              setOpen(false);
              if (isCreated) fetchProduct();
            }}
          />
        </div>
      </dialog>

      {/* <div className="w-full flex justify-end">
        <label htmlFor={constants.CreateModalId} className="btn m-3 right-0">
          Create Product
        </label>
      </div> */}
      <div
        className="min-h-screen py-10 px-5"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="w-full flex justify-end">
          <label htmlFor={constants.CreateModalId} className="btn m-3 right-0">
            Create Product
          </label>
        </div>
        <div className="container-lg flex justify-center flex-wrap gap-4">
          {products &&
            products.map((product: IProduct) => (
              <div
                key={product.id}
                className="card bg-white w-96 shadow-lg rounded-lg overflow-hidden m-4 transform transition-transform hover:scale-105"
              >
                <figure
                  className="relative cursor-pointer"
                  onClick={() => {
                    previewProduct(
                      product?.image as string | null,
                      product?.price
                    );
                  }}
                >
                  {product.image ? (
                    <img
                      src={`http://127.0.0.1:8000/assets/images/${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 flex justify-center items-center bg-gray-200 rounded-t-lg">
                      <p className="text-gray-500 font-semibold">
                        Image Unavailable
                      </p>
                    </div>
                  )}
                </figure>
                <div className="card-body p-6 bg-gradient-to-br from-white to-gray-50 rounded-b-lg shadow-inner">
                  <h1 className="card-title text-lg font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="text-gray-700 text-sm mt-2">
                    {product.description}
                  </p>
                  <p className="text-primary font-semibold text-lg mt-2 text-end">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product?.price || 0)}
                  </p>
                  <div className="card-actions mt-4 flex justify-between">
                    <button
                      className="btn btn-outline btn-primary btn-md px-6 py-3 w-[47%] transition-transform duration-300 hover:scale-105"
                      onClick={() => {
                        setEditProductId(product.id!);
                        setOpenUpdate(!openUpdate);
                        (
                          document.getElementById(
                            constants.UpdateModalId
                          )! as HTMLDialogElement
                        ).showModal();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary btn-outline btn-md px-6 py-3 w-[47%] transition-transform duration-300 hover:scale-105"
                      onClick={() => handleDelete(product.id!)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="join">
        {totalPage &&
          Array.from({ length: totalPage }).map((_, index) => (
            <button
              key={index}
              className={`join-item btn btn-md ${
                index + 1 === currentPage
                  ? "btn-primary text-white font-bold"
                  : ""
              }`}
              onClick={() => handlePaginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
      </div>
      <dialog id={constants.UpdateModalId} className="modal">
        <div className="modal-box w-full max-w-3xl p-6 sm:p-8">
          {openUpdate && (
            <EditProductForm callback={handleModalUpdate} id={editProductId} />
          )}
        </div>
      </dialog>
      <dialog id="modalPreview" className="modal">
        <div className="modal-box p-6 bg-white rounded-lg shadow-lg">
          <h3 className="font-bold text-2xl text-gray-800 mb-4">
            Image Preview
          </h3>
          {currentProduct && (
            <div className="flex flex-col items-center">
              {currentProduct.image && (
                <img
                  src={
                    typeof currentProduct?.image === "string"
                      ? `http://127.0.0.1:8000/assets/images/${currentProduct?.image}`
                      : URL.createObjectURL(currentProduct?.image)
                  }
                  alt="Preview"
                  className="w-full max-w-md h-auto rounded-lg border border-gray-300 shadow-sm"
                />
              )}
              <small className="font-bold text-lg text-gray-700 mt-4">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(currentProduct?.price || 0)}
              </small>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Home;
