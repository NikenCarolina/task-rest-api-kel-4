import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { IProduct, IProductWithslide } from "../interfaces/product";

export const Content = () => {
  const [products, setProducts] = useState([]);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get("/api/products");
      const data = res?.data;
      if (data) {
        const _data = data.map((el: IProduct, idx: number) => ({
          ...el,
          prev: `#slide${idx === 0 ? data.length : idx}`,
          next: `#slide${idx === data.length - 1 ? 1 : idx + 2}`,
        }));
        setProducts(_data);
      }
      console.log("🚀 ~ fetchProduct ~ data:", data);
      return;
    } catch (error) {
      console.log("🚀 ~ fetchProduct ~ error:", error);
      return;
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await axiosInstance.delete("/api/products/" + productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product: IProduct) => product.id !== productId)
      );
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-overlay"></div>
      {/* <div className="hero-content text-neutral-content text-center">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="mb-5 text-5xl font-bold text-white">Our Product</h1>
          <div className="carousel w-full rounded-lg overflow-hidden shadow-lg">
            {products.map((product: IProductWithslide, idx: number) => (
              <div
                key={product.id}
                id={"slide" + idx}
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
      </div> */}
      <div className="container-lg flex justify-center flex-wrap gap-4">
        {products &&
          products.map((product: IProduct) => (
            <div
              key={product.id}
              className="card bg-white w-96 shadow-lg rounded-lg overflow-hidden m-4 transform transition-transform hover:scale-105"
            >
              <figure className="relative">
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
                  <button className="btn btn-accent btn-md px-6 py-3 w-[47%]">
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-md px-6 py-3 w-[47%]"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
