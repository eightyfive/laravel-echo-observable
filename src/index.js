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

  channel(name) {
    return this.getChannel("channel", name);
  }

  private(name) {
    return this.getChannel("private", name);
  }

  join(name) {
    return this.getChannel("join", name);
  }

  getChannel(channelType, channelName) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = new channelClassNames[channelType](
        this.echo[channelType](channelName),
        this.createUnsubscribe(channelName)
      );
    }

    return this.channels[channelName];
  }

  createUnsubscribe = name => () => {
    this.echo.leave(name);

    delete this.channels[name];
  };
}
