import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Plane, ArrowRight, MessageSquare, Palmtree, Clock, Compass, Star } from 'lucide-react';
import { api } from '../services/api';

export default function AiChatbot({ isOpen, onClose, onSelectFlight, onSelectPackage, onNavigateToTab, currency }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi there! I'm **SkyGenie AI**, your 24/7 personal flight concierge & holiday planner. Ask me to plan a holiday, suggest personalized trips, or find the cheapest flights!",
      recommendedFlights: [],
      recommendedPackages: []
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
          recommendedFlights: response.recommendedFlights || [],
          recommendedPackages: response.recommendedPackages || []
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm having trouble fetching live flight data right now. Please try again or search directly in our flight search bar.",
          recommendedFlights: [],
          recommendedPackages: []
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
    <div className="skygenie-chat-window">
      {/* Chatbot Header */}
      <div style={{
        background: 'linear-gradient(135deg, #16223f, #0d1527)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 210, 255, 0.4)'
          }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
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
        padding: '14px 16px',
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
              maxWidth: '88%'
            }}
          >
            <div style={{
              background: m.sender === 'user' 
                ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' 
                : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              padding: '10px 14px',
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {m.text}
            </div>

            {/* Recommended Holiday Package Cards */}
            {m.recommendedPackages && m.recommendedPackages.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#f5af19',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Palmtree size={14} color="#f5af19" />
                  <span>AI-Recommended Holiday Packages</span>
                </div>
                {m.recommendedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 26, 48, 0.98), rgba(11, 18, 33, 0.98))',
                      border: '1px solid rgba(245, 175, 25, 0.35)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'
                    }}
                  >
                    <div style={{ position: 'relative', height: 115, overflow: 'hidden' }}>
                      <img
                        src={pkg.heroImage}
                        alt={pkg.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(11, 18, 33, 0.95) 0%, rgba(11, 18, 33, 0.2) 60%, transparent 100%)'
                      }} />
                      <span style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: pkg.badgeColor || '#00d2ff',
                        color: '#000',
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 10,
                        letterSpacing: 0.5
                      }}>
                        {pkg.badge || 'ALL-INCLUSIVE'}
                      </span>
                      <span style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 8,
                        fontSize: 11,
                        color: '#e2e8f0',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Clock size={12} color="#f5af19" /> {pkg.duration}
                      </span>
                    </div>

                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                        {pkg.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, lineHeight: 1.4 }}>
                        {pkg.highlights}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: 8
                      }}>
                        <div>
                          <div style={{ fontSize: 10, color: '#94a3b8' }}>Per Person</div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: '#00e676' }}>
                            {currencySymbol}{convertPrice(pkg.pricePerPerson).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectPackage) onSelectPackage(pkg);
                              else if (onNavigateToTab) onNavigateToTab('packages');
                              onClose();
                            }}
                            className="btn-primary"
                            style={{
                              padding: '6px 12px',
                              fontSize: 11,
                              borderRadius: 8,
                              background: 'linear-gradient(135deg, #f5af19, #f12711)',
                              color: '#fff',
                              border: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            <Palmtree size={12} /> Book Holiday
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommended Flight Cards */}
            {m.recommendedFlights && m.recommendedFlights.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#00d2ff',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Plane size={13} color="#00d2ff" />
                  <span>Matching Flight Corridors</span>
                </div>
                {m.recommendedFlights.map(flight => (
                  <div
                    key={flight.id}
                    style={{
                      background: 'rgba(18, 28, 54, 0.95)',
                      border: '1px solid rgba(0, 210, 255, 0.3)',
                      borderRadius: 10,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10
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
                      style={{ padding: '6px 12px', fontSize: 12, minHeight: 36, whiteSpace: 'nowrap' }}
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
            <Sparkles size={14} className="spin-slow" /> SkyGenie is searching flight & holiday databases...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="scroll-touch-x" style={{
        padding: '8px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
        gap: 6
      }}>
        {[
          "🌴 Plan a 5-day holiday in Bali",
          "🎯 Personalized trip recommendations for me",
          "🏖️ Beach getaways under ₹40,000",
          "✈️ Fastest flight to Dubai",
          "💎 Dubai luxury package with desert safari",
          "🧳 What is the baggage allowance?"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: 14,
              fontSize: 11,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {prompt}
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
          padding: '10px 14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: 8,
          background: '#0d1527',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="Ask SkyGenie about flights, fares..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 8,
            color: '#fff',
            padding: '8px 12px',
            fontSize: 13,
            outline: 'none',
            minHeight: 'auto'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '0 16px', borderRadius: 8, height: 40, minHeight: 40 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
