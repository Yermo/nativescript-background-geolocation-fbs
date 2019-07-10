/**
* Geolocation Settings Page
*
* @author Yermo Lamers of Flying Brick Software, LLC
*/

import { 
  Component, 
  OnInit, 
  AfterViewInit,
  OnDestroy, 
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";

import { RouterExtensions } from "nativescript-angular/router";

import { LocationsService } from "../../services/locations.service";

import { Switch } from "tns-core-modules/ui/switch";
import { action } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { EventData } from "tns-core-modules/data/observable";

/**
* Configuration Page
*
* This implements a configuration form for all 
* properties that can be set in the background geolocation
* plugin.
*
* Properties are saved to the geolocation plugin as soon as they are changed.
*/

@Component({
  selector: "configure-page",
  moduleId: module.id,
  templateUrl: "./settings-page.component.html",
  styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent implements OnInit, AfterViewInit {

  // config from the plugin

  private pluginConfig : any = {};

  // config to display in the view, basically to translate the 
  // numeric constants in dropdowns to their text representation. 
  //
  // FIXME: The NativeScript action dialog doesn't seem to support
  // a separate title and value. At least none is documented.

  private config : any = {};

  // setting to string maps

  private locationProviderMap : any = {
    DISTANCE_FILTER_PROVIDER: 0,
    ACTIVITY_PROVIDER: 1,
    RAW_PROVIDER: 2
  };

  private desiredAccuracyMap : any = {
    HIGH_ACCURACY : 0,
    MEDIUM_ACCURACY: 100,
    LOW_ACCURACY: 1000,
    PASSIVE_ACCURACY: 10000
  };
  
  // flag to work around change event being called when it should not be.

  private initialized : boolean = false;

  constructor(
    private routerExtensions: RouterExtensions,
    private locationsService: LocationsService
  ) {

   // get the configuration currently stored in the plugin.

   this.locationsService.getConfig().then( ( config ) => {
     this.pluginConfig = config;

     this.config = config;

     this.config.locationProvider = this.propertyToString( 'locationProvider', this.config.locationProvider );
     this.config.desiredAccuracy = this.propertyToString( 'desiredAccuracy', this.config.desiredAccuracy );

     console.log( "SettingsPageComponent::constructor(): got configuration:", this.config );

   });

/*
   // For TESTING:

   this.config.locationProvider = 'DISTANCE_FILTER_PROVIDER';
   this.config.desiredAccuracy = 'MEDIUM_ACCURACY';
   this.config.stationaryRadius = '50';
   this.config.distanceFilter = '500';
   this.config.stopOnTerminate = true;
   this.config.startOnBoot = false;
   this.config.interval = 60000;
   this.config.fatestInterval = 120000;
   this.config.activitiesInterval = 10000;
   this.config.stopOnStillActivity = true;
   this.config.notificationsEnabled = true;
   this.config.startForeground = false;
   this.config.notificationTitle = "Background tracking";
   this.config.notificationText = "ENABLED";
   this.config.notificationIconColor = "#4CAF50";
   this.config.notificationIconLarge = "";
   this.config.notificationIconSmall = "";

   this.config.activityType = 'OtherNavigation';
   this.config.pauseLocationUpdates = false;
   this.config.saveBatteryOnBackground = false;

   this.config.url = '';
   this.config.syncUrl = '';
   this.config.syncThreshold = '100';
   this.config.httpHeaders = '{}';

   this.config.maxLocations = '10000';
   this.config.postTemplate = '';
*/

  }

  // ---------------------------------------------------------

  /**
  * on init
  */

  ngOnInit(): void {
  }

  // ----------------------------------------------------------

  /**
  * after view init
  */

  ngAfterViewInit(): void {
    this.initialized = true;
  }

  // ----------------------------------------------------------

  /**
  * convert config values to strings
  *
  * The NativeScript action dialog does not seem to support the concept of values.
  *
  * This method converts the numeric selection into it's corresponding string.
  *
  * @param {string} property the setting 
  * @param {number} value the numeric value
  *
  * @return {string} the string representation of the value
  */

  propertyToString( property, value ) {

    let entries: any;

    switch( property ) {

      case 'locationProvider':

        entries = this.objectEntries( this.locationProviderMap );

        for ( let i = 0; i < entries.length; i++ ) {
          if ( entries[i][1] == value ) {
            return entries[i][0];
          }
        }

      break;

      case 'desiredAccuracy':

        entries = this.objectEntries( this.desiredAccuracyMap );

        for ( let i = 0; i < entries.length; i++ ) {
          if ( entries[i][1] == value ) {
            return entries[i][0];
          }
        }

      break;

    }

  }

  // ----------------------------------------------------------

  /**
  * convert property strings to values
  *
  * The NativeScript action dialog does not seem to support the concept of values.
  *
  * This method converts the string selectiont to it's corresponding numeric value
  *
  * @param {string} property the setting 
  * @param {string} string value
  *
  * @return {number} the numeric representation of the value
  */

  stringToProperty( property, value ) {

    let entries: any;

    switch( property ) {

      case 'locationProvider':

        entries = this.objectEntries( this.locationProviderMap );

        for ( let i = 0; i < entries.length; i++ ) {
          if ( entries[i][0] == value ) {
            return entries[i][1];
          }
        }

      break;

      case 'desiredAccuracy':

        entries = this.objectEntries( this.desiredAccuracyMap );

        for ( let i = 0; i < entries.length; i++ ) {
          if ( entries[i][0] == value ) {
            return entries[i][1];
          }
        }

      break;

    }

  }

  // ----------------------------------------------------------

  /**
  * select provider type
  */

  onLocationProviderTap() {

    let options = {
      title: "Location Provider",
      message: "Select the provider to use.",
      cancelButtonText: "Cancel",
      actions: [ 
        "DISTANCE_FILTER_PROVIDER", 
        "ACTIVITY_PROVIDER",
        "RAW_PROVIDER"
      ]
    };

    action( options ).then( (result) => {

      if ( result != 'Cancel' ) {
        this.config.locationProvider = result;

        // update the config.

        this.locationsService.configure( { locationProvider: this.stringToProperty( 'locationProvider', result ) } );

      }

    });

  }

  // ----------------------------------------------------------

  /**
  * select desired accuracy
  */

  onDesiredAccuracyTap() {

    let options = {
      title: "Desired Accuracy",
      message: "Select the Desired Accuracy.",
      cancelButtonText: "Cancel",
      actions: [ 
        "HIGH_ACCURACY", 
        "MEDIUM_ACCURACY",
        "LOW_ACCURACY",
        "PASSIVE_ACCURACY"
      ]
    };

    action( options ).then( (result) => {
      console.log( "result is:", result );

      if ( result != 'Cancel' ) {
        this.config.desiredAccuracy = result;

        this.locationsService.configure( { desiredAccuracy: this.stringToProperty( 'desiredAccuracy', result ) } );

      }

    });

  }

  // -----------------------------------------------------

  /**
  * stationary radius
  */

  onStationaryRadius( args ) {
    let textField = <TextField>args.object;
    this.config.stationaryRadius = Number( textField.text );

    this.locationsService.configure( { stationaryRadius: this.config.stationaryRadius } );

  }

  // -----------------------------------------------------

  onDebugCheckedChange(args: EventData) {

    console.log( "SettingsPageComponent::onDebugCheckedChange(): top" );

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onDebugCheckedChange(): view not yet initialized. Ignoring." );
      return;
    }

    let debugSwitch = args.object as Switch;
    this.config.debug = Boolean( debugSwitch.checked ); // boolean

    this.locationsService.configure( { debug: this.config.debug } );

  }

  // -----------------------------------------------------

  /**
  * distance filter
  */

  onDistanceFilter( args ) {
    let textField = <TextField>args.object;
    this.config.distanceFilter = Number( textField.text );

    this.locationsService.configure( { distanceFilter: this.config.distanceFilter } );

  }

  // -----------------------------------------------------

  /**
  *
  * @todo Under iOS it seems that because the default setting is 'true' this event is * fired when the page first renders. 
  */

  onStopOnTerminateChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onStopTerminateChange(): view not yet initialized. Ignoring." );
      return;
    }

    console.log( "SettingsPageComponent::onStopOnTerminateChange(): top" );

    let stopSwitch = args.object as Switch;
    this.config.stopOnTerminate = Boolean( stopSwitch.checked ); // boolean

    this.locationsService.configure( { stopOnTerminate: this.config.stopOnTerminate } );

  }

  // -----------------------------------------------------

  onStartOnBootChange(args: EventData) {

    console.log( "SettingsPageComponent::onStartOnBootChange(): top" );

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onStartOnBootChange(): view not yet initialized. Ignoring." );
      return;
    }

    let startSwitch = args.object as Switch;
    this.config.startOnBoot = startSwitch.checked; // boolean

    this.locationsService.configure( { startOnBoot: this.config.startOnBoot } );

  }

  // -----------------------------------------------------

  /**
  * interval
  */

  onInterval( args ) {
    let textField = <TextField>args.object;
    this.config.interval = Number( textField.text );

    this.locationsService.configure( { interval: this.config.interval } );

  }

  // -----------------------------------------------------

  /**
  * fastest interval
  */

  onFastestInterval( args ) {
    let textField = <TextField>args.object;
    this.config.fastestInterval = Number( textField.text );

    this.locationsService.configure( { fastestInterval: this.config.fastestInterval } );

  }

  // -----------------------------------------------------

  /**
  * activities interval
  */

  onActivitiesInterval( args ) {
    let textField = <TextField>args.object;
    this.config.activitiesInterval = Number( textField.text );

    this.locationsService.configure( { activitiesInterval: this.config.activitiesInterval } );

  }

  // -----------------------------------------------------

  onStopOnStillActivityChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onStopOnStillActivityChange(): view not yet initialized. Ignoring." );
      return;
    }

    let stopSwitch = args.object as Switch;
    this.config.stopOnStillActivity = stopSwitch.checked; // boolean

    this.locationsService.configure( { stopOnStillActivity: this.config.stopOnStillActivity } );

  }

  // -----------------------------------------------------

  onNotificationsEnabledChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onNotificationsEnabledChange(): view not yet initialized. Ignoring." );
      return;
    }

    let switchElem = args.object as Switch;
    this.config.notificationsEnabled = switchElem.checked; // boolean
    this.locationsService.configure( { notificationsEnabled: this.config.notificationsEnabled } );
  }

  // -----------------------------------------------------

  onStartForegroundChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onStartForegroundChange(): view not yet initialized. Ignoring." );
      return;
    }

    let switchElem = args.object as Switch;
    this.config.startForeground = switchElem.checked; // boolean

    this.locationsService.configure( { startForeground: this.config.startForeground } );

  }

  // -----------------------------------------------------

  /**
  * notification title
  */

  onNotificationTitle( args ) {
    let textField = <TextField>args.object;
    this.config.notificationTitle = textField.text;

    this.locationsService.configure( { notificationTitle: this.config.notificationTitle } );

  }

  // -----------------------------------------------------

  /**
  * notification text
  */

  onNotificationText( args ) {
    let textField = <TextField>args.object;
    this.config.notificationText = textField.text;

    this.locationsService.configure( { notificationText: this.config.notificationText } );

  }

  // -----------------------------------------------------

  /**
  * notification icon color
  */

  onNotificationIconColor( args ) {
    let textField = <TextField>args.object;
    this.config.notificationIconColor = textField.text;

    this.locationsService.configure( { notificationIconColor: this.config.notificationIconColor } );

  }

  // -----------------------------------------------------

  /**
  * notification icon large
  */

  onNotificationIconLarge( args ) {
    let textField = <TextField>args.object;
    this.config.notificationIconLarge = textField.text;

    this.locationsService.configure( { notificationIconLarge: this.config.notificationIconLarge } );

  }

  // -----------------------------------------------------

  /**
  * notification icon small
  */

  onNotificationIconSmall( args ) {
    let textField = <TextField>args.object;
    this.config.notificationIconSmall = textField.text;

    this.locationsService.configure( { notificationIconSmall: this.config.notificationIconSmall } );

  }

  // ----------------------------------------------------------

  /**
  * select activity type
  */

  onActivityTypeTap() {

    let options = {
      title: "Activity Type (iOS Only)",
      message: "Select the activity algorithm to use.",
      cancelButtonText: "Cancel",
      actions: [ 
        "AutomotiveNavigation", 
        "OtherNavigation",
        "Fitness",
        "Other"
      ]
    };

    action( options ).then( (result) => {
      console.log( "result is:", result );

      if ( result != 'Cancel' ) {
        this.config.activityType = result;

        this.locationsService.configure( { activityType: this.config.activityType } );

      }

    });

  }

  // -----------------------------------------------------

  onPauseLocationUpdatesChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onPauseLocationUpdatesChange(): view not yet initialized. Ignoring." );
      return;
    }

    let switchElem = args.object as Switch;
    this.config.pauseLocationUpdates = switchElem.checked; // boolean
    this.locationsService.configure( { pauseLocationUpdates: this.config.pauseLocationUpdates } );

  }

  // -----------------------------------------------------

  onSaveBatteryOnBackgroundChange(args: EventData) {

    if ( ! this.initialized ) {
      console.log( "SettingsPageComponent::onSaveBatteryOnBackgroundChange(): view not yet initialized. Ignoring." );
      return;
    }

    let switchElem = args.object as Switch;
    this.config.saveBatteryOnBackground = switchElem.checked; // boolean
    this.locationsService.configure( { saveBatteryOnBackground: this.config.saveBatteryOnBackground } );
  }

  // -----------------------------------------------------

  /**
  * url
  */

  onUrl( args ) {
    let textField = <TextField>args.object;
    this.config.url = textField.text;

    this.locationsService.configure( { url: this.config.url } );

  }

  // -----------------------------------------------------

  /**
  * sync url
  */

  onSyncUrl( args ) {
    let textField = <TextField>args.object;
    this.config.syncUrl = textField.text;

    this.locationsService.configure( { syncUrl: this.config.syncUrl } );

  }

  // -----------------------------------------------------

  /**
  * onSyncThreshold
  */

  onSyncThreshold( args ) {
    let textField = <TextField>args.object;
    this.config.syncThreshold = Number( textField.text );

    this.locationsService.configure( { syncThreshold: this.config.syncThreshold } );

  }

  // -----------------------------------------------------

  /**
  * http headers
  */

  onHttpHeaders( args ) {
    let textField = <TextField>args.object;
    this.config.httpHeaders = textField.text;

    this.locationsService.configure( { httpHeaders: this.config.httpHeaders } );

  }

  // -----------------------------------------------------

  /**
  * maxLocations
  */

  onMaxLocations( args ) {
    let textField = <TextField>args.object;

    console.log( "textField text is '" + textField.text + "'" );

    this.config.maxLocations = Number( textField.text );

    this.locationsService.configure( { maxLocations: this.config.maxLocations } );

  }
  // -----------------------------------------------------

  /**
  * postTemplate
  */

  onPostTemplate( args ) {
    let textField = <TextField>args.object;
    this.config.postTemplate = textField.text;

    this.locationsService.configure( { postTemplate: this.config.postTemplate } );

  }


  // -----------------------------------------------------

  public back() {
    this.routerExtensions.backToPreviousPage();
  }

  // ------------------------------------------------------

  /**
  */

  objectEntries( obj ) {
    let ownProps = Object.keys( obj );
    let i = ownProps.length;
    let resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    
    return resArray;
  }

} // END
