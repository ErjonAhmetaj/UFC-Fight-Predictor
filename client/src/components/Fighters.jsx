import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fighters = () => {
  const [fighters, setFighters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/fighters');
        setFighters(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch fighters');
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(e.target.alt)}`;
  };

  const divisions = [...new Set(fighters.map(fighter => fighter.division))].sort();

  const filteredFighters = fighters.filter(fighter => {
    const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = !selectedDivision || fighter.division === selectedDivision;
    return matchesSearch && matchesDivision;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen mt-16 bg-primary-bg">
      <div className="text-xl text-primary animate-pulse">Loading fighters...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen mt-16 bg-primary-bg">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-fighter-bg">
      <div className="pt-16 px-4 pb-8 max-w-[2000px] mx-auto">
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search fighters..."
            className="w-full p-4 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-gray-100 border border-gray-800 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="w-full p-4 text-gray-900 transition-all duration-300 bg-gray-100 border border-gray-800 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="" className="bg-gray-900">All Divisions</option>
            {divisions.map(division => (
              <option key={division} value={division} className="bg-gray-900">
                {division}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl">
          {filteredFighters.map(fighter => (
            <div 
              key={fighter._id} 
              className="p-6 transition-all duration-300 border border-gray-800 bg-fighter-card rounded-xl hover:border-purple-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="absolute inset-0 border-4 rounded-full shadow-lg border-purple-500/30 shadow-purple-500/20"></div>
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  onError={handleImageError}
                  className="object-cover object-top w-full h-full transition-transform duration-500 rounded-full hover:scale-110"
                />
              </div>
              <h2 className="mb-2 text-xl font-bold text-black truncate">{fighter.name}</h2>
              <p className="mb-1 text-gray-400">Division: {fighter.division}</p>
              <p className="mb-2 text-gray-400">
                Record: {fighter.wins}-{fighter.losses}-{fighter.draws}
              </p>
              <p className="font-semibold text-purple-400">
                {fighter.rank ? `Rank: #${fighter.rank}` : 'Unranked'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Fighters; 