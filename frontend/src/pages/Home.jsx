import React from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";

const Home = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleUploadSuccess = () => {
    navigate("/results");
  };

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      {/* Header Section */}
      <header className="header-section">
        <div className="logo-container">
          <div className="logo-icon">📊</div>
          <h1 className="main-title">Web Log Analyzer</h1>
        </div>
        <p className="subtitle">
          Advanced server log analysis with ML-powered anomaly detection
        </p>
        <div className="feature-badges">
          <span className="badge">Real-time Analysis</span>
          <span className="badge">ML Detection</span>
          <span className="badge">Visual Insights</span>
        </div>
      </header>

      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <h2>Upload Your Log Files</h2>
            <p>Drag & drop or click to upload your server logs</p>
          </div>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3>Why Choose Our Log Analyzer?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h4>Smart Detection</h4>
            <p>AI-powered anomaly detection identifies unusual patterns and potential security threats</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h4>Visual Analytics</h4>
            <p>Interactive charts and graphs provide clear insights into your server performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Fast Processing</h4>
            <p>Process large log files quickly with optimized algorithms and real-time results</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .bg-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .circle-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          top: 30%;
          right: 30%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-5deg); }
        }

        .header-section {
          text-align: center;
          padding: 60px 20px 40px;
          position: relative;
          z-index: 1;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .logo-icon {
          font-size: 48px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .main-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(45deg, #ffffff, #e3f2fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 20px 0 30px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .feature-badges {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .badge:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .upload-section {
          padding: 0 20px;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .upload-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          max-width: 600px;
          width: 100%;
          transition: transform 0.3s ease;
        }

        .upload-card:hover {
          transform: translateY(-5px);
        }

        .upload-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .upload-header h2 {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .upload-header p {
          color: #7f8c8d;
          font-size: 1rem;
        }

        .features-section {
          padding: 80px 20px 60px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .features-section h3 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 50px;
          font-weight: 700;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          text-align: center;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          display: block;
        }

        .feature-card h4 {
          color: white;
          font-size: 1.3rem;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .feature-card p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .header-section {
            padding: 40px 20px 30px;
          }
          
          .upload-card {
            padding: 30px 20px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .logo-container {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;