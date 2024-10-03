import dotenv from 'dotenv-defaults';
import express from 'express';
import intranet from './routes/intranet.js';
import home from './routes/home.js';
import constants from './utils/constants.js';
import initEsIndex from './utils/elasticsearch.js';
import es from './routes/es.js'

dotenv.config();
console.log(process.env);

const serverPort = process.env.SERVER_PORT;
const app = express();

app.use(express.static(constants.STATIC_FILES_FOLDER));

app.get(constants.READY_PATH, (req, res) => {
	res.send('READY');
});

app.get('/', home);

app.get('/reindex', es);

app.use(intranet);

const startServer = async() => {
   const indexOnStartup = process.env.INDEX_ON_STARTUP?.toLowerCase()  === 'true';
   if (indexOnStartup) await initEsIndex();
   app.listen(serverPort, () => {
      console.info(`App listening on ${serverPort}`);
   });
}

startServer();

export default app;