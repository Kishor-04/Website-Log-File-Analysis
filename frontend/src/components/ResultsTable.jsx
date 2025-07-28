import React from "react";

const ResultsTable = ({ data }) => {
  return (
    <div style={{ overflowX: "auto", padding: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#87CEFA", // Light blue header background
              color: "white",
              textAlign: "left",
            }}
          >
            <th style={headerCellStyle}>Timestamp</th>
            <th style={headerCellStyle}>IP Address</th>
            <th style={headerCellStyle}>Status</th>
            <th style={headerCellStyle}>Size</th>
            <th style={headerCellStyle}>Anomaly</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#E3F2FD" : "#FFFFFF", // Alternating light blue and white
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#BBDEFB"; // Hover effect
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? "#E3F2FD" : "#FFFFFF";
              }}
            >
              <td style={cellStyle}>{row.timestamp}</td>
              <td style={cellStyle}>{row.ip}</td>
              <td style={cellStyle}>{row.status}</td>
              <td style={cellStyle}>{row.size}</td>
              <td
                style={{
                  ...cellStyle,
                  color: row.anomaly === -1 ? "#FF6F61" : "#4CAF50", // Red for anomalies, green for normal
                  fontWeight: "bold",
                }}
              >
                {row.anomaly === -1 ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

const headerCellStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default ResultsTable;