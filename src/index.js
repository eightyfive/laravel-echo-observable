import Echo from "laravel-echo";
//
import PublicChannel from "./public-channel";
import PrivateChannel from "./private-channel";
import PresenceChannel from "./presence-channel";

const defaultOptions = {
  broadcaster: "pusher",
  auth: {
    headers: {}
  }
};

const channelClassNames = {
  channel: PublicChannel,
  private: PrivateChannel,
  join: PresenceChannel
};

export default class EchoObservable {
  constructor(options) {
    this.echo = null;
    this.channels = {};
    this.options = Object.assign({}, defaultOptions, options);
  }

  getEcho() {
    if (this.echo === null) {
      this.echo = new Echo(this.options);
    }

    // FIXME: WTF ?
    // At least give a stackoverflow reference of why doing that
    window.Echo = this.echo;

    return this.echo;
  }

  setAccessToken(token) {
    this.echo = null;
    this.options.auth.headers["Authorization"] = `Bearer ${token}`;
  }

  public(channelName) {
    return this.getChannel("channel", channelName);
  }

  private(channelName) {
    return this.getChannel("private", channelName);
  }

  presence(channelName) {
    return this.getChannel("join", channelName);
  }

  getChannel(channelType, channelName) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = new channelClassNames[channelType](
        this.getEcho()[channelType](channelName),
        this.createUnsubscribe(channelName)
      );
    }

    return this.channels[channelName];
  }

  async getSocketId() {
    // TODO: Implement this method for other broadcasters than "pusher"
    return new Promise(resolve => {
      this.getEcho().connector.pusher.connection.bind("connected", () =>
        resolve(this.getEcho().socketId())
      );
    });
  }

  createUnsubscribe = name => () => {
    this.getEcho().leave(name);

    delete this.channels[name];
  };
}
