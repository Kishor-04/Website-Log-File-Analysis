import React, { useState, useEffect } from "react";
import ResultsTable from "../components/ResultsTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Results = () => {
  const [results, setResults] = useState([]);
  const [anomalyStats, setAnomalyStats] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/results")
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        processVisualizationData(data);
      })
      .catch((error) => console.error("Error fetching results:", error));
  }, []);

  const processVisualizationData = (data) => {
    // Compute anomaly stats for bar chart
    const anomalyCounts = data.reduce(
      (acc, log) => {
        if (log.anomaly === -1) acc.anomalies++;
        else acc.normal++;
        return acc;
      },
      { anomalies: 0, normal: 0 }
    );
    setAnomalyStats([
      { name: "Normal Requests", count: anomalyCounts.normal },
      { name: "Anomalies", count: anomalyCounts.anomalies },
    ]);

    // Compute status code distribution for pie chart
    const statusCounts = data.reduce((acc, log) => {
      const status = log.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    const statusData = Object.keys(statusCounts).map((status) => ({
      name: `Status ${status}`,
      value: statusCounts[status],
    }));
    setStatusDistribution(statusData);
  };

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#E3F2FD", // Light blue background
      }}
    >
      <h1
        style={{
          color: "#1E88E5", // Blue text for header
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Anomaly Detection Results
      </h1>

      {/* Bar Chart for Anomalies vs Normal Requests */}
      <div style={{ marginBottom: "50px" }}>
        <h3 style={{ textAlign: "center", color: "#1E88E5" }}>
          Anomalies vs. Normal Requests
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={anomalyStats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#64B5F6" /> {/* Light blue bar */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart for Request Sizes over Time */}
      <div style={{ marginBottom: "50px" }}>
        <h3 style={{ textAlign: "center", color: "#1E88E5" }}>
          Request Size over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={results}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="size" stroke="#4FC3F7" /> {/* Light blue line */}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart for Status Code Distribution */}
      <div style={{ marginBottom: "50px" }}>
        <h3 style={{ textAlign: "center", color: "#1E88E5" }}>
          HTTP Status Code Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#64B5F6" // Light blue pie
              label
            >
              {statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Results Table */}
      <div>
        <h3 style={{ textAlign: "center", color: "#1E88E5" }}>Detailed Results</h3>
        <ResultsTable data={results} />
      </div>
    </div>
  );
};

// Helper function to generate colors for PieChart
const generateColor = (index) => {
  const colors = [
    "#64B5F6", // Light Blue
    "#4FC3F7", // Cyan
    "#FF8A65", // Salmon
    "#FFD54F", // Yellow
    "#81C784", // Green
    "#BA68C8", // Purple
  ];
  return colors[index % colors.length];
};

export default Results;