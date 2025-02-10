import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useChat } from "../context/Context";
const Layout = () => {
  const { darkMode } = useChat();
  return (
    <div className={darkMode ? "dark" : " "}>
      <div className="dark:bg-black">
        <Header />
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
