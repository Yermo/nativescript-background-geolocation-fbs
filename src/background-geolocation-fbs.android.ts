import { Common } from './background-geolocation-fbs.common';
import * as utils from 'tns-core-modules/utils/utils';
import * as app from "tns-core-modules/application";

declare const com: any;

// export class BackgroundGeolocationFbs extends Common {

export class BackgroundGeolocationFbs extends com.marianhello.bgloc.PluginDelegate {

  private bgGeo : any;

  // ------------------------------------------------------------

  constructor() {

    super();

    let config = new com.marianhello.bgloc.Config();

    console.log( "BackgroundGeolocationFbs::constructor(): referencing android library:", config );

    this.bgGeo = new com.marianhello.bgloc.BackgroundGeolocationFacade( app.android.context, this );

    return global.__native(this)

  } // end of constructor()

  // -------------------------------------------------------------

  /**
  * Configure the geolocation backend.
  *

    public Config(Config config) {
        this.stationaryRadius = config.stationaryRadius;
        this.distanceFilter = config.distanceFilter;
        this.desiredAccuracy = config.desiredAccuracy;
        this.debug = config.debug;
        this.notificationTitle = config.notificationTitle;
        this.notificationText = config.notificationText;
        this.notificationIconLarge = config.notificationIconLarge;
        this.notificationIconSmall = config.notificationIconSmall;
        this.notificationIconColor = config.notificationIconColor;
        this.locationProvider = config.locationProvider;
        this.interval = config.interval;
        this.fastestInterval = config.fastestInterval;
        this.activitiesInterval = config.activitiesInterval;
        this.stopOnTerminate = config.stopOnTerminate;
        this.startOnBoot = config.startOnBoot;
        this.startForeground = config.startForeground;
        this.notificationsEnabled = config.notificationsEnabled;
        this.stopOnStillActivity = config.stopOnStillActivity;
        this.url = config.url;
        this.syncUrl = config.syncUrl;
        this.syncThreshold = config.syncThreshold;
        this.httpHeaders = CloneHelper.deepCopy(config.httpHeaders);
        this.maxLocations = config.maxLocations;
        if (config.template instanceof AbstractLocationTemplate) {
            this.template = ((AbstractLocationTemplate)config.template).clone();
        }

  */

    public onAuthorizationChanged( authStatus : number ): void {

    }

    public onLocationChanged( location ): void {

    }

    public onStationaryChanged( location ): void {

    }

    public onActivityChanged( activity ): void {

    }

    public onServiceStatusChanged( status ): void {

    }

    public onAbortRequested(): void {

    }

    public onHttpAuthorization(): void {

    }

    public onError(error): void {

    }
}
