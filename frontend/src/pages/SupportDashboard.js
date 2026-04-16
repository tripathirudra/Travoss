import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, User, Clock, CheckCircle, RefreshCcw, MessageSquare } from "lucide-react";
import { supportService } from "../services/supportService";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchTickets = useCallback(async () => {
    try {
      const data = await supportService.getAllTickets();
      setTickets(data);
      if (activeTicket) {
        const updatedActive = data.find(t => t._id === activeTicket._id);
        if (updatedActive) setActiveTicket(updatedActive);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTicket]);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicket?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    try {
      const updatedTicket = await supportService.sendMessage(activeTicket._id, "agent", replyText);
      setActiveTicket(updatedTicket);
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;
    try {
      await supportService.closeTicket(activeTicket._id);
      setActiveTicket(null);
      fetchTickets();
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex">
      {/* Sidebar: Ticket List */}
      <div className="w-1/3 max-w-sm bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-80px)]">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg">Active Queries</h2>
          <button onClick={fetchTickets} className="hover:rotate-180 transition-transform p-1">
            <RefreshCcw size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading && tickets.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
               <CheckCircle size={40} className="mb-2 text-green-400" />
               <p>All caught up!</p>
               <p className="text-sm mt-1">No active support queries.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div 
                key={ticket._id}
                onClick={() => setActiveTicket(ticket)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeTicket?._id === ticket._id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <User size={16} className="text-gray-400"/>
                    {ticket.customerName}
                  </h3>
                  <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-2">
                  {ticket.messages.length > 0 
                     ? ticket.messages[ticket.messages.length - 1].text 
                     : "New session started..."}
                </p>
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(ticket.updatedAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Chat Interface */}
      <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-white relative">
        {activeTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
              <div>
                <h2 className="font-bold text-xl text-gray-800">Chat with {activeTicket.customerName}</h2>
                <p className="text-sm text-gray-500">Ticket ID: {activeTicket._id}</p>
              </div>
              <button 
                onClick={handleCloseTicket}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition-colors border border-red-200 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Mark Resolved
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/50">
              {activeTicket.messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex max-w-[75%] ${msg.sender === "agent" ? "self-end" : "self-start"}`}
                >
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.sender === "agent" 
                      ? "bg-indigo-600 text-white rounded-tr-sm" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the customer..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 rounded-xl transition-colors flex items-center gap-2 font-medium shadow-sm"
                >
                  Reply
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquare size={64} className="mb-4 text-gray-300" opacity={0.5} />
            <p className="text-xl font-medium text-gray-500">Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
