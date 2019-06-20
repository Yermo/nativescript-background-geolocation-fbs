import { 
  Component,
  OnInit
} from '@angular/core';

import { RouterExtensions } from "nativescript-angular/router";

import { LocationsService } from "../../services/locations.service";

// ----------------------------------------------------------------

/**
* Locations page.
*
* This page enables the user to scroll through the cached list of locations.
*/

@Component({
  selector: 'locations-page',
  templateUrl: 'locations-page.component.html',
  styleUrls: ["./locations-page.component.css"],
})
export class LocationsPageComponent implements OnInit {

  locations: any;

  constructor(
    private routerExtensions: RouterExtensions,
    private locationsService: LocationsService
  ) {
    this.locations = [];
  }

  // ------------------------------------------------------------

  async ngOnInit() {

    this.locations = await this.locationsService.getLocations();

    console.log( "LocationsPageComponent:ngOnInit(): got locations:", this.locations );
  }

  // -----------------------------------------------------

  public goBack() {
    this.routerExtensions.backToPreviousPage();
  }

}

// END
