const cron = require('node-cron');
const crawlerService = require('./crawlerService');
const logger = require('../utils/logger');

// Run every 4 hours
cron.schedule('0 */4 * * *', async () => {
  logger.info('Starting scheduled movie sync...');
  try {
    // Sync first 5 pages of movies
    await crawlerService.syncMovies(5);
    logger.info('Scheduled movie sync completed successfully');
  } catch (error) {
    logger.error('Error in scheduled movie sync:', error);
  }
});

// Run a full sync once per day at 3 AM
cron.schedule('0 3 * * *', async () => {
  logger.info('Starting daily full movie sync...');
  try {
    // Sync first 20 pages for a more complete update
    await crawlerService.syncMovies(20);
    logger.info('Daily full movie sync completed successfully');
  } catch (error) {
    logger.error('Error in daily full movie sync:', error);
  }
});
