import { useEffect, useState } from "react";
import API from "../api/api";

export default function IncidentList({ refreshKey }) {
  const [incidents, setIncidents] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [refreshKey]);

  // 🔥 ADD COMMENT FUNCTION
  const addComment = async (incidentId) => {
    const message = commentInputs[incidentId];
    if (!message) return;

    try {
      await API.post(`/incidents/${incidentId}/comments`, {
        message,
      });

      // clear input
      setCommentInputs({
        ...commentInputs,
        [incidentId]: "",
      });

      // refresh incidents
      fetchIncidents();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500";
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500";
    }
  };

  return (
    <div className="space-y-4">

      {incidents.map((i) => (
        <div
          key={i._id}
          className="bg-gray-950 border border-gray-800 rounded-xl p-4 shadow-lg"
        >

          {/* TITLE */}
          <h3 className="text-lg font-semibold text-white">
            {i.title}
          </h3>

          {/* SEVERITY + STATUS */}
          <div className="flex gap-3 mt-2 text-sm">

            <span className={`px-2 py-1 rounded border ${getSeverityColor(i.severity)}`}>
              {i.severity}
            </span>

            <span className="text-gray-400">
              Status:{" "}
              <span className="text-blue-400">
                {i.status || "open"}
              </span>
            </span>

          </div>

          {/* ALERT COUNT */}
          <p className="text-gray-400 mt-2 text-sm">
            Alerts: <span className="text-white">{i.alerts?.length || 0}</span>
          </p>

          {/* COMMENTS LIST */}
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-300">
              Comments
            </h4>

            <div className="mt-1 space-y-1">
              {(i.comments || []).map((c) => (
                <p
                  key={c._id}
                  className="text-xs text-gray-400"
                >
                  • {c.message}
                </p>
              ))}
            </div>
          </div>

          {/* ADD COMMENT INPUT */}
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 p-2 text-sm bg-gray-900 border border-gray-700 rounded"
              placeholder="Write comment..."
              value={commentInputs[i._id] || ""}
              onChange={(e) =>
                setCommentInputs({
                  ...commentInputs,
                  [i._id]: e.target.value,
                })
              }
            />

            <button
              onClick={() => addComment(i._id)}
              className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded"
            >
              Add
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}