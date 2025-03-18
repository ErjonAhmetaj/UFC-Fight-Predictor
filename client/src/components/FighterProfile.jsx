import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./FighterProfile.css";

const FighterProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fighter, setFighter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFighter = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/fighters/${id}`);
        setFighter(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch fighter details");
        setLoading(false);
      }
    };

    fetchFighter();
  }, [id]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `https://placehold.co/400x400/1a1a1a/ffffff?text=${encodeURIComponent(e.target.alt)}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="loading">Loading fighter details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!fighter) return <div className="error">Fighter not found</div>;

  return (
    <div className="container">
      <button 
        onClick={handleBack}
        className="back-button mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
      >
        ← Back
      </button>
      
      <div className="fighter-profile">
        <div className="image-container">
          <img
            src={fighter.image}
            alt={fighter.name}
            onError={handleImageError}
          />
        </div>
        <h1>{fighter.name}</h1>
        <p className="division">{fighter.division}</p>
        <p className="record">Record: {fighter.wins}-{fighter.losses}-{fighter.draws}</p>
        <p className="rank">Rank: #{fighter.rank || 'Unranked'}</p>
        
        <div className="stats-container mt-6">
          <h2 className="text-xl font-bold mb-4">Fighter Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Height:</span>
              <span className="stat-value">{fighter.stats.height}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Weight:</span>
              <span className="stat-value">{fighter.stats.weight}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reach:</span>
              <span className="stat-value">{fighter.stats.reach}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Stance:</span>
              <span className="stat-value">{fighter.stats.stance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterProfile;