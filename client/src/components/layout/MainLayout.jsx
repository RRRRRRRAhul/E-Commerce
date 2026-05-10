import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;