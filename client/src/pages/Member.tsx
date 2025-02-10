import { useChat } from "../context/Context";

const Member = ({
  setReceiverId,
  receiverId,
}: {
  setReceiverId: (id: string) => void;
  receiverId: string;
}) => {
  const { search, setSearch, users } = useChat();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sm:w-full   max-h-screen overflow-y-scroll bg-white dark:bg-gray-800  shadow-lg  border border-gray-200 dark:border-gray-700 p-4">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:focus:ring-gray-500 transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="text-xl font-semibold my-4 text-gray-700 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
        People
      </h2>
      <div className="space-y-2 max-h-screen  overflow-scroll pr-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setReceiverId(user)}
              className={`flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer  shadow-md darK:shadow-lg border-gray-200 dark:border-gray-700 ${
                receiverId && receiverId._id == user._id
                  ? "border-l-4 border-purple-500 dark:border-blue-500"
                  : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden border border-gray-400 dark:border-gray-600">
                <img
                  src={user.avatarUrl || "vite.svg"}
                  className="w-full h-full object-cover"
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.status || "Hey there..."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center min-h-screen">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Member;
