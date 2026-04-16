import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, X } from 'lucide-react';
import { locationService } from '../services/locationService';

const LocationAutocomplete = ({ value, onChange, placeholder, icon: Icon, name, required = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange({ target: { name, value: val } });

    if (val.length >= 2) {
      setLoading(true);
      setShowDropdown(true);
      const results = await locationService.searchPlaces(val);
      setSuggestions(results);
      setLoading(false);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion) => {
    setInputValue(suggestion.display_name);
    onChange({ target: { name, value: suggestion.display_name } });
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative group">
        {Icon ? (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" size={20} />
        ) : (
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" size={20} />
        )}
        
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-10 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
        />

        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader className="animate-spin text-blue-500" size={18} />
          </div>
        )}

        {inputValue && !loading && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              onChange({ target: { name, value: '' } });
              setSuggestions([]);
              setShowDropdown(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || loading) && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500 italic">Fetching locations...</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-none"
                  >
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{item.name}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{item.display_name}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
