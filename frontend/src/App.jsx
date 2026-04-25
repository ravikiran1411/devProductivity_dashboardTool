import { useState } from "react";
import axios from "axios";

function App() {
  const [developer, setDeveloper] = useState("DEV-002");
  const [month, setMonth] = useState("2026-04");
  const [data, setData] = useState(null);

  const getMetrics = async () => {
    const res = await axios.get(`http://localhost:4000/metrics?developer=${developer}&month=${month}`);
    setData(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Developer Productivity Dashboard
        </h1>

        <div className="flex gap-3 mb-4">
          <select
            className="border p-2 rounded w-full"
            onChange={(e) => setDeveloper(e.target.value)}
          >
            <option value="DEV-001">Ava Chen</option>
            <option value="DEV-002">Noah Patel</option>
            <option value="DEV-003">Mia Lopez</option>
            <option value="DEV-004">Lucas Reed</option>
            <option value="DEV-005">Emma Roy</option>
            <option value="DEV-006">Ishan Mehta</option>
            <option value="DEV-008">Owen Brooks</option>
          </select>

          <select
            className="border p-2 rounded w-full"
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="2026-03">March</option>
            <option value="2026-04">April</option>
          </select>
        </div>

        <button
          onClick={getMetrics}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Get Metrics
        </button>

        {data && (
          <div className="mt-6">

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded shadow">
                <p className="text-sm text-gray-500">Lead Time</p>
                <p className="text-xl font-semibold">{data.leadTime}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded shadow">
                <p className="text-sm text-gray-500">Cycle Time</p>
                <p className="text-xl font-semibold">{data.cycleTime}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded shadow">
                <p className="text-sm text-gray-500">PR Count</p>
                <p className="text-xl font-semibold">{data.prCount}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded shadow">
                <p className="text-sm text-gray-500">Deployments</p>
                <p className="text-xl font-semibold">{data.deployCount}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded shadow col-span-2">
                <p className="text-sm text-gray-500">Bug Rate</p>
                <p className="text-xl font-semibold text-red-500">
                  {data.bugRate}%
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="font-semibold mb-2">Insights</h2>
              {data.insights.map((i, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                   {i}
                </p>
              ))}
            </div>


            <div>
              <h2 className="font-semibold mb-2">Suggestions</h2>
              {data.suggestions.map((s, idx) => (
                <p key={idx} className="text-sm text-gray-700">
                   {s}
                </p>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;