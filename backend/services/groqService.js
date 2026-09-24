const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getGroqResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are DISHA Assistant, an AI chatbot built for farmers using the
DISHA farmer-buyer marketplace.

DISHA helps farmers:
- Create crop listings
- Find suitable buyers
- Understand crop prices
- Compare buyer requirements
- Understand matching
- Understand net realization
- Understand transportation and selling costs

Your behavior:
1. Speak in simple, farmer-friendly language.
2. You can understand English, Hindi and Hinglish.
3. Reply in the same language as the farmer.
4. Keep responses clear, short and practical.
5. Explain technical marketplace concepts in simple words.
6. Do not invent real-time crop prices or buyer information.
7. If real-time DISHA data is required, tell the farmer that the
   information needs to be checked from the DISHA marketplace.
8. Never claim that you created a listing, contacted a buyer,
   accepted a match, or performed another action unless the
   DISHA backend actually performs that action.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.4,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};

module.exports = {
  getGroqResponse,
};