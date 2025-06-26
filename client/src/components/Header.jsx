import React from "react";
import { AppLogo, UserIcon } from "./icons";

function getInitials(name) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) {
    const subparts = parts[0].split("_");
    if (subparts.length > 1) {
      return (subparts[0][0] + subparts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const Header = ({ user, onLogout }) => {
  const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <AppLogo className="h-8 w-auto text-blue-600" />
            <span className="text-xl font-bold text-gray-800">
              Feedback Portal
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.avatar ? (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt="User avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                  {getInitials(user.full_name)}
                </div>
              )}
              <span className="text-sm font-medium">
                {user.full_name} ({role})
              </span>
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
