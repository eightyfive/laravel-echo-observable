import { Observable } from "rxjs";
//
import PublicChannel from "./public-channel";

const presenceMethods = ["here", "joining", "leaving"];

export default class PresenceChannel extends PublicChannel {
  here() {
    return this.getObservable("here");
  }

  joining() {
    return this.getObservable("joining");
  }

  leaving() {
    return this.getObservable("leaving");
  }
}
