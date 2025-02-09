import { useEffect } from "react";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";

const Settings = () => {
    const { user, setUser, loading, setLoading, getUserdetail,handleUpdate } = useChat();

    useEffect(() => {
        getUserdetail();
    }, []);

    return (
        <div className="h-screen flex flex-col items-center w-full justify-center bg-gray-100">
            <div className="p-6 w-full sm:w-96 rounded-2xl shadow-lg bg-white">
                <h1 className="text-xl font-semibold text-center mb-4">Settings</h1>
                <form className="flex flex-col gap-4  pt-4">
                    <div className="flex items-center w-full border-2 border-gray-200 rounded-s-sm p-2">
                        <div className="h-12 w-12 flex justify-center items-center bg-gray-500 rounded-full overflow-hidden">
                            <img
                                src={user?.avatarUrl || "vite.svg"}
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </div>
                        <input
                            type="text"
                            value={user?.name || ""}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                            className="px-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ml-3"
                        />
                    </div>
                    <input
                        type="email"
                        value={user?.email || ""}
                        className="px-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <button type="submit" onClick={handleUpdate} className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition">
                        Update
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Settings;
