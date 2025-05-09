import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChat } from "../context/Context";
import { faX } from "@fortawesome/free-solid-svg-icons";

const Member = () => {
  const { 
    users, 
    search, 
    setSearch, 
    setReceiverId, 
    receiverId, 
    onlineUsers 
  } = useChat();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <FontAwesomeIcon
            icon={faX}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={() => setSearch("")}
          />
        </div>
        
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setReceiverId(user)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                receiverId?._id === user._id
                  ? "bg-blue-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <div className="relative">
                <img
                  src={user.avatarUrl || "vite.svg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-400 dark:border-gray-600"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                    onlineUsers.includes(user._id)
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.status || "Hey there! I'm using this app"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Member;