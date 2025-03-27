import React, { useEffect, useState } from "react";
import CreateProductForm from "../components/CreateProductForm";
import axiosInstance from "../utils/axios";
import { IPreviewProduct, IProduct } from "../interfaces/product";
import Swal from "sweetalert2";
import EditProductForm from "../components/EditProductForm";
import constants from "../constants";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<IPreviewProduct | null>(
    null
  );

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
    } catch (error) {
      return;
    }
  };

  const previewProduct = (productImg: string, price: number) => {
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
        reverseButtons: true,
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

  const handleModalUpdate = (id: number) => {
    setOpenUpdate(!openUpdate);
    setEditProductId(id!);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const closeUpdateModal = (isCreated: boolean) => {
    document.getElementById(constants.UpdateModalId)!.close();
    if (isCreated) fetchProduct();
    setOpenUpdate(false);
  };

  return (
    <>
      <label
        htmlFor={constants.CreateModalId}
        className="btn absolute m-3 right-0"
      >
        Create Product
      </label>

      <input
        type="checkbox"
        id={constants.CreateModalId}
        className="modal-toggle"
        checked={open}
        onChange={() => setOpen(!open)}
      />

      <dialog id={constants.CreateModalId} className="modal">
        <div className="modal-box min-w-3/4">
          <CreateProductForm
            callback={(isCreated) => {
              setOpen(false);
              if (isCreated) fetchProduct();
            }}
          />
        </div>
      </dialog>

      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="container-lg flex justify-center flex-wrap gap-4">
          {products &&
            products.map((product: IProduct) => (
              <div
                key={product.id}
                className="card bg-white w-96 shadow-lg rounded-lg overflow-hidden m-4 transform transition-transform hover:scale-105"
              >
                <figure
                  className="relative"
                  onClick={() => {
                    previewProduct(product?.image, product?.price);
                  }}
                >
                  <img
                    src={`http://127.0.0.1:8000/assets/images/${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </figure>
                <div className="card-body p-6">
                  <h2 className="card-title text-lg font-semibold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2">
                    {product.description}
                  </p>
                  <div className="card-actions mt-4 flex justify-between">
                    <button
                      className="btn"
                      onClick={() => {
                        setEditProductId(product.id!);
                        setOpenUpdate(!openUpdate);
                        document
                          .getElementById(constants.UpdateModalId)!
                          .showModal();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-md px-6 py-3 w-[47%]"
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
        <div className="modal-box">
          {openUpdate && (
            <EditProductForm callback={closeUpdateModal} id={editProductId} />
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
              <img
                src={
                  typeof currentProduct?.image === "string"
                    ? `http://127.0.0.1:8000/assets/images/${currentProduct?.image}`
                    : URL.createObjectURL(currentProduct?.image)
                }
                alt="Preview"
                className="w-full max-w-md h-auto rounded-lg border border-gray-300 shadow-sm"
              />
              <small className="font-bold text-lg text-gray-700 mt-4">
                Rp. {currentProduct?.price.toFixed(2)}
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
