const Hapi = require('@hapi/hapi');
const routes = require('../server/route');
 
(async () => {
    const server = Hapi.server({
        port: 3000,
        // host: '0.0.0.0',
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });
 
    // const model = await loadModel();
    // server.app.model = model;
 
    server.route(routes);
 
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();