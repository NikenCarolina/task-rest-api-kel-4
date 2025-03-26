import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";

function RoutesProvider() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/preview/:id" element={<p>Preview</p>} />
      <Route path="*" element={<b>Not Found</b>} />
    </Routes>
  );
}

export default RoutesProvider;
