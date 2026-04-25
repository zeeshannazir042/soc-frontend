import API from "../api/api";

export default function AlertTable({ alerts, incidents, refresh }) {

  // attach single alert to incident
  const attachAlert = async (alertId, incidentId) => {
    try {
      await API.post(`/incidents/${incidentId}/alerts`, {
        alertIds: [alertId],
      });

      refresh();
    } catch (err) {
      console.error("Attach failed:", err);
    }
  };

  const updateTriage = async (id, status) => {
    try {
      await API.post(`/triage/${id}`, { status });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "low":
        return "text-green-400 bg-green-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="bg-gray-950 text-white rounded-xl border border-gray-800 overflow-hidden">

      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Alerts Console</h2>
        <p className="text-sm text-gray-400">Attach each alert to an incident</p>
      </div>

      <table className="w-full text-sm">

        <thead className="bg-gray-900 text-gray-300">
          <tr>
            <th className="p-3 text-left">Rule</th>
            <th className="p-3 text-left">Severity</th>
            <th className="p-3 text-left">Host</th>
            <th className="p-3 text-left">IP</th>
            <th className="p-3 text-left">Attach</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a) => (
            <tr key={a._id} className="border-b border-gray-800">

              <td className="p-3">{a.rule}</td>

              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(a.severity)}`}>
                  {a.severity}
                </span>
              </td>

              <td className="p-3">{a.host}</td>
              <td className="p-3">{a.ip}</td>

              {/* INCIDENT SELECT + ATTACH */}
              <td className="p-3 flex gap-2">

                <select
                  className="bg-gray-900 border border-gray-700 text-xs p-1 rounded"
                  id={`incident-${a._id}`}
                >
                  <option value="">Select Incident</option>
                  {incidents.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const incidentId = document.getElementById(`incident-${a._id}`).value;
                    if (!incidentId) return;

                    attachAlert(a._id, incidentId);
                  }}
                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Attach
                </button>

              </td>

              {/* TRIAGE ACTIONS */}
              <td className="p-3 flex gap-2">

                <button
                  onClick={() => updateTriage(a._id, "true_positive")}
                  className="px-2 py-1 text-xs bg-red-600 rounded"
                >
                  TP
                </button>

                <button
                  onClick={() => updateTriage(a._id, "false_positive")}
                  className="px-2 py-1 text-xs bg-green-600 rounded"
                >
                  FP
                </button>

                <button
                  onClick={() => updateTriage(a._id, "ignored")}
                  className="px-2 py-1 text-xs bg-gray-600 rounded"
                >
                  Ignore
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}