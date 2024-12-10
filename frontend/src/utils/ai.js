// src/utils/ai.js
export async function improveAndTranslateTranscript(
  transcript,
  targetLanguage,
  inputLanguage
) {
  const prompt = transcript;

  const response = await fetch("http://localhost:8000/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: prompt,
      target_lang: targetLanguage,
      source_lang: inputLanguage,
    }),
  });

  const data = await response.json();
  return data.translated;
}
