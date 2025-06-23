import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { users, managerTeam, allFeedback } from "./data/mockData";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (role) => {
    setUser(users[role]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === "manager") {
    return (
      <ManagerDashboard
        user={user}
        onLogout={handleLogout}
        team={managerTeam}
        feedbackData={allFeedback}
      />
    );
  }

  if (user.role === "employee") {
    // For the demo, the logged-in employee is Kevin Lee (id: 1)
    return (
      <EmployeeDashboard
        user={user}
        onLogout={handleLogout}
        feedbackData={allFeedback["1"]}
      />
    );
  }

  return null; // Should not happen
}
