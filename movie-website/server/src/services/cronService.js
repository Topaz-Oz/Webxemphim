const cron = require('node-cron');
const movieService = require('../services/movieService');

// Run every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log('Running movie sync cron job...');
  try {
    await movieService.syncMovies();
    console.log('Movie sync completed successfully');
  } catch (error) {
    console.error('Error in movie sync cron job:', error);
  }
});
