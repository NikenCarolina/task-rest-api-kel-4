import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { IProduct } from "../interfaces/product";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";
import { HttpResponse, IHttpResponse } from "../interfaces/response";

const EditProductForm: React.FC<{
  callback: (isCreated: boolean) => void;
  id: number;
}> = ({ callback, id }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<IProduct>({
    name: "",
    price: 0,
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);

  const [productError, setProductError] = useState<{
    name: string[];
    price: string[];
    description: string[];
    image: string[];
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const UpdateProduct = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("description", product.description);
    formData.append("_method", "PUT");
    if (product.image instanceof File) {
      formData.append("image", product.image);
    }
    try {
      const updateResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      });
      if (updateResult.isConfirmed) {
        setProductError(null);
        await axiosInstance.post("/products", formData, {
          headers: {
            contentType: "multipart/form-data",
          },
        });
        const result = await Swal.fire({
          title: "Updated!",
          text: "Your product has been created.",
          icon: "success",
        });
        if (result.isConfirmed) {
          callback(true);
        }
      }
    } catch (e) {
      if (e instanceof AxiosError && e.status === 422) {
        console.log(e);
        setProductError({
          name: e.response?.data.errors.name ?? [],
          price: e.response?.data.errors.price ?? [],
          description: e.response?.data.errors.description ?? [],
          image: e.response?.data.errors.image ?? [],
        });
        Swal.fire({
          title: "Error!",
          text: "Failed to delete product",
          icon: "error",
        });
      }
    }
  };

  const getProductById = async () => {
    try {
      const data: IHttpResponse<IProduct> = await axiosInstance.get(
        `/products/${id}`
      );
      if (data.data) setProduct(data.data);
      return;
    } catch (e) {
      if (e instanceof AxiosError) {
        Swal.fire({
          title: "Error!",
          text: "Failed fetch product. Please check your internet connection.",
          icon: "error",
        });
      }
      return;
    }
  };

  useEffect(() => {
    getProductById();
  }, []);
  return (
    <form onSubmit={UpdateProduct}>
      <h2 className="font-bold text-2xl mb-2">Updated Product</h2>
      <div className="flex w-full mb-3">
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Product Name</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. Kopi"
              value={product.name}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {productError?.name && (
              <p className="fieldset-label text-error">
                {productError?.name.join(" ")}
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Description</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. Kopi Luwak adalah ..."
              value={product.description}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            {productError?.description && (
              <p className="fieldset-label text-error">
                {productError?.description.join(" ")}
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Price</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. 5000"
              value={product.price}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }));
              }}
            />
            {productError?.price && (
              <p className="fieldset-label text-error">
                {productError?.price.join(" ")}
              </p>
            )}
          </fieldset>
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Pick a file</legend>
            <input
              type="file"
              className="file-input w-full"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <label className="fieldset-label">Max size 2MB</label>
            {productError?.image && (
              <p className="fieldset-label text-error">
                {productError?.image.join(" ")}
              </p>
            )}
          </fieldset>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="card bg-base-300 rounded-box grid grow place-items-center">
          {preview && <img src={preview} alt="Preview"></img>}
          {!preview && <p>No Image Selected</p>}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button className="btn btn-primary" type="submit">
          Add Product
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            setProduct({
              name: "",
              price: 0,
              description: "",
              image: null,
            });
            setPreview(null);
            setProductError(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            callback(false);
          }}
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
