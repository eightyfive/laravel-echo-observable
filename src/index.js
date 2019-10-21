import PublicChannel from "./public-channel";
import PrivateChannel from "./private-channel";
import PresenceChannel from "./presence-channel";

const channelClassNames = {
  channel: PublicChannel,
  private: PrivateChannel,
  join: PresenceChannel
};

export default class EchoObservable {
  constructor(echo) {
    this.echo = echo;
    this.channels = {};
  }

  setBearer(token) {
    // https://github.com/laravel/echo/issues/26#issuecomment-370832818
    this.echo.connector.options.auth.headers.Authorization = "Bearer " + token;
  }

  async getSocketId() {
    return new Promise(resolve =>
      this.echo.connector.socket.on("connect", () =>
        resolve(this.echo.socketId())
      )
    );
  }

  channel(name) {
    return this.getChannel("channel", name);
  }

  private(name) {
    return this.getChannel("private", name);
  }

  join(name) {
    return this.getChannel("join", name);
  }

  getChannel(method, name) {
    if (!this.channels[name]) {
      this.channels[name] = new channelClassNames[method](
        this.echo[method](name),
        this.createLeaveChannel(name)
      );
    }

    return this.channels[name];
  }

  createLeaveChannel(name) {
    return () => {
      this.echo.leave(name);

      delete this.channels[name];
    };
  }
}
