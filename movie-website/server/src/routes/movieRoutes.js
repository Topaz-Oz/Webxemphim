const express = require('express');
const router = express.Router();
const { 
  getMovies, 
  getMovieBySlug, 
  searchMovies, 
  syncMovies,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getRecommendedMovies,
  addToWatchHistory,
  getVideoStream
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getMovies);
router.get('/search', searchMovies);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:movieId', protect, addToFavorites);
router.delete('/favorites/:movieId', protect, removeFromFavorites);
router.get('/:slug', getMovieBySlug);
router.post('/sync', protect, admin, syncMovies);
router.get('/cron/sync', syncMovies); // For automatic sync via cron job

// Recommendation routes
router.get('/recommendations', protect, getRecommendedMovies);
router.post('/watch-history/:movieId', protect, addToWatchHistory);

// Video streaming route
router.get('/:movieId/stream', protect, getVideoStream);

module.exports = router;
