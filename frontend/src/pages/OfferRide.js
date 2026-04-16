import React, { useState } from 'react';
import { MapPin, Calendar, Users, IndianRupee, Send, CheckCircle2 } from 'lucide-react';
import { sharedRideService } from '../services/sharedRideService';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationAutocomplete from '../components/LocationAutocomplete';

const OfferRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialType = queryParams.get('type') || 'offer';

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    totalSeats: 1,
    pricePerSeat: 0,
    type: initialType
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sharedRideService.offerRide(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-soft-xl text-center max-w-md w-full animate-fade-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ride Published!</h2>
          <p className="text-gray-600 dark:text-gray-400">Your ride has been successfully listed. Redirecting you to your carpool requests dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 floating">
          <h1 className="text-5xl font-extrabold gradient-text-3d mb-4 tracking-tight drop-shadow-xl">
            {formData.type === 'request' ? 'Request a Ride' : 'Offer a Ride'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
            {formData.type === 'request' 
              ? 'Tell drivers where you want to go and find someone to take you.'
              : 'Help others commute while saving on your own travel costs.'}
          </p>
        </div>

        <div className="glass-panel-3d rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">From</label>
                  <LocationAutocomplete
                    placeholder="Leaving from..."
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">To</label>
                  <LocationAutocomplete
                    placeholder="Going to..."
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    icon={MapPin}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Departure Time</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
                    <input
                      type="datetime-local"
                      name="departureTime"
                      required
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                      value={formData.departureTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                    {formData.type === 'request' ? 'Seats Needed' : 'Available Seats'}
                  </label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="number"
                      name="totalSeats"
                      min="1"
                      max="10"
                      required
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                      value={formData.totalSeats}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                   {formData.type === 'request' ? 'Approx. Budget per Seat' : 'Price per Seat (Optional)'}
                </label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
                  <input
                    type="number"
                    name="pricePerSeat"
                    min="0"
                    placeholder={formData.type === 'request' ? 'How much are you willing to pay?' : 'Set a price or keep it 0 for free'}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                    value={formData.pricePerSeat}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary-enhanced py-5 flex items-center justify-center gap-3 disabled:opacity-70 disabled:transform-none mt-4 text-lg ${formData.type === 'request' ? 'from-purple-600 to-indigo-600' : ''}`}
              >
                {loading ? 'Publishing...' : (formData.type === 'request' ? 'Post My Requirement' : 'Publish Ride')}
                {!loading && <Send size={20} />}
              </button>
            </form>
          </div>
          
          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-800 text-center">
            <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} />
              Your profile details will be visible to passengers who view this ride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferRide;
