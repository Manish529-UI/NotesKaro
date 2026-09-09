import UserModel from "../models/user.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import NotesModel from "../models/notes.model.js";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false
    } = req.body;

    // 1. Topic Validation
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // 2. User & Credits Check
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "User is not found" });
    }

    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();
      return res.status(403).json({
        message: "Insufficient credits. Minimum 10 credits required.",
      });
    }

    console.log("Req Body Params:", { topic, classLevel, examType, revisionMode, includeDiagram, includeChart });

    // 3. Build Prompt
    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart
    });

    // 4. Fetch Response from AI Service
    let textContent;
    try {
      textContent = await generateGeminiResponse(prompt);
    } catch (aiError) {
      console.error("AI Generation Critical Failure:", aiError.message);
      return res.status(503).json({
        message: "AI Service is temporarily busy or rate limited. Please try again in a few seconds."
      });
    }

    // 5. Clean & Ensure Structured JSON Data
    if (typeof textContent === "string") {
      const cleanJson = textContent.replace(/```json/gi, "").replace(/```/g, "").trim();
      try {
        textContent = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.error("JSON Parsing Error:", parseErr);
        return res.status(500).json({
          message: "AI generated invalid JSON structure. Please try again."
        });
      }
    }

    if (!textContent || typeof textContent !== "object") {
      return res.status(500).json({
        message: "Failed to parse AI response into structured data."
      });
    }

    // 6. Save Note to Database
    const createdNote = await NotesModel.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: textContent
    });

    // 7. Deduct Credits
    user.credits -= 10;
    if (user.credits <= 0) user.isCreditAvailable = false;

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }

    user.notes.push(createdNote._id);
    await user.save();

    // 8. Send Response
    return res.status(200).json({
      data: textContent,
      notesId: createdNote._id,
      creditsLeft: user.credits,
    });

  } catch (error) {
    console.error("Generate Notes Controller Error:", error);
    return res.status(500).json({ 
      message: error?.message || "An error occurred while generating notes." 
    });
  }
};