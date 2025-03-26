import { Route, Routes } from "react-router-dom";

function RoutesProvider() {
  return (
    <Routes>
      <Route path="/" element={<p>Home</p>} />
      <Route path="/preview/:id" element={<p>Preview</p>} />
      <Route path="*" element={<b>Not Found</b>} />
    </Routes>
  );
}

export default RoutesProvider;
