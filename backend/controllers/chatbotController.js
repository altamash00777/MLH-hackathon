const { getGroqResponse } = require("../services/groqService");

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await getGroqResponse(message);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chatbot Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to get chatbot response",
    });
  }
};

module.exports = {
  chatWithBot,
};