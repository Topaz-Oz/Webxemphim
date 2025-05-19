const express = require('express');
const { checkRole } = require('../middleware/auth');
const crawlerService = require('../services/crawlerService');

const router = express.Router();

// Trigger manual sync
router.post('/sync', checkRole('admin'), async (req, res) => {
  try {
    await crawlerService.syncMovies();
    res.json({ message: 'Movies sync completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error syncing movies' });
  }
});

// Get sync status
router.get('/sync/status', checkRole('admin'), async (req, res) => {
  res.json({ status: 'idle' });
});

module.exports = router;
