import { useState, useEffect } from "react";
import UploadSection from "./components/UploadSection";
import ChatSection from "./components/ChatSection";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [uploadedText, setUploadedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [notesGenerated, setNotesGenerated] = useState(false);


// ✅ Whenever fileData changes, print it in console
useEffect(() => {
  if (fileData?.summary) {
    console.log("AI summary output:", fileData.summary);
  }
}, [fileData]);

  // --- Upload file handler ---
  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setFileData(json);
      setUploadedText(json.text || "");
      setFileUploaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGenerateNotes() {
    if (fileData) setNotesGenerated(true);
  }

  async function handleSend() {
    if (input.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/analyse-with-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          fileText: uploadedText,
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { question: input, answer: json.summary },
      ]);
      setInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: fileUploaded ? "row" : "column",
        justifyContent: "flex-start",
        alignItems: fileUploaded ? "flex-start" : "center",
        gap: "4rem",
        padding: "3rem 2rem",
        height: "100vh",
        transition: "all 0.6s ease",
      }}
    >
      <UploadSection
        fileUploaded={fileUploaded}
        fileData={fileData}
        notesGenerated={notesGenerated}
        handleFileUpload={handleFileUpload}
        handleGenerateNotes={handleGenerateNotes}
        setChatHistory={setChatHistory}
        loading={loading}
        error={error}
      />
      <ChatSection
        fileUploaded={fileUploaded}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        chatHistory={chatHistory}
        loading={loading}
      />
    </div>
  );
}

export default App;

