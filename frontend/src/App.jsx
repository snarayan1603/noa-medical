// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import SpeechCapture from "./components/SpeechCapture";
import { improveAndTranslateTranscript } from "./utils/ai";

const languages = [
  { label: "English", code: "en" },
  { label: "Spanish", code: "es" },
  { label: "French", code: "fr" },
  { label: "German", code: "de" },
  { label: "Italian", code: "it" },
  { label: "Dutch", code: "nl" },
  { label: "Portuguese", code: "pt" },
  { label: "Swedish", code: "sv" },
  { label: "Norwegian", code: "no" },
  { label: "Danish", code: "da" },
  { label: "Finnish", code: "fi" },
  { label: "Russian", code: "ru" },
  { label: "Polish", code: "pl" },
  { label: "Czech", code: "cs" },
  { label: "Hungarian", code: "hu" },
  { label: "Romanian", code: "ro" },
  { label: "Bulgarian", code: "bg" },
  { label: "Greek", code: "el" },
  { label: "Arabic", code: "ar" },
  { label: "Hebrew", code: "he" },
  { label: "Turkish", code: "tr" },
  { label: "Chinese", code: "zh" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Hindi", code: "hi" },
  { label: "Indonesian", code: "id" },
  { label: "Vietnamese", code: "vi" },
  { label: "Thai", code: "th" },
  { label: "Swahili", code: "sw" },
];

function App() {
  const [inputLanguage, setInputLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [longLoad, setLongLoad] = useState(false);

  const longLoadTimer = useRef(null);

  const handleTranscriptUpdate = async (transcript) => {
    setOriginalText(transcript);
    setTranslatedText("");
    if (transcript.trim()) {
      setIsLoading(true);
      setLongLoad(false);

      // Set a timer for 7 seconds to change the loading message
      longLoadTimer.current = setTimeout(() => {
        setLongLoad(true);
      }, 7000);

      try {
        const translation = await improveAndTranslateTranscript(
          transcript,
          targetLanguage,
          inputLanguage
        );
        setTranslatedText(translation);
      } catch (err) {
        console.error(err);
        setError("Translation failed. Please try again.");
      } finally {
        setIsLoading(false);
        clearTimeout(longLoadTimer.current);
      }
    } else {
      setTranslatedText("");
    }
  };

  let loadingMessage = "Translating...";
  if (longLoad) {
    loadingMessage = "Please wait, while we are loading AI model...";
  }

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "500px", width: "100%", padding: "1rem" }}>
        <h1>Healthcare Translation Web App</h1>

        <div>
          <label>
            <span style={{ fontSize: "20px", fontWeight: "700" }}>
              Input Language:
            </span>
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              style={{ marginLeft: "20px" }}
            >
              {languages.map((lang) => (
                <option value={lang.code} key={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>
          <br />

          <div style={{ marginTop: "10px" }}>
            <label>
              <span style={{ fontSize: "20px", fontWeight: "700" }}>
                Target Language:
              </span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                style={{ marginLeft: "20px" }}
              >
                {languages.map((lang) => (
                  <option value={lang.code} key={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <SpeechCapture
            onResult={handleTranscriptUpdate}
            onError={setError}
            setOriginalText={setOriginalText}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="transcripts" style={{ marginTop: "20px" }}>
          <h2>Original Transcript:</h2>
          <p>{originalText}</p>

          <h2>Translated Transcript:</h2>
          {isLoading ? <p>{loadingMessage}</p> : <p>{translatedText}</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
