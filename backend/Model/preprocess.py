import re
import pandas as pd

def parse_log_line(log_line):
    """
    Parses a single line of the log file and extracts useful fields.
    """
    log_pattern = r'(?P<ip>\d+\.\d+\.\d+\.\d+) - - \[(?P<timestamp>.*?)\] "(?P<method>[A-Z]+) (?P<url>.*?) (?P<protocol>HTTP\/\d\.\d)" (?P<status>\d+) (?P<size>\d+) "(?P<referer>.*?)" "(?P<user_agent>.*?)"'
    match = re.match(log_pattern, log_line)
    if match:
        return match.groupdict()
    return None

def preprocess_log_file(filepath):
    """
    Reads the log file, parses each line, and returns a structured DataFrame.
    """
    parsed_data = []
    with open(filepath, 'r') as file:
        for line in file:
            parsed_line = parse_log_line(line)
            if parsed_line:
                parsed_data.append(parsed_line)
    
    # Convert to DataFrame
    df = pd.DataFrame(parsed_data)
    
    # Convert timestamp to datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'], format='%d/%b/%Y:%H:%M:%S %z', errors='coerce')
    
    # Convert status and size to integers
    df['status'] = pd.to_numeric(df['status'], errors='coerce')
    df['size'] = pd.to_numeric(df['size'], errors='coerce')
    
    return df

if __name__ == "__main__":
    # Example usage
    filepath = "../logs/access.log"  # Path to the log file
    structured_data = preprocess_log_file(filepath)
    print(structured_data.head())  # Display the first few rows of the structured data
    
    # Save the structured data to a CSV file
    output_filepath = "../logs/structured_data.csv"
    structured_data.to_csv(output_filepath, index=False)
    print(f"Structured data saved to {output_filepath}")