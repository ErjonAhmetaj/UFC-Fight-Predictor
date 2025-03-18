import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FightPredictor.css';
import "./FightPredictor.css";

const FightPredictor = () => {
  const [fighters, setFighters] = useState([]);
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [prediction, setPrediction] = useState(null);
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

  const calculatePrediction = () => {
    if (!fighter1 || !fighter2) return;

    // Calculate win probability based on various factors
    const calculateScore = (fighter, opponent) => {
      let score = 0;
      
      // Win/Loss record impact (35%)
      const totalFights = fighter.wins + fighter.losses;
      const winRate = totalFights > 0 ? (fighter.wins / totalFights) * 100 : 0;
      score += winRate * 0.35;

      // Rankings impact (25%)
      const rankScore = fighter.rank ? (16 - Math.min(fighter.rank, 15)) * 2 : 0;
      score += rankScore * 0.25;

      // Physical advantages (20%)
      const physicalScore = calculatePhysicalAdvantages(fighter, opponent);
      score += physicalScore * 0.20;

      // Experience (20%)
      const experienceScore = calculateExperienceScore(fighter);
      score += experienceScore * 0.20;

      return score;
    };

    // Calculate physical advantages
    const calculatePhysicalAdvantages = (fighter, opponent) => {
      let physicalScore = 0;

      // Height advantage (in inches)
      const heightDiff = parseFloat(fighter.stats.height) - parseFloat(opponent.stats.height);
      physicalScore += Math.max(0, heightDiff) * 2;

      // Reach advantage (in inches)
      const reachDiff = parseFloat(fighter.stats.reach) - parseFloat(opponent.stats.reach);
      physicalScore += Math.max(0, reachDiff) * 3;

      return Math.min(100, physicalScore); // Cap at 100
    };

    // Calculate experience score
    const calculateExperienceScore = (fighter) => {
      let experienceScore = 0;

      // Total fights impact
      const totalFights = fighter.wins + fighter.losses + fighter.draws;
      experienceScore += Math.min(50, totalFights * 2); // Cap at 50 points

      // Win streak bonus (if we had this data)
      // experienceScore += (fighter.winStreak || 0) * 5;

      // Fighting style matchup (if we had style effectiveness data)
      // experienceScore += getStyleMatchupScore(fighter.stats.stance, opponent.stats.stance);

      return Math.min(100, experienceScore); // Cap at 100
    };

    const fighter1Score = calculateScore(fighter1, fighter2);
    const fighter2Score = calculateScore(fighter2, fighter1);
    const totalScore = fighter1Score + fighter2Score;

    const fighter1Probability = Math.round((fighter1Score / totalScore) * 100);
    const fighter2Probability = 100 - fighter1Probability;

    setPrediction({
      fighter1: {
        name: fighter1.name,
        probability: fighter1Probability,
        stats: {
          winRate: ((fighter1.wins / (fighter1.wins + fighter1.losses)) * 100).toFixed(1),
          physicalAdvantages: calculatePhysicalAdvantages(fighter1, fighter2).toFixed(1),
          experienceScore: calculateExperienceScore(fighter1).toFixed(1)
        }
      },
      fighter2: {
        name: fighter2.name,
        probability: fighter2Probability,
        stats: {
          winRate: ((fighter2.wins / (fighter2.wins + fighter2.losses)) * 100).toFixed(1),
          physicalAdvantages: calculatePhysicalAdvantages(fighter2, fighter1).toFixed(1),
          experienceScore: calculateExperienceScore(fighter2).toFixed(1)
        }
      }
    });
  };

  // Filter fighters by selected division
  const availableFighters = fighters.filter(f => 
    !fighter1 || f.division === fighter1.division
  );

  if (loading) return <div className="loading">Loading fighters...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-12 text-4xl font-bold text-center gradient-text">Fight Predictor</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Fighter 1 Selection */}
        <div className="p-6 fighter-select glass-effect rounded-xl">
          <h2 className="mb-6 text-xl font-bold text-indigo-400">Select Fighter 1</h2>
          <select
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            value={fighter1 ? fighter1._id : ""}
            onChange={(e) => {
              const selected = fighters.find(f => f._id === e.target.value);
              setFighter1(selected);
              setFighter2(null);
              setPrediction(null);
            }}
          >
            <option value="">Select a fighter...</option>
            {fighters.map(fighter => (
              <option key={fighter._id} value={fighter._id}>
                {fighter.name} ({fighter.division})
              </option>
            ))}
          </select>

          {fighter1 && (
            <div className="mt-6 fighter-card fighter1 scale-effect">
              <div className="w-48 h-48 mx-auto mb-4 overflow-hidden border-4 border-indigo-500 rounded-full glow-effect">
                <img
                  src={fighter1.image}
                  alt={fighter1.name}
                  className="object-cover object-top w-full h-full"
                  onError={handleImageError}
                />
              </div>
              <h3 className="fighter-name">{fighter1.name}</h3>
              <p className="fighter-record">
                Record: {fighter1.wins}-{fighter1.losses}-{fighter1.draws}
              </p>
            </div>
          )}
        </div>

        {/* Fighter 2 Selection */}
        <div className="p-6 fighter-select glass-effect rounded-xl">
          <h2 className="mb-6 text-xl font-bold text-red-400">Select Fighter 2</h2>
          <select
            className="w-full p-3 text-gray-200 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500"
            value={fighter2 ? fighter2._id : ""}
            onChange={(e) => {
              const selected = fighters.find(f => f._id === e.target.value);
              setFighter2(selected);
              setPrediction(null);
            }}
            disabled={!fighter1}
          >
            <option value="">Select a fighter...</option>
            {availableFighters
              .filter(f => f._id !== fighter1?._id)
              .map(fighter => (
                <option key={fighter._id} value={fighter._id}>
                  {fighter.name} ({fighter.division})
                </option>
              ))}
          </select>

          {fighter2 && (
            <div className="mt-6 fighter-card fighter2 scale-effect">
              <div className="w-48 h-48 mx-auto mb-4 overflow-hidden border-4 border-red-500 rounded-full glow-effect">
                <img
                  src={fighter2.image}
                  alt={fighter2.name}
                  className="object-cover object-top w-full h-full"
                  onError={handleImageError}
                />
              </div>
              <h3 className="fighter-name">{fighter2.name}</h3>
              <p className="fighter-record">
                Record: {fighter2.wins}-{fighter2.losses}-{fighter2.draws}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Predict Button */}
      {fighter1 && fighter2 && (
        <div className="mt-12 text-center">
          <button
            className="px-10 py-4 font-bold text-white transition-all duration-200 transform rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 glow-effect"
            onClick={calculatePrediction}
          >
            Predict Winner
          </button>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="p-8 mt-12 glass-effect rounded-xl glow-effect">
          <h2 className="mb-8 text-3xl font-bold text-center gradient-text">Fight Prediction</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-6 text-center bg-gray-800 rounded-lg">
              <h3 className="mb-4 text-xl font-bold text-indigo-400">{prediction.fighter1.name}</h3>
              <div className="mb-6 text-4xl font-bold gradient-text">{prediction.fighter1.probability}%</div>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="ml-2 text-indigo-400">{prediction.fighter1.stats.winRate}%</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Physical Advantage:</span>
                  <span className="ml-2 text-indigo-400">{prediction.fighter1.stats.physicalAdvantages}</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Experience:</span>
                  <span className="ml-2 text-indigo-400">{prediction.fighter1.stats.experienceScore}</span>
                </div>
              </div>
            </div>
            <div className="p-6 text-center bg-gray-800 rounded-lg">
              <h3 className="mb-4 text-xl font-bold text-red-400">{prediction.fighter2.name}</h3>
              <div className="mb-6 text-4xl font-bold gradient-text">{prediction.fighter2.probability}%</div>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="ml-2 text-red-400">{prediction.fighter2.stats.winRate}%</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Physical Advantage:</span>
                  <span className="ml-2 text-red-400">{prediction.fighter2.stats.physicalAdvantages}</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <span className="text-gray-400">Experience:</span>
                  <span className="ml-2 text-red-400">{prediction.fighter2.stats.experienceScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightPredictor; 