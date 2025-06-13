// Updated Uploadbox.js
import React, { useState } from 'react';
import '../App.css';

function Uploadbox({ onContentExtracted }) {
  const [status, setStatus] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setStatus('Please select a file.');
      return;
    }

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setStatus('Only PDF files are allowed.');
      return;
    }

    setStatus('Uploading...');

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      onContentExtracted(data.content); // Pass extracted text to App
      setStatus('✅ Uploaded and extracted content');
    } catch (error) {
      const errorMessage = error.response?.data?.error || '❌ Upload failed';
      setStatus(errorMessage);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload PDF</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        className="upload-input"
      />
      <p className="upload-status">{status}</p>
    </div>
  );
}

export default Uploadbox;
