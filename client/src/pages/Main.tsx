import { useState, useEffect } from "react";
import { useChat } from "../context/Context";
import Chat from "./Chat";
import Member from "./Member";

const Main = () => {
  const { receiverId } = useChat();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Member List */}
      <div
        className={`${
          isSmallScreen && receiverId ? "hidden" : "block"
        } w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700`}
      >
        <Member />
      </div>

      {/* Chat Area */}
      <div
        className={`${
          isSmallScreen && !receiverId ? "hidden" : "flex"
        } flex-1 min-w-0 flex-col`}
      >
        {receiverId ? (
          <Chat receiverId={receiverId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-6">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a contact to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
