import fs from 'fs';
import path from 'path';
import constants from './constants.js';

const getPageList = () => {
   const storePath = path.join(constants.APP_ROOT, 'store');
   const fileList = fs.readdirSync(storePath, { encoding: 'utf8', recursive: false});
   let pageList = [];
   fileList.forEach((file) => {
      const fileContent = fs.readFileSync(path.join(storePath, file), { encoding: 'utf8', flag: 'r' });
      const json = JSON.parse(fileContent);
      pageList.push({
         id: json.id,
         title: json.title,
         url: getPageUrl(json.id)
      });
   })
   return pageList;
}

const getPageUrl = (name) => {
   const protocol = process.env.LINK_PROTOCOL;
   const hostname = process.env.LINK_HOSTNAME;
   const port = process.env.LINK_PORT;
   const bastUrl = `${protocol}://${hostname}${port === '443' || port === '80' ? '' : `:${port}`}`;
   return `${bastUrl}${constants.PAGES_PATH}/${name}`;
}

export { getPageList, getPageUrl }