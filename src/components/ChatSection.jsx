import React, { useRef } from "react";


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
      handleSend(); // Her bruges uploaded text, så min chat har adgang til pdf teksten

      // Lille klik-animation
      if (buttonRef.current) {
        buttonRef.current.classList.add("click-animation");
        setTimeout(() => {
          buttonRef.current.classList.remove("click-animation");
        }, 150);
      }
    }
  };

  return (
    <div className="chat-section">
      <h2 className="chat-title">Ask AI about your notes</h2>

      <textarea
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            triggerSend();
          }
        }}
        placeholder="Ask something about these notes..."
      />

      <button
        ref={buttonRef}
        className={`chat-button ${loading ? "disabled" : ""}`}
        disabled={loading || input.trim().length === 0}
        onClick={triggerSend}
      >
        {loading ? "Thinking..." : "↑ Send"}
      </button>

      <div className="chat-history">
        {chatHistory.map((entry, i) => ( 
          <div className="chat-entry" key={i}>
            <strong className="chat-question">You:</strong> {entry.question}
            <br />
            <br />
            <strong className="chat-answer">AI:</strong> {entry.answer}
          </div>
        ))}
      </div>
    </div>
  );
}