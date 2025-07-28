import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

const Home = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    // Redirect to results page after successful upload
    navigate("/results");
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#f4f4f9",
      }}
    >
      {/* Header Section */}
      <header
        style={{
          marginBottom: "30px",
          animation: "fadeInDown 1.5s ease-in-out",
        }}
      >
        <h1
          style={{
            color: "#2c7be5",
            fontSize: "42px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Web Log Analyzer
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#6c757d",
            marginBottom: "0",
          }}
        >
          Upload your server log files to detect anomalies and gain insights.
        </p>
      </header>

      {/* Upload Section */}
      <section
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          animation: "zoomIn 1s ease-in-out",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            color: "#333",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Upload Your File
        </h2>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: "#6c757d",
          }}
        >
          Supported formats: <strong>.log</strong>, <strong>.txt</strong>
        </p>
      </section>

      {/* Information Section */}
      <section
        style={{
          marginTop: "40px",
          padding: "30px",
          backgroundColor: "#e9f7fe",
          borderRadius: "10px",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
          animation: "fadeInUp 1.5s ease-in-out",
        }}
      >
        <h3 style={{ fontSize: "22px", color: "#2c7be5", marginBottom: "15px" }}>
          Why Upload Your Logs?
        </h3>
        <p style={{ fontSize: "16px", color: "#495057", lineHeight: "1.6" }}>
          Analyzing your server logs helps you identify traffic patterns and detect anomalies such as unusual activity, failed requests, or server issues. Upload your logs now to gain actionable insights.
        </p>
      </section>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          button:hover {
            background-color: #1e6fd8;
            transform: scale(1.05);
            transition: all 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default Home;