const Hapi = require('@hapi/hapi');
const {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} = require('./src/handler');

const init = async () => {

  const server = Hapi.server({
    port: 8080,
    host: process.env.HOST_ENV !== 'prod' ? 'localhost' : '0.0.0.0',
  });

  server.route([
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
