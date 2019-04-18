import { Observable } from 'tns-core-modules/data/observable';
import { BackgroundGeolocationFbs } from 'nativescript-background-geolocation-fbs';

export class HelloWorldModel extends Observable {
  public message: string;
  private backgroundGeolocationFbs: BackgroundGeolocationFbs;

  constructor() {
    super();

    this.backgroundGeolocationFbs = new BackgroundGeolocationFbs();
    this.message = this.backgroundGeolocationFbs.message;
  }
}
