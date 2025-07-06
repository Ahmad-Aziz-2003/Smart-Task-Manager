import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAddTask = () => window.dispatchEvent(new CustomEvent("addTask"));
  const handleAddCategory = () =>
    window.dispatchEvent(new CustomEvent("addCategory"));
  const handleShowReminders = () =>
    window.dispatchEvent(new CustomEvent("showReminders"));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        user={user}
        handleLogout={handleLogout}
        handleShowReminders={handleShowReminders}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex flex-1">
        <Sidebar
          onAddTask={handleAddTask}
          onAddCategory={handleAddCategory}
          onShowReminders={handleShowReminders}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>

      <button
        onClick={handleAddTask}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-30 flex items-center justify-center"
        aria-label="Add Task"
        title="Add Task"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
