import React, { useState } from "react";
import CreateProductForm from "../components/CreateProductForm";

const Home = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <label htmlFor="my_modal_1" className="btn">
        open modal
      </label>
      <input
        type="checkbox"
        id="my_modal_1"
        className="modal-toggle"
        checked={open}
        onChange={() => setOpen(!open)}
      />

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box min-w-3/4">
          <CreateProductForm callback={() => setOpen(false)} />
        </div>
      </dialog>
    </>
  );
};

export default Home;
