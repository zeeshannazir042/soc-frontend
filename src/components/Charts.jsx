import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#f97316", "#eab308", "#a855f7"];

export default function Charts({ alerts }) {

  const severityData = ["low", "medium", "high"].map((s) => ({
    name: s,
    value: alerts.filter(a => a.severity === s).length
  }));

  const triageData = ["true_positive", "false_positive", "ignored", "escalated"].map((s) => ({
    name: s,
    value: alerts.filter(a => a.triage?.status === s).length
  }));

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 shadow-lg">
        <h2 className="text-white text-lg font-semibold mb-3">
          Severity Distribution
        </h2>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {severityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#fff"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

  
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 shadow-lg">
        <h2 className="text-white text-lg font-semibold mb-3">
          Triage Status Overview
        </h2>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={triageData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  color: "#fff"
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}