export const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionMode,
  includeDiagram,
  includeChart
}) => {
  return `
You are a WORLD-CLASS SUBJECT MATTER EXPERT and EXAM COACH.
Generate highly detailed, rich, and extensive content for the topic: "${topic}".

⚠️ STRICT JSON RULES:
- Output MUST be valid JSON.
- Escape all line breaks inside strings using \\n.

-------------------------------------------------------------------
QUANTITY & DEPTH MANDATES (STRICTLY FOLLOW THIS):
-------------------------------------------------------------------
1. "subTopics": 
   - MUST contain AT LEAST 3 to 5 detailed sub-topics under EACH star category ("⭐", "⭐⭐", "⭐⭐⭐").

2. "revisionPoints": 
   - MUST contain AT LEAST 8 to 12 crisp, highly detailed revision points/formulas (do not give short 2-word bullet points, explain each point in 1-2 complete sentences with formulas/units).

3. "notes": 
   - Write deeply elaborated notes with thorough explanations, mathematical derivations, physical significances, and practical examples for each section.

4. "questions":
   - "short": AT LEAST 5 high-yield short answer questions.
   - "long": AT LEAST 3 detailed long answer/numerical questions.

-------------------------------------------------------------------
REVISION MODE LOGIC:
-------------------------------------------------------------------
- Revision Mode is ${revisionMode ? "ON" : "OFF"}.
- Even if Revision Mode is ON, provide AT LEAST 8 to 10 comprehensive revision points in "revisionPoints".

-------------------------------------------------------------------
DIAGRAM RULES (MERMAID.JS):
-------------------------------------------------------------------
- Include Diagram: ${includeDiagram ? "YES" : "NO"}
- If INCLUDE DIAGRAM is YES:
  - Must start with: graph TD
  - Wrap EVERY node label in square brackets [ ]
  - Do NOT use special characters inside labels
- If INCLUDE DIAGRAM is NO:
  - diagram.data MUST be ""

-------------------------------------------------------------------
CHART RULES (RECHARTS):
-------------------------------------------------------------------
- Include Charts: ${includeChart ? "YES" : "NO"}
- If INCLUDE CHARTS is YES:
  - charts array MUST NOT be empty
  - Generate at least ONE chart
  - Choose chart based on topic type:
    - THEORY topic -> bar or pie (importance / weightage)
    - PROCESS topic -> bar or line (steps / stages)
  - Use numeric values ONLY
  - Labels must be short and exam-oriented
- If INCLUDE CHARTS is NO:
  - charts MUST be []

CHART TYPES ALLOWED:
- bar
- line
- pie

CHART OBJECT FORMAT:
{
  "type": "bar | line | pie",
  "title": "string",
  "data": [
    { "name": "string", "value": 10 }
  ]
}

STRICT JSON FORMAT (DO NOT CHANGE):
{
  "subTopics": {
    "⭐": [],
    "⭐⭐": [],
    "⭐⭐⭐": []
  },
  "importance": "⭐ | ⭐⭐ | ⭐⭐⭐",
  "notes": "string",
  "revisionPoints": [],
  "questions": {
    "short": [],
    "long": [],
    "diagram": "string"
  },
  "diagram": {
    "type": "flowchart",
    "data": "string"
  },
  "charts": []
}
`;
};