import { Observable } from 'tns-core-modules/data/observable';
import * as app from 'tns-core-modules/application';

export class Common extends Observable {
  public message: string;

  // config settings 

  public static DISTANCE_FILTER_PROVIDER : number = 0;
  public static ACTIVITY_PROVIDER : number = 1;
  public static RAW_PROVIDER : number = 2;

  public static HIGH_ACCURACY : number = 0;
  public static MEDIUM_ACCURACY: number = 100;
  public static LOW_ACCURACY: number = 1000;
  public static PASSIVE_ACCURACY: number = 10000;

  constructor() {
    super();
  }

}

// END
