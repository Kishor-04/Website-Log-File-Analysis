from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import pandas as pd
import pickle
import os
import re
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Path to the trained model
MODEL_PATH = "../Model/anomaly_detection_model.pkl"
UPLOAD_FOLDER = "../logs/"
RESULTS_FILE = "../logs/anomaly_results.csv"

# Load the trained model
with open(MODEL_PATH, 'rb') as file:
    model = pickle.load(file)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Function to preprocess and parse log file lines
def preprocess_log_file(filepath):
    """
    Reads the log file, parses each line, and returns a structured DataFrame.
    """
    log_pattern = r'(?P<ip>\d+\.\d+\.\d+\.\d+) - - \[(?P<timestamp>.*?)\] "(?P<method>[A-Z]+) (?P<url>.*?) (?P<protocol>HTTP\/\d\.\d)" (?P<status>\d+) (?P<size>\d+) "(?P<referer>.*?)" "(?P<user_agent>.*?)"'
    parsed_data = []

    with open(filepath, 'r') as file:
        for line in file:
            match = re.match(log_pattern, line)
            if match:
                parsed_data.append(match.groupdict())

    # Convert parsed data to DataFrame
    df = pd.DataFrame(parsed_data)
    
    # Convert timestamp to datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d/%b/%Y:%H:%M:%S %z', errors='coerce')

    # Convert status and size to numeric values
    df['status'] = pd.to_numeric(df['status'], errors='coerce')
    df['size'] = pd.to_numeric(df['size'], errors='coerce')

    return df


# Function to preprocess and predict anomalies
def preprocess_and_predict(file_path):
    """
    Preprocess the log data and predict anomalies using the trained model.
    """
    df = preprocess_log_file(file_path)  # Parse the log file
    feature_columns = ['size', 'status']
    X = df[feature_columns].fillna(0)    # Fill missing values with 0
    predictions = model.predict(X)      # Predict anomalies
    df['anomaly'] = predictions          # Add anomaly column
    return df


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    API endpoint to upload a log file, process it, and return the results.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    # Preprocess and predict anomalies
    results = preprocess_and_predict(file_path)
    results.to_csv(RESULTS_FILE, index=False)

    return jsonify({'message': 'File uploaded and processed successfully.'})


@app.route('/api/results', methods=['GET'])
def get_results():
    """
    API endpoint to retrieve anomaly detection results.
    """
    if not os.path.exists(RESULTS_FILE):
        return jsonify({'error': 'No results available'}), 404

    # Load results from the CSV file
    results = pd.read_csv(RESULTS_FILE)
    return results.to_json(orient='records')


if __name__ == '__main__':
    app.run(debug=True)