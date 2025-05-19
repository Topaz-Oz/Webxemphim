const Movie = require('../models/Movie');
const User = require('../models/User');
const movieService = require('../services/movieService');
const recommendationService = require('../services/recommendationService');

exports.getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by category
    switch (category) {
      case 'series':
        query.type = 'series';
        break;
      case 'single':
        query.type = 'single';
        break;
      case 'theater':
        query.isTheater = true;
        break;
      case 'new':
        // No additional query needed, will sort by date
        break;
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title thumbnail slug year genres quality rating');

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovieBySlug = async (req, res) => {
  try {
    const movie = await Movie.findOne({ slug: req.params.slug });
    if (movie) {
      // Increment views
      movie.views += 1;
      await movie.save();

      // Get similar movies
      const similarMovies = await movieService.getSimilarMovies(movie._id, 6);

      res.json({ movie, similarMovies });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const movies = await Movie.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .select('title thumbnail slug year genres');

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.syncMovies = async (req, res) => {
  try {
    const result = await movieService.syncMovies();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;

    if (!user.favorites.includes(movieId)) {
      user.favorites.push(movieId);
      await user.save();
    }

    res.json({ message: 'Movie added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const movieId = req.params.movieId;

    user.favorites = user.favorites.filter(id => id.toString() !== movieId);
    await user.save();

    res.json({ message: 'Movie removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        select: 'title thumbnail slug year genres'
      });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.user._id;
    const contentBased = await recommendationService.getContentBasedRecommendations(req.query.movieId);
    const collaborative = await recommendationService.getCollaborativeRecommendations(userId);

    res.json({
      contentBased,
      collaborative
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWatchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const movieId = req.params.movieId;

    await User.findByIdAndUpdate(userId, {
      $push: {
        watchHistory: {
          movie: movieId,
          watchedAt: new Date()
        }
      }
    });

    res.json({ message: 'Added to watch history' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideoStream = async (req, res) => {
  try {
    const stream = await movieService.getVideoStream(req.params.movieId);
    res.json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeaturedMovies = async (req, res) => {
  try {
    // Get movies with highest ratings and views
    const featuredMovies = await Movie.find({
      rating: { $gt: 7 },  // Movies with rating > 7
      views: { $gt: 100 }  // Movies with more than 100 views
    })
    .sort({ rating: -1, views: -1 })
    .limit(10)
    .select('title thumbnail slug year genres quality rating');

    res.json(featuredMovies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
