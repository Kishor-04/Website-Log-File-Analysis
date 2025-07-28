import React from "react";

const ResultsTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>IP Address</th>
          <th>Status</th>
          <th>Size</th>
          <th>Anomaly</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.timestamp}</td>
            <td>{row.ip}</td>
            <td>{row.status}</td>
            <td>{row.size}</td>
            <td>{row.anomaly === -1 ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;