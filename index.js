import dotenv from 'dotenv-defaults';
import express from 'express';
import intranet from './routes/intranet.js';
import home from './routes/home.js';
import constants from './utils/constants.js';
import initEsIndex from './utils/elasticsearch.js';
import es from './routes/es.js';
import { rateLimit } from 'express-rate-limit';

dotenv.config();
console.log(process.env);

const reindexLimit = rateLimit({
   windowMs: process.env.WINDOW_MS,
   limit: process.env.REINDEX_LIMIT,
   standardHeaders: process.env.STANDARD_HEADERS,
   legacyHeaders: process.env.LEGACY_HEADERS
});

const pageLimit = rateLimit({
   windowMs: process.env.WINDOW_MS,
   limit: process.env.PAGE_LIMIT,
   standardHeaders: process.env.STANDARD_HEADERS,
   legacyHeaders: process.env.LEGACY_HEADERS
});

const serverPort = process.env.SERVER_PORT;
const app = express();

app.use(express.static(constants.STATIC_FILES_FOLDER));

app.get(constants.READY_PATH, (req, res) => {
	res.send('READY');
});

app.use(pageLimit);

app.get('/', home);

app.use(intranet);

app.get('/reindex', reindexLimit, es);

const startServer = async() => {
   const indexOnStartup = process.env.INDEX_ON_STARTUP?.toLowerCase()  === 'true';
   if (indexOnStartup) await initEsIndex();
   app.listen(serverPort, () => {
      console.info(`App listening on ${serverPort}`);
   });
}

startServer();

export default app;