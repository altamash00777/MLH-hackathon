import { useState } from "react";
import { sendChatMessage } from "../services/chatbotService";
import "./DishaAssistant.css";

const DishaAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste. Main DISHA hoon, aapka sahayak. Main aapki fasal bechne, buyer dhoondhne aur market information samajhne mein madad kar sakta hoon.",
    },
  ]);

  const handleSend = async (text = message) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Abhi response nahi mil pa raha hai. Kripya thodi der baad dobara try karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}

      {!isOpen && (
        <button
          className="disha-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open DISHA Assistant"
        >
          <span className="disha-floating-mark">D</span>

          <span className="disha-floating-content">
            <strong>DISHA</strong>
            <small>Farmer Assistant</small>
          </span>
        </button>
      )}

      {/* Full screen overlay */}

      {isOpen && (
        <div className="disha-overlay">

          {/* Background */}

          <div
            className="disha-backdrop"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat panel */}

          <div className="disha-chat-panel">

            {/* Header */}

            <header className="disha-header">

              <div className="disha-brand">

                <div className="disha-brand-mark">
                  D
                </div>

                <div>
                  <h2>DISHA</h2>
                  <p>Farmer Assistant</p>
                </div>

              </div>

              <button
                className="disha-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>

            </header>

            {/* Welcome */}

            <section className="disha-welcome">

              <div className="disha-welcome-label">
                FARMER SUPPORT
              </div>

              <h1>
                Namaste, main aapka sahayak hoon.
              </h1>

              <p>
                Fasal listing, suitable buyer, mandi price,
                matching aur net realization ke baare mein
                mujhse pooch sakte hain.
              </p>

            </section>

            {/* Quick help */}

            
            {/* Conversation */}

            <section className="disha-conversation">

              <div className="disha-conversation-header">

                <div>
                  <span>CONVERSATION</span>
                  <h3>Ask DISHA</h3>
                </div>

                <div className="disha-live-status">
                  <span />
                  Available
                </div>

              </div>

              <div className="disha-messages">

                {messages.map((msg, index) => (

                  <div
                    key={index}
                    className={`disha-message-row ${
                      msg.role === "user"
                        ? "user-row"
                        : "assistant-row"
                    }`}
                  >

                    {msg.role === "assistant" && (
                      <div className="disha-message-mark">
                        D
                      </div>
                    )}

                    <div
                      className={
                        msg.role === "user"
                          ? "disha-user-message"
                          : "disha-assistant-message"
                      }
                    >
                      {msg.content}
                    </div>

                  </div>

                ))}

                {loading && (
                  <div className="disha-message-row assistant-row">

                    <div className="disha-message-mark">
                      D
                    </div>

                    <div className="disha-typing">
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>
                )}

              </div>

            </section>

            {/* Input */}

            <div className="disha-input-area">

              <div className="disha-input-box">

                <input
                  type="text"
                  placeholder="Ask about your crop..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!message.trim() || loading}
                  aria-label="Send"
                >
                  Send
                </button>

              </div>

              <p>
                DISHA provides marketplace guidance based on
                available information.
              </p>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default DishaAssistant;