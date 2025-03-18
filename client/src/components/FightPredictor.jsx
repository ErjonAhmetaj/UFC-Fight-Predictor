import React, { useState, useEffect } from 'react';

const FightPredictor = () => {
  const [upcomingFights, setUpcomingFights] = useState([]);
  const [selectedFight, setSelectedFight] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUpcomingFights = async () => {
      try {
        // Temporary mock data
        const mockFights = [
          {
            id: 1,
            event: "UFC 300",
            date: "2024-04-13",
            fighters: {
              fighter1: {
                name: "Alex Pereira",
                record: "9-2-0",
                rank: 1
              },
              fighter2: {
                name: "Jamahal Hill",
                record: "12-1-0",
                rank: 2
              }
            }
          }
        ];
        setUpcomingFights(mockFights);
      } catch (error) {
        console.error('Error fetching upcoming fights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingFights();
  }, []);

  const generatePrediction = async (fight) => {
    setSelectedFight(fight);
    // TODO: Implement actual prediction logic
    // This would involve analyzing fighter stats, recent performance, etc.
    const mockPrediction = {
      winner: fight.fighters.fighter1.name,
      confidence: 65,
      reasoning: [
        "Better striking accuracy",
        "More recent activity",
        "Favorable matchup style"
      ]
    };
    setPrediction(mockPrediction);
  };

  if (loading) {
    return <div className="text-center">Loading upcoming fights...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Fight Predictor</h1>
      
      {/* Upcoming Fights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Fights</h2>
        <div className="grid gap-4">
          {upcomingFights.map(fight => (
            <div key={fight.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{fight.event}</h3>
                <span className="text-gray-600">{fight.date}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-center flex-1">
                  <p className="font-semibold">{fight.fighters.fighter1.name}</p>
                  <p className="text-sm text-gray-600">{fight.fighters.fighter1.record}</p>
                  <p className="text-sm text-gray-600">Rank #{fight.fighters.fighter1.rank}</p>
                </div>
                <div className="px-4 font-bold">VS</div>
                <div className="text-center flex-1">
                  <p className="font-semibold">{fight.fighters.fighter2.name}</p>
                  <p className="text-sm text-gray-600">{fight.fighters.fighter2.record}</p>
                  <p className="text-sm text-gray-600">Rank #{fight.fighters.fighter2.rank}</p>
                </div>
              </div>

              <button
                onClick={() => generatePrediction(fight)}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Generate Prediction
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && selectedFight && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
          <div className="text-center mb-6">
            <p className="text-xl font-semibold">Predicted Winner:</p>
            <p className="text-3xl font-bold text-green-600">{prediction.winner}</p>
            <p className="text-xl text-gray-600">Confidence: {prediction.confidence}%</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Reasoning:</h3>
            <ul className="list-disc list-inside space-y-2">
              {prediction.reasoning.map((reason, index) => (
                <li key={index} className="text-gray-700">{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FightPredictor; 