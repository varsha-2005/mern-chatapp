import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io, Socket } from "socket.io-client";
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
  _id?: string;
  senderId: string;
  content: string;
  timestamp: Date;
  receiver: User;
  message: string;
  isOptimistic?: boolean;
  sender?: User;
  isReceived?: boolean;
}

interface SocketMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  sender: User;
  receiver: User;
}

interface TypingEvent {
  senderId: string;
  receiverId: string;
  isTyping: boolean;
}

interface ConnectionStatus {
  isConnected: boolean;
  lastPing?: Date;
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
  fetchUsers: () => Promise<void>;
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (message: string) => Promise<void>;
  fetchMessages: () => Promise<void>;
  toggleDarkMode: () => void;
  handleLogout: () => void;
  status: string | null;
  setStatus: React.Dispatch<React.SetStateAction<string | null>>;
  darkMode: boolean;
  messageload: boolean;
  sendmsgload: boolean;
  setSendmsgload: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
  onlineUsers: string[];
  isTyping: boolean;
  handleTyping: (isTyping: boolean) => void;
  connectionStatus: ConnectionStatus;
  checkConnection: () => Promise<boolean>;
}

type Props = {
  children: React.ReactNode;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const Context = ({ children }: Props) => {
  const backendUrl = "https://mern-chatapp-six.vercel.app";
  const apiPath = `${backendUrl}/api`;
  const navigate = useNavigate();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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
  const [token, setToken] = useState(localStorage.getItem("token"));

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!socket) return false;
    return socket.connected;
  }, [socket]);

  useEffect(() => {
    if (!token || !user?._id) return;

    const newSocket = io(backendUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      query: { userId: user._id },
    });

    setSocket(newSocket);

    const onConnect = () => {
      console.log("Socket connected");
      setConnectionStatus({ isConnected: true, lastPing: new Date() });
    };

    const onMessage = (newMessage: SocketMessage) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m._id === newMessage._id ||
            (m.isOptimistic && m.timestamp === newMessage.timestamp)
        );

        return exists
          ? prev
          : [
              ...prev,
              {
                ...newMessage,
                id: newMessage._id,
                content: newMessage.message,
                isReceived: newMessage.senderId !== user?._id,
              },
            ];
      });
    };

    const onOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const onTyping = (data: TypingEvent) => {
      if (receiverId?._id === data.senderId) {
        setIsTyping(data.isTyping);
      }
    };

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", () => {
      setConnectionStatus((prev) => ({ ...prev, isConnected: false }));
      showToastError("Connection lost - reconnecting...");
    });
    newSocket.on("msg-receive", onMessage);
    newSocket.on("online-users", onOnlineUsers);
    newSocket.on("typing", onTyping);

    pingIntervalRef.current = setInterval(() => {
      if (newSocket.connected) {
        setConnectionStatus((prev) => ({ ...prev, lastPing: new Date() }));
      }
    }, 15000);

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect");
      newSocket.off("msg-receive", onMessage);
      newSocket.off("online-users", onOnlineUsers);
      newSocket.off("typing", onTyping);
      newSocket.disconnect();
    };
  }, [token, user?._id, receiverId?._id]);

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!socket || !receiverId?._id || !user?._id) return;

      socket.emit("typing", {
        senderId: user._id,
        receiverId: receiverId._id,
        isTyping,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          handleTyping(false);
        }, 2000);
      }
    },
    [socket, receiverId?._id, user?._id]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev: boolean): boolean => {
      const newMode: boolean = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${apiPath}/auth/register`, {
        name,
        email,
        password,
      });
      const { token: newToken, message: successMessage } = response.data;

      localStorage.setItem("token", newToken);
      setName("");
      setEmail("");
      setPassword("");
      showToastSuccess(successMessage);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      showToastError(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${apiPath}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      showToastSuccess("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      showToastError(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setMessages([]);
    setReceiverId(null);
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  }, [socket, navigate]);

  const getUserdetail = useCallback(async () => {
    try {
      const response = await axios.get(`${apiPath}/auth/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      handleLogout();
    }
  }, [token, handleLogout]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${apiPath}/auth/fetchuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users");
    }
  }, [token]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await axios.put(
        `${apiPath}/auth/updateuser`,
        { name: user.name, status, password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      showToastSuccess("Profile updated");
      setPassword("");
      setNewPassword("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Update failed";
      showToastError(errorMessage);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!receiverId?._id || !token) {
      console.log("Skipping fetch - missing IDs or token");
      return;
    }

    setMessageload(true);
    try {
      const response = await axios.get(
        `${apiPath}/chat/messages/${receiverId._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );

      setMessages(
        response.data?.map((msg: any) => ({
          ...msg,
          id: msg._id,
          senderId: msg.sender._id,
          receiver: msg.receiver,
          isReceived: msg.sender._id !== user?._id,
        })) || []
      );
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    } finally {
      setMessageload(false);
    }
  }, [receiverId?._id, token, user?._id]);

  const handleSendMessage = useCallback(
    async (currentMessage: string) => {
      if (!currentMessage.trim() || !receiverId?._id || !user?._id) return;

      const tempId = Date.now().toString();

      const optimisticMessage = {
        id: tempId,
        _id: tempId,
        senderId: user._id,
        content: currentMessage,
        timestamp: new Date(),
        receiver: receiverId,
        message: currentMessage,
        isOptimistic: true,
        sender: user,
        isReceived: false,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");
      handleTyping(false);

      try {
        const response = await axios.post(
          `${apiPath}/chat/sendmessages`,
          {
            receiver: receiverId._id,
            message: currentMessage,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...response.data,
                  id: response.data._id,
                  senderId: user._id,
                  receiver: receiverId,
                  sender: user,
                  isOptimistic: undefined,
                }
              : m
          )
        );

        // Also send via socket if available
        if (socket?.connected && response.data?._id) {
          socket.emit("send-msg", {
            to: receiverId._id,
            from: user._id,
            message: currentMessage,
            _id: response.data._id,
            sender: user,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Send failed:", error);
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        showToastError("Failed to send message");
      }
    },
    [receiverId, user, socket, token, handleTyping]
  );

  // Initial Data Loading
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      getUserdetail();
      fetchUsers();
    }
  }, [token, getUserdetail, fetchUsers, navigate]);

  // Fetch Messages When Receiver Changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (token && receiverId?._id) {
        fetchMessages();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, receiverId?._id]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
        setError,
        getUserdetail,
        fetchUsers,
        handleUpdate,
        newMessage,
        setNewMessage,
        handleSendMessage,
        fetchMessages,
        toggleDarkMode,
        handleLogout,
        status,
        setStatus,
        darkMode,
        messageload,
        sendmsgload,
        setSendmsgload,
        socket,
        onlineUsers,
        isTyping,
        handleTyping,
        connectionStatus,
        checkConnection,
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
