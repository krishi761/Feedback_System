import React from "react";

const FeedbackCard = ({ feedback, onEdit }) => {
  const sentimentColors = {
    positive: "bg-green-100 text-green-800",
    neutral: "bg-gray-100 text-gray-800",
    negative: "bg-red-100 text-red-800",
  };
  const sentimentText =
    feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1);

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{feedback.date}</p>
          <div className="mt-2 space-y-2">
            <p>
              <strong className="font-semibold text-gray-800">
                Strengths:
              </strong>{" "}
              {feedback.strengths}
            </p>
            <p>
              <strong className="font-semibold text-gray-800">
                Areas to Improve:
              </strong>{" "}
              {feedback.areas_to_improve}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              sentimentColors[feedback.sentiment]
            }`}
          >
            {sentimentText}
          </span>
          <button
            onClick={() => onEdit(feedback)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
      </div>
      {feedback.acknowledged && (
        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
          Acknowledged by employee on {feedback.acknowledgedDate}.
        </p>
      )}
    </div>
  );
};

export default FeedbackCard;
