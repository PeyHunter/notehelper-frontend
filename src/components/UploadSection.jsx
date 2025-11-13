import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function UploadSection({
  fileUploaded,
  fileData,
  notesGenerated,
  handleFileUpload,
  handleGenerateNotes,
  setChatHistory,
  loading,
  error,
}) {
  const centered = !fileUploaded;

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
          marginTop: centered ? "5rem" : "0",
          marginBottom: "2rem",
          textAlign: centered ? "center" : "left",
          transition: "all 0.5s ease",
        }}
      >
        NoteHelper
      </h1>

      {/* ---- BUTTONS UNDER TITLE (only visible after file upload) ---- */}
      {fileUploaded && (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          {/* Generate Notes */}
          <button
            onClick={handleGenerateNotes}
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
            Generate Notes
          </button>

          {/* Summarize Again */}
          <button
            onClick={() =>
              alert("Later, this could trigger a new summary request")
            }
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
            Summarize Again
          </button>

          {/* Clear Chat */}
          <button
            onClick={() => setChatHistory([])}
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
            Clear Chat
          </button>
        </div>
      )}

      {/* ---- UPLOAD SECTION ---- */}
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
            {/* --- Updated upload button (matches others) --- */}
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

      {/* ---- FILE INFO / NOTES DISPLAY ---- */}
      {fileUploaded && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>📄 {fileData?.fileName}</h3>

          {notesGenerated ? (
<div
  style={{
    background: "#FFF9F5",
    padding: "22px 28px",
    borderRadius: "10px",
    overflowY: "auto",
    marginBottom: "70px",
  }}
>
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkBreaks]}
    children={fileData.summary}
    components={{
      h3: ({node, ...props}) => (
        <h3
          style={{
            fontSize: "1.55rem",
            fontWeight: 700,
            color: "#581F18",
            marginTop: "1.8rem",
            marginBottom: "0",        // ✅ zero air under title
            lineHeight: "1.1",
          }}
          {...props}
        />
      ),
      p: ({node, ...props}) => (
        <p
          style={{
            marginTop: "0.2rem",      // ✅ almost touching the title
            marginBottom: "0.6rem",
            fontSize: "1rem",
            lineHeight: "1.55",
            color: "#581F18",
          }}
          {...props}
        />
      ),
      hr: () => (
      <hr
        style={{
          border: 0,
          borderTop: "2px solid #F18805",     // your signature orange
          marginTop: "2.8rem",                // ⬆️ More air before the line
          marginBottom: "2.2rem",             // ⬇️ More air after the line
        }}
      />
    ),
      code: ({node, ...props}) => (
        <code
          style={{
            background: "rgba(88,31,24,0.08)",
            padding: "2px 5px",
            borderRadius: "4px",
            fontFamily: "monospace",
            color: "#581F18",
          }}
          {...props}
        />
      ),
    }}
  />
</div>
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