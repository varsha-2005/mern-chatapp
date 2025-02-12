import { useEffect } from "react";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const {
    user,
    setUser,
    getUserdetail,
    handleUpdate,
    status,
    setStatus,
    password,
    setPassword,
    newPassword,
    setNewPassword,
  } = useChat();

  useEffect(() => {
    getUserdetail();
  }, []);

  return (
    <div className="h-screen px-6 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition overflow-hidden">
      <div className="rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition">
        <h1 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-100">
          Settings
        </h1>
        <button
          onClick={getUserdetail}
          className=" text-lg font-semibold text-center text-gray-700 dark:text-gray-100"
        >
          +
        </button>

        <form className="flex flex-col gap-4 p-4 mx-10 my-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="h-[100px] w-[100px] flex flex-col justify-between gap-4 items-center bg-gray-500 dark:bg-gray-600 rounded-full shadow-lg">
              <img
                src={user?.avatarUrl || "vite.svg"}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <input
            type="text"
            value={user?.name || ""}
            onChange={(e) =>
              setUser((prevUser) => ({ ...prevUser, name: e.target.value }))
            }
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <input
            type="email"
            value={user?.email}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
            readOnly
          />

          <input
            type="text"
            value={user?.status ?? status ?? ""}
            onChange={(e) => setStatus(e.target.value)}
            placeholder={"Enter your status"}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <input
            type="password"
            placeholder="Enter the old password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <input
            type="password"
            placeholder="Enter the new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <button
            type="submit"
            onClick={(e:any) => {
              e.preventDefault(); 
              handleUpdate(e); 
            }}
            className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition"
          >
            Update
          </button>

        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Settings;
