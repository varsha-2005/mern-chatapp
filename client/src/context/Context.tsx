import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToastSuccess, showToastError } from "../components/toast";
import "react-toastify/dist/ReactToastify.css";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  receiver: User;
  message:String;
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
  newPassword: string;  
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
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
  handleSendMessage: (message: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  toggleDarkMode: () => void;
  handleLogout: () => void;
  status: string | null;
  setStatus: React.Dispatch<React.SetStateAction<string | null>>;
  darkMode?: boolean;
  messageload: boolean;
  sendmsgload:boolean;
  setSendmsgload: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [messageload, setMessageload] = useState(false);
  const [sendmsgload, setSendmsgload] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

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
    if (token !== "") {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      if (location.pathname !== "/register") {
        navigate("/login");
      }
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${path}/auth/register`, {
        name,
        email,
        password,
      });

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

      const newToken = response.data.token;
      const message = response.data.message;
      setMessage(message);

      localStorage.setItem("token", newToken);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/");

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

  useEffect(() => {
    if (token) {
      getUserdetail();
    }
  }, [token]);
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
        { name: user.name, status, password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.user);
      // getUserdetail();
      showToastSuccess("User updated successfully.");
      setPassword("");
      setNewPassword("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      showToastError(errorMessage);
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
    setMessageload(true);
    try {
      // setLoading(true);
      const response = await axios.get(
        `${path}/chat/messages/${receiverId._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data);
      // setMessageload(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessageload(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token, receiverId,]);

  const handleSendMessage = async (currentMessage: string) => {
    if (!currentMessage.trim()) {
      showToastError("Please enter something!");
      return;
    }
    if (!currentMessage || !token || !receiverId) return;
    setSendmsgload(true);
    try {
      const response = await axios.post(`${path}/chat/sendmessages`, {
        receiver: receiverId._id,
        message: currentMessage,
      });
      setMessages(response.data);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendmsgload(false);
    }
  };

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
        newPassword,
        setNewPassword,
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
        status,
        setStatus,
        sendmsgload,
        setSendmsgload,
        messageload,
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
