const express = require('express');
const router = express.Router();
const { 
  getMovies, 
  getMovieBySlug, 
  searchMovies, 
  syncMovies,
  addToFavorites,
  removeFromFavorites,
  getFavorites
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

module.exports = router;
