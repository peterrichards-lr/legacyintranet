import express from 'express';
import handlebarsHelper from '../utils/handlebars.js';
import {getPageList} from '../utils/pages.js';

const router = express.Router();

router.get('/', async (req, res) => {
   let template = handlebarsHelper.getTemplate('index');
   const data = getPageList();
   const html = template(data);
   res.send(html);
});

export default router;