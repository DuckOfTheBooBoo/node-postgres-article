const Hapi = require('@hapi/hapi');
const vision = require('@hapi/vision');
const inert = require('@hapi/inert');
const Handlebars = require('handlebars');
const mime = require('mime');
const Path = require('path');
const {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  serveArticle,
  deleteArticleNonAPI,
  editArticleNonAPI,
} = require('./src/handler');

const init = async () => {

  const server = Hapi.server({
    port: 8080,
    host: process.env.HOST_ENV !== 'prod' ? 'localhost' : '0.0.0.0',
  });

  await server.register([vision, inert]);

  server.views({
    engines: {
      html: Handlebars,
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: './templates',
    defaultExtension: 'html',
  });

  server.ext('onPostHandler', (request, h) => {
    const {response} = request;

    if (response.isBoom || response.type !== 'text/html') {
      return h.continue;
    }
    response.type(mime.getType(request.path));
    return h.continue;
  });

  server.events.on('response', function(request) {
    // eslint-disable-next-line max-len
    console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => h.view('index'),
    },
    {
      method: 'GET',
      path: '/add',
      handler: (request, h) => h.view('add'),
    },
    {
      method: 'GET',
      path: '/post/{param}',
      handler: serveArticle,
    },
    {
      method: 'GET',
      path: '/edit/{param}',
      handler: editArticleNonAPI,
    },
    {
      method: 'GET',
      path: '/delete/{param}',
      handler: deleteArticleNonAPI,
    },
    // Serve static files
    {
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: Path.join(__dirname, 'public'),
        },
      },
    },
    {
      method: 'GET',
      path: '/api/articles',
      handler: getArticles,
    },
    {
      method: 'POST',
      path: '/api/articles',
      handler: addArticle,
    },
    {
      method: 'PUT',
      path: '/api/articles',
      handler: updateArticle,
    },
    {
      method: 'DELETE',
      path: '/api/articles',
      handler: deleteArticle,
    },
  ]);

  await server.start();
  console.log(`Hapi.js is running in ${server.info.uri}`);
};

init();
