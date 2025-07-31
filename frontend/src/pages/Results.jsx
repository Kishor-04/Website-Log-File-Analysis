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
  AreaChart,
  Area,
} from "recharts";

const Results = () => {
  const [results, setResults] = useState([]);
  const [anomalyStats, setAnomalyStats] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [summary, setSummary] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = () => {
    setLoading(true);
    fetch(`${API_URL}/results`)
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        processVisualizationData(data);
        generateSummary(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  };

  const processVisualizationData = (data) => {
    // Anomaly stats
    const anomalyCounts = data.reduce(
      (acc, log) => {
        if (log.anomaly === -1) acc.anomalies++;
        else acc.normal++;
        return acc;
      },
      { anomalies: 0, normal: 0 }
    );
    setAnomalyStats([
      { name: "Normal Requests", count: anomalyCounts.normal, fill: "#4ade80" },
      { name: "Anomalies", count: anomalyCounts.anomalies, fill: "#f87171" },
    ]);

    // Status code distribution
    const statusCounts = data.reduce((acc, log) => {
      const status = log.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map((status, index) => ({
      name: `${status}`,
      value: statusCounts[status],
      fill: getStatusColor(status),
    }));
    setStatusDistribution(statusData);

    // Time series data (grouping by hour) - FIXED: Create a copy before sorting
    const timeGroups = data.reduce((acc, log) => {
      const hour = new Date(log.timestamp).getHours();
      const key = `${hour}:00`;
      if (!acc[key]) {
        acc[key] = { time: key, requests: 0, anomalies: 0, totalSize: 0 };
      }
      acc[key].requests++;
      acc[key].totalSize += parseInt(log.size) || 0;
      if (log.anomaly === -1) acc[key].anomalies++;
      return acc;
    }, {});

    // FIXED: Create an array and sort it (not mutating the original)
    const timeSeriesArray = Object.values(timeGroups).sort((a, b) => {
      return parseInt(a.time) - parseInt(b.time);
    });
    setTimeSeriesData(timeSeriesArray);
  };

  const generateSummary = (data) => {
    const totalRequests = data.length;
    const anomalies = data.filter(log => log.anomaly === -1).length;
    const uniqueIPs = new Set(data.map(log => log.ip)).size;
    const avgSize = data.reduce((sum, log) => sum + (parseInt(log.size) || 0), 0) / totalRequests;

    setSummary({
      totalRequests,
      anomalies,
      uniqueIPs,
      avgSize: Math.round(avgSize),
      anomalyRate: ((anomalies / totalRequests) * 100).toFixed(2)
    });
  };

  const getStatusColor = (status) => {
    if (status.startsWith('2')) return '#4ade80'; // Green for 2xx
    if (status.startsWith('3')) return '#60a5fa'; // Blue for 3xx
    if (status.startsWith('4')) return '#fbbf24'; // Yellow for 4xx
    if (status.startsWith('5')) return '#f87171'; // Red for 5xx
    return '#94a3b8'; // Gray for others
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Analyzing your log files...</h2>
        <p>Please wait while we process your data</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* Header */}
      <header className="results-header">
        <div className="header-content">
          <h1>📊 Analysis Results</h1>
          <p>Comprehensive insights from your server logs</p>
        </div>
        <button className="refresh-button" onClick={fetchResults}>
          🔄 Refresh Data
        </button>
      </header>

      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-cards">
          <div className="summary-card primary">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>{summary.totalRequests?.toLocaleString()}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="summary-card danger">
            <div className="card-icon">⚠️</div>
            <div className="card-content">
              <h3>{summary.anomalies?.toLocaleString()}</h3>
              <p>Anomalies Detected</p>
              <span className="badge">{summary.anomalyRate}%</span>
            </div>
          </div>
          <div className="summary-card info">
            <div className="card-icon">🌐</div>
            <div className="card-content">
              <h3>{summary.uniqueIPs?.toLocaleString()}</h3>
              <p>Unique IP Addresses</p>
            </div>
          </div>
          <div className="summary-card success">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>{summary.avgSize?.toLocaleString()}</h3>
              <p>Avg Response Size (bytes)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="view-navigation">
        <button
          className={`nav-tab ${selectedView === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedView('overview')}
        >
          📈 Overview
        </button>
        <button
          className={`nav-tab ${selectedView === 'anomalies' ? 'active' : ''}`}
          onClick={() => setSelectedView('anomalies')}
        >
          ⚠️ Anomaly Analysis
        </button>
        <button
          className={`nav-tab ${selectedView === 'traffic' ? 'active' : ''}`}
          onClick={() => setSelectedView('traffic')}
        >
          🚦 Traffic Patterns
        </button>
        <button
          className={`nav-tab ${selectedView === 'details' ? 'active' : ''}`}
          onClick={() => setSelectedView('details')}
        >
          📋 Detailed Logs
        </button>
      </nav>

      {/* Content based on selected view */}
      <main className="results-content">
        {selectedView === 'overview' && (
          <div className="overview-grid">
            <div className="chart-container">
              <h3>Request Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={anomalyStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>HTTP Status Codes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'anomalies' && (
          <div className="anomaly-analysis">
            <div className="chart-container full-width">
              <h3>Anomaly Detection Over Time</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timeSeriesData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="requests"
                    stackId="1"
                    stroke="#4ade80"
                    fill="#4ade80"
                    fillOpacity={0.6}
                    name="Normal Requests"
                  />
                  <Area
                    type="monotone"
                    dataKey="anomalies"
                    stackId="1"
                    stroke="#f87171"
                    fill="#f87171"
                    fillOpacity={0.8}
                    name="Anomalies"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="anomaly-insights">
              <div className="insight-card">
                <h4>🔍 Key Findings</h4>
                <ul>
                  <li>Peak anomaly hours: {[...timeSeriesData].sort((a, b) => b.anomalies - a.anomalies).slice(0, 3).map(d => d.time).join(', ')}</li>
                  <li>Anomaly rate: {summary.anomalyRate}% of total requests</li>
                  <li>Most affected time period: {[...timeSeriesData].find(d => d.anomalies === Math.max(...timeSeriesData.map(x => x.anomalies)))?.time || 'N/A'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'traffic' && (
          <div className="traffic-analysis">
            <div className="chart-container full-width">
              <h3>Traffic Patterns by Hour</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#667eea"
                    strokeWidth={3}
                    dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                    name="Total Requests"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalSize"
                    stroke="#764ba2"
                    strokeWidth={2}
                    dot={{ fill: '#764ba2', r: 3 }}
                    name="Total Data (bytes)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedView === 'details' && (
          <div className="details-section">
            <ResultsTable data={results} />
          </div>
        )}
      </main>

      <style>{`
        .results-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 30px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .results-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content h1 {
          font-size: 2.5rem;
          margin: 0 0 10px;
          font-weight: 700;
        }

        .header-content p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
        }

        .refresh-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .refresh-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .summary-section {
          padding: 30px 20px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .summary-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-5px);
        }

        .summary-card.primary { border-left-color: #667eea; }
        .summary-card.danger { border-left-color: #f87171; }
        .summary-card.info { border-left-color: #60a5fa; }
        .summary-card.success { border-left-color: #4ade80; }

        .card-icon {
          font-size: 2.5rem;
        }

        .card-content h3 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 5px;
          color: #1a202c;
        }

        .card-content p {
          font-size: 0.9rem;
          color: #718096;
          margin: 0;
        }

        .badge {
          background: #fed7d7;
          color: #c53030;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 5px;
          display: inline-block;
        }

        .view-navigation {
          background: white;
          padding: 0 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          gap: 0;
          overflow-x: auto;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 16px 24px;
          cursor: pointer;
          font-weight: 500;
          color: #718096;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-tab:hover {
          color: #4a5568;
          background: #f7fafc;
        }

        .nav-tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f7fafc;
        }

        .results-content {
          padding: 30px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 30px;
        }

        .chart-container {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .chart-container.full-width {
          grid-column: 1 / -1;
        }

        .chart-container h3 {
          margin: 0 0 20px;
          color: #2d3748;
          font-weight: 600;
          font-size: 1.3rem;
        }

        .anomaly-analysis {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .anomaly-insights {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .insight-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .insight-card h4 {
          margin: 0 0 15px;
          color: #2d3748;
          font-weight: 600;
        }

        .insight-card ul {
          margin: 0;
          padding-left: 20px;
          color: #4a5568;
        }

        .insight-card li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .traffic-analysis,
        .details-section {
          width: 100%;
        }

        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
          
          .anomaly-analysis {
            grid-template-columns: 1fr;
          }
          
          .chart-container {
            min-width: 0;
          }
        }

        @media (max-width: 768px) {
          .results-header {
            flex-direction: column;
            text-align: center;
          }
          
          .header-content h1 {
            font-size: 2rem;
          }
          
          .summary-cards {
            grid-template-columns: 1fr;
          }
          
          .view-navigation {
            padding: 0 10px;
          }
          
          .nav-tab {
            padding: 16px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Results;