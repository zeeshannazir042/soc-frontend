import { useEffect, useState } from "react";
import API from "../api/api";

import Charts from "./Charts";
import AlertTable from "./AlertTable";
import IncidentList from "./IncidentList";
import CreateIncident from "./CreateIncident";
import CreateAlert from "./CreateAlert";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState("");

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
      setAlerts([]);
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data || []);
    } catch (err) {
      console.error(err);
      setIncidents([]);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchIncidents();
  }, []);

  // ✅ FIXED LOGIC
  const selectedIncidentData = incidents.find(
    (i) => i._id === selectedIncident
  );

  const filteredAlerts =
    selectedIncident && selectedIncidentData
      ? alerts.filter((a) =>
          selectedIncidentData.alerts?.includes(a._id)
        )
      : alerts;

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        SOC Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        <div className="lg:col-span-1">
          <CreateAlert onAlertCreated={fetchAlerts} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 h-[300px]">
            <Charts alerts={alerts} />
          </div>
        </div>
      </div>

      {/* INCIDENT FILTER */}
      <div className="mb-4">
        <select
          value={selectedIncident}
          onChange={(e) => setSelectedIncident(e.target.value)}
          className="bg-gray-900 text-white p-2 rounded border border-gray-700"
        >
          <option value="">All Incidents</option>

          {incidents.map((i) => (
            <option key={i._id} value={i._id}>
              {i.title} ({i.alerts?.length || 0})
            </option>
          ))}
        </select>
      </div>

      {/* ALERTS */}
      <div className="mb-6">
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-4">
            Alert Console
          </h2>

          <AlertTable
            alerts={filteredAlerts}
            refresh={fetchAlerts}
            incidents={incidents}
          />
        </div>
      </div>

      {/* INCIDENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1">
          <CreateIncident refresh={fetchIncidents} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-4">
              Incident Response
            </h2>

            <IncidentList incidents={incidents || []} />
          </div>
        </div>

      </div>

    </div>
  );
}