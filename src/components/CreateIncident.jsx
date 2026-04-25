import { useState } from "react";
import API from "../api/api";

export default function CreateIncident({ refresh }) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("low");
  const [loading, setLoading] = useState(false);

  const createIncident = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await API.post("/incidents", {
        title,
        severity,
      });

      setTitle("");
      setSeverity("low");

      // 🔥 IMPORTANT FIX
      await refresh?.(); // prevents stale UI issues

      console.log("Created:", res.data);

    } catch (err) {
      console.error("Error creating incident:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 text-white shadow-lg">

      <h3 className="text-xl font-bold mb-4">
        Create Incident
      </h3>

      <div className="space-y-4">

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
          placeholder="Incident title (e.g. Suspicious Login)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          onClick={createIncident}
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Creating Incident..." : "Create Incident"}
        </button>
      </div>
    </div>
  );
}