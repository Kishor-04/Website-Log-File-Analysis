import pandas as pd
from sklearn.ensemble import IsolationForest
import pickle

def load_preprocessed_data(filepath):
    """
    Load the preprocessed data from a CSV file or DataFrame.
    """
    return pd.read_csv(filepath)

def train_anomaly_detection_model(data):
    """
    Train an Isolation Forest model for anomaly detection.
    """
    # Select features for training (e.g., size, status)
    feature_columns = ['size', 'status']  # Example features
    X = data[feature_columns].fillna(0)  # Handle missing values

    # Train the Isolation Forest model
    model = IsolationForest(n_estimators=100, contamination=0.01, random_state=42)
    model.fit(X)

    return model

def save_model(model, filepath):
    """
    Save the trained model to a file.
    """
    with open(filepath, 'wb') as file:
        pickle.dump(model, file)
    print(f"Model saved to {filepath}")

if __name__ == "__main__":
    # Path to the structured data CSV file
    preprocessed_data_path = "../logs/structured_data.csv"  # Update with your preprocessed data path

    # Load preprocessed data
    print("Loading preprocessed data...")
    data = load_preprocessed_data(preprocessed_data_path)

    # Train the model
    print("Training the anomaly detection model...")
    anomaly_model = train_anomaly_detection_model(data)

    # Save the model
    model_filepath = "anomaly_detection_model.pkl"
    save_model(anomaly_model, model_filepath)
    print("Training complete!")
