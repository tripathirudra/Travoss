import React, { useState } from "react"
import { 
  X, 
  CreditCard, 
  Wallet, 
  Building2, 
  Lock, 
  ShieldCheck, 
  QrCode, 
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react"
import api from "../services/api"

const PaymentGateway = ({ isOpen, onClose, amount, bookingId, sharedRideId, onPaymentSuccess }) => {
  const [activeTab, setActiveTab] = useState("upi")
  const [status, setStatus] = useState("idle") // idle, processing, success, error
  const [error, setError] = useState("")

  // Form states
  const [upiId, setUpiId] = useState("")
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "", name: "" })
  const [selectedBank, setSelectedBank] = useState("")

  const banks = [
    { id: "sbi", name: "State Bank of India", icon: "🏛️" },
    { id: "hdfc", name: "HDFC Bank", icon: "🏢" },
    { id: "icici", name: "ICICI Bank", icon: "🏛️" },
    { id: "axis", name: "Axis Bank", icon: "🏢" },
    { id: "pnb", name: "Punjab National Bank", icon: "🏛️" },
  ]

  const handlePayment = async () => {
    setStatus("processing")
    setError("")

    try {
      // 1. Initiate Payment on Backend
      const initiateRes = await api.post(
        `/payments/initiate`,
        {
          bookingId,
          sharedRideId,
          amount,
          method: activeTab,
          paymentDetails: activeTab === "upi" ? { upiId } : 
                         activeTab === "card" ? { cardLast4: cardData.number.slice(-4) } : 
                         { bankName: selectedBank }
        }
      )

      const { paymentId } = initiateRes.data.data

      // 2. Simulate external gateway delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 3. Verify Payment on Backend
      await api.post(
        `/payments/verify`,
        { paymentId, status: "success" }
      )

      setStatus("success")
      setTimeout(() => {
        onPaymentSuccess()
        onClose()
      }, 2000)
    } catch (err) {
      console.error("Payment failed:", err)
      setStatus("error")
      setError(err.response?.data?.message || "Transaction failed. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 gradient-primary text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-white/80" />
              Secure Checkout
            </h2>
            <p className="text-white/70 text-sm mt-1">Order Summary: ₹{amount}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "idle" || status === "error" ? (
            <>
              {/* Payment Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                {["upi", "card", "netbanking"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${
                      activeTab === tab ? "bg-white text-primary shadow-sm scale-105" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab === "upi" && <Wallet size={20} />}
                    {tab === "card" && <CreditCard size={20} />}
                    {tab === "netbanking" && <Building2 size={20} />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{tab}</span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              {/* UPI Tab */}
              {activeTab === "upi" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                  <div className="flex justify-center flex-col items-center p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <QrCode size={120} className="text-primary opacity-20" />
                    <p className="text-sm font-medium text-gray-400 mt-2 italic">Scan QR code coming soon</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">UPI ID / VPA</label>
                    <input 
                      type="text" 
                      placeholder="username@upi"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-300"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {activeTab === "card" && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="h-44 w-full gradient-primary rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg mb-6 card-3d">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-10 bg-yellow-400/80 rounded-lg"></div>
                      <CreditCard size={32} />
                    </div>
                    <div className="text-xl font-mono tracking-[0.2em]">
                      {cardData.number || "**** **** **** ****"}
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[8px] uppercase opacity-60">Card Holder</p>
                        <p className="text-sm font-bold uppercase">{cardData.name || "YOUR NAME"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase opacity-60">Expires</p>
                        <p className="text-sm font-bold">{cardData.expiry || "MM/YY"}</p>
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Card Holder Name"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Card Number"
                    maxLength={16}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
                    onChange={(e) => setCardData({...cardData, number: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" maxLength={5} className="w-1/2 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-14" onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
                    <input type="password" placeholder="CVV" maxLength={3} className="w-1/2 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none h-14" onChange={(e) => setCardData({...cardData, cvc: e.target.value})} />
                  </div>
                </div>
              )}

              {/* Net Banking Tab */}
              {activeTab === "netbanking" && (
                <div className="space-y-3 animate-in slide-in-from-bottom-2">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        selectedBank === bank.id ? "bg-primary/5 border-primary scale-[1.02]" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{bank.icon}</span>
                        <span className="font-semibold text-gray-700">{bank.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedBank === bank.id ? "border-primary bg-primary" : "border-gray-300"}`}>
                        {selectedBank === bank.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Footer Button */}
              <button 
                onClick={handlePayment}
                className="w-full mt-10 py-5 gradient-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Pay Now ₹{amount}
                <ArrowRight size={20} />
              </button>
            </>
          ) : status === "processing" ? (
            <div className="py-20 flex flex-col items-center justify-center animate-in zoom-in-90 duration-500">
              <div className="relative">
                <Loader2 size={80} className="text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-primary/40" />
                </div>
              </div>
              <h3 className="mt-8 text-xl font-bold text-gray-800">Verifying Payment</h3>
              <p className="text-gray-400 mt-2">Do not close this window</p>
              <div className="mt-12 flex gap-2">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
              </div>
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center animate-in zoom-in-90 duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-8 scale-illustration">
                <CheckCircle2 size={60} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-400 mt-2 mb-10">Your booking is now confirmed</p>
              <div className="w-full p-4 bg-gray-50 rounded-2xl flex flex-col items-center">
                <p className="text-xs text-gray-400 mb-1">Transaction Link</p>
                <p className="text-sm font-mono font-bold text-primary">#TRV_CONFIRMED_OK</p>
              </div>
            </div>
          )}

          {/* Security Footer */}
          <div className="mt-8 flex items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-1">
              <Lock size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">PCI-DSS Safe</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentGateway
