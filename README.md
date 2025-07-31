# 🌐 Web Log Analyzer using Machine Learning

A powerful web application that analyzes web server logs using machine learning to detect anomalies and patterns. Built with a modern stack—**React** for the frontend, **Flask** for the backend, and **Python's IsolationForest** model for anomaly detection. Dockerized for seamless setup and deployment.

---

## 🚀 Features

- Upload and analyze large server log files
- Detect anomalies using the **IsolationForest** ML model
- View insights and analysis through an intuitive UI
- Secure and scalable architecture
- Fully containerized using Docker

---

## 🛠️ Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React             |
| Backend     | Flask (Python)    |
| ML Model    | IsolationForest   |
| Containerization | Docker & Docker Compose |

---

## 🧠 Machine Learning Model

- **Algorithm:** IsolationForest  
- **Purpose:** Anomaly detection in web logs  
- **Language:** Python (Pickle file used in Flask backend)

---

## 🐳 Run with Docker

Make sure you have **Docker** and **Docker Compose** installed.

### 🔧 Steps to run:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/web-log-analyzer.git
   cd web-log-analyzer
2. **Build and start containers**
    docker-compose up --build
3. **Access the application**
    Frontend: http://localhost:5173
    Backend API: http://localhost:5000

Folder Structure Recap

project-root/
│
├── backend/                      # Flask backend
│   ├── logs/                     # Log and result files
│   │   ├── anomaly_results.csv
│   │   ├── delete.py
│   │   ├── new_structured_data.csv (truncated name)
│   │   └── sample.log
│   │
│   ├── Model/                    # ML model training/inference code
│   │   ├── anomaly_detection_model.pkl
│   │   ├── preprocess.py
│   │   ├── requirements.txt      # Dependencies for 
│   │   └── train.py
│   │
│   └── app.py                    # Main Flask API file
│   ├── requirements.txt              # Backend dependencies
├── frontend/ # React application
│   └── src/
│
├── docker-compose.yml            # Docker Compose file
├── .dockerignore
├── .gitignore
└── README.md



📈 **Future Improvements**
User authentication & log history
Enhanced visualizations (graphs, charts)
Log format auto-detection
Time-series analysis