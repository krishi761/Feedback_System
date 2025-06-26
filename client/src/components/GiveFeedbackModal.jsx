import React, { useState, useEffect } from "react";

const GiveFeedbackModal = ({
  employee,
  show,
  onClose,
  onSave,
  editingFeedback,
}) => {
  const [strengths, setStrengths] = useState("");
  const [areasToImprove, setAreasToImprove] = useState("");
  const [sentiment, setSentiment] = useState("neutral");

  useEffect(() => {
    if (show) {
      if (editingFeedback) {
        setStrengths(editingFeedback.strengths || "");
        setAreasToImprove(editingFeedback.areas_to_improve || "");
        setSentiment(editingFeedback.sentiment || "neutral");
      } else {
        setStrengths("");
        setAreasToImprove("");
        setSentiment("neutral");
      }
    }
  }, [show, editingFeedback, employee]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      strengths,
      areas_to_improve: areasToImprove,
      sentiment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              Give Feedback to {employee?.full_name}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="strengths"
                className="block text-sm font-medium text-gray-700"
              >
                Strengths
              </label>
              <textarea
                id="strengths"
                rows="4"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="improvements"
                className="block text-sm font-medium text-gray-700"
              >
                Areas to Improve
              </label>
              <textarea
                id="improvements"
                rows="4"
                value={areasToImprove}
                onChange={(e) => setAreasToImprove(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overall Sentiment
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sentiment"
                    value="positive"
                    checked={sentiment === "positive"}
                    onChange={() => setSentiment("positive")}
                    className="form-radio text-green-500"
                  />
                  <span className="ml-2 text-green-700">Positive</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sentiment"
                    value="neutral"
                    checked={sentiment === "neutral"}
                    onChange={() => setSentiment("neutral")}
                    className="form-radio text-gray-500"
                  />
                  <span className="ml-2 text-gray-700">Neutral</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sentiment"
                    value="negative"
                    checked={sentiment === "negative"}
                    onChange={() => setSentiment("negative")}
                    className="form-radio text-red-500"
                  />
                  <span className="ml-2 text-red-700">Negative</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveFeedbackModal;
