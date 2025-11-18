import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import DownloadNotes from "./DownloadNotes";
import QuizView from "./QuizView";


export default function UploadSection({
  fileUploaded, /*----Her impoteres de forskellige props fra APP, ----*/
  fileData,
  notesGenerated,
  handleFileUpload,
  handleGenerateNotes,
  setChatHistory,
  loading,
  error,
  setFileData,
  setNotesGenerated,
}) {

  const centered = !fileUploaded;
  const notesRef = useRef(null);
  const [explaining, setExplaining] = useState(false);
  const [viewMode, setViewMode] = useState("notes");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const formatSummary = (summary = "") => summary.replaceAll("\r\n", "\n");
  const markdownText = fileData?.summary ? formatSummary(fileData.summary) : "";

  // --- EXPLAIN MORE ---
  const handleExplainMore = async () => {
    try {
      setExplaining(true);
      const res = await fetch("http://localhost:8080/api/explain-more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fileData.summary }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setFileData({ ...fileData, summary: String(data.summary) });
      if (data.summary && typeof setNotesGenerated === "function") {
        setNotesGenerated(true);
      }
    } catch (error) {
      console.error("❌ Explain More failed:", error);
    } finally {
      setExplaining(false);
    }
  };

  // --- GENERATE QUIZ ---
  const handleGenerateQuiz = async () => {
    try {
      setQuizLoading(true);
      const res = await fetch("http://localhost:8080/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fileData.summary, amount: 20 }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setQuizQuestions(
        data.quizMarkdown || data.quiz || "### No quiz generated yet."
      );
      setViewMode("quiz");
    } catch (error) {
      console.error("❌ Quiz generation failed:", error);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div
    /*--Her er hovedcontaineren--*/
      className={`upload-section ${centered ? "centered" : ""}`}
      style={{
        flex: fileUploaded ? 1 : "none",
        transition: "all 0.5s ease",
      }}
    >
      <h1 /*--H1, som er stabil--*/
        className="upload-title"
        style={{
          marginTop: fileUploaded ? "0" : "4rem",
          textAlign: fileUploaded ? "left" : "center",
        }}
      >
        NoteHelper
      </h1>

      {/* FORSIDEN - her vises state når en file IKKE er uploaded */}
      {!fileUploaded && (
        <>
          <h3 className="upload-subtitle">Upload a file to get started</h3>

          <div className="upload-center">
            <label htmlFor="file-upload" className="btn">
              Choose File
            </label>

            <input 
              id="file-upload" /*----e.target fra APP rammer den her del ----*/
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {loading && <p className="upload-status">Analysing...</p>}
            {error && <p className="upload-error">Error: {error}</p>}
          </div>
        </>
      )}

       {/* FILE UPLOADED + BUTTON DEL */}
      {fileUploaded && (
        <div className="upload-buttons">
          <button
            className="btn"
            onClick={() => {
              if (viewMode === "quiz") setViewMode("notes");
              else handleGenerateNotes();
            }}
          >
            Notes
          </button>

          <button
            className={`btn ${quizLoading ? "disabled" : ""}`}
            onClick={() => {
              if (!quizLoading) handleGenerateQuiz();
            }}
            disabled={quizLoading}
          >
            {quizLoading ? "Generating..." : "Quiz"}
          </button>
        </div>
      )}

     
       {/* FILE UPLOADED + NOTES OG QUIZ */}
      {fileUploaded && (
        <div className="notes-wrapper">
          <div className="file-info">
            <h3 className="file-name">📄 {fileData?.fileName}</h3>

            {notesGenerated && (
              <button
                className={`btn explain-btn ${
                  explaining ? "disabled" : ""
                }`}
                onClick={handleExplainMore}
                disabled={explaining}
              >
                {explaining ? "Analysing..." : "Explain More"}
              </button>
            )}
          </div>

          {notesGenerated ? (
            viewMode === "quiz" ? (
              <QuizView quizMarkdown={quizQuestions} />
            ) : (
              <>
                <div ref={notesRef} className="notes-container">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    children={markdownText}
                  />
                </div>


          {/* DOWNLOAD NOTES */}
                <DownloadNotes
                  notesRef={notesRef}
                  fileName={fileData?.fileName}
                  markdownText={markdownText}
                />
              </>
            )
          ) : (
            <p className="upload-hint">
              Click “Generate Notes” to create a summary of this document.
            </p>
          )}
        </div>
      )}
    </div>
  );
}