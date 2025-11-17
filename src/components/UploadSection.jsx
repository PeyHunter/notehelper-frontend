import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import DownloadNotes from "./DownloadNotes";
import QuizView from "./QuizView";

export default function UploadSection({
  fileUploaded,
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
  const [viewMode, setViewMode] = useState("notes"); // "notes" | "quiz"
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizLoading, setQuizLoading] = useState(false);

  const buttonStyle = {
    background: "white",
    color: "#581F18",
    border: "1px solid #F18805",
    padding: "10px 18px",
    borderRadius: "13px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s ease",
    outline: "none",
  };

  const hoverColor = "#8C3A0E";

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

  // --- RENDER ---
  return (
    <div
      style={{
        flex: fileUploaded ? 1 : "none",
        transition: "all 0.5s ease",
      }}
    >
      <h1
        style={{
          color: "#581F18",
          marginTop: fileUploaded ? "0" : "4rem",
          marginBottom: "1.5rem",
          textAlign: fileUploaded ? "left" : "center",
          transition: "all 0.5s ease",
        }}
      >
        NoteHelper
      </h1>

      {/* --- KNAPPER UNDER TITEL --- */}
      {fileUploaded && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => {
              if (viewMode === "quiz") setViewMode("notes");
              else handleGenerateNotes();
            }}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = hoverColor;
              e.target.style.color = "white";
              e.target.style.borderColor = hoverColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#581F18";
              e.target.style.borderColor = "#F18805";
            }}
          >
            Notes
          </button>

          <button
            onClick={() => {
              if (!quizLoading) handleGenerateQuiz();
            }}
            style={{ ...buttonStyle, opacity: quizLoading ? 0.6 : 1 }}
            disabled={quizLoading}
            onMouseEnter={(e) => {
              e.target.style.background = hoverColor;
              e.target.style.color = "white";
              e.target.style.borderColor = hoverColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.color = "#581F18";
              e.target.style.borderColor = "#F18805";
            }}
          >
            {quizLoading ? "Generating..." : "Quiz"}
          </button>

        
        </div>
      )}

      {/* --- UPLOAD SECTION --- */}
      {!fileUploaded && (
        <>
          <h3
            style={{
              textAlign: "center",
              color: "#555",
              marginBottom: "2rem",
              fontWeight: "normal",
            }}
          >
            Upload a file to get started
          </h3>

          <div style={{ textAlign: "center" }}>
            <label
              htmlFor="file-upload"
              style={{
                ...buttonStyle,
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = hoverColor;
                e.target.style.color = "white";
                e.target.style.borderColor = hoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#581F18";
                e.target.style.borderColor = "#F18805";
              }}
            >
              Choose File
            </label>

            <input
              id="file-upload"
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {loading && <p style={{ color: "#666" }}>Analysing...</p>}
            {error && (
              <p style={{ color: "red", marginTop: "1rem" }}>Error: {error}</p>
            )}
          </div>
        </>
      )}

      {/* --- NOTES / QUIZ VISNING --- */}
      {fileUploaded && (
        <div style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0, color: "#581F18" }}>
              📄 {fileData?.fileName}
            </h3>

            {notesGenerated && (
              <button
                onClick={handleExplainMore}
                disabled={explaining}
                style={{
                  ...buttonStyle,
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  opacity: explaining ? 0.6 : 1,
                  cursor: explaining ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = explaining ? "white" : hoverColor;
                  e.target.style.color = explaining ? "#581F18" : "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#581F18";
                }}
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
                <div
                  ref={notesRef}
                  style={{
                    background: "#FFF9F5",
                    padding: "22px 28px",
                    borderRadius: "10px",
                    overflowY: "auto",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    children={markdownText}
                    components={{
                      h1: ({ node, ...props }) => (
                        <>
                          <h1
                            style={{
                              fontSize: "1.6rem",
                              fontWeight: 700,
                              color: "#581F18",
                              marginTop: "2rem",
                              marginBottom: "0.6rem",
                              lineHeight: "1.3",
                            }}
                            {...props}
                          />
                          <hr
                            style={{
                              border: 0,
                              borderTop: "2px solid #F18805",
                              margin: "0.4rem 0 1.5rem 0",
                            }}
                          />
                        </>
                      ),
                      h2: ({ node, ...props }) => (
                        <>
                          <h2
                            style={{
                              fontSize: "1.4rem",
                              fontWeight: 700,
                              color: "#581F18",
                              marginTop: "1.8rem",
                              marginBottom: "0.5rem",
                              lineHeight: "1.25",
                            }}
                            {...props}
                          />
                          <hr
                            style={{
                              border: 0,
                              borderTop: "1px solid #F18805",
                              margin: "0.3rem 0 1rem 0",
                            }}
                          />
                        </>
                      ),
                      h3: ({ node, ...props }) => (
                        <>
                          <h3
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: "#581F18",
                              marginTop: "1.6rem",
                              marginBottom: "0.5rem",
                              lineHeight: "1.2",
                            }}
                            {...props}
                          />
                          <hr
                            style={{
                              border: 0,
                              borderTop: "1px solid #F18805",
                              margin: "0.3rem 0 1rem 0",
                            }}
                          />
                        </>
                      ),
                    }}
                  />
                </div>

                <DownloadNotes
                  notesRef={notesRef}
                  fileName={fileData?.fileName}
                  markdownText={markdownText}
                />
              </>
            )
          ) : (
            <p style={{ color: "#555" }}>
              Click “Generate Notes” to create a summary of this document.
            </p>
          )}
        </div>
      )}
    </div>
  );
}