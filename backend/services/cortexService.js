const OpenAI = require("openai");

const cortex = new OpenAI({
  apiKey: process.env.CORTEX_PAT,
  baseURL: `${process.env.CORTEX_ACCOUNT_URL}/api/v2/cortex/v1`,
});

const getCortexResponse = async (message) => {
  try {
    console.log("Sending request to Snowflake Cortex...");

    const completion = await cortex.chat.completions.create({
      model: "llama3.1-8b",
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

    const response = completion.choices?.[0]?.message?.content;

    if (!response) {
      throw new Error("Snowflake Cortex returned an empty response");
    }

    console.log("Snowflake Cortex response received.");

    return response;
  } catch (error) {
    console.error("Snowflake Cortex API Error:");

    if (error.status) {
      console.error("Status:", error.status);
    }

    if (error.message) {
      console.error("Message:", error.message);
    }

    throw error;
  }
};

module.exports = {
  getCortexResponse,
};