"use strict";
const socketio = require("socket.io");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  process.nextTick(() => {
    let io = socketio(strapi.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: false,
      },
    });

    strapi.StrapIO = new (require("./utils/SocketUtil"))(io, strapi);
  });
};
