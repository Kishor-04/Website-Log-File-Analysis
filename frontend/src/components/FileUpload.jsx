import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert("No file selected!");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://127.0.0.1:5000/api/upload", formData);
      alert("Upload successful!");
      setSelectedFile(null); // ✅ Only reset after successful upload
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
