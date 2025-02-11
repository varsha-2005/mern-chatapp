import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowsRotate,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";

const Chat = ({ receiverId }: { receiverId: string | null }) => {
  const { handleSendMessage, messages, loading, setReceiverId, fetchMessages, sendmsgload, setSendmsgload } =
    useChat();
  const isSmallScreen = window.innerWidth < 768;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  useEffect(() => {
    if (!messagesEndRef.current || scroll) return;

    messagesEndRef.current.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, scroll]);

  useEffect(() => {
    const container = messagesEndRef.current;
    if (!container) return;

    const handleScroll = () => {
      const atBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 50;
      setScroll(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (messages.length == 0)
    return (
      <div className="text-center text-gray-500 dark:bg-gray-800 h-screen flex justify-center items-center">
        No chats found...........
      </div>
    );

  const SendMessage = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (currentMessage !== "") {
        setSendmsgload(true);
        handleSendMessage(currentMessage).then(() => {
          setSendmsgload(false);
          setCurrentMessage("");
          fetchMessages();
        });
      } else {
        alert("Please enter a message");
      }
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-800">
        {isSmallScreen && (
          <button
            className="mr-3 text-2xl text-gray-700 dark:text-gray-100"
            onClick={() => setReceiverId(null)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <div
          className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-800 border flex items-center"
          onClick={handleToggle}
        >
          {toggle && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 sm:w-96 border border-gray-300 dark:border-gray-700">
                <FontAwesomeIcon icon={faX} />
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={receiverId?.avatarUrl || "vite.svg"}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    {receiverId?.name || "User"}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    {receiverId?.email || "No email"}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {receiverId?.status || "No status available"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <img
            src={receiverId?.avatarUrl || "vite.svg"}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
          <div className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-100">
            {receiverId?.name || "User"}
          </div>
        </div>

        <div
          onClick={() => fetchMessages()}
          className="text-gray-700 dark:text-gray-100 cursor-pointer hover:scale-125"
        >
          <FontAwesomeIcon icon={faArrowsRotate} />
        </div>
      </div>

      {/* Attach messagesEndRef to the messages container */}
      <div
        ref={messagesEndRef}
        className="p-4 space-y-3 overflow-y-auto flex-grow w-full bg-gray-50 dark:bg-gray-800"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.receiver._id === receiverId?._id
              ? "justify-end"
              : "justify-start"
              }`}
          >
            <div
              className={`p-3 rounded-lg shadow-md max-w-xs sm:max-w-md ${msg.receiver._id === receiverId?._id
                ? "bg-blue-500 dark:bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
            >
              <p className="break-words whitespace-pre-wrap overflow-auto max-h-32">
                {msg.message}
              </p>
              <span className="text-[9px] text-right text-black-500 dark:text-slate-300 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 flex items-center space-x-3 rounded-b-xl">
        <input
          type="text"
          value={currentMessage}
          onKeyDown={(e) => SendMessage(e)}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="p-2 sm:w-[85%] w-[80%] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={(e) => SendMessage(e)}
          className="sm:w-[15%] w-[20%] text-white bg-green-500 dark:bg-green-600 p-2 px-4 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition flex items-center justify-center"
        >
          {sendmsgload ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Send"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
