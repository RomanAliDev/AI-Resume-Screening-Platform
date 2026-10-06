import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  X,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userName = user?.name || "Recruiter";

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Jobs",
      path: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Candidates",
      path: "/candidates",
      icon: Users,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">AI Resume</h1>

            <p className="text-xs text-slate-400">Screening Platform</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }>
                <Icon size={19} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-900">{userName}</p>

            <p className="mt-1 text-xs text-slate-500">
              {user?.email || "HR Account"}
            </p>

            <button
              onClick={handleLogout}
              className="mt-3 flex cursor-pointer  w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium  transitionbg-red-50 text-red-600">
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
