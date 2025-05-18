const axios = require('axios');
const cheerio = require('cheerio');
const Movie = require('../models/Movie');
const logger = require('../utils/logger');

class CrawlerService {
  constructor() {
    this.baseUrl = 'https://www.rophim.me';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    };
  }

  async crawlMovieList(page = 1) {
    try {
      const url = `${this.baseUrl}/phimhay${page > 1 ? '/trang-' + page : ''}`;
      logger.info(`Crawling movie list from: ${url}`);

      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);
      const movies = [];

      // Get movie items from the grid
      $('.film-item').each((i, element) => {
        try {
          const $el = $(element);
          const title = $el.find('.film-title').text().trim();
          const url = $el.find('a').first().attr('href');
          const slug = url?.split('/').pop() || '';
          const thumbnail = $el.find('img').first().attr('src') || '';
          const quality = $el.find('.film-quality').text().trim();
          const meta = $el.find('.film-meta').text().trim();
          const rating = parseFloat($el.find('.film-rating').text()) || 0;

          if (title && url) {
            movies.push({
              title,
              slug,
              thumbnail: thumbnail.startsWith('http') ? thumbnail : `${this.baseUrl}${thumbnail}`,
              url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
              quality,
              rating,
              meta,
              updatedAt: new Date()
            });
          }
        } catch (err) {
          logger.error(`Error parsing movie item: ${err.message}`);
        }
      });

      return movies;
    } catch (error) {
      logger.error('Error crawling movie list:', error);
      throw error;
    }
  }

  async crawlMovieDetail(url) {
    try {
      logger.info(`Crawling movie detail from: ${url}`);
      const response = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(response.data);

      // Extract video sources for streaming
      const videoSources = [];
      $('script').each((i, element) => {
        const script = $(element).html() || '';
        const sourceMatch = script.match(/sources:\s*(\[.*?\])/s);
        if (sourceMatch) {
          try {
            const sourcesJson = JSON.parse(sourceMatch[1]);
            videoSources.push(...sourcesJson);
          } catch (err) {
            logger.error(`Error parsing video sources: ${err.message}`);
          }
        }
      });

      return {
        description: $('.film-description').text().trim(),
        genres: $('.film-info .genres a').map((_, el) => $(el).text().trim()).get(),
        year: parseInt($('.film-info .year').text()) || new Date().getFullYear(),
        actors: $('.film-info .actors a').map((_, el) => $(el).text().trim()).get(),
        directors: $('.film-info .directors a').map((_, el) => $(el).text().trim()).get(),
        country: $('.film-info .country').text().trim(),
        duration: $('.film-info .duration').text().trim(),
        episodes: $('.episodes .episode').map((_, el) => ({
          episode: parseInt($(el).text()) || 1,
          url: $(el).attr('href'),
          title: $(el).attr('title')
        })).get(),
        videoSources
      };
    } catch (error) {
      logger.error(`Error crawling movie detail: ${error.message}`);
      throw error;
    }
  }

  async syncMovies(pages = 1) {
    try {
      logger.info(`Starting movie sync for ${pages} pages`);
      let totalMovies = 0;

      for (let page = 1; page <= pages; page++) {
        const movies = await this.crawlMovieList(page);
        logger.info(`Found ${movies.length} movies on page ${page}`);
        
        for (const movieData of movies) {
          try {
            const details = await this.crawlMovieDetail(movieData.url);
            const movie = { 
              ...movieData, 
              ...details,
              sourceId: movieData.slug, // Unique identifier from rophim.me
            };
            
            await Movie.findOneAndUpdate(
              { sourceId: movie.sourceId },
              movie,
              { upsert: true, new: true }
            );
            totalMovies++;
            
            // Add a small delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            logger.error(`Error syncing movie ${movieData.title}: ${error.message}`);
          }
        }
      }

      logger.info(`Successfully synced ${totalMovies} movies from ${pages} pages`);
    } catch (error) {
      logger.error(`Error in movie sync: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new CrawlerService();
