// Local database of major Indian cities and popular travel destinations
const INDIAN_CITIES = [
  "Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka", "Hyderabad, Telangana", "Ahmedabad, Gujarat", 
  "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Surat, Gujarat", "Pune, Maharashtra", "Jaipur, Rajasthan", 
  "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Nagpur, Maharashtra", "Indore, Madhya Pradesh", 
  "Thane, Maharashtra", "Bhopal, Madhya Pradesh", "Visakhapatnam, Andhra Pradesh", "Pimpri-Chinchwad, Maharashtra", 
  "Patna, Bihar", "Vadodara, Gujarat", "Ghaziabad, Uttar Pradesh", "Ludhiana, Punjab", "Agra, Uttar Pradesh", 
  "Nashik, Maharashtra", "Faridabad, Haryana", "Meerut, Uttar Pradesh", "Rajkot, Gujarat", "Kalyan-Dombivli, Maharashtra", 
  "Vasai-Virar, Maharashtra", "Varanasi, Uttar Pradesh", "Srinagar, Jammu and Kashmir", "Aurangabad, Maharashtra", 
  "Dhanbad, Jharkhand", "Amritsar, Punjab", "Navi Mumbai, Maharashtra", "Allahabad, Uttar Pradesh", "Ranchi, Jharkhand", 
  "Howrah, West Bengal", "Coimbatore, Tamil Nadu", "Jabalpur, Madhya Pradesh", "Gwalior, Madhya Pradesh", 
  "Vijayawada, Andhra Pradesh", "Jodhpur, Rajasthan", "Madurai, Tamil Nadu", "Raipur, Chhattisgarh", "Kota, Rajasthan", 
  "Guwahati, Assam", "Chandigarh", "Solapur, Maharashtra", "Hubballi-Dharwad, Karnataka", "Bareilly, Uttar Pradesh", 
  "Moradabad, Uttar Pradesh", "Mysore, Karnataka", "Gurgaon, Haryana", "Aligarh, Uttar Pradesh", "Jalandhar, Punjab", 
  "Tiruchirappalli, Tamil Nadu", "Bhubaneswar, Odisha", "Salem, Tamil Nadu", "Warangal, Telangana", 
  "Mira-Bhayandar, Maharashtra", "Thiruvananthapuram, Kerala", "Bhiwandi, Maharashtra", "Saharanpur, Uttar Pradesh", 
  "Guntur, Andhra Pradesh", "Amravati, Maharashtra", "Bikaner, Rajasthan", "Noida, Uttar Pradesh", "Jamshedpur, Jharkhand", 
  "Bhilai, Chhattisgarh", "Cuttack, Odisha", "Firozabad, Uttar Pradesh", "Kochi, Kerala", "Nellore, Andhra Pradesh", 
  "Bhavnagar, Gujarat", "Dehradun, Uttarakhand", "Durgapur, West Bengal", "Asansol, West Bengal", "Rourkela, Odisha", 
  "Nanded, Maharashtra", "Kolhapur, Maharashtra", "Ajmer, Rajasthan", "Akola, Maharashtra", "Gulbarga, Karnataka", 
  "Jamnagar, Gujarat", "Ujjain, Madhya Pradesh", "Loni, Uttar Pradesh", "Jhansi, Uttar Pradesh", "Pondicherry", 
  "Nellore, Andhra Pradesh", "Jammu, Jammu and Kashmir", "Belgaum, Karnataka", "Mangalore, Karnataka", 
  "Ambattur, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Malegaon, Maharashtra", "Gaya, Bihar", "Jalgaon, Maharashtra", 
  "Udaipur, Rajasthan", "Maheshtala, West Bengal", "Shimla, Himachal Pradesh", "Manali, Himachal Pradesh", 
  "Rishikesh, Uttarakhand", "Haridwar, Uttarakhand", "Nanital, Uttarakhand", "Mussoorie, Uttarakhand", 
  "Dharamshala, Himachal Pradesh", "Leh, Ladakh", "Kasol, Himachal Pradesh", "Spiti Valley, Himachal Pradesh",
  "Pushkar, Rajasthan", "Jaisalmer, Rajasthan", "Mount Abu, Rajasthan", "Gokarna, Karnataka", "Hampi, Karnataka",
  "Ooty, Tamil Nadu", "Munnar, Kerala", "Varkala, Kerala", "Waynad, Kerala", "Alappuzha, Kerala",
  "Darjeeling, West Bengal", "Gangtok, Sikkim", "Shillong, Meghalaya", "Tawang, Arunachal Pradesh"
];

export const locationService = {
  searchPlaces: async (query) => {
    if (!query || query.length < 2) return [];
    
    // Simulate slight delay for natural feeling, though it's instant local search
    const results = INDIAN_CITIES
      .filter(city => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8) // Limit to top 8 matches
      .map((city, index) => ({
        id: `local-${index}`,
        display_name: city,
        name: city.split(',')[0],
        lat: null, // No coordinates needed for No-API strategy
        lon: null
      }));
    
    return results;
  }
};
