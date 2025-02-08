import { useChat } from "../context/Context";

const Member = ({ setReceiverId }: { setReceiverId: (id: string) => void }) => {

    const { search, setSearch,users  } = useChat();
    
    const filteredUsers = users.filter((user) => 
        user.name.toLowerCase().includes(search.toLowerCase()) 
    );    
 
    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md mt-9 p-4">
            <input
                type="text"
                placeholder="Search users..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <h2 className="text-lg font-semibold my-4 text-gray-800">People</h2>
            <div className="space-y-3">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => setReceiverId(user)}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                                <img
                                    src={user.avatarUrl || "vite.svg"}
                                    className="w-full h-full object-cover"
                                    alt={user.name}
                                />
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-500">
                                    {user.status || "Hey there..."}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Member;