import React, { useState } from "react";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false); // To track upload state

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadStatus(""); // Reset upload status on new file selection
  };

  const handleFileUpload = () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setIsUploading(true); // Start upload animation
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://127.0.0.1:5000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setIsUploading(false); // Stop upload animation
        if (response.ok) {
          setUploadStatus("File uploaded successfully!");
          if (onUploadSuccess) {
            onUploadSuccess(); // Trigger the success callback to redirect
          }
        } else {
          setUploadStatus("File upload failed.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setIsUploading(false); // Stop upload animation
        setUploadStatus("File upload failed.");
      });
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Upload Your Log File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "14px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleFileUpload}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: isUploading ? "#ccc" : "#1e6fd8",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: isUploading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
        disabled={isUploading} // Disable button during upload
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
      {uploadStatus && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: uploadStatus.includes("successfully") ? "green" : "red",
            animation: "fadeIn 0.5s ease-in-out",
          }}
        >
          {uploadStatus}
        </p>
      )}

      <style>
        {`
          button:hover:enabled {
            background-color: #1e6fd8;
          }

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

export default FileUpload;