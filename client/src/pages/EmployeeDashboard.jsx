import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import EmployeeFeedbackCard from "../components/EmployeeFeedbackCard";
import { dashboardService, feedbackService } from "../services/api";

const EmployeeDashboard = ({ user, onLogout }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboard = await dashboardService.getDashboard();
        setFeedbackData(dashboard.feedback_timeline || []);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        setError("Failed to load feedback data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcknowledgeFeedback = async (feedbackId) => {
    try {
      await feedbackService.acknowledgeFeedback(feedbackId);
      // Refresh the feedback data
      const dashboard = await dashboardService.getDashboard();
      setFeedbackData(dashboard.feedback_timeline || []);
    } catch (error) {
      console.error("Error acknowledging feedback:", error);
      alert("Failed to acknowledge feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading feedback...</div>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Feedback Timeline
        </h1>
        <div className="space-y-6">
          {feedbackData.length > 0 ? (
            feedbackData.map((fb) => (
              <EmployeeFeedbackCard
                key={fb.id}
                feedback={fb}
                onAcknowledge={() => handleAcknowledgeFeedback(fb.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              You haven't received any feedback yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
