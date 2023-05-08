const Hapi = require('@hapi/hapi');
const vision = require('@hapi/vision');
const inert = require('@hapi/inert');
const Handlebars = require('handlebars');
const mime = require('mime');
const {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  serveArticle,
  deleteArticleNonAPI,
} = require('./src/handler');

const ALLOWED_STATIC_DIR = ['src', 'styles'];
const ALLOWED_STATIC_FILE = ['make-request.js', 'style.css', 'utils.js'];

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

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => h.view('index'),
    },
    {
      method: 'GET',
      path: '/post/{param}',
      handler: serveArticle,
    },
    {
      method: 'GET',
      path: '/delete/{param}',
      handler: deleteArticleNonAPI,
    },
    // Serve static files
    {
      method: 'GET',
      path: '/{param}/{param1*}',
      handler: (request, h) => {
        const {param, param1} = request.params;

        // eslint-disable-next-line max-len
        if ((ALLOWED_STATIC_DIR.includes(param)) && (ALLOWED_STATIC_FILE.includes(param1))) {
          return h.file(`${param}/${param1}`);
        }

        const response = h.response({
          status: 'fail',
          message: 'Forbidden. You are not authorized to access this resource.',
        });
        response.code(403);
        return response;
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
