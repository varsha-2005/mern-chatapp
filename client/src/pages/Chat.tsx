import { useChat } from "../context/Context";

const Chat = ({ receiverId }: { receiverId: string | null }) => {
  const {
    newMessage,
    setNewMessage,
    handleSendMessage,
    messages,
    loading,
    setReceiverId,
  } = useChat();
  const isSmallScreen = window.innerWidth < 768;

  if (messages.length == 0)
    return (
      <div className="text-center text-gray-500 dark:bg-gray-900 h-screen">
        Loading chat...
      </div>
    );

  return (
    <div className=" h-screen bg-white dark:bg-gray-900  shadow-lg border border-gray-200 dark:border-gray-700  flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-300  dark:border-gray-500 bg-gray-100 dark:bg-gray-800   ">
        {isSmallScreen && (
          <button
            className="mr-3 text-2xl text-gray-700 dark:text-gray-100"
            onClick={() => setReceiverId(null)}
          >
            ⬅
          </button>
        )}
        <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-800 overflow-hidden border">
          <img
            src={receiverId?.avatarUrl || "vite.svg"}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-100">
          {receiverId?.name || "User"}
        </div>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto flex-grow w-full bg-gray-50 dark:bg-gray-800 ">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.receiver._id === receiverId?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs shadow-md ${
                msg.receiver._id === receiverId?._id
                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {/* <p className="font-semibold">{msg.sender?.name || "Unknown"}</p> */}
              <p>{msg.message}</p>
              <span className="text-[9px] text-right text-black-500 dark:text-slate-300 block mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 flex items-center space-x-3 rounded-b-xl ">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="p-2  sm:w-[85%] w-[80%] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={(e) => handleSendMessage(e).then(() => setNewMessage(""))}
          className=" sm:w-[15%] w-[20%]  text-white bg-green-500 dark:bg-green-600 p-2 px-4 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
