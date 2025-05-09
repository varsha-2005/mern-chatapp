import { useEffect, useState } from "react";
import { useChat } from "../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const {
    user,
    setUser,
    getUserdetail,
    handleUpdate,
    status,
    setStatus,
    password,
    setPassword,
    newPassword,
    setNewPassword,
    loading,
  } = useChat();

  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    getUserdetail();
    setAvatarOptions([
      "/avatar1.jpg",
      "/avatar2.jpg",
      "/avatar3.jpg",
      "/avatar4.jpg",
      "/avatar5.jpg",
      "/avatar6.jpg",
      "/avatar7.jpg",
      "/avatar8.jpg",
      "/avatar9.jpg",
      "/avatar10.jpg",
    ]);
  }, []);

  const handleAvatarChange = (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatarUrl }));
    setShowAvatarSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleUpdate(e);
      toast.success("Profile updated successfully");
      setPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="h-screen px-6 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition overflow-hidden">
      <div className="w-full max-w-md rounded-lg shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition h-[700px]">
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 ">
          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
            Profile Settings
          </h1>
          <button
            onClick={getUserdetail}
            className="text-lg font-semibold text-gray-700 dark:text-gray-100 hover:text-blue-500 transition"
            title="Refresh"
          >
            ⟳
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 relative">
            <div className="relative group">
              <img
                src={user?.avatarUrl || "/default-avatar.jpg"}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover cursor-pointer border-4 border-blue-500 hover:border-blue-600 transition"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white bg-black bg-opacity-50 rounded-full p-1 text-xs">
                  Change
                </span>
              </div>
            </div>

            {showAvatarSelector && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg z-10 grid grid-cols-5 gap-2 mt-2">
                {avatarOptions.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition"
                    onClick={() => handleAvatarChange(avatar)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={user?.name || ""}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 transition"
              required
            />
          </div>

          {/* Email Field (read-only) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Status/About Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              About
            </label>
            <input
              type="text"
              placeholder={status || user?.status || ""}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 transition"
            />
          </div>

          {/* Password Change Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Change Password
            </h3>

            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-400 text-gray-900 dark:text-gray-100 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Settings;
