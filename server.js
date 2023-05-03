const Hapi = require('@hapi/hapi');

const init = async () => {

  const server = Hapi.server({
    port: 8080,
    host: process.env.HOST_ENV !== 'prod' ? 'localhost' : '0.0.0.0',
  });

  server.route([
    {
      method: 'GET',
      path: '/api',
      handler: () => 'Hello from API',
    },
  ]);

  await server.start();
  console.log(`Hapi.js is running in ${server.info.uri}`);
};

init();
