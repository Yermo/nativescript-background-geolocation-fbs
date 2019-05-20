import { 
  Component, 
  OnInit, 
  OnDestroy, 
  Input, 
  ChangeDetectionStrategy 
} from "@angular/core";

import { Location } from "nativescript-background-geolocation-fbs";

/**
* locations list view - CURRENTLY UNUSED.
*
* This implements the "dumb view component" pattern for separating out an asynchronous
* pipe component from it's display. It just displays a listview of locations. 
*
* The process is as follows:
*
* - The background geolocation service, once started, will start emitting 'location'
*   events. 
*
* - The location service in this demo app subscribes to those location updates and
*   maintains a list of locations received since the app was started.
*
* - The location service also creates an observable subject that it publishes the
*   complete list to each time an update comes in.
*
* - The home page component subscribes to the location service observable and
*   implements the onPush change detection strategy.
*
* - The observable is referenced via an "async pipe" in the home page template where
*   the current locations array is passed to this 'dumb view' component.
*
* - When a new update comes in, change detection runs, and through the async pipe
*   the updated list of locations is passed to use where we just display it in a
*   list view.
*/

@Component({
    selector: "locations-list",
    moduleId: module.id,
    templateUrl: "./locations-list.component.html"
})
export class LocationsListComponent {

  @Input() locations : Location[];

  constructor(
  ) {
    console.log( "LocationsListComponent::constructor()" );
  }

} // END
