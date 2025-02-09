import { useChat } from "../context/Context";

const Member = ({ setReceiverId }: { setReceiverId: (id: string) => void }) => {
  const { search, setSearch, users } = useChat();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto max-h-screen bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 border border-gray-200 dark:border-gray-700 mt-1">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="text-xl font-semibold my-4 text-gray-700 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-2">
        People
      </h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setReceiverId(user)}
              className="flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden border border-gray-400 dark:border-gray-600">
                <img
                  src={user.avatarUrl || "vite.svg"}
                  className="w-full h-full object-cover"
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.status || "Hey there..."}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Member;
