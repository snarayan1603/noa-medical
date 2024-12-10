// src/components/SpeechCapture.jsx
import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechCapture = ({ onResult, onError, setOriginalText }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Timer reference to track silence
  const silenceTimer = useRef(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      onError && onError("Your browser does not support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition, onError]);

  // Whenever the transcript updates, reset the silence timer
  useEffect(() => {
    if (onResult) {
      setOriginalText(transcript);
    }

    if (listening) {
      // Clear any previous timer
      clearTimeout(silenceTimer.current);

      // Set a new timer for silence detection (e.g., 3 seconds)
      silenceTimer.current = setTimeout(() => {
        // No transcript update for 3 seconds, stop listening
        SpeechRecognition.stopListening();
        onResult && onResult(transcript);
      }, 2000);
    }
  }, [transcript, onResult, listening]);

  const handleStart = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    resetTranscript();
  };

  return !browserSupportsSpeechRecognition ? (
    <p>Your browser does not support speech recognition.</p>
  ) : (
    <div className="speech-controls">
      <button onClick={handleStart}>
        {listening ? "Listening..." : "Start"}
      </button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default SpeechCapture;
