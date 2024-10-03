import express from 'express';
import initEsIndex from '../utils/elasticsearch.js'

const router = express.Router();

router.get('/reindex', async (req, res) => {
   await initEsIndex();
   res.send('DONE');
});

export default router;