const API_URL = "http://localhost:5000/api/chatbot";

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get chatbot response");
    }

    return data;
  } catch (error) {
    console.error("Chatbot API Error:", error);
    throw error;
  }
};