import mongoose from "mongoose";

const fighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  draws: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: null,
  },
  stats: {
    height: String,
    weight: String,
    reach: String,
    stance: String,
    winsByKO: Number,
    winsBySubmission: Number,
    winsByDecision: Number,
    strikingAccuracy: Number,
    takedownAccuracy: Number,
  }
});

// Index for faster searches
fighterSchema.index({ name: 1 });
fighterSchema.index({ division: 1 });

const Fighter = mongoose.model("Fighter", fighterSchema);

export { Fighter }; 