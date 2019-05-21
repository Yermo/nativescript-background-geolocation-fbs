import { 
  Component,
  OnInit
} from '@angular/core';

import { RouterExtensions } from "nativescript-angular/router";

import { LocationsService } from "../../services/locations.service";

// ----------------------------------------------------------------

/**
* DebugLog page.
*
* This page enables the user to scroll through the debug log generated
* by the background geolocation plugin.
*/

@Component({
  selector: 'debug-log-page',
  templateUrl: 'debug-log-page.component.html',
  styleUrls: ["./debug-log-page.component.css"],
})
export class DebugLogPageComponent implements OnInit {

  messages: any;

  constructor(
    private routerExtensions: RouterExtensions,
    private locationsService: LocationsService
  ) {
    this.messages = [];
  }

  // ------------------------------------------------------------

  async ngOnInit() {

    this.messages = await this.locationsService.getLogEntries( 25 );

    console.log( "DebugLogPageComponent:ngOnInit(): got messages:", this.messages );
  }

  // -----------------------------------------------------

  public goBack() {
    this.routerExtensions.backToPreviousPage();
  }

  // ------------------------------------------------------------

  /**
  * Format a date for display
  *
  * @param { number } milliseconds time in milliseconds
  *
  * @return { string } formatted date
  */

  formatDate( milliseconds ) {

    let date = new Date( milliseconds );

    let year = date.getFullYear(); 
    let month = date.getMonth() + 1;

    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let yearString = year.toString();

    let monthString = ( month < 10 ) ? "0" + month.toString() : month.toString();
    let dayString = ( day < 10 ) ? "0" + day.toString() : day.toString();

    let hoursString = (hours < 10) ? "0" + hours.toString() : hours.toString();
    let minutesString = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
    let secondsString = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

    return yearString + '-' +  monthString + '-' + dayString + ' ' + hoursString + ':' + minutesString + ':' + secondsString;

  }

}
