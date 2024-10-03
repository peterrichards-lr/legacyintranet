import express from 'express';
import fs from 'fs';
import path from 'path';
import handlebarsHelper from '../utils/handlebars.js';
import constants from '../utils/constants.js';

const router = express.Router();

router.get(`${constants.PAGES_PATH}/:pageId`, async (req, res) => {   
   const jsonPath = path.join(constants.APP_ROOT, 'store', `${req.params.pageId}.json`);
   console.info('jsonPath', jsonPath);
   fs.readFile(jsonPath, 'utf8', (err, data) => {
      if (err) throw err;
      console.log('data', data);
      const jsonData = JSON.parse(data);
      let template = handlebarsHelper.getTemplate('page');
      const html = template(jsonData);
      res.send(html);
   });
});

export default router;