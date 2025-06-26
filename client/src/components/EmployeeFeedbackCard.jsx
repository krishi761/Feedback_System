import React, { useState } from "react";

function formatDateMDY(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

const EmployeeFeedbackCard = ({ feedback, onAcknowledge }) => {
  const [isExpanded, setIsExpanded] = useState(!feedback.acknowledged);

  const sentimentColors = {
    positive: "bg-green-100 text-green-800",
    neutral: "bg-gray-100 text-gray-800",
    negative: "bg-red-100 text-red-800",
  };
  const sentimentText =
    feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1);

  const isUpdated =
    feedback.updated_at && feedback.updated_at !== feedback.created_at;
  const dateValue = isUpdated
    ? formatDateMDY(feedback.updated_at)
    : formatDateMDY(feedback.created_at);
  const dateLabel = isUpdated ? "Updated" : "";

  if (!isExpanded) {
    return (
      <div className="bg-white p-5 rounded-lg shadow opacity-80">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">
              {dateValue} from{" "}
              <strong className="text-gray-800">{feedback.author}</strong>
              {dateLabel && (
                <span className="ml-2 text-xs text-gray-500">
                  ({dateLabel})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                sentimentColors[feedback.sentiment]
              }`}
            >
              {sentimentText}
            </span>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-lg ${
        !feedback.acknowledged ? "border-2 border-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-600">
          {dateValue} from{" "}
          <strong className="text-gray-800">{feedback.author}</strong>
          {dateLabel && (
            <span className="ml-2 text-xs text-gray-500">({dateLabel})</span>
          )}
        </p>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            sentimentColors[feedback.sentiment]
          }`}
        >
          {sentimentText}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800">Strengths</h4>
          <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
            {feedback.strengths
              .split(". ")
              .filter((s) => s)
              .map((s, i) => (
                <li key={i}>{s}</li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Areas to Improve</h4>
          <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
            {feedback.areas_to_improve
              .split(". ")
              .filter((s) => s)
              .map((s, i) => (
                <li key={i}>{s}</li>
              ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        {!feedback.acknowledged ? (
          <button
            onClick={async () => {
              if (onAcknowledge) {
                await onAcknowledge(feedback.id);
              }
            }}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            Acknowledge Feedback
          </button>
        ) : (
          <button
            onClick={() => setIsExpanded(false)}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Hide Details
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeFeedbackCard;
