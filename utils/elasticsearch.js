import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import path from 'path';
import constants from './constants.js';
import { getPageUrl } from './pages.js';

const getDocuments = () => {
  const storePath = path.join(constants.APP_ROOT, 'store');
  const fileList = fs.readdirSync(storePath, {
    encoding: 'utf8',
    recursive: false,
  });
  let documents = [];
  fileList.forEach((file) => {
    const fileContent = fs.readFileSync(path.join(storePath, file), {
      encoding: 'utf8',
      flag: 'r',
    });
    const json = JSON.parse(fileContent);
    documents.push({
      id: json.id,
      title: json.title,
      description: json.description,
      url: getPageUrl(json.id),
    });
  });
  return documents;
};

const initEsIndex = async () => {
  const esIndex = process.env.ES_INDEX;
  const esEndpoint = process.env.ES_ENDPOINT;

  const client = new Client({
    node: esEndpoint,
  });

  console.log('esIndex', esIndex);

  console.info('Deleting ES index');
  await client.indices.delete({ index: esIndex }, {ignore: [404]});

  
  console.info('Creating ES index');
  await client.indices.create(
    {
      index: esIndex,
      settings: {
        number_of_replicas: 0,
      },
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: { type: 'text' },
          description: { type: 'text' },
          url: { type: 'keyword' },
        },
      },
    }
  );

  const dataset = getDocuments();
  console.log('dataset', dataset);

  const operations = dataset.flatMap((doc) => [
    { index: { _index: esIndex, _id: doc.id } },
    doc,
  ]);

  console.info('Loading docuemnts into ES index');
  const bulkResponse = await client.bulk({ refresh: true, operations });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: operations[i * 2],
          document: operations[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }

  const count = await client.count({ index: esIndex });
  console.log(count);
};

export default initEsIndex;
