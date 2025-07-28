import React from "react";
import FileUpload from "../components/FileUpload";

const Home = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#4CAF50", marginBottom: "10px" }}>Web Log Analyzer</h1>
      <p style={{ fontSize: "18px", color: "gray", marginBottom: "30px" }}>
        Upload your server log file to detect anomalies in web traffic.
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#333" }}>
          Upload Your File
        </h2>
        <FileUpload />
        <p style={{ marginTop: "10px", fontSize: "14px", color: "gray" }}>
          Accepted formats: <strong>.log</strong>, <strong>.txt</strong>
        </p>
      </div>
    </div>
  );
};

export default Home;