import React, { useEffect, useState } from "react";
import CreateProductForm from "../components/CreateProductForm";
import EditProductForm from "../components/EditProductForm";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";
import constants from "../constants";
import {
  IPreviewProduct,
  IProduct,
  IProductWithslide,
} from "../interfaces/product";
import { AxiosError } from "axios";

const Home = () => {
  const [products, setProducts] = useState<IProductWithslide[]>([]);
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
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result?.isConfirmed) {
        await axiosInstance.delete("/products/" + productId);
        fetchProduct(currentPage);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.status === 404) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product, product not found",
          icon: "error",
          scrollbarPadding: false,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product",
          icon: "error",
          scrollbarPadding: false,
        });
      }
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
      <div
        className="min-h-screen pt-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        }}
      >
        <div className="w-full text-neutral-content pb-10">
          <div className="w-full max-w-4xl mx-auto">
            <div className="carousel w-full rounded-lg overflow-hidden shadow-lg">
              {products.map((product: IProductWithslide, idx: number) => (
                <div
                  key={product.id}
                  id={"slide" + (idx + 1)}
                  className="carousel-item relative w-full h-100"
                >
                  <img
                    src={`http://127.0.0.1:8000/assets/images/${product.image}`}
                    alt={`Slide ${product.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a
                      href={product.prev}
                      className="btn btn-circle bg-white text-black hover:bg-gray-200"
                    >
                      ❮
                    </a>
                    <a
                      href={product.next}
                      className="btn btn-circle bg-white text-black hover:bg-gray-200"
                    >
                      ❯
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container-lg from-gray-100 to-gray-200 rounded-lg shadow-inner bg-gradient-to-b pb-10 pt-5">
          <div className="w-full flex justify-end p-10 pb-0">
            <label
              htmlFor={constants.CreateModalId}
              className="btn m-3 right-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M12 4.5a.75.75 0 0 1 .75.75v6h6a.75.75 0 0 1 0 1.5h-6v6a.75.75 0 0 1-1.5 0v-6h-6a.75.75 0 0 1 0-1.5h6v-6a.75.75 0 0 1 .75-.75z"
                  clipRule="evenodd"
                />
              </svg>
              Create Product
            </label>
          </div>
          <div className="flex justify-center flex-wrap gap-4 py-10">
            {products &&
              products.map((product: IProduct) => (
                <div
                  key={product.id}
                  className="card bg-white w-80 shadow-xl rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
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
                        className="w-full h-56 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-56 flex justify-center items-center bg-gray-200 rounded-t-lg">
                        <p className="text-gray-500 font-semibold">
                          Image Unavailable
                        </p>
                      </div>
                    )}
                  </figure>
                  <div className="card-body p-6 bg-gradient-to-br from-white to-gray-50 rounded-b-lg">
                    <h1 className="card-title text-xl font-bold text-gray-900 truncate">
                      {product.name}
                    </h1>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-primary font-semibold text-lg mt-4 text-end">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product?.price || 0)}
                    </p>
                    <div className="card-actions mt-6 flex justify-between">
                      <button
                        className="btn btn-outline btn-primary btn-md px-6 py-2 w-[47%] transition-transform duration-300 hover:scale-105"
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
                        className="btn btn-secondary btn-outline btn-md px-6 py-2 w-[47%] transition-transform duration-300 hover:scale-105"
                        onClick={() => handleDelete(product.id!)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="join flex justify-center">
            {totalPage &&
              Array.from({ length: totalPage }).map((_, index) => (
                <button
                  key={index}
                  className={`join-item btn btn-lg ${
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
        </div>
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
