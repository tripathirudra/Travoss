import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Users, ArrowRight, User as UserIcon, CheckCircle2, Leaf } from 'lucide-react';
import { sharedRideService } from '../services/sharedRideService';
import useAuth from '../hooks/useAuth';
import LocationAutocomplete from '../components/LocationAutocomplete';

const FindRide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: ''
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [searchType, setSearchType] = useState('offer'); // 'offer' or 'request'
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchRides = useCallback(async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const data = await sharedRideService.searchRides({ ...searchParams, type: searchType });
      setRides(data);
      if (data.length === 0) {
        if (searchType === 'offer') {
          setMessage({ type: 'info', text: 'No rides found matching your criteria. Try different locations or dates, or check passenger requests.' });
        } else {
          setMessage({ type: 'info', text: 'No ride requests found. Be the first to post what you need!' });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch rides. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [searchParams, searchType]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleJoin = async (rideId) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to join a ride.' });
      return;
    }
    
    setJoiningId(rideId);
    try {
      await sharedRideService.requestRide(rideId);
      setMessage({ type: 'success', text: 'Request sent! The driver will review your application.' });
      // Refresh list
      fetchRides();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to request ride.' });
    } finally {
      setJoiningId(null);
    }
  };

  // Helper to check user status in a ride
  const getUserStatus = (ride) => {
    if (!user) return null;
    if (ride.passengers.includes(user._id)) return 'joined';
    const request = ride.requests?.find(r => r.userId === user._id || r.userId?._id === user._id);
    if (request) return request.status; // 'pending', 'accepted', 'rejected'
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold gradient-text-3d text-center mb-8 tracking-tight drop-shadow-xl floating">Find a Ride</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Share a commute, save costs, and meet new people.</p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-4 mb-8 justify-center">
          <button 
            onClick={() => setSearchType('offer')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${searchType === 'offer' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-gray-900 text-gray-500'}`}
          >
            I am a Passenger (Find a Car)
          </button>
          <button 
            onClick={() => setSearchType('request')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${searchType === 'request' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-gray-900 text-gray-500'}`}
          >
            I am a Driver (Find Passengers)
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass-panel-3d rounded-3xl p-6 mb-10 transition-transform hover:scale-[1.01] duration-500">
          <form onSubmit={fetchRides} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <LocationAutocomplete
              placeholder="Leaving from..."
              name="origin"
              value={searchParams.origin}
              onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
            />
            <LocationAutocomplete
              placeholder="Going to..."
              name="destination"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
              icon={MapPin}
            />
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 z-10" size={18} />
              <input
                type="date"
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50"
                value={searchParams.date}
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary-enhanced py-4 flex items-center justify-center gap-2 ${searchType === 'request' ? 'from-purple-600 to-indigo-600' : ''}`}
            >
              <Search size={20} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* CTA for Passenger Posting */}
        {searchType === 'offer' && rides.length === 0 && !loading && (
          <div className="mb-10 p-8 glass-panel-3d rounded-3xl border-2 border-dashed border-blue-400/30 text-center animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Can't find a ride on this route?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Don't wait! Post your own ride requirement and let drivers find YOU.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                onClick={() => navigate('/offer-ride?type=request')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
               >
                 Post My Requirement
               </button>
               <button 
                onClick={() => navigate('/user/book-ride')}
                className="bg-white dark:bg-gray-900 text-blue-600 border border-blue-200 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all"
               >
                 Book a Dedicated Taxi
               </button>
            </div>
          </div>
        )}

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-2xl border flex items-center gap-3 animate-fade-in ${
            message.type === 'error' ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-900/10 dark:border-red-900/30' : 
            message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600 dark:bg-green-900/10 dark:border-green-900/30' :
            'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/10 dark:border-blue-900/30'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Ride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 h-64 rounded-3xl shadow-soft animate-pulse" />
            ))
          ) : (
            rides.map((ride) => {
              const status = getUserStatus(ride);
              // Calculate a random but consistent green score based on seats
              const greenScore = (ride.totalSeats * 2.5).toFixed(1);

              return (
              <div key={ride._id} className="card-3d bg-white dark:bg-gray-900 rounded-3xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 overflow-hidden group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 animate-fade-in-up relative">
                
                {/* Eco Badge */}
                <div className="absolute top-4 right-4 bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-semibold backdrop-blur-sm shadow-sm">
                  <Leaf size={14} className="animate-pulse" />
                  {greenScore}kg CO₂ saved
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                      <UserIcon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white pb-1">
                        {searchType === 'offer' 
                          ? `${ride.driverId?.firstName} ${ride.driverId?.lastName}`
                          : `${ride.requesterId?.firstName} ${ride.requesterId?.lastName}`
                        }
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold mt-1 shadow-sm px-2 py-0.5 rounded-full border border-yellow-200">
                        ★ {(searchType === 'offer' ? ride.driverId?.rating : ride.requesterId?.rating) || '4.8'}
                      </div>
                    </div>
                    <div className="ml-auto text-right mt-8">
                      <p className="text-xl font-black text-blue-600 dark:text-blue-400 mt-2">
                      ₹{ride.pricePerSeat}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">per seat</p>
                    </div>
                  </div>

                  <div className="space-y-4 relative mb-6">
                    {/* Vertical Line for connection */}
                    <div className="absolute left-2.5 top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-800" />
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 z-10 mt-1 shadow-sm" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Origin</p>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{ride.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500 border-4 border-white dark:border-gray-900 z-10 mt-1 shadow-sm" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Destination</p>
                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{ride.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock size={16} />
                      <span className="text-xs font-medium">
                        {new Date(ride.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Users size={16} />
                      <span className="text-xs font-medium">{ride.availableSeats} seats left</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoin(ride._id)}
                    disabled={joiningId === ride._id || ride.availableSeats === 0 || status === 'joined' || status === 'pending' || status === 'rejected'}
                    className={`w-full mt-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      status === 'joined' ? "bg-green-50 text-green-600 border border-green-100 cursor-default" :
                      status === 'pending' ? "bg-yellow-50 text-yellow-600 border border-yellow-100 cursor-default" :
                      status === 'rejected' ? "bg-red-50 text-red-600 border border-red-100 cursor-not-allowed" :
                      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    {joiningId === ride._id ? "Processing..." : 
                     status === 'joined' ? "Membership Approved" : 
                     status === 'pending' ? "Request Pending" : 
                     status === 'rejected' ? "Declined by Driver" : 
                     ride.availableSeats === 0 ? "Car is Full" : "Request to Join"}
                    {!status && ride.availableSeats > 0 && joiningId !== ride._id && <ArrowRight size={18} />}
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
    </div>
  );
};

export default FindRide;
