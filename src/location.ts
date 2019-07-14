/**
* Location 
*
* @link https://github.com/mauron85/cordova-plugin-background-geolocation#location-event
*/

export class Location {

  // ID of location as stored in DB (or null) 

  public id: number;

  // gps, network, passive or fused
 
  provider: string;

  // location provider
 
  locationProvider: number;

  // UTC time of this fix, in milliseconds since January 1, 1970. 

  timestamp:number;

  // Latitude, in degrees.
 
  latitude: number;

  // Longitude, in degrees.
 
  longitude: number;

  // Estimated accuracy of this location, in meters. 

  accuracy: number;

  // Speed if it is available, in meters/second over ground.

  speed: number;

  // Altitude if available, in meters above the WGS 84 reference ellipsoid.
 
  altitude: number;

  // Bearing, in degrees.
 
  bearing: number;

  // (android only) True if location was recorded by mock provider 

  isFromMockProvider: boolean;

  // (android only) True if device has mock locations enabled 

  mockLocationsEnabled: boolean;

}

// END
