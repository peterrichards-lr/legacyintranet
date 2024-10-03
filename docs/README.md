# Legacy Intranet

## Overview

This repository represents a legacy intranet which can be used to showcase Liferay's federated search.

## Pages

The [store](../store/) contains JSON documents which serve as both the page content and the document information which will be added to the Elastic Search index.

In order to add additional pages, simply create a new JSON file as follows. The name is not important but for convention simply give it the same name as the document "id" within the JSON body.

```json
{
   "id": "break_rest_period",
   "title": "Break and Rest Period Policy",
   "description": "This policy provides guidelines for employee rest periods and breaks during work hours, ensuring compliance with labor laws."
 }
```

The "id" value is used as the identifier for the document which is added to the Elastic Search index. In the case of displaying the page within the application, the "title" is the page title and the "description" is the page content.

The pages are build using the Handlebar templates located [here](../templates).

## Liferay Search

Instructions on how setup a Low Level Search can be found in on [Liferay Learn](https://learn.liferay.com/web/guest/w/dxp/using-search/search-pages-and-widgets/search-results/understanding-low-level-search-options).

Remember to set *Indexes* field of the **Low Level Search Options** widget to the name of the Elastic Search index used by the legacy intranet app.

The "title" and "description" fields which are specified within the [Low Level Search Result](https://learn.liferay.com/web/guest/w/dxp/using-search/search-pages-and-widgets/search-results/understanding-low-level-search-options#displaying-low-level-search-results) widget. A third field "url" is constructed at the point the pages are indexed within Elastic Search. Therefore, you should configure the *Fields to Display* field of the **Search Results** widget to `title,description,url`.

## Configuration

This application used dotenv-defaults and therefore, the .env defaults can be found in the [.env.defaults](../.env.defaults) file. To override the default values just create a new .env with the properties which are different. The defaults will be for all properties which are not explicitly overridden.

## Deployment to Liferay PaaS

The application is not a Client Extension and needs to be deployed to the Liferay PaaS environment as a [custom service](https://learn.liferay.com/w/liferay-cloud/platform-services/using-a-custom-service). Simply copy the entire content of this repo into the appropriate directory within the project's workspace.

The Dockerfile should work as is but feel to change it as you wish.

In Liferay PaaS then just override the defaults with the required values by setting environment variables in the [LCP.json](../LCP.json) file.

## Local Setup

The easiest way to test this locally is to run Elastic Search within a Docker container. The Elastic Search client used by this application is 18.5.0.

Within the local-dev folder, run the following command to build an Elastic Search image with the require plugins.

`docker build . -f ./Elasticsearch.Dockerfile -t elasticsearchwithplugins:8.15.0`

The following command can be run from the terminal to spin up a Docker container.

`docker run --name es01 -p 9200:9200 -it -m 1GB -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e "xpack.security.http.ssl.enabled=false" elasticsearchwithplugins:8.15.0`

Once the docker container is running then use `yarn run start` or `npm run start` to start the application itself.

### Liferay setup

1. Download a Liferay bundle. When testing these steps Liferay DXP 2024.Q3.2 was used.
2. Copy the [Elastic Search configuration](../local-dev/com.liferay.portal.search.elasticsearch7.configuration.ElasticsearchConfiguration.config) into the bundles osgi/config directory.
3. Run the bundle and ensure it starts without error. If there are expections they you may not have used the Elasticsearch.Dockerfile to build the Elastic Search image.
4. Configure Liferay DXP in the usual way.
5. Import the [Search Blueprint](../local-dev/Legacy%20Intranet.json) via the UI.
6. Within the Liferay DXP guest site, create a new Search Result widget Template and copy and paste the content of the [ADT](../local-dev/search-result.adt) and finally save it.
7. Within the Search page, add the necessary widgets ensuring you include the Federated Search Key. Further help can be found on [Liferay Learn](https://learn.liferay.com/web/guest/w/dxp/using-search/search-pages-and-widgets/search-results/understanding-low-level-search-options).
8. Search for a keyword, such as leave

A video showing the result is available [here](Legacy%20Intranet.gif)