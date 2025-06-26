import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SentimentChart from "../components/SentimentChart";
import FeedbackCard from "../components/FeedbackCard";
import GiveFeedbackModal from "../components/GiveFeedbackModal";
import { FeedbackIcon, PlusIcon } from "../components/icons";
import {
  dashboardService,
  teamService,
  feedbackService,
} from "../services/api";

function getSentimentTrends(feedbackHistory) {
  // Group feedback by month and sentiment
  const monthMap = {};
  feedbackHistory.forEach((fb) => {
    const date = new Date(fb.updated_at || fb.created_at);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const label = `${month} ${year}`;
    if (!monthMap[label]) {
      monthMap[label] = { positive: 0, neutral: 0, negative: 0 };
    }
    monthMap[label][fb.sentiment] = (monthMap[label][fb.sentiment] || 0) + 1;
  });
  const labels = Object.keys(monthMap);
  const positive = labels.map((label) => monthMap[label].positive || 0);
  const neutral = labels.map((label) => monthMap[label].neutral || 0);
  const negative = labels.map((label) => monthMap[label].negative || 0);
  return { labels, positive, neutral, negative };
}

const TeamOverview = ({ dashboardData, feedbackHistory }) => {
  const sentimentData = getSentimentTrends(feedbackHistory || []);
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Feedback Sent
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboardData?.feedback_count || 0}
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <FeedbackIcon />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow relative h-64">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Sentiment Trend
          </p>
          <SentimentChart sentimentData={sentimentData} />
        </div>
      </div>
    </section>
  );
};

const ManagerDashboard = ({ user, onLogout }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employeeFeedback, setEmployeeFeedback] = useState([]);

  const fetchData = async (employeeId = null) => {
    try {
      setLoading(true);
      const [dashboard, team] = await Promise.all([
        dashboardService.getDashboard(),
        teamService.getTeam(),
      ]);
      setDashboardData(dashboard);
      setTeamMembers(team);
      if (team.length > 0) {
        const emp = employeeId
          ? team.find((m) => m.id === employeeId)
          : team[0];
        setSelectedEmployee(emp);
        if (dashboard.team_members) {
          const member = dashboard.team_members.find((m) => m.id === emp.id);
          setEmployeeFeedback(member?.feedback_history || []);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (dashboardData.team_members && selectedEmployee) {
      const member = dashboardData.team_members.find(
        (m) => m.id === selectedEmployee.id
      );
      setEmployeeFeedback(member?.feedback_history || []);
    }
  }, [dashboardData, selectedEmployee]);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingFeedback(null);
    setIsModalOpen(false);
  };

  const handleSaveFeedback = async (feedbackData) => {
    try {
      if (editingFeedback) {
        await feedbackService.updateFeedback(editingFeedback.id, {
          strengths: feedbackData.strengths,
          areas_to_improve: feedbackData.areas_to_improve,
          sentiment: feedbackData.sentiment,
        });
      } else {
        await feedbackService.submitFeedback({
          ...feedbackData,
          recipient_id: selectedEmployee.id,
        });
      }
      await fetchData(selectedEmployee.id);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to save feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Team List */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Team
              </h3>
              {teamMembers.length > 0 ? (
                <ul className="space-y-2">
                  {teamMembers.map((member) => (
                    <li key={member.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedEmployee(member);
                        }}
                        className={`flex items-center space-x-3 p-2 rounded-md ${
                          selectedEmployee?.id === member.id
                            ? "bg-blue-100 border-l-4 border-blue-500"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">
                            {member.full_name}
                          </p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No team members found.</p>
              )}
            </div>
          </aside>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-8">
            <TeamOverview
              dashboardData={dashboardData}
              feedbackHistory={employeeFeedback}
            />
            {selectedEmployee && (
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedEmployee.full_name} - Feedback History
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <PlusIcon />
                    <span>Give Feedback</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {employeeFeedback.length > 0 ? (
                    employeeFeedback.map((fb) => (
                      <FeedbackCard
                        key={fb.id}
                        feedback={fb}
                        onEdit={handleEdit}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      No feedback given to this team member yet.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      {selectedEmployee && (
        <GiveFeedbackModal
          employee={selectedEmployee}
          show={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveFeedback}
          editingFeedback={editingFeedback}
        />
      )}
    </div>
  );
};

export default ManagerDashboard;
