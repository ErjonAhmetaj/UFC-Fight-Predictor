import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./FighterList.css";

const FighterList = () => {
  const [fighters, setFighters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/fighters");
        setFighters(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch fighters");
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(e.target.alt)}`;
  };

  // Get unique divisions from fighters
  const divisions = ['All', ...new Set(fighters.map(fighter => fighter.division))].sort();

  const filteredFighters = fighters.filter(fighter => {
    const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = selectedDivision === 'All' || fighter.division === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  if (loading) return <div className="loading">Loading fighters...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search fighters..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          {divisions.map(division => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFighters.map(fighter => (
          <Link
            key={fighter._id}
            to={`/fighter/${fighter._id}`}
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 mb-4 overflow-hidden rounded-full border-4 border-gray-200">
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  className="w-full h-full object-cover object-top"
                  onError={handleImageError}
                />
              </div>
              <h2 className="text-xl font-bold text-center mb-2">{fighter.name}</h2>
              <p className="text-gray-600 mb-2">Division: {fighter.division}</p>
              <p className="text-gray-600 mb-2">Record: {fighter.wins}-{fighter.losses}-{fighter.draws}</p>
              <p className="text-gray-600">Rank: #{fighter.rank || 'Unranked'}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredFighters.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No fighters found matching your search.
        </div>
      )}
    </div>
  );
};

export default FighterList; 