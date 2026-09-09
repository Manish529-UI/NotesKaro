import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

// Helper delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Universal Fallback Mock Generator (Jab dono APIs complete fail ho jaayein)
const getEmergencyMockData = (prompt) => {
  console.warn("🚨 Emergency Mode Activated: Returning Mock Formatted Notes");
  return {
    title: "Generated Notes (Offline Mode)",
    summary: "AI services are currently unreachable. Here is a baseline template.",
    content: "Please check your network connectivity or API key limits.",
    keyPoints: ["API Service Busy", "Retried Gemini & Groq", "Fallback Triggered"]
  };
};

// 2. Groq Execution Logic
const generateGroqBackup = async (prompt) => {
  console.log("⚠️ Executing Groq Silent Fallback...");
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY missing");
  }

  const groq = new Groq({ apiKey });
  
  // Multiple Groq Models for high redundancy
  const groqModels = ["qwen/qwen3.6-27b", "openai/gpt-oss-120b"];
  
  for (const model of groqModels) {
    try {
      console.log(`Trying Groq model: ${model}`);
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert tutor. Always output valid JSON format." },
          { role: "user", content: prompt }
        ],
        model: model,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "";
      const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      return JSON.parse(cleanText);
    } catch (err) {
      console.warn(`Groq Model ${model} failed: ${err.message}`);
    }
  }
  throw new Error("All Groq models failed");
};

// 3. Main Response Generator
export const generateGeminiResponse = async (prompt) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Layer 1: Try Gemini API
  if (geminiApiKey) {
    const geminiModels = ["gemini-3.8-flash", "gemini-3.7-flash"];
    
    for (const modelName of geminiModels) {
      try {
        console.log(`⚡ Requesting Gemini (${modelName})...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
            return JSON.parse(cleanText);
          }
        }
      } catch (geminiErr) {
        console.warn(`Gemini (${modelName}) Failed:`, geminiErr.message);
      }
    }
  }

  // Layer 2: Try Groq API
  try {
    return await generateGroqBackup(prompt);
  } catch (groqErr) {
    console.error("❌ Groq Layer Failed:", groqErr.message);
  }

  // Layer 3: Catch-All Fallback (App kabhi 503 error deke nahi phategi)
  return getEmergencyMockData(prompt);
};