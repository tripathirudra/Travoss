import React, { useState, useEffect, useCallback } from "react"
import { Clock, MapPin, CheckCircle2, XCircle, Users, Navigation, CreditCard } from 'lucide-react';
import { sharedRideService } from '../services/sharedRideService';
import useAuth from '../hooks/useAuth';
import PaymentGateway from '../components/PaymentGateway';

const MyRides = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('offered'); // 'offered' or 'bookings'
  const [offeredRides, setOfferedRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRideForPayment, setSelectedRideForPayment] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'offered') {
        const data = await sharedRideService.getMyOfferedRides();
        setOfferedRides(data);
      } else {
        const data = await sharedRideService.getMyBookings();
        setMyBookings(data);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) fetchData();
  }, [fetchData, user]);

  const handleRequestAction = async (rideId, passengerId, status) => {
    setActionLoading(passengerId);
    try {
      await sharedRideService.updateRequestStatus(rideId, passengerId, status);
      fetchData(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update request");
    } finally {
      setActionLoading(null);
    }
  };

  const getMyStatus = (ride) => {
    if (!user) return null;
    if (ride.passengers.some(p => p === user._id || p._id === user._id)) return 'accepted';
    const req = ride.requests?.find(r => r.userId === user._id || r.userId?._id === user._id);
    return req ? req.status : 'unknown';
  };

  const initiatePayment = (ride) => {
    setSelectedRideForPayment(ride);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">My Rides Dashboard</h1>

        {/* Custom Tabs */}
        <div className="flex gap-4 mb-8 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit">
          <button
            onClick={() => setActiveTab('offered')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'offered' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Navigation size={18} />
            Rides I Am Driving
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'bookings' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Users size={18} />
            My Bookings
          </button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : activeTab === 'offered' ? (
          /* OFFERED RIDES SECTION */
          <div className="space-y-6">
            {offeredRides.length === 0 ? (
              <p className="text-gray-500 py-10 text-center text-lg bg-white dark:bg-gray-900 rounded-3xl">You haven't offered any rides yet.</p>
            ) : (
              offeredRides.map(ride => (
                <div key={ride._id} className="card-3d bg-white dark:bg-gray-900 rounded-3xl shadow-soft p-6 border border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${ride.type === 'request' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                          {ride.type === 'request' ? 'Ride Requirement' : 'Ride Offer'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                        <MapPin size={20} className="text-blue-500" />
                        {ride.origin} → {ride.destination}
                      </h2>
                      <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <Clock size={16} />
                        {new Date(ride.departureTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {ride.availableSeats} <span className="text-sm font-medium text-gray-500">seats left</span>
                      </div>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ride.status === 'scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ride.status}
                      </span>
                    </div>
                  </div>

                  {/* Requests Management */}
                  <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    {ride.type === 'request' ? 'Interested Drivers' : 'Passenger Requests'}
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {ride.requests?.filter(r => r.status === 'pending').length || 0} Pending
                    </span>
                  </h3>
                  
                  {ride.requests?.length === 0 ? (
                    <p className="text-gray-400 text-sm italic">
                      {ride.type === 'request' ? 'No drivers have reached out yet.' : 'No requests for this ride yet.'}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ride.requests.map((req, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex justify-center items-center font-bold">
                              {req.userId?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {req.userId?.firstName} {req.userId?.lastName}
                              </p>
                              <p className="text-xs font-mono text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {req.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleRequestAction(ride._id, req.userId._id, 'accepted')}
                                  disabled={actionLoading === req.userId._id || ride.availableSeats === 0}
                                  className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-xl transition-colors text-sm font-bold disabled:opacity-50"
                                >
                                  <CheckCircle2 size={16} /> Accept
                                </button>
                                <button 
                                  onClick={() => handleRequestAction(ride._id, req.userId._id, 'rejected')}
                                  disabled={actionLoading === req.userId._id}
                                  className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl transition-colors text-sm font-bold disabled:opacity-50"
                                >
                                  <XCircle size={16} /> Reject
                                </button>
                              </>
                            ) : (
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                                req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {req.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* MY BOOKINGS SECTION */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBookings.length === 0 ? (
              <p className="col-span-2 text-gray-500 py-10 text-center text-lg bg-white dark:bg-gray-900 rounded-3xl">You haven't requested any rides yet.</p>
            ) : (
              myBookings.map(ride => {
                const status = getMyStatus(ride);
                return (
                  <div key={ride._id} className="card-3d bg-white dark:bg-gray-900 rounded-3xl shadow-soft p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Driver</p>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {ride.driverId?.firstName} {ride.driverId?.lastName}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          status === 'accepted' ? 'bg-green-100 text-green-700' :
                          status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {status}
                        </span>
                        {status === 'accepted' && (
                          ride.paymentStatus === 'paid' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              <CheckCircle2 size={10} /> PAID
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              UNPAID
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-4">
                      <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                        <MapPin size={16} className="text-blue-500" /> {ride.origin}
                      </div>
                      <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                        <MapPin size={16} className="text-purple-500" /> {ride.destination}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} />
                        {new Date(ride.departureTime).toLocaleDateString()} at {new Date(ride.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        ₹{ride.pricePerSeat}
                      </div>
                    </div>

                    {status === 'accepted' && ride.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => initiatePayment(ride)}
                        className="w-full mt-4 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md"
                      >
                        <CreditCard size={18} />
                        Pay Now
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <PaymentGateway
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedRideForPayment?.pricePerSeat || 0}
        sharedRideId={selectedRideForPayment?._id}
        onPaymentSuccess={() => {
          fetchData(); // Refresh to show 'Paid' status
        }}
      />
    </div>
  );
};

export default MyRides;
