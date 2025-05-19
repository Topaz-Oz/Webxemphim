const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  originalTitle: String,
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['single', 'series'],
    required: true,
    default: 'single',
    index: true,
  },
  isTheater: {
    type: Boolean,
    default: false,
    index: true,
  },
  quality: {
    type: String,
    enum: ['HD', 'SD', 'CAM', 'FHD'],
    default: 'HD',
  },
  genres: [{
    type: String,
    index: true,
  }],
  year: {
    type: Number,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  actors: [{
    type: String,
    index: true,
  }],
  directors: [{
    type: String,
    index: true,
  }],
  episodes: [{
    episode: Number,
    url: String,
    title: String,
  }],
  rating: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  sourceId: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

// Text index for search functionality
movieSchema.index({
  title: 'text',
  description: 'text',
  actors: 'text',
  directors: 'text',
  genres: 'text',
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
