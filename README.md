# 🌐 Web Log Analyzer using Machine Learning

A powerful web application that analyzes web server logs using machine learning to detect anomalies and patterns. Built with a modern stack—**React** for the frontend, **Flask** for the backend, and **Python's IsolationForest** model for anomaly detection. Dockerized for seamless setup and deployment.

---

## 🚀 Features

- **Upload & Analyze Large Server Log Files:** Easily upload web server logs for instant analysis.
- **Anomaly Detection:** Detects anomalies and outliers using the IsolationForest machine learning model.
- **Intuitive UI:** Gain insights and view results through a clean, modern frontend.
- **Secure & Scalable:** Built with best practices for security and scalability.
- **Fully Containerized:** Uses Docker for hassle-free setup and deployment.

---

## 🛠️ Tech Stack

| Layer            | Technology            |
|------------------|----------------------|
| **Frontend**     | React                |
| **Backend**      | Flask (Python)       |
| **ML Model**     | IsolationForest      |
| **Containerization** | Docker & Docker Compose |

---

## 🧠 Machine Learning Model

- **Algorithm:** IsolationForest
- **Purpose:** Anomaly detection in web logs
- **Language:** Python (Pickle file used in Flask backend)

---

## 🗂️ Folder Structure

```
project-root/
│
├── backend/                       # Flask backend
│   ├── logs/                      # Log and result files
│   │   ├── anomaly_results.csv
│   │   ├── delete.py
│   │   ├── new_structured_data.csv
│   │   └── sample.log
│   ├── Model/                     # ML model training/inference code
│   │   ├── anomaly_detection_model.pkl
│   │   ├── preprocess.py
│   │   ├── requirements.txt
│   │   └── train.py
│   ├── app.py                     # Main Flask API file
│   └── requirements.txt           # Backend dependencies
│
├── frontend/                      # React application
│   └── src/
│
├── docker-compose.yml             # Docker Compose file
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 🐳 Run with Docker

> **Prerequisites:**  
> Make sure you have **Docker** and **Docker Compose** installed.

### 🚦 Quickstart

1. **Clone the repository**
    ```bash
    git clone https://github.com/Kishor-04/Website-Log-File-Analysis.git
    cd web-log-analyzer
    ```

2. **Build and start containers**
    ```bash
    docker-compose up --build
    ```

3. **Access the application**
    - **Frontend:** [http://localhost:5173](http://localhost:5173)
    - **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 📈 Future Improvements

- User authentication & log history
- Enhanced visualizations (graphs, charts)
- Log format auto-detection
- Time-series analysis

---

## 🤝 Contributing

Contributions are welcome!  
Please open issues or pull requests for new features, improvements, or bug fixes.

---

**Happy Analyzing!**