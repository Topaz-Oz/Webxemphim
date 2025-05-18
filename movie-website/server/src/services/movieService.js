const axios = require('axios');
const cheerio = require('cheerio');
const Movie = require('../models/Movie');

class MovieService {
  constructor() {
    this.baseUrl = 'https://www.rophim.me/phimhay';
    this.apiClient = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
  }

  async fetchMovieList(page = 1) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}?page=${page}`);
      const $ = cheerio.load(response.data);
      const movies = [];

      // Parse movie list
      $('.film-item').each((_, element) => {
        const $el = $(element);
        const title = $el.find('.film-title').text().trim();
        const slug = $el.find('.film-title a').attr('href')?.split('/').pop() || '';
        const thumbnail = $el.find('.film-poster img').attr('src') || '';
        const year = parseInt($el.find('.film-year').text()) || new Date().getFullYear();

        movies.push({
          title,
          slug,
          thumbnail,
          year
        });
      });

      return movies;
    } catch (error) {
      console.error('Error fetching movie list:', error);
      throw error;
    }
  }
  async fetchMovieDetail(slug) {
    try {
      const response = await this.apiClient.get(`${this.baseUrl}/${slug}`);
      const $ = cheerio.load(response.data);

      const detail = {
        title: $('.film-title').text().trim(),
        description: $('.film-description').text().trim(),
        genres: $('.film-info .genres a').map((_, el) => $(el).text().trim()).get(),
        year: parseInt($('.film-info .year').text()) || new Date().getFullYear(),
        actors: $('.film-info .actors a').map((_, el) => $(el).text().trim()).get(),
        directors: $('.film-info .directors a').map((_, el) => $(el).text().trim()).get(),
        url: $('.film-player iframe').attr('src') || '',
        episodes: $('.episodes-list a').map((_, el) => ({
          episode: parseInt($(el).text()),
          url: $(el).attr('href')
        })).get()
      };

      return detail;
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      throw error;
    }
  }

  async syncMovies() {
    try {
      // Fetch first 5 pages
      for (let page = 1; page <= 5; page++) {
        const movies = await this.fetchMovieList(page);
        
        for (const movieData of movies) {
          const detail = await this.fetchMovieDetail(movieData.slug);
          
          await Movie.findOneAndUpdate(
            { slug: movieData.slug },
            {
              ...movieData,
              ...detail,
              updatedAt: new Date()
            },
            { upsert: true, new: true }
          );

          // Add delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return { success: true, message: 'Movies synchronized successfully' };
    } catch (error) {
      console.error('Error syncing movies:', error);
      throw error;
    }
  }

  async getSimilarMovies(movieId, limit = 10) {
    try {
      const movie = await Movie.findById(movieId);
      if (!movie) throw new Error('Movie not found');

      const similarMovies = await Movie.find({
        genres: { $in: movie.genres },
        _id: { $ne: movieId }
      })
        .limit(limit)
        .select('title thumbnail slug');

      return similarMovies;
    } catch (error) {
      console.error('Error getting similar movies:', error);
      throw error;
    }
  }
}

module.exports = new MovieService();
