import { useState } from "react";
import axios from "axios";
import './WeeklyReport.css';

const WeeklyReport = () => {
  const [pdfUrl, setPdfUrl] = useState("");

  const generateReport = async () => {
    try {
      const res = await axios.get("http://localhost:8000/feedback/generate-weekly-report-pdf/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      setPdfUrl(url);
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  return (
    <div className="report-container">
      <p className="report-description">
        Generate a feedback report containing all submitted employee questions and suggestions.
      </p>
      <button className="report-button" onClick={generateReport}>Generate Feedback Report</button>
      
      {pdfUrl && (
        <div className="report-pdf-container">
          <iframe
            className="report-pdf-frame"
            src={pdfUrl}
            title="Weekly Report"
          />
          {/* <a href={pdfUrl} download="weekly_feedback_report.pdf">Download PDF</a> */}
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
