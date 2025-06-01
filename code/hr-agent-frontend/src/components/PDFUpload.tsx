// src/components/PDFUpload.tsx
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import axios from 'axios';

const PDFUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

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
    <div>
      <div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        <p>{uploadStatus}</p>
      </div>

      <div>
        {/* <button onClick={}>Generate weekly questions report</button> */}
      </div>
    </div>
  );
};

export default PDFUpload;
