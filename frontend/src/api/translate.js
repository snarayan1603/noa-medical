// api/translate.js (Vercel serverless function)
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(configuration)
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { prompt } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
    });
    const result = completion.data.choices[0].text.trim();
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Translation failed' });
  }
}
