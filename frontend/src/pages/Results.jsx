import React, { useState, useEffect } from "react";
import ResultsTable from "../components/ResultsTable";

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/results")
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((error) => console.error("Error fetching results:", error));
  }, []);

  return (
    <div className="container">
      <h1>Anomaly Detection Results</h1>
      <ResultsTable data={results} />
    </div>
  );
};

export default Results;