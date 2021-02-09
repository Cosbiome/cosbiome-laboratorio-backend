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
      entity = await strapi.services.materiasprimas.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.materiasprimas.update(
        { id },
        ctx.request.body
      );
    }

    let returnSocket = await strapi.services.materiasprimas.find(ctx.query);
    strapi.StrapIO.emit(this, "updateMateriaPrima", returnSocket);

    return sanitizeEntity(entity, { model: strapi.models.materiasprimas });
  },
  async create(ctx) {
    let entity;

    ctx.query = {
      ...ctx.query,
      _limit: 100000,
    };

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.materiasprimas.create(data, { files });
    } else {
      entity = await strapi.services.materiasprimas.create(ctx.request.body);
    }

    let returnSocket = await strapi.services.materiasprimas.find(ctx.query);
    strapi.StrapIO.emit(this, "updateMateriaPrima", returnSocket);

    return sanitizeEntity(entity, { model: strapi.models.materiasprimas });
  },
};
