import { useEffect, useRef, useState, useCallback } from "react";
import { User } from "../context/Context";
import { useChat } from "../context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowsRotate, faX } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";

const Chat = ({ receiverId }: { receiverId: User | null }) => {
  const {
    handleSendMessage,
    messages,
    setReceiverId,
    user,
    onlineUsers,
    messageload,
    isTyping,
    handleTyping,
    fetchMessages
  } = useChat();

  const isSmallScreen = window.innerWidth < 768;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [toggle, setToggle] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll handling
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setIsAtBottom(scrollHeight - (scrollTop + clientHeight) < 50);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('auto');
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Initial scroll
  useEffect(() => {
    if (receiverId) {
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [receiverId, scrollToBottom]);

  const handleSend = useCallback((e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e as React.KeyboardEvent).key === 'Enter' || e.type === 'click') {
      if (currentMessage.trim()) {
        handleSendMessage(currentMessage);
        setCurrentMessage("");
        handleTyping(false);
      }
    }
  }, [currentMessage, handleSendMessage, handleTyping]);

  return (
    <div className="h-screen bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Loading overlay */}
      {messageload && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center">
          {isSmallScreen && (
            <button onClick={() => setReceiverId(null)} className="mr-3 text-2xl">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <div className="flex items-center cursor-pointer" onClick={() => setToggle(true)}>
            <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-800 border flex items-center">
              <img
                src={receiverId?.avatarUrl || "default-avatar.png"}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">{receiverId?.name}</div>
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-1 ${onlineUsers.includes(receiverId?._id || '') ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-100">
                  {onlineUsers.includes(receiverId?._id || '') ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={fetchMessages} className="text-gray-700 dark:text-gray-100">
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
      </div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"
      >
        {messages.map((msg) => (
          <div key={msg._id || msg.id} className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"} mb-3`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === user?._id
                ? "bg-blue-500 dark:bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              } ${msg.isOptimistic ? "opacity-80" : ""}`}>
              <p className="break-words whitespace-pre-wrap overflow-auto max-h-32">{msg.message}</p>
              <p className="text-xs opacity-80 text-right mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.isOptimistic && " (Sending...)"}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg inline-flex items-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onKeyDown={handleSend}
            onBlur={() => handleTyping(false)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>

      {/* Profile modal */}
      {toggle && receiverId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Profile</h2>
              <button onClick={() => setToggle(false)} className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={receiverId.avatarUrl || "default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{receiverId.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{receiverId.email}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{receiverId.status || "No status"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={() => scrollToBottom()}
          className="fixed bottom-20 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg"
        >
          ↓
        </button>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Chat;