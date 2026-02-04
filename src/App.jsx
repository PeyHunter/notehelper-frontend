/*NOTER*/
/* React er et Javascript-bibliotek, som bygger genbrugelige komponenter

    App.jsx i dette projekt er hovedkomponenten, som styrer alt data (state) og sender det videre 
    til de to underkomponenter: UploadSection og ChatSection.


    1. Komponenter - opdeler alt i små brikker
                        - App styrer helheden 
                        - UploadSection håndtere filer noter + quiz
                        - ChatSection håndere AI chatten
    
    2. State - React bruger variabler som useState, for at huske og opdatere UI automatisk.   
              EKSEMPEL: 

              const [fileUploaded, setFileUploaded] = useState(false);

              Når setFileUploaded(true) bliver kaldt, genopbygger React HTML’en 
                  (det ligner det er en ny side, men den reloader ikke)

    3. Props - Hvis man vil sende data fra en komponent til en anden, bruger man “props”.  
               Props står for “properties”, og bruges til at sende data fra en forælder-komponent (App) til dens børn.
               EKSEMPEL: 
               Her sender App sine props ned til UploadSection:

        <UploadSection
          fileUploaded={fileUploaded}
          fileData={fileData}
          notesGenerated={notesGenerated}
          .....
        />

        Inde i UploadSection bliver props’ene modtaget i starten af komponenten:
        
        export default function UploadSection({
          fileUploaded,
          fileData,
          notesGenerated,
          ...)}
*/

import { useState, useEffect } from "react";
import UploadSection from "./components/UploadSection";
import ChatSection from "./components/ChatSection";
import "./App.css";

/*--HOVEDKOMPONEMT - den der samler alt-*/
function App() {
  const [input, setInput] = useState("");  /*--states og setStates defineres, så vi kan arbejde dynamisk-*/
  const [chatHistory, setChatHistory] = useState([]); /*-Alle states er "false"-*/
  const [fileData, setFileData] = useState(null);
  const [uploadedText, setUploadedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [notesGenerated, setNotesGenerated] = useState(false);


  useEffect(() => {   /*-useEffect bruges til at reagere på ændringer, som API-kald / logging-*/
    if (fileData?.summary) {
      console.log("AI summary output:", fileData.summary);
    }
  }, [fileData]);

  async function handleFileUpload(e) {
    const file = e.target.files[0];/*--Array som indeholder den fil som uploades--*/
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {  /*--Her sendes filen til backend-*/
       const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setFileData(json); /*-Her gemmer vi hele svaret fra backend, så hele promptens svar som JSON-object-*/
      setUploadedText(json.text || ""); /*-Her gemmer vi testen fra PDF, så vi kan bruge den i chatten senere-*/
      setFileUploaded(true);  /*-Her sættes fileUploaded til true, som bliver brugt i UploadSection-*/
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); /*-Loading states sættes til false igen-*/
    }
  }

  function handleGenerateNotes() {
    if (fileData) setNotesGenerated(true); /*-Her generes noterne-*/
  }

  /*-Styrer chat sekctionen-*/
  async function handleSend() {
    if (input.trim().length === 0) return;
    setLoading(true);
    setError(null);

    try { /*--POST request sendes til backend-*/
      const res = await fetch("/api/analyse-with-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input, /*-Tekst som bruger skriver-*/
          fileText: uploadedText,  /*-Her bruges UploadedTest, så chatten ved hvad der forgår  -*/
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json(); /*-svaret fra backend-*/
      setChatHistory((prev) => [  /*-her gemmes chat historikken, som bliver vist i-*/
        ...prev,
        { question: input, answer: json.summary },
      ]);
      setInput("");  /*-Input delen ryddes, så man kan skrive noget ny-*/
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); /*-Nu står der send og ikke thinking-*/
    }
  }


  return (
    /* Hele div'en tagges med app-container. 
        alt efter state, så skal den aktivere row-layout eller colomn-layout
        så feks. hvis fileUploaded=true, skal den bruge row-layout

        betingelse ? værdiHvisTrue : værdiHvisFalse

        */
    <div
      className={`app-container ${fileUploaded ? "row-layout" : "column-layout"}`}
    >
      <UploadSection
        /*Her sendes props videre*/
        fileUploaded={fileUploaded}
        fileData={fileData}
        notesGenerated={notesGenerated}
        handleFileUpload={handleFileUpload}
        handleGenerateNotes={handleGenerateNotes}
        setChatHistory={setChatHistory}
        loading={loading}
        error={error}
        setFileData={setFileData}
        setNotesGenerated={setNotesGenerated}
      />

      <div className="chat-wrapper">

        <ChatSection
          fileUploaded={fileUploaded}
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          chatHistory={chatHistory}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;