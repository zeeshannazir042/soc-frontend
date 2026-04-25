import { useState } from "react";
import api from "../api/api";

export default function CreateAlert({ onAlertCreated }) {
  const [form, setForm] = useState({
    rule: "",
    severity: "low",
    host: "",
    ip: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/alerts", form);

      setForm({
        rule: "",
        severity: "low",
        host: "",
        ip: ""
      });

      if (onAlertCreated) onAlertCreated(res.data);

    } catch (err) {
      console.error("Error creating alert:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 shadow-lg text-white">
  
      <h3 className="text-xl font-bold mb-4">
        Create Security Alert
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="rule"
          placeholder="Rule name (e.g. SSH Brute Force)"
          value={form.rule}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
        />

        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
        >
          <option value="low"> Low</option>
          <option value="medium"> Medium</option>
          <option value="high"> High</option>
        </select>

        <input
          name="host"
          placeholder="Host (e.g. server-01)"
          value={form.host}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
        />

        <input
          name="ip"
          placeholder="IP Address (e.g. 192.168.1.1)"
          value={form.ip}
          onChange={handleChange}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg font-semibold transition ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Alert..." : "Create Alert"}
        </button>
      </form>
    </div>
  );
}