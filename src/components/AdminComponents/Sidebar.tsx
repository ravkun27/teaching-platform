// components/AdminDashboard/Sidebar.tsx
import toast from "react-hot-toast";
import { FiUsers, FiBarChart2, FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <div className="w-full md:w-64 bg-white dark:bg-gray-800 p-4 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("teachers")}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            activeTab === "teachers"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <FiUsers className="inline mr-2" /> Teachers
        </button>
        {/* <button
          onClick={() => setActiveTab("students")}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            activeTab === "students"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <FiUsers className="inline mr-2" /> Students
        </button> */}
        <button
          onClick={() => setActiveTab("editPages")}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            activeTab === "editPages"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <FiSettings className="inline mr-2" /> Edit Pages
        </button>
        <button
          onClick={() => setActiveTab("admins")}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            activeTab === "admins"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <FiSettings className="inline mr-2" /> Admins
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`w-full text-left px-4 py-2 rounded-lg ${
            activeTab === "stats"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <FiBarChart2 className="inline mr-2" /> Statistics
        </button>
        <button
          onClick={handleLogout}
          className={`w-full text-left px-4 py-2 rounded-lg hover:bg-red-500 text-red-700 hover:text-white dark:bg-red-600 dark:text-red-100 transition-colors duration-300`}
        >
          <FiLogOut className="inline mr-2" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
