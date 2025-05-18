const Movie = require('../models/Movie');
const User = require('../models/User');

class RecommendationService {
  async getContentBasedRecommendations(movieId, limit = 6) {
    const sourceMovie = await Movie.findById(movieId);
    if (!sourceMovie) return [];

    // Get movies with similar genres
    const similarMovies = await Movie.aggregate([
      {
        $match: {
          _id: { $ne: sourceMovie._id },
          genres: { $in: sourceMovie.genres }
        }
      },
      {
        $addFields: {
          commonGenres: {
            $size: {
              $setIntersection: ['$genres', sourceMovie.genres]
            }
          }
        }
      },
      {
        $sort: {
          commonGenres: -1,
          views: -1
        }
      },
      {
        $limit: limit
      }
    ]);

    return similarMovies;
  }

  async getCollaborativeRecommendations(userId, limit = 6) {
    const user = await User.findById(userId);
    if (!user) return [];

    // Get users with similar watch history
    const similarUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: user._id }
        }
      },
      {
        $unwind: '$watchHistory'
      },
      {
        $match: {
          'watchHistory.movie': {
            $in: user.watchHistory.map(h => h.movie)
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          commonMovies: { $sum: 1 }
        }
      },
      {
        $sort: { commonMovies: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get movies watched by similar users but not by current user
    const watchedMovies = user.watchHistory.map(h => h.movie);
    const recommendations = await Movie.aggregate([
      {
        $match: {
          _id: {
            $nin: watchedMovies
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          let: { movieId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$_id', similarUsers.map(u => u._id)] },
                    { $in: ['$$movieId', '$watchHistory.movie'] }
                  ]
                }
              }
            }
          ],
          as: 'watchedBy'
        }
      },
      {
        $addFields: {
          similarUsersCount: { $size: '$watchedBy' }
        }
      },
      {
        $sort: {
          similarUsersCount: -1,
          views: -1
        }
      },
      {
        $limit: limit
      }
    ]);

    return recommendations;
  }
}

module.exports = new RecommendationService();
