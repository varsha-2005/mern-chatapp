import { useEffect, useContext, useState } from "react";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { user, setUser, getUserdetail, handleUpdate } = useChat();
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    getUserdetail();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    } else {
      alert("No file selected"); //replace with toast
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mern-chat");
    try {
      const response = await axios.post(
        `http://api.cloudinary.com/v1_1/${"dyxqpr2m2"}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageUrl(response.data.secure_url);
      alert("Uploaded image successfully");
      console.log("image" + imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.error("Cloudinary response:", error.response.data); // Log response data
        console.error("Cloudinary status code:", error.response.status);
        console.error("Cloudinary headers:", error.response.headers);
      }
    }
  };

  return (
    <div className=" h-screen px-6 flex flex-col items-center  justify-center bg-gray-100 dark:bg-gray-900 transition overflow-hidden">
      <div className="   rounded-lg shadow-lg  dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition">
        <h1 className="text-xl font-semibold text-center  text-gray-700 dark:text-gray-100">
          Settings
        </h1>

        <form className="flex flex-col gap-4 p-4 mx-10 my-4">
          <div className="flex flex-col justify-center items-center  gap-4 ">
            <div className="h-[100px] w-[100px] flex flex-col justify-between  gap-4 items-center bg-gray-500   dark:bg-gray-600 rounded-full  shadow-lg">
              <img
                src={user?.avatarUrl || image || "vite.svg"}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-black dark:text-gray-300 "
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <input
            type="text"
            value={user?.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <input
            type="email"
            value={user?.email || ""}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
            readOnly
          />
          <input
            type="text"
            value=""
            placeholder="Hey there I'm using What's App"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />
          <input
            type="password"
            placeholder="Enter the old password"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />
          <input
            type="password"
            placeholder="Enter the new password"
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"
          />

          <button
            type="submit"
            onClick={handleUpdate}
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
