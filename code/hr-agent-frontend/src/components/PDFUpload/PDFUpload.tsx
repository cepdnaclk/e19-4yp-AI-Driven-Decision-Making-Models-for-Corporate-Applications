import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import axios from 'axios';
import './pdfUpload.css';

const PDFUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      console.log('Selected files:', selectedFiles);
    }
  };

  const uploadFile = async () => {
    if (files.length === 0) {
      alert("Please select at least one file first");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await axios.post("http://localhost:8000/upload-pdf/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadStatus("Upload successful: " + res.data.status);
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileChange}
          className="upload-input"
        />

        {/* should be changed to remove a selected file and multiselect more easily */}
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}

        <button onClick={uploadFile} className="upload-button" disabled={files.length === 0}>Upload</button>
        {/* <p className="upload-status">{uploadStatus}</p> */}
        <p className="upload-status">
          {uploadStatus.startsWith("Upload successful") ? "Successfully uploaded!" : uploadStatus}
        </p>
      </div>
    </div>
  );
};

export default PDFUpload;
