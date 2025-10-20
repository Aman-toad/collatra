import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
dotenv.config();
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', authMiddleware, async (req, res) => {
  const { text, prompt } = req.body;

  if (!text || !prompt) {
    return res.status(400).json({ message: "Missing text content or AI prompt." });
  }

  const fullPrompt = `You are an AI writing assistant. Your goal  is to help the user brainstorm, summarize, or improve the provided text.
    Analyze the user's 'Text to Analyze' and fulfill the 'User Request/Prompt'. Be concise, helpful, and return ONLY the requested response.
    
    ---
    Text to Analyze: 
    "${text}"
    
    User Request/Prompt: 
    "${prompt}"
    ---`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    let aiResponse = result.response.text();

    aiResponse = aiResponse
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\*(.*?)\*/g, '<li>$1</li>') // list items
      .replace(/\n{2,}/g, '<br/>'); // paragraph breaks

    res.status(200).json({ suggestion: aiResponse })
  } catch (err) {
    console.error('Gemini API Error: ', err.message);
    res.status(500).json({ message: 'AI service failed to generate a response.' });
  }
});

export default router;