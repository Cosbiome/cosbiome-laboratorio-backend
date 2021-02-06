class StrapIO {
  constructor(io, strapi) {
    this.io = io;
    this.strapi = strapi;

    this.io.use((socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        this._upServices()
          .jwt.verify(socket.handshake.query.token)
          .then((user) => {
            socket.emit("message", "Hey");
            this._upServices()
              .user.fetchAuthenticatedUser(user.id)
              .then((detail) => socket.join(detail.role.name));
          });
      }
      next();
    });
  }

  async emit(vm, action, entity) {
    // check if old arguments are used. < 1.0.10
    if (arguments.length > 4) {
      action = arguments[2];
      entity = arguments[3];
    }

    const plugins = await this._upServices().userspermissions.getPlugins("es");
    const roles = await this._upServices().userspermissions.getRoles();

    for (var i in roles) {
      const roleDetail = await this._upServices().userspermissions.getRole(
        roles[i].id,
        plugins
      );

      this.io.sockets.in(roleDetail.name).emit(action, entity);
    }
  }

  _upServices() {
    return this.strapi.plugins["users-permissions"].services;
  }
}

module.exports = StrapIO;
