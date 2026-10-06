import { Bell, LogOut, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageInfo = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "AI-powered recruitment overview",
    },
    "/jobs": {
      title: "Jobs",
      subtitle: "Manage your recruitment positions",
    },
    "/jobs/create": {
      title: "Create Job",
      subtitle: "Create a new recruitment position",
    },
    "/candidates": {
      title: "Candidates",
      subtitle: "Review and manage AI-screened candidates",
    },
  };

  const isCandidateDetails = location.pathname.startsWith("/candidates/");

  const currentPage = isCandidateDetails
    ? {
        title: "Candidate Details",
        subtitle: "Review candidate profile and AI matching results",
      }
    : pageInfo[location.pathname] || pageInfo["/dashboard"];

  const handleLogout = () => {
    logout();
  };

  const userName = user?.name || "Recruiter";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 cursor-pointer text-slate-600 hover:bg-slate-100 lg:hidden">
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {currentPage.title}
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{userName}</p>

          <p className="text-xs text-slate-500">
            {user?.email || "HR Account"}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
          {initials}
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="rounded-lg cursor-pointer p-2  transition bg-red-50 text-red-600">
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;
