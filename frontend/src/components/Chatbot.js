import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { supportService } from "../services/supportService";

const FAQ_OPTIONS = [
  {
    id: "book",
    label: "How do I book a vehicle?",
    answer: "To book a vehicle, simply log in to your account, navigate to 'Agencies' or 'Book a Ride', select your preferred vehicle, dates, and pick-up location, and click 'Confirm Booking'."
  },
  {
    id: "cancel",
    label: "What is your cancellation policy?",
    answer: "You can cancel your booking up to 24 hours before the scheduled pickup time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee."
  },
  {
    id: "contact_agency",
    label: "How to contact an agency?",
    answer: "Once your booking is confirmed, you will receive the agency's direct contact number. You can also view agency details in the 'Agencies Near You' section."
  },
  {
    id: "payment",
    label: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, and popular digital wallets. Payments are processed securely during the booking checkout."
  }
];

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I'm your Travoss AI Assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [supportMode, setSupportMode] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Polling for live support messages
  useEffect(() => {
    let intervalId;
    if (supportMode && activeTicketId) {
      intervalId = setInterval(async () => {
        try {
          const ticket = await supportService.getTicket(activeTicketId);
          // Only show messages sent by the agent
          const supportMessages = ticket.messages
            .filter(m => m.sender === "agent")
            .map(m => ({ type: "support", text: m.text }));
            
          setMessages(prev => {
            const currentSupportTexts = prev.filter(p => p.type === "support").map(p => p.text);
            const newMessages = supportMessages.filter(sm => !currentSupportTexts.includes(sm.text));
            if (newMessages.length > 0) {
               return [...prev, ...newMessages];
            }
            return prev;
          });
        } catch (error) {
          console.error("Error polling ticket:", error);
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [supportMode, activeTicketId]);

  const handleFAQClick = (faq) => {
    setMessages((prev) => [...prev, { type: "user", text: faq.label }]);
    
    // Simulate thinking delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text: faq.answer }]);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { type: "user", text: userText }]);
    setInputValue("");

    // Simulate looking up answer based on keyword, or fallback
    setTimeout(async () => {
      if (supportMode) {
        if (activeTicketId) {
            try {
                await supportService.sendMessage(activeTicketId, "user", userText);
                // Assume success, message already added to local state
            } catch (err) {
                console.error("Failed to send message to support", err);
            }
        }
        return;
      }

      const lowerTextSafe = userText.toLowerCase();
      let responseText = "";
      let foundAnswer = false;
      
      const isGreeting = lowerTextSafe.match(/\b(hello|hi|hey|greetings)\b/);

      if (isGreeting) {
        const userName = user?.firstName || "there";
        responseText = `Hello ${userName}! How may I help you? Please select one of the Quick Answers below to choose your problem, or type it here.`;
        foundAnswer = true;
      } else if (lowerTextSafe.includes("book") || lowerTextSafe.includes("ride")) {
        responseText = FAQ_OPTIONS.find((f) => f.id === "book").answer;
        foundAnswer = true;
      } else if (lowerTextSafe.includes("cancel") || lowerTextSafe.includes("refund")) {
        responseText = FAQ_OPTIONS.find((f) => f.id === "cancel").answer;
        foundAnswer = true;
      } else if (lowerTextSafe.includes("pay") || lowerTextSafe.includes("card")) {
        responseText = FAQ_OPTIONS.find((f) => f.id === "payment").answer;
        foundAnswer = true;
      }

      if (foundAnswer) {
        setUnansweredCount(0); // reset count on successful answer
        setMessages((prev) => [...prev, { type: "bot", text: responseText }]);
      } else {
        const newCount = unansweredCount + 1;
        setUnansweredCount(newCount);

        if (newCount >= 2 || lowerTextSafe.includes("human") || lowerTextSafe.includes("support") || lowerTextSafe.includes("agent")) {
          setSupportMode(true);
          setMessages((prev) => [
            ...prev, 
            { type: "bot", text: "It seems I'm not able to fully answer your question. I'm transferring you to our human support team now. Please wait a moment..." }
          ]);
          
          // Connect to backend
          try {
             const userName = user ? `${user.firstName} ${user.lastName}` : "Guest User";
             const ticket = await supportService.createTicket(userName, userText);
             setActiveTicketId(ticket._id);
             
             // System message
             setTimeout(() => {
                setMessages((prev) => [
                  ...prev, 
                  { type: "support", text: "Hi there! I'm a Travoss Support Agent. I see you need some help. Could you provide a bit more detail about your request?" }
                ]);
             }, 1500);
          } catch (err) {
             console.error("Failed to create ticket:", err);
             setMessages((prev) => [
                ...prev, 
                { type: "bot", text: "I'm sorry, our support system is currently offline. Please try again later." }
              ]);
             setSupportMode(false);
          }
        } else {
          setMessages((prev) => [
            ...prev, 
            { type: "bot", text: "I'm still learning and unfortunately don't know the answer to that. Could you try rephrasing? If I still can't help, I'll connect you to our live support team." }
          ]);
        }
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-indigo-600 text-white p-4 rounded-full shadow-soft-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center animate-fade-in-up glow-on-hover"
          style={{ width: '64px', height: '64px' }}
        >
          <MessageSquare size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl w-[340px] sm:w-[380px] flex flex-col overflow-hidden animate-fade-in" style={{ height: '580px', maxHeight: '85vh' }}>
          {/* Header */}
          <div className="gradient-primary p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {supportMode ? <User size={22} className="text-white" /> : <Bot size={22} className="text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-tight">{supportMode ? "Travoss Support" : "Travoss AI Helper"}</h3>
                <p className="text-xs text-blue-100 opacity-90">{supportMode ? "Connected to Agent" : "Always online"}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50 dark:bg-gray-800/50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[88%] ${msg.type === "user" ? "self-end flex-row-reverse" : "self-start"}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  msg.type === "user" ? "bg-indigo-500 text-white" : 
                  msg.type === "support" ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                }`}>
                  {msg.type === "user" ? <User size={14} /> : msg.type === "support" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 text-sm shadow-sm ${
                  msg.type === "user" 
                    ? "bg-indigo-500 text-white rounded-2xl rounded-tr-sm" 
                    : msg.type === "support"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-50 rounded-2xl rounded-tl-sm"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Quick Links */}
          {!supportMode && (
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2 shrink-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1 mb-1">Quick answers:</p>
              <div className="flex flex-wrap gap-2">
                {FAQ_OPTIONS.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFAQClick(faq)}
                    className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors px-3 py-1.5 rounded-full flex items-center gap-1 text-left"
                  >
                    {faq.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-800 dark:text-gray-100"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-md"
            >
              <Send size={18} className="translate-x-[1px]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
