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

  // --------------------------------------------------------

  /**
  * start location service
  *
  * @see locations.component.html
  */

  start( args: EventData ) {

    console.log( "HomePageComponent::start() - starting to track locations" );

    try {
      this.locationsService.start();
    } catch( error ) {

      dialogs.alert({
        title: "Location Service",
        message: error.msg,
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
        message: error.msg,
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
