import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToastSuccess, showToastError } from "../components/toast";
import "react-toastify/dist/ReactToastify.css";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  handleSignUp: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  message: string;
  receiverId: User | null;
  setReceiverId: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  getUserdetail: () => Promise<void>;
  fetchUsers: void;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: any;
  fetchMessages: any;
  toggleDarkMode: () => void;
  handleLogout: () => void;
}

type Props = {
  children: React.ReactNode;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);
const Context = ({ children }: Props) => {
  const path = "http://localhost:5001/api";

  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode: any) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      if (location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, [token]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${path}/auth/register`);

      const { token, message } = response.data;
      setMessage(message);

      localStorage.setItem("token", token);

      setName("");
      setEmail("");
      setPassword("");
      showToastSuccess(message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      showToastError(errorMessage);

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${path}/auth/login`, {
        email,
        password,
      });

      const { token, message } = response.data;
      setMessage(message);

      const userResponse = await axios.get(`${path}/auth/fetchuser`);

      console.log("Fetched User:", userResponse.data);
      setUser(userResponse.data);
      navigate("/");
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // setUser(user);
      showToastSuccess("Logged in successfully.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      showToastError(errorMessage);

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const ForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${path}/auth/forgot`, {
        email,
      });

      const { message } = response.data;
      setMessage(message);
      showToastSuccess(message);
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showToastError(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserdetail = async () => {
    try {
      const response = await axios.get(`${path}/auth/getuser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User Data:", response.data);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      showToastError("User not found. Please log in again.");
      return;
    }
    try {
      const response = await axios.put(
        `${path}/auth/updateuser`,
        { name: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      showToastSuccess("User updated successfully.");
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      showToastError(errorMessage);

      setMessage(errorMessage);
    }
  };

  const fetchUsers = useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${path}/auth/fetchuser`);
        // console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("An error occurred.");
      }
    };
    fetchUser();
  }, []);

  const fetchMessages = async () => {
    if (!receiverId || typeof receiverId !== "object" || !receiverId._id) {
      return;
    }
    try {
      const response = await axios.get(
        `${path}/chat/messages/${receiverId._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token, receiverId, messages]);

  const handleSendMessage = async (currentMessage: string) => {
    if (!currentMessage.trim()) {
      showToastError("Please enter something!");
      return;
    }
    if (!currentMessage || !token || !receiverId) return;
    try {
      const response = await axios.post(`${path}/chat/sendmessages`, {
        receiver: receiverId._id,
        message: currentMessage,
      });
      setMessages(response.data);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     if (!token) {
  //         toast.error("Invalid or missing reset token.");
  //         setLoading(false);
  //         return;
  //     }

  //     try {
  //         const response = await axios.post(`${path}/auth/forgot/${token}`, { password });

  //         showToastSuccess(response.data.message);

  //         setPassword("");

  //         setTimeout(() => navigate("/login"), 2000);
  //     } catch (error) {
  //         let errorMessage = error.response?.data?.message || "Error resetting password";
  //         showToastError(errorMessage);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        user,
        setUser,
        loading,
        handleSignUp,
        handleLogin,
        message,
        receiverId,
        setReceiverId,
        users,
        setUsers,
        search,
        setSearch,
        error,
        getUserdetail,
        toggleDarkMode,
        setError,
        fetchUsers,
        handleUpdate,
        handleLogout,
        newMessage,
        setNewMessage,
        handleSendMessage,
        fetchMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatContext.Provider");
  }
  return context;
};

export default Context;
