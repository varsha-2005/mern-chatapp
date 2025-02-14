import { useState, useEffect } from "react";
import { useChat } from "../context/Context";
import Chat from "./Chat";
import Member from "./Member";

const Main = () => {
  const { receiverId, setReceiverId } = useChat();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full  ">
      <div
        className={`${
          isSmallScreen && receiverId ? "hidden" : "block"
        } w-full lg:w-[40%]`}
      >
        <Member setReceiverId={setReceiverId} receiverId={receiverId} />
      </div>

      <div
        className={`${
          isSmallScreen && !receiverId ? "hidden" : "block"
        } flex w-full`}
      >
        {receiverId ? (
          <div className="w-full h-screen">
            <Chat receiverId={receiverId} />
          </div>
        ) : (
          <div className="text-center flex justify-center items-center w-full dark:text-gray-100 text-gray-500 h-screen bg-[#f9f6f6] dark:bg-gray-800">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
