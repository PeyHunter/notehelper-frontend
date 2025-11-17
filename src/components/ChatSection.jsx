import React, { useRef } from "react";

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

export default function ChatSection({
  fileUploaded,
  input,
  setInput,
  handleSend,
  chatHistory,
  loading,
}) {
  const buttonRef = useRef(null);

  if (!fileUploaded) return null;

  const triggerSend = () => {
    if (!loading && input.trim().length > 0) {
      handleSend();

      // Klik-animation
      if (buttonRef.current) {
        buttonRef.current.style.transform = "scale(0.9)";
        setTimeout(() => {
          buttonRef.current.style.transform = "scale(1)";
        }, 150);
      }
    }
  };
return (
  <div
    style={{
      flex: 1,
      paddingRight: "2rem",
      paddingLeft: "1rem",
      background: "white",
      zIndex: 5,
    }}
  >
      <h2 style={{ color: "#581F18" }}>Ask AI about your notes</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            triggerSend();
          }
        }}
        rows="4"
        style={{
          width: "100%",
          padding: "12px",
          fontFamily: "monospace",
          fontSize: "1rem",
          border: "1px solid #F18805",
          borderRadius: "10px",
          outline: "none",
          color: "#581F18",
          transition: "all 0.3s ease",
          resize: "none",
        }}
        placeholder="Ask something about these notes..."
        onFocus={(e) => {
          e.target.style.borderColor = "#8C3A0E";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#F18805";
        }}
      />

      <button
        ref={buttonRef}
        onClick={triggerSend}
        disabled={loading || input.trim().length === 0}
        style={{ ...buttonStyle, marginTop: "1rem" }}
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
        {loading ? "Thinking..." : "↑ Send"}
      </button>

      {/* Historik sektion */}
     <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column-reverse" }}>
        {chatHistory.map((entry, i) => (

          <div
            key={i}
            style={{
              marginTop: "1.2rem",
              padding: "10px 20px",
              borderRadius: "10px",
              color: "#581F18",
              border: "1px solid #F18805",
              fontSize: "1rem",
              lineHeight: "1.4",
              whiteSpace: "pre-wrap",
            }}
          >
            <strong style={{ color: "#8C3A0E" }}>
              You: {entry.question}
            </strong>
            <br />
            <br />
            <strong style={{ color: "#581F18" }}>AI:</strong> {entry.answer}
          </div>
        ))}
      </div>
    </div>
  );
}