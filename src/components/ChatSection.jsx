import React from "react";

const buttonStyle = {
  background: "white",
  color: "#581F18",
  border: "1px solid #F18805",
  padding: "10px 18px",
  borderRadius: "13px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
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
  if (!fileUploaded) return null;

  return (
    <div
      style={{
        flex: 1,
        opacity: fileUploaded ? 1 : 0,
        transform: fileUploaded ? "translateX(0)" : "translateX(50px)",
        transition: "all 0.6s ease",
        paddingRight: "2rem",
        paddingLeft: "1rem",
      }}
    >
      <h2 style={{ color: "#581F18" }}>Ask AI about your notes</h2>

      {/* --- TEXTAREA --- */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows="5"
        style={{
          width: "100%",
          padding: "12px",
          fontFamily: "monospace",
          fontSize: "1rem",
          border: "1px solid #F18805", // consistent orange
          borderRadius: "10px",
          outline: "none",
          color: "#581F18",
          transition: "all 0.3s ease",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#8C3A0E";
          e.target.style.boxShadow = "0 0 6px rgba(140, 58, 14, 0.3)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#F18805";
          e.target.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
        }}
        placeholder="Ask something about these notes..."
      />

      {/* --- SEND BUTTON --- */}
      <button
        onClick={handleSend}
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
        ↑
      </button>

      {/* --- CHAT MESSAGES --- */}
      {chatHistory.map((entry, i) => (
        <div
          key={i}
          style={{
            marginTop: "1.2rem",
            background: "#FFF9F5", 
           border: "1px solid #581F18",
            padding: "10px 15px",
            borderRadius: "10px",
            color: "#581F18",
            fontFamily: "monospace",
            fontSize: "1rem",
            lineHeight: "1.4",
            whiteSpace: "pre-wrap",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <strong>You:</strong> {entry.question}
          <br />
          <strong>AI:</strong> {entry.answer}
        </div>
      ))}
    </div>
  );
}