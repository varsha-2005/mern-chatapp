import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../context/Context";
import { ToastContainer } from "react-toastify";


export default function ForgotPassword() {
    const navigate = useNavigate();
    const { email, setEmail, loading, message } = useChat();
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 w-full max-w-md rounded-2xl shadow-lg bg-white sm:w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Forgot Password</h1>
                {message && <div className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</div>}
                <form className="flex flex-col gap-4"  >
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-all hover:bg-gray-200 w-full">
                        🌐 Continue with Google
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-all hover:bg-gray-200 w-full">
                        📘 Continue with Facebook
                    </button>
                    <p className="text-center text-sm my-2 text-gray-600">or</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    
                    <button
                        className="w-full sm:w-auto px-6 py-3 rounded mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90"
                        type="submit"
                    >
                        Send
                    </button>

                    
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}