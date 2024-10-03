import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import constants from './constants.js';

const getTemplate = (name) => {
  if (
    Handlebars.templates === undefined ||
    Handlebars.templates[name] === undefined
  ) {
    const templatePath = path.join(constants.APP_ROOT, 'templates', `${name}.hbs`);
    const data = fs.readFileSync(templatePath, { encoding: 'utf8', flag: 'r' });

    if (Handlebars.templates === undefined) {
      Handlebars.templates = {};
    }
    Handlebars.templates[name] = Handlebars.compile(data);
  }
  return Handlebars.templates[name];
};

export default { getTemplate };
