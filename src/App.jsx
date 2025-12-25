import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppRoutes from "./routes/AppRoutes";


export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" limit={3} />
      <AppRoutes />
    </BrowserRouter>
  );
}
