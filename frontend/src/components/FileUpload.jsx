import React, { useState, useRef } from "react";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const allowedTypes = ['text/plain', 'application/x-log'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.log')) {
      setUploadStatus("Please select a valid log file (.log or .txt)");
      return;
    }
    
    if (selectedFile.size > maxSize) {
      setUploadStatus("File size must be less than 50MB");
      return;
    }
    
    setFile(selectedFile);
    setUploadStatus("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    // Simulate progress for demo purposes
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);
        
        if (response.ok) {
          setUploadStatus("File uploaded successfully!");
          setTimeout(() => {
            if (onUploadSuccess) {
              onUploadSuccess();
            }
          }, 1000);
        } else {
          setUploadStatus("Upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus("Upload failed. Please check your connection.");
      });
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".log,.txt"
          style={{ display: 'none' }}
        />
        
        {!file ? (
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <h3>Drop your log file here</h3>
            <p>or click to browse files</p>
            <div className="file-types">
              <span>.log</span>
              <span>.txt</span>
            </div>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <div className="file-icon">📄</div>
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{formatFileSize(file.size)}</p>
              </div>
              <button
                className="remove-file"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                disabled={isUploading}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="progress-text">{Math.round(uploadProgress)}% uploaded</p>
        </div>
      )}

      {/* Upload Button */}
      {file && !isUploading && (
        <button
          className="upload-button"
          onClick={handleFileUpload}
          disabled={isUploading}
        >
          <span className="button-icon">🚀</span>
          Start Analysis
        </button>
      )}

      {/* Status Message */}
      {uploadStatus && (
        <div className={`status-message ${uploadStatus.includes('successfully') ? 'success' : 'error'}`}>
          <span className="status-icon">
            {uploadStatus.includes('successfully') ? '✅' : '❌'}
          </span>
          {uploadStatus}
        </div>
      )}

      {/* File Requirements */}
      <div className="requirements">
        <h4>File Requirements:</h4>
        <ul>
          <li>Max file size: 50MB</li>
          <li>Supported formats: .log, .txt</li>
          <li>Common log formats: Apache, Nginx, IIS</li>
        </ul>
      </div>

      <style jsx>{`
        .file-upload-container {
          max-width: 500px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .drop-zone {
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover {
          border-color: #4299e1;
          background: #ebf8ff;
          transform: translateY(-2px);
        }

        .drop-zone.drag-over {
          border-color: #3182ce;
          background: #bee3f8;
          box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.1);
        }

        .drop-zone.has-file {
          border-color: #38a169;
          background: #f0fff4;
        }

        .drop-zone-content h3 {
          color: #2d3748;
          font-size: 1.3rem;
          margin: 15px 0 8px;
          font-weight: 600;
        }

        .drop-zone-content p {
          color: #718096;
          margin: 0 0 20px;
          font-size: 1rem;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 10px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .file-types {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .file-types span {
          background: #e2e8f0;
          color: #4a5568;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .file-preview {
          width: 100%;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 15px;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .file-icon {
          font-size: 2.5rem;
        }

        .file-details h4 {
          margin: 0 0 5px;
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .file-details p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .remove-file {
          background: #fed7d7;
          color: #c53030;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.2s ease;
          margin-left: auto;
        }

        .remove-file:hover {
          background: #feb2b2;
          transform: scale(1.1);
        }

        .progress-container {
          margin: 20px 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4299e1, #3182ce);
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-text {
          text-align: center;
          font-size: 0.9rem;
          color: #4a5568;
          margin: 0;
        }

        .upload-button {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 15px 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .upload-button:active {
          transform: translateY(0);
        }

        .button-icon {
          font-size: 1.2rem;
        }

        .status-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
          margin: 15px 0;
          animation: slideInUp 0.3s ease;
        }

        .status-message.success {
          background: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }

        .status-message.error {
          background: #fed7d7;
          color: #c53030;
          border: 1px solid #feb2b2;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .requirements {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          margin-top: 25px;
          border-left: 4px solid #4299e1;
        }

        .requirements h4 {
          margin: 0 0 12px;
          color: #2d3748;
          font-weight: 600;
        }

        .requirements ul {
          margin: 0;
          padding-left: 20px;
          color: #4a5568;
        }

        .requirements li {
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        @media (max-width: 600px) {
          .file-upload-container {
            padding: 0 10px;
          }
          
          .drop-zone {
            padding: 30px 15px;
            min-height: 160px;
          }
          
          .file-info {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;