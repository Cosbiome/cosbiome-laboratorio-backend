"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    ctx.query = {
      ...ctx.query,
      _limit: 100000,
    };

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.requisiciones.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.requisiciones.update(
        { id },
        ctx.request.body
      );
    }

    let returnSocket = await strapi.services.requisiciones.find(ctx.query);
    strapi.StrapIO.emit(this, "requisiciones", returnSocket);

    return sanitizeEntity(entity, { model: strapi.models.requisiciones });
  },
  async create(ctx) {
    let entity;

    ctx.query = {
      ...ctx.query,
      _limit: 100000,
    };

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.requisiciones.create(data, { files });
    } else {
      entity = await strapi.services.requisiciones.create(ctx.request.body);
    }

    let returnSocket = await strapi.services.requisiciones.find(ctx.query);
    strapi.StrapIO.emit(this, "requisiciones", returnSocket);

    return sanitizeEntity(entity, { model: strapi.models.requisiciones });
  },
  async delete(ctx) {
    const { id } = ctx.params;

    ctx.query = {
      ...ctx.query,
      _limit: 100000,
    };

    const entity = await strapi.services.requisiciones.delete({ id });

    let returnSocket = await strapi.services.requisiciones.find(ctx.query);
    strapi.StrapIO.emit(this, "requisiciones", returnSocket);

    return sanitizeEntity(entity, { model: strapi.models.requisiciones });
  },
};
