import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { IProduct } from "../interfaces/product";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axios";

const CreateProductForm: React.FC<{
  callback: (isCreated: boolean) => void;
}> = ({ callback }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<IProduct>({
    name: "",
    price: 0,
    description: "",
    image: null,
  });
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

  const CreateProduct = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("description", product.description);
    if (product.image instanceof File) {
      formData.append("image", product.image);
    }
    try {
      const createResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
      });
      if (createResult.isDismissed) {
        setSubmitLoading(false);
        return;
      }
      if (createResult.isConfirmed) {
        setProductError(null);
        await axiosInstance.post("/products", formData, {
          headers: {
            contentType: "multipart/form-data",
          },
        });
        const result = await Swal.fire({
          title: "Create!",
          text: "Your product has been created.",
          icon: "success",
        });
        if (result.isDismissed || result.isConfirmed) {
          setSubmitLoading(false);
          setProduct({
            name: "",
            price: 0,
            description: "",
            image: null,
          });
          setPreview(null);
          setProductError(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
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
          text: "Failed to create product",
          icon: "error",
        });
        setSubmitLoading(false);
      }
    }
  };

  return (
    <form onSubmit={CreateProduct}>
      <h2 className="font-bold text-2xl mb-2">Create Product</h2>
      <div className="flex w-full mb-3">
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-6 min-w-1/2 max-w-1/2">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Product Name</legend>
            <input
              type="text"
              className={
                "input w-full" +
                (productError?.name && productError?.name.length
                  ? " input-error"
                  : "")
              }
              placeholder="e.g. Kopi"
              value={product.name}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              disabled={submitLoading}
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
              className={
                "input w-full" +
                (productError?.description && productError?.description.length
                  ? " input-error"
                  : "")
              }
              placeholder="e.g. Kopi Luwak adalah ..."
              value={product.description}
              onChange={(e) =>
                setProduct((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={submitLoading}
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
              className={
                "input w-full" +
                (productError?.price && productError?.price.length
                  ? " input-error"
                  : "")
              }
              placeholder="e.g. 5000"
              value={product.price}
              onChange={(e) => {
                if (isNaN(Number(e.target.value))) return;
                setProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }));
              }}
              disabled={submitLoading}
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
              className={
                "file-input w-full" +
                (productError?.image && productError?.image.length
                  ? " file-input-error"
                  : "")
              }
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={submitLoading}
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
        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitLoading}
        >
          {!submitLoading && "Add"}
          {submitLoading && (
            <span className="loading loading-spinner loading-sm"></span>
          )}
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

export default CreateProductForm;
