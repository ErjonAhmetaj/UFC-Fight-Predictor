import mongoose from 'mongoose';
import { Fighter } from './models/Fighter.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const OCTAGON_API_URL = 'https://api.octagon-api.com';

const fetchRankings = async () => {
  try {
    const response = await axios.get(`${OCTAGON_API_URL}/rankings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return [];
  }
};

const fetchFighters = async () => {
  try {
    const response = await axios.get(`${OCTAGON_API_URL}/fighters`);
    const fightersData = response.data;
    
    // Get rankings to map fighter ranks
    const rankings = await fetchRankings();
    const fighterRanks = new Map();
    
    // Create a map of fighter IDs to their ranks
    rankings.forEach(division => {
      division.fighters.forEach((fighter, index) => {
        fighterRanks.set(fighter.id, index + 1);
      });
    });

    // Transform API data to match our Fighter model
    const fighters = Object.entries(fightersData).map(([id, fighter]) => ({
      name: fighter.name,
      division: fighter.category.replace(' Division', ''),
      image: fighter.imgUrl,
      wins: parseInt(fighter.wins),
      losses: parseInt(fighter.losses),
      draws: parseInt(fighter.draws),
      rank: fighterRanks.get(id) || null,
      stats: {
        height: `${Math.floor(parseInt(fighter.height) / 12)}'${parseInt(fighter.height) % 12}"`,
        weight: `${fighter.weight} lbs`,
        reach: `${fighter.reach}"`,
        stance: fighter.fightingStyle,
        winsByKO: 0, // These stats aren't provided by the API
        winsBySubmission: 0,
        winsByDecision: 0,
        strikingAccuracy: 0,
        takedownAccuracy: 0
      }
    }));

    return fighters;
  } catch (error) {
    console.error('Error fetching fighters:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Fighter.deleteMany({});
    console.log('Cleared existing fighters');

    // Fetch and insert fighters
    const fighters = await fetchFighters();
    const insertedFighters = await Fighter.insertMany(fighters);
    console.log(`Inserted ${insertedFighters.length} fighters from API`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase(); 