import React, { useState, useEffect } from "react";
import questions from "./data";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(10);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );

  // Timer countdown
  useEffect(() => {
    if (isFinished || showFeedback) return;

    if (timer === 0) {
      handleAnswer(null); // auto move on timeout
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showFeedback, isFinished]);

  // Answer handling
  const handleAnswer = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    setShowFeedback(true);

    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  // Next question
  const handleNext = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimer(10); // reset timer
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === questions[currentQuestion].answer ? 1 : 0);
      if (finalScore > highScore) {
        localStorage.setItem("highScore", finalScore);
        setHighScore(finalScore);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">🧠 React Quiz App</h1>

      {isFinished ? (
        <div className="text-center">
          <h2>✅ Final Score: {score} / {questions.length}</h2>
          <h4>🏆 High Score: {highScore}</h4>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <div className="d-flex justify-content-between mb-2">
            <h5>Question {currentQuestion + 1} of {questions.length}</h5>
            <h5>⏳ {timer}s</h5>
          </div>
          <h4 className="mb-4">{questions[currentQuestion].question}</h4>
          {questions[currentQuestion].options.map((option, index) => {
            const isCorrect = option === questions[currentQuestion].answer;
            const isSelected = option === selectedOption;
            const btnClass =
              showFeedback && isSelected
                ? isCorrect
                  ? "btn-success"
                  : "btn-danger"
                : "btn-outline-primary";

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`btn ${btnClass} w-100 mb-2`}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            );
          })}

          {showFeedback && (
            <div className="mt-3">
              <p className={selectedOption === questions[currentQuestion].answer ? "text-success" : "text-danger"}>
                {selectedOption === questions[currentQuestion].answer
                  ? "✅ Correct!"
                  : `❌ Wrong! Correct answer: ${questions[currentQuestion].answer}`}
              </p>
              <button className="btn btn-primary" onClick={handleNext}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;


