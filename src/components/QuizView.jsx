import React, { useState, useEffect } from "react";

export default function QuizView({ quizMarkdown }) {
  const [questions, setQuestions] = useState([]); // Array af { question: "...", answer: "..." } objekter
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Parser quizMarkdown strengen til et array af spørgsmål/svar objekter
  useEffect(() => {
    if (quizMarkdown) {
      const parsedQuestions = [];
      // Splitter strengen op i blokke baseret på "Question X:"
      // Regex'en fanger spørgsmål og svaret, der starter med "Korrekt svar: "
      const questionBlocks = quizMarkdown.split(/(?=Question \d+:)/);

      questionBlocks.forEach((block) => {
        if (block.trim() === "") return;

        // Opdateret regex for at matche det nye format: "Question X:..." og "Korrekt svar:..."
        const questionMatch = block.match(
          /Question \d+:\s*(.*?)\nKorrekt svar:\s*(.*)/s
        );

        if (questionMatch && questionMatch[1] && questionMatch[2]) {
          parsedQuestions.push({
            question: questionMatch[1].trim(), // Spørgsmålet
            answer: questionMatch[2].trim(), // Svaret (inkl. "Korrekt svar:" header i strengen, men det fjerner vi visuelt)
          });
        } else {
            console.warn("Could not parse block:", block); // Hjælp til debugging
        }
      });
      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0); // Nulstil til første spørgsmål ved ny quiz
      setShowAnswer(false); // Skjul svar
    }
  }, [quizMarkdown]); // Kør denne effekt når quizMarkdown ændrer sig

  if (!quizMarkdown) {
    return <p style={{ color: "#555" }}>No quiz generated yet.</p>;
  }

  if (questions.length === 0) {
    // Vis en besked, hvis der er quizMarkdown, men ingen spørgsmål kunne parses
    // Dette indikerer en fejl i det format AI'en returnerede
    return (
      <p style={{ color: "#555" }}>
        {quizMarkdown.length > 0
          ? "Failed to parse quiz questions from the generated content. Please try generating a new quiz."
          : "Generating quiz or no questions could be parsed."}
      </p>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const buttonStyle = {
    background: "#F18805",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#8C3A0E",
  };

  const navButtonStyle = {
    background: "#581F18",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginLeft: "10px",
  };

  const navHoverStyle = {
    backgroundColor: "#3a140f",
  };

  return (
    <div
      style={{
        background: "#FFF9F5",
        padding: "22px 28px",
        borderRadius: "10px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        minHeight: "300px",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#581F18",
            marginBottom: "1rem",
          }}
        >
          Quiz - Spørgsmål {currentQuestionIndex + 1} af {questions.length}
        </h2>
        <hr
          style={{
            border: 0,
            borderTop: "1px solid #F18805",
            margin: "0.3rem 0 1.5rem 0",
          }}
        />

        {currentQuestion && (
          <div>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "#333",
                marginBottom: "1rem",
                lineHeight: "1.5",
              }}
            >
              {currentQuestion.question}
            </p>

            <button
              onClick={() => setShowAnswer(!showAnswer)}
              style={buttonStyle}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor =
                  buttonHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = buttonStyle.background)
              }
            >
              {showAnswer ? "Skjul Svar" : "Se Svar"}
            </button>

            {showAnswer && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#E8F5E9",
                  borderRadius: "8px",
                  border: "1px solid #A5D6A7",
                }}
              >
                {/* Her viser vi svaret */}
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#2E7D32", // Grøn farve for "Korrekt svar"
                    marginBottom: "0.5rem",
                  }}
                >
                  Korrekt svar:
                </p>
                <p style={{ color: "#333", lineHeight: "1.4" }}>
                  {currentQuestion.answer}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigationsknapper */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          style={{
            ...navButtonStyle,
            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (currentQuestionIndex !== 0) {
              e.target.style.backgroundColor = navHoverStyle.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (currentQuestionIndex !== 0) {
              e.target.style.backgroundColor = navButtonStyle.background;
            }
          }}
        >
          Forrige Spørgsmål
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          style={{
            ...navButtonStyle,
            opacity:
              currentQuestionIndex === questions.length - 1 ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (currentQuestionIndex !== questions.length - 1) {
              e.target.style.backgroundColor = navHoverStyle.backgroundColor;
            }
          }}
          onMouseLeave={(e) => {
            if (currentQuestionIndex !== questions.length - 1) {
              e.target.style.backgroundColor = navButtonStyle.background;
            }
          }}
        >
          Næste Spørgsmål
        </button>
      </div>
    </div>
  );
}