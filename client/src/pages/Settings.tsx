import { useEffect } from "react";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
    const { user, setUser, getUserdetail, handleUpdate } = useChat();

    useEffect(() => {
        getUserdetail();
    }, []);

    return (
        <div className="h-screen flex flex-col items-center w-full justify-center bg-gray-100 dark:bg-gray-900 transition">
            <div className="p-6 w-full sm:w-96 rounded-sm shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition">
                <h1 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-gray-100">Settings</h1>

                <form className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col justify-center items-center w-full  ">
                        <div className="h-[100px] w-[100px] flex flex-col justify-between  items-center bg-gray-500   dark:bg-gray-600 rounded-full  shadow-lg">
                            <img
                                src={user?.avatarUrl || "vite.svg"}
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />

                        </div>
                        <div>
                            <input type="file" />
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
                        type="text"
                        value=""
                        placeholder="Enter the new password"
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 w-full text-gray-900 dark:text-gray-100 transition"

                    />
                    <input
                        type="text"
                        value=""
                        placeholder="Enter the old password"
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
}

export default Settings;
