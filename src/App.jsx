import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("http://localhost:8080/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) throw new Error(`API request failed: ${res.status}`);

      const json = await res.json();
      setData(json); // save JSON as an object
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>NoteHelper</h1>

     <textarea
  value={input}
  onChange={(e) => setInput(e.target.value)}
  rows="6"
  style={{
    width: "100%",
    padding: "12px",
    resize: "vertical",
    fontFamily: "monospace", // typewriter style for your own text
    fontSize: "1rem",      // bigger & stronger than before
    lineHeight: "1.5",
    border: "1px solid #ccc",
    borderRadius: "6px",
  }}
  placeholder="Write or paste your text here..."
/>

      <button
        onClick={handleSend}
        disabled={loading || input.trim().length === 0}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
        }}
      >
        {loading ? "Analysing..." : "Send to Backend"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>Error: {error}</p>
      )}

{data && (
  <div
    style={{
      marginTop: "2rem",
      background: "#EAFFED",
      padding: "15px 20px",
      borderRadius: "8px",
      position: "relative",
      fontFamily: "sans-serif",
      fontSize: "1.2srem",         // lidt mindre end før
      lineHeight: "1.4",
      whiteSpace: "pre-wrap",
      color: "#333",
    }}
  >
    {data.summary}

    <span
      style={{
        position: "absolute",
        bottom: "6px",
        right: "10px",
        fontSize: "0.75rem",
        color: "#777",
      }}
    >
      {new Date(data.timestamp).toLocaleTimeString()}
    </span>
  </div>
)}
    </div>
  );
} 

  
  

export default App;