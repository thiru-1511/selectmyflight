import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Plane, ArrowRight, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export default function AiChatbot({ isOpen, onClose, onSelectFlight, currency }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi there! I'm **SkyGenie AI**, your 24/7 personal flight concierge. How can I help you today? Try clicking one of the suggested prompts below or ask me anything!",
      recommendedFlights: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    // Append User Message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await api.askAiChat(textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response.reply,
          recommendedFlights: response.recommendedFlights || []
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having trouble fetching live flight data right now. Please try again or search directly in our flight search bar.",
          recommendedFlights: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const convertPrice = (inrPrice) => {
    return currency === 'USD' ? Math.round(inrPrice / 85) : inrPrice;
  };
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      width: 420,
      maxWidth: 'calc(100vw - 32px)',
      height: 600,
      maxHeight: 'calc(100vh - 100px)',
      background: '#111a33',
      border: '1px solid rgba(0, 210, 255, 0.3)',
      borderRadius: 18,
      boxShadow: '0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(0, 210, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Chatbot Header */}
      <div style={{
        background: 'linear-gradient(135deg, #16223f, #0d1527)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)'
          }}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              SkyGenie AI
              <span className="live-dot" />
            </div>
            <div style={{ fontSize: 11, color: '#00d2ff', fontWeight: 600 }}>
              AI Flight Concierge • 24/7 Active
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#cbd5e1',
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat Messages Body */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            <div style={{
              background: m.sender === 'user' 
                ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' 
                : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {m.text}
            </div>

            {/* Recommended Flight Cards */}
            {m.recommendedFlights && m.recommendedFlights.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {m.recommendedFlights.map(flight => (
                  <div
                    key={flight.id}
                    style={{
                      background: 'rgba(18, 28, 54, 0.9)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {flight.airlineName} • {flight.flightNumber}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        {flight.originCode} ({flight.departureTime}) ➔ {flight.destinationCode} ({flight.arrivalTime})
                      </div>
                      <div style={{ fontSize: 12, color: '#00d2ff', fontWeight: 800, marginTop: 2 }}>
                        {currencySymbol}{convertPrice(flight.basePrice).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectFlight(flight);
                        onClose();
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: 12 }}
                    >
                      Book <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#00d2ff', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} /> SkyGenie is searching flight databases...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (Directly from User Requirements) */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {[
          "Find me a cheap flight to Dubai.",
          "Which flight has the shortest duration?",
          "I want a weekend trip under ₹15,000.",
          "What is the baggage allowance?"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '4px 10px',
              borderRadius: 14,
              fontSize: 11,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: 8,
          background: '#0d1527'
        }}
      >
        <input
          type="text"
          placeholder="Ask SkyGenie anything about flights, fares, baggage..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 8,
            color: '#fff',
            padding: '10px 12px',
            fontSize: 13,
            outline: 'none'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0 14px', borderRadius: 8 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
