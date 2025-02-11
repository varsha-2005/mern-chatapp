import { Link, } from "react-router-dom";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoon,
    faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {

    const { name, setName, email, setEmail, password, setPassword, loading, handleSignUp,darkMode, toggleDarkMode, message } = useChat();
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-color duration-300">
            <div className="p-6 w-full max-w-md rounded-2xl shadow-lg bg-white dark:bg-gray-800 sm:w-96 border border-gray-300 dark:border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sign Up
                    </h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-yellow-400 transition duration-300"
                    >
                        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                    </button>
                </div>
                {message && (
                    <div className={`message p-2 rounded-md text-center ${message.includes("success") ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                        {message}
                    </div>
                )}
                <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignUp}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <button className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition duration-300">
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 font-medium cursor-pointer hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
