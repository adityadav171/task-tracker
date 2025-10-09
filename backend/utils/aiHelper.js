const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function enhanceTaskWithAI(userInput) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Given this task input: "${userInput}"
    
Generate a clear task title and detailed description in JSON format:
{
  "title": "Clear, actionable task title",
  "description": "2-3 sentence detailed description with specific actions"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      title: userInput,
      description: 'Complete this task'
    };
  } catch (error) {
    return {
      title: userInput,
      description: 'Complete this task'
    };
  }
}

module.exports = { enhanceTaskWithAI };
