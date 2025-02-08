import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ChatContextType {
    messages: Message[];
    // setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    children: React.ReactNode;
}
interface User {
    id: string;
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
type Props = {
    children: React.ReactNode;
};


const ChatContext = createContext<ChatContextType | undefined>(undefined);
const Context = ({ children }: Props) => {


    const path = "http://localhost:5001/api"

    const [messages, setMessages] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [receiverId, setReceiverId] = useState();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);


    const [newMessage, setNewMessage] = useState("");

    const token = localStorage.getItem("token");

    const navigate = useNavigate();
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
            navigate("/login")

        } catch (error) {
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
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


            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            navigate("/");

        } catch (error) {
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${path}/auth/fetchuser`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("An error occurred.");
            }
        };
        fetchUser();
    }, [])




    const fetchMessages = useEffect(() => {
        const fetchMessage = async () => {
            if (!receiverId || typeof receiverId !== "object" || !receiverId._id) {
                return; 
            }
            try {
                const response = await axios.get(`${path}/chat/messages/${receiverId._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMessages(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
                // setError("An error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [token, receiverId]);

    const handleSendMessage = async () => {
        if (!newMessage || !token || !receiverId) return;
        try {
            const response = await axios.post(`${path}/chat/sendmessages`, {
                receiver: receiverId,
                message: newMessage
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setMessages(response.data);
            // console.log(response.data);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    return (
        <ChatContext.Provider value={{
            messages, setMessages, name, setName,
            email, setEmail, password, setPassword,
            user, setUser, loading, handleSignUp,
            handleLogin, message, receiverId, setReceiverId,
            users, setUsers, search, setSearch, error,
            setError, fetchUsers,users,
            newMessage, setNewMessage, handleSendMessage, fetchMessages
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
export default Context;
