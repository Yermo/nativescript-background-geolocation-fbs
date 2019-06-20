/**
* App Home Page
*
* @author Yermo Lamers of Flying Brick Software, LLC
*/

import { 
  Component, 
  OnInit, 
  OnDestroy, 
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

import { RouterExtensions } from "nativescript-angular/router";

import { Location } from "nativescript-background-geolocation-fbs";
import { LocationsService } from "../../services/locations.service";

import * as dialogs from "tns-core-modules/ui/dialogs";
import { EventData } from "tns-core-modules/data/observable";

import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

/**
* App Home Page
*
* This implements the home page of the Angular Demo app. 
* It provides methods to start and stop background 
* geolocation and displays the current location.
*
* For grins, it also includes a clock.
*/

@Component({
  selector: "home-page",
  moduleId: module.id,
  templateUrl: "./home-page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {

  // stream of locations from LocationsService

  public locations$ : Observable<Location[]>;

  // start time. 

  public startTime = Date.now();

  // runtime counter. 

  public runtime$ = interval(1000).pipe( map( val => { return this.formatInterval( Date.now() - this.startTime ); } ));

  constructor(
    private routerExtensions: RouterExtensions,
    private locationsService: LocationsService
  ) {
  }

  // ---------------------------------------------------------

  /**
  * navigate to the settings page
  */

  settings() {
    this.routerExtensions.navigate( ["/settings" ] );
  }


  // --------------------------------------------------------

  /**
  * start location service
  *
  * @see locations.component.html
  */

  async start( args: EventData ) {

    console.log( "HomePageComponent::start() - starting to track locations" );

    // if the geolocation service is not configured, configure it with the currently
    // stored (or if this is the first run, default) settings.

    if ( ! this.locationsService.isConfigured ) {

      await this.locationsService.configure().catch( ( error ) => {

        dialogs.alert({
          title: "Location Service",
          message: error.toString(),
          okButtonText: "OK",
        });

        return false;

      });

    }

    try {
      this.locationsService.start();
    } catch( error ) {

      dialogs.alert({
        title: "Location Service",
        message: error.toString(),
        okButtonText: "OK",
      });

    }
  }

  // ---------------------------------------------------------

  /**
  * stop locations service
  */

  stop( args: EventData ) {

    console.log( "HomePageComponent::stop() - stopping tracking" );

    try {

      this.locationsService.stop();

    } catch( error ) {

      dialogs.alert({
        title: "Location Service",
        message: error.toString(),
        okButtonText: "OK",
      });

    }

  }

  // ---------------------------------------------------------

  /**
  * pause locations service
  */

  pause( args: EventData ) {

    console.log( "HomePageComponent::pause() - pausing tracking" );

    try {

      this.locationsService.pause();

      dialogs.alert({
        title: "Location Service",
        message: "Location updates paused.",
        okButtonText: "OK",
      });

    } catch( error ) {

      dialogs.alert({
        title: "Location Service",
        message: error.toString(),
        okButtonText: "OK",
      });

    }

  }

  // ---------------------------------------------------------

  /**
  * resume locations service
  */

  resume( args: EventData ) {

    console.log( "HomePageComponent::resume() - resuming tracking" );

    try {

      this.locationsService.resume();

      dialogs.alert({
        title: "Location Service",
        message: "Location updates resumed.",
        okButtonText: "OK",
      });

    } catch( error ) {

      dialogs.alert({
        title: "Location Service",
        message: error.toString(),
        okButtonText: "OK",
      });

    }

  }

  // ---------------------------------------------------------

  /**
  * navigate to the debuglog page
  */

  debuglog() {
    this.routerExtensions.navigate( ["/debuglog" ] );
  }

  // ---------------------------------------------------------

  /**
  * navigate to the locations page
  */

  locations() {
    this.routerExtensions.navigate( ["/locations" ] );
  }

  // ---------------------------------------------------------

  /**
  * Current Location
  */

  currentLocation() {

    console.log( "HomePageComponent::currentLocation():" );

    this.locationsService.getCurrentLocation().then( ( location ) => {

      dialogs.alert({
        title: "Current Location",
        message: "Lat: " + location.latitude + " Lng: " + location.longitude + " Elev: " + location.altitude,
        okButtonText: "OK",
       });
    }).catch( ( error ) => {

      dialogs.alert({
        title: "Location Error",
        message: error.toString(),
        okButtonText: "OK",
      });

    });

  }

  // ---------------------------------------------------------

  /**
  * clear locations cache.
  */

  clearLocations() {

    console.log( "HomePageComponent::clearLocations():" );

    this.locationsService.clearLocations();

    dialogs.alert({
      title: "Background Locations",
      message: "Locations cache cleared",
      okButtonText: "OK",
     });

  }

  // ---------------------------------------------------------

  /**
  * show app settings
  */

  appSettings() {
    this.locationsService.settings();
  }

  // ---------------------------------------------------------

  /**
  * show location settings
  */

  locationSettings() {
    this.locationsService.locationSettings();
  }

  // ---------------------------------------------------------

  /**
  * Check status
  */

  status() {

    console.log( "HomePageComponent::clearLocations():" );

    this.locationsService.checkStatus().then( ( status ) => {

      let msg = 'isRunning: ' +  status.isRunning + "\n";

      msg += 'hasPermissions: ' + status.hasPermissions + "\n";

      msg += 'locationServicesEnabled: ' + status.locationServicesEnabled + "\n";
      msg += 'authorizaton: ' + status.authorization + "\n";

      dialogs.alert({
        title: "BGgeo Status",
        message: msg,
        okButtonText: "OK",
       });

     }).catch( ( error ) => {
  
      dialogs.alert({
        title: "BGgeo Status Error",
        message: error.toString(),
        okButtonText: "OK",
       });

     });

  }

  // ---------------------------------------------------------

  /**
  * on init
  *
  * @see LocationsService
  * @see LocationsListComponent
  */

  ngOnInit(): void {
    this.locations$ = this.locationsService.getLocationsObservable();
  }

  // ------------------------------------------------------------

  /**
  * format a time interval in milliseconds for display
  *
  * @param { number } duration time in milliseconds.
  *
  * @return { string } formatted date string
  */

  formatInterval( duration : number ) {

    let seconds = Math.floor( ( duration/1000) ) % 60;
    let minutes = Math.floor( ( duration/( 1000*60 ))) % 60;
    let hours =  Math.floor( ( duration/( 1000*60*60 )) ) % 24;
    let days =  Math.floor( ( duration/( 1000*60*60*24 )) );

    let daysString = (days < 10) ? "0" + days.toString() : days.toString();

    let hoursString = (hours < 10) ? "0" + hours.toString() : hours.toString();
    let minutesString = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
    let secondsString = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

    return daysString + ":" + hoursString + ":" + minutesString + ":" + secondsString;

  }

} // END
