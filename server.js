const Hapi = require('@hapi/hapi');
const { getArticles } = require('./src/handler');

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
  ]);

  await server.start();
  console.log(`Hapi.js is running in ${server.info.uri}`);
};

init();
