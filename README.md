# @Yermo/nativescript-background-geolocation-fbs

** THIS IS A WORK IN PROGRESS **

This is a port of https://github.com/mauron85/cordova-plugin-background-geolocation to NativeScript. This version of the
API relies heavily on promises instead of the callback structure used by the cordova plugin. See API below.

The majority of this documentation comes from the cordova plugin repository managed by @mauron85.

## Running the demo

I've put together a demo using NativeScript + Angular in ./ngdemo that loads the plugin and displays the raw data of
the current location.

You must have NativeScript installed and the 'tns' command must be in your path.

To run it on Android in an emulator:

```
cd src
npm run ngdemo.android
```

### Running the demo on a live device with simulated location data

Simulating GPS locations in the Android emulator, at least in my experience under Ubuntu, is ridiculously
slow so I use a real device for testing.

To simulate GPS locations on a live device I have been using the "Lockito" app which seems to work.

https://play.google.com/store/apps/details?id=fr.dvilleneuve.lockito&hl=en_US

If you are under Linux or MacOSX, there is a script in ./etc/fake_gps.sh that will 
feed locations to the lockito app for testing. You must have the Android SDK installed and
the 'adb' command must be in your path.

- connect your device via USB
- open the lockito app 
- press start in the lockito app
- cd src; npm run build
- cd ../ngdemo
- tns run android
- press the 'START' button in the ngdemo app
- in another terminal window run ./etc/fake_gps.sh

You should see the location data update.

*** iOS support is currently not implemented but I will get to that soon. ***

## Submitting issues

All new issues should follow instructions in [ISSUE_TEMPLATE.md](/ISSUE_TEMPLATE.md).
A properly filled issue report will significantly reduce number of follow up questions and decrease issue resolving time.
Most issues cannot be resolved without debug logs. Please try to isolate debug lines related to your issue.
Instructions for how to prepare debug logs can be found in section [Debugging](#debugging).
If you're reporting an app crash, debug logs might not contain all the necessary information about the cause of the crash.
In that case, also provide relevant parts of output of `adb logcat` command.

# Android background service issues

There are repeatedly reported issues with some android devices not working in the background. Check if your device model is on  [dontkillmyapp list](https://dontkillmyapp.com) before you report new issue. For more information check out [dontkillmyapp.com](https://dontkillmyapp.com/problem).

## Description

Cross-platform geolocation for NativeScript on iOS and Android with battery-saving "circular region monitoring" and "stop detection".

This plugin can be used for geolocation when the app is running in the foreground or background. It provides features that focus on limiting battery drain.

You can choose from three location location providers:
* **DISTANCE_FILTER_PROVIDER**
* **ACTIVITY_PROVIDER**
* **RAW_PROVIDER**

See [Which provider should I use?](/PROVIDERS.md) for more information about providers.

## Example Application

This repository contains a sample NativeScript/Angular app in the ngdemo directory which demonstrates how to use the plugin.

To build the sample application:

```
cd src
npm run ngdemo.android
-or-
npm run ngdemo.ios
```

## Installing the plugin - NOT COMPLETE

```
tns plugin add @Yermo/nativescript-background-geolocation-fbs
```

You may also want to change default iOS permission prompts and set specific google play version and android support library version for compatibility with other plugins.

**FIXME:** Add instructions for AndroidManifest.xml and app.gradle

### Android
You will need to ensure that you have the following items installed through the Android SDK Manager:

| Name                       | Version |
|----------------------------|---------|
| Android SDK Tools          | 26.0.2  |
| Android SDK Platform-tools | 26.0.2  |
| Android SDK Build-tools    | 26.0.2  |
| Android Support Repository | 47      |
| Android Support Library    | 26.1.0  |
| Google Play Services       | 11.8.0  |
| Google Repository          | 58      |

Android is no longer supporting downloading support libraries through the SDK Manager.
The support libraries are now available through Google's Maven repository.

## Example

```typescript
  BackgroundGeolocationFbs.configure({
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    debug: true,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    url: 'http://192.168.81.15:3000/location',
    httpHeaders: {
      'X-FOO': 'bar'
    },
    // customize post properties
    postTemplate: {
      lat: '@latitude',
      lon: '@longitude',
      foo: 'bar' // you can also add your own properties
    }
  }).then( () => {

    BackgroundGeolocation.on('location', ( location ) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task

      BackgroundGeolocation.startTask().then( (taskKey) => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(function() {
          var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
          if (showSetting) {
            return BackgroundGeolocation.showAppSettings();
          }
        }, 1000);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
      // you can also reconfigure service (changes will be applied immediately)
      BackgroundGeolocation.configure({ debug: true });
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
      BackgroundGeolocation.configure({ debug: false });
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus().then( (status) => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)

      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    }).catch( (error ) => {
      console.log( "checkStatus returned an error:", error );
    });

    // you can also just start without checking for status
    // BackgroundGeolocation.start();

    // Don't forget to remove listeners at some point!
    // BackgroundGeolocation.removeAllListeners();
  }

```

## API

### configure(options).then( success ).catch( fail )

Configure options:

| Parameter                 | Type              | Platform     | Description                                                                                                                                                                                                                                                                                                                                        | Provider*   | Default                    | 
|---------------------------|-------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|----------------------------|
| `locationProvider`        | `Number`          | all          | Set location provider **@see** [PROVIDERS](/PROVIDERS.md)                                                                                                                                                                                                                                                                                          | N/A         | DISTANCE\_FILTER\_PROVIDER | 
| `desiredAccuracy`         | `Number`          | all          | Desired accuracy in meters. Possible values [HIGH_ACCURACY, MEDIUM_ACCURACY, LOW_ACCURACY, PASSIVE_ACCURACY]. Accuracy has direct effect on power drain. Lower accuracy = lower power drain.                                                                                                                                                       | all         | MEDIUM\_ACCURACY           | 
| `stationaryRadius`        | `Number`          | all          | Stationary radius in meters. When stopped, the minimum distance the device must move beyond the stationary location for aggressive background-tracking to engage.                                                                                                                                                                                  | DIS         | 50                         | 
| `debug`                   | `Boolean`         | all          | When enabled, the plugin will emit sounds for life-cycle events of background-geolocation! See debugging sounds table.                                                                                                                                                                                                                             | all         | false                      | 
| `distanceFilter`          | `Number`          | all          | The minimum distance (measured in meters) a device must move horizontally before an update event is generated. **@see** [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/distanceFilter).        | DIS,RAW     | 500                        | 
| `stopOnTerminate`         | `Boolean`         | all          | Enable this in order to force a stop() when the application terminated (e.g. on iOS, double-tap home button, swipe away the app).                                                                                                                                                                                                                  | all         | true                       | 
| `startOnBoot`             | `Boolean`         | Android      | Start background service on device boot.                                                                                                                                                                                                                                                                                                           | all         | false                      | 
| `interval`                | `Number`          | Android      | The minimum time interval between location updates in milliseconds. **@see** [Android docs](http://developer.android.com/reference/android/location/LocationManager.html#requestLocationUpdates(long,%20float,%20android.location.Criteria,%20android.app.PendingIntent)) for more information.                                                    | all         | 60000                      | 
| `fastestInterval`         | `Number`          | Android      | Fastest rate in milliseconds at which your app can handle location updates. **@see** [Android  docs](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest.html#getFastestInterval()).                                                                                                                   | ACT         | 120000                     | 
| `activitiesInterval`      | `Number`          | Android      | Rate in milliseconds at which activity recognition occurs. Larger values will result in fewer activity detections while improving battery life.                                                                                                                                                                                                    | ACT         | 10000                      | 
| `stopOnStillActivity`     | `Boolean`         | Android      | @deprecated stop location updates, when the STILL activity is detected                                                                                                                                                                                                                                                                             | ACT         | true                       | 
| `notificationsEnabled`    | `Boolean`         | Android      | Enable/disable local notifications when tracking and syncing locations                                                                                                                                                                                                                                                                             | all         | true                       |
| `startForeground`         | `Boolean`         | Android      | Allow location sync service to run in foreground state. Foreground state also requires a notification to be presented to the user.                                                                                                                                                                                                                 | all         | false                      |
| `notificationTitle`       | `String` optional | Android      | Custom notification title in the drawer. (goes with `startForeground`)                                                                                                                                                                                                                                                                             | all         | "Background tracking"      | 
| `notificationText`        | `String` optional | Android      | Custom notification text in the drawer. (goes with `startForeground`)                                                                                                                                                                                                                                                                              | all         | "ENABLED"                  | 
| `notificationIconColor`   | `String` optional | Android      | The accent color to use for notification. Eg. **#4CAF50**. (goes with `startForeground`)                                                                                                                                                                                                                                                           | all         |                            | 
| `notificationIconLarge`   | `String` optional | Android      | The filename of a custom notification icon. **@see** Android quirks. (goes with `startForeground`)                                                                                                                                                                                                                                                 | all         |                            | 
| `notificationIconSmall`   | `String` optional | Android      | The filename of a custom notification icon. **@see** Android quirks. (goes with `startForeground`)                                                                                                                                                                                                                                                 | all         |                            | 
| `activityType`            | `String`          | iOS          | [AutomotiveNavigation, OtherNavigation, Fitness, Other] Presumably, this affects iOS GPS algorithm. **@see** [Apple docs](https://developer.apple.com/library/ios/documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instp/CLLocationManager/activityType) for more information | all         | "OtherNavigation"          | 
| `pauseLocationUpdates`    | `Boolean`         | iOS          | Pauses location updates when app is paused. **@see* [Apple docs](https://developer.apple.com/documentation/corelocation/cllocationmanager/1620553-pauseslocationupdatesautomatical?language=objc)                                                                                                                                                  | all         | false                      | 
| `saveBatteryOnBackground` | `Boolean`         | iOS          | Switch to less accurate significant changes and region monitory when in background                                                                                                                                                                                                                                                                 | all         | false                      | 
| `url`                     | `String`          | all          | Server url where to send HTTP POST with recorded locations **@see** [HTTP locations posting](#http-locations-posting)                                                                                                                                                                                                                              | all         |                            | 
| `syncUrl`                 | `String`          | all          | Server url where to send fail to post locations **@see** [HTTP locations posting](#http-locations-posting)                                                                                                                                                                                                                                         | all         |                            | 
| `syncThreshold`           | `Number`          | all          | Specifies how many previously failed locations will be sent to server at once                                                                                                                                                                                                                                                                      | all         | 100                        | 
| `httpHeaders`             | `Object`          | all          | Optional HTTP headers sent along in HTTP request                                                                                                                                                                                                                                                                                                   | all         |                            | 
| `maxLocations`            | `Number`          | all          | Limit maximum number of locations stored into db                                                                                                                                                                                                                                                                                                   | all         | 10000                      | 
| `postTemplate`            | `Object\|Array`   | all          | Customization post template **@see** [Custom post template](#custom-post-template)                                                                                                                                                                                                                                                                 | all         |                            | 

\*
DIS = DISTANCE\_FILTER\_PROVIDER
ACT = ACTIVITY\_PROVIDER
RAW = RAW\_PROVIDER


Partial reconfiguration is possible by later providing a subset of the configuration options:

```
BackgroundGeolocation.configure({
  debug: true
});
```

In this case new configuration options will be merged with stored configuration options and changes will be applied immediately.

**Important:** Because configuration options are applied partially, it's not possible to reset an option to its default value just by emitting it's key name and calling `configure` method. To reset a configuration option to the default value, it's key must be set to `null`!

```
// Example: reset postTemplate to default
BackgroundGeolocation.configure({
  postTemplate: null
});
```

### getConfig().then( (config) => { successFn } ).catch( ( error ) => {failFn} );
Platform: iOS, Android

Get current configuration. Method will return a promise that resolves with all configuration options and their values.
Because `configure` method can be called with subset of the configuration options only,
`getConfig` method can be used to check the actual applied configuration.

```
BackgroundGeolocation.getConfig().then( (config) => {
  console.log(config);
});
```

### start().then( () => { successFn } ).catch( ( error ) => { errorFn } );
Platform: iOS, Android

Start background geolocation.

### stop().then( () => { successFn } ).catch( ( error ) => { errorFn } );
Platform: iOS, Android

Stop background geolocation.

### getCurrentLocation( timeout : number, maxAge : number, enableHighAccuracy : boolean ).then( ( location ) => { successFn } ).catch( (error) => {errorFn} );

Platform: iOS, Android

One time location check to get current location of the device.

| Option parameter           | Type      | Description                                                                            |
|----------------------------|-----------|----------------------------------------------------------------------------------------|
| `timeout`                  | `Number`  | Maximum time in milliseconds device will wait for location                             |
| `maximumAge`               | `Number`  | Maximum age in milliseconds of a possible cached location that is acceptable to return |
| `enableHighAccuracy`       | `Boolean` | if true and if the device is able to provide a more accurate position, it will do so   |

| Promise resolves           | Type      | Description                                                    |
|----------------------------|-----------|----------------------------------------------------------------|
| `location`                 | `Object`  | location object (@see [Location event](#location-event))       |

| Promise rejection          | Type      | Description                                                    |
|----------------------------|-----------|----------------------------------------------------------------|
| `code`                     | `Number`  | Reason of an error occurring when using the geolocating device |
| `message`                  | `String`  | Message describing the details of the error                    |

Error codes:

| Value | Associated constant  | Description                                                              |
|-------|----------------------|--------------------------------------------------------------------------|
| 1     | PERMISSION_DENIED    | Request failed due missing permissions                                   |
| 2     | LOCATION_UNAVAILABLE | Internal source of location returned an internal error                   |
| 3     | TIMEOUT              | Timeout defined by `option.timeout was exceeded                          |

### checkStatus().then( (status) => { successFn} ).catch( ( error ) => { errorFn } );

Check status of the service

| Success callback parameter | Type      | Description                                          |
|----------------------------|-----------|------------------------------------------------------|
| `isRunning`                | `Boolean` | true/false (true if service is running)              |
| `locationServicesEnabled`  | `Boolean` | true/false (true if location services are enabled)   |
| `authorization`            | `Number`  | authorization status                                 |

Authorization statuses:

* NOT_AUTHORIZED
* AUTHORIZED - authorization to run in background and foreground
* AUTHORIZED_FOREGROUND iOS only authorization to run in foreground only

Note: In the Android concept of authorization, these represent application permissions.

### showAppSettings()
Platform: Android >= 6, iOS >= 8.0

Show app settings to allow change of app location permissions.

### showLocationSettings()
Platform: Android

Show system settings to allow configuration of current location sources.

### getLocations().then( ( locations ) => { successFn }).catch( (error) => { errorFn } );
Platform: iOS, Android

Method will return all stored locations.
This method is useful for initial rendering of user location on a map just after application launch.

| resolve                    | Type    | Description                    |
|----------------------------|---------|--------------------------------|
| `locations`                | `Array` | collection of stored locations |

```typecript
BackgroundGeolocation.getLocations()
.then( (locations) => {
  console.log(locations);
});
```

### getValidLocations().then( (locations) => { successFn }).catch( (error) => { errorFn } );

Platform: iOS, Android

Method will return locations which have not yet been posted to server.

| resolve                    | Type    | Description                    |
|----------------------------|---------|--------------------------------|
| `locations`                | `Array` | collection of stored locations |

### deleteLocation( locationId : number ).then( ()=> {successFn} ).catch( (error) => {errorFn} );
Platform: iOS, Android

Delete location with locationId.

### deleteAllLocations().then( () => { successFn } ).catch( (error) => { errorFn });

**Note:** You don't need to delete all locations. The plugin manages the number of stored locations automatically and the total count never exceeds the number as defined by `option.maxLocations`.

Platform: iOS, Android

Delete all stored locations.

**FIXME:** Locations are not actually deleted from database to avoid gaps in locationId numbering.
Instead locations are marked as deleted. Locations marked as deleted will not appear in output of `BackgroundGeolocation.getValidLocations`.

### switchMode(modeId).then( () => { successFn } ).catch( (error) => { errorFn } );

Platform: iOS

Normally the plugin will handle switching between **BACKGROUND** and **FOREGROUND** mode itself.
Calling switchMode you can override plugin behavior and force it to switch into other mode.

In **FOREGROUND** mode the plugin uses iOS local manager to receive locations and behavior is affected
by `option.desiredAccuracy` and `option.distanceFilter`.

In **BACKGROUND** mode plugin uses significant changes and region monitoring to receive locations
and uses `option.stationaryRadius` only.

```
// switch to FOREGROUND mode
BackgroundGeolocation.switchMode(BackgroundGeolocation.FOREGROUND_MODE);

// switch to BACKGROUND mode
BackgroundGeolocation.switchMode(BackgroundGeolocation.BACKGROUND_MODE);
```

### forceSync()
Platform: Android, iOS

Force sync of pending locations. Option `syncThreshold` will be ignored and
all pending locations will be immediately posted to `syncUrl` in single batch.

### getLogEntries(limit, fromId, minLevel).then( ( entries ) => { successFn } ).catch( (error) => { errorFn });
Platform: Android, iOS

Return all logged events. Useful for plugin debugging.

| Parameter  | Type          | Description                                                                                       |
|------------|---------------|---------------------------------------------------------------------------------------------------|
| `limit`    | `Number`      | limits number of returned entries                                                                 |
| `fromId`   | `Number`      | return entries after fromId. Useful if you plan to implement infinite log scrolling*              |
| `minLevel` | `String`      | return log entries above level. Available levels: ["TRACE", "DEBUG", "INFO", "WARN", "ERROR]      |

Format of log entry:

| Parameter   | Type          | Description                                                                                       |
|-------------|---------------|---------------------------------------------------------------------------------------------------|
| `id`        | `Number`      | id of log entry as stored in db                                                                   |
| `timestamp` | `Number`      | timestamp in milliseconds since beginning of UNIX epoch                                           |
| `level`     | `String`      | log level                                                                                         |
| `message`   | `String`      | log message                                                                                       |
| `stackTrace`| `String`      | recorded stacktrace (Android only, on iOS part of message)                                        |

### removeAllListeners()

Unregister all event listeners for given event. If parameter `event` is not provided then all event listeners will be removed.

## Events

| Name                | Callback param         | Platform     | Provider*   | Description                                      |
|---------------------|------------------------|--------------|-------------|--------------------------------------------------|
| `location`          | `Location`             | all          | all         | on location update                               |
| `stationary`        | `Location`             | all          | DIS,ACT     | on device entered stationary mode                |
| `activity`          | `Activity`             | Android      | ACT         | on activity detection                            |
| `error`             | `{ code, message }`    | all          | all         | on plugin error                                  |
| `authorization`     | `status`               | all          | all         | on user toggle location service                  |
| `start`             |                        | all          | all         | geolocation has been started                     |
| `stop`              |                        | all          | all         | geolocation has been stopped                     |
| `foreground`        |                        | Android      | all         | app entered foreground state (visible)           |
| `background`        |                        | Android      | all         | app entered background state                     |
| `abort_requested`   |                        | all          | all         | server responded with "285 Updates Not Required" |
| `http_authorization`|                        | all          | all         | server responded with "401 Unauthorized"         |

### Location event
| Location parameter     | Type      | Description                                                            |
|------------------------|-----------|------------------------------------------------------------------------|
| `id`                   | `Number`  | ID of location as stored in DB (or null)                               |
| `provider`             | `String`  | gps, network, passive or fused                                         |
| `locationProvider`     | `Number`  | location provider                                                      |
| `time`                 | `Number`  | UTC time of this fix, in milliseconds since January 1, 1970.           |
| `latitude`             | `Number`  | Latitude, in degrees.                                                  |
| `longitude`            | `Number`  | Longitude, in degrees.                                                 |
| `accuracy`             | `Number`  | Estimated accuracy of this location, in meters.                        |
| `speed`                | `Number`  | Speed if it is available, in meters/second over ground.                |
| `altitude`             | `Number`  | Altitude if available, in meters above the WGS 84 reference ellipsoid. |
| `bearing`              | `Number`  | Bearing, in degrees.                                                   |
| `isFromMockProvider`   | `Boolean` | (android only) True if location was recorded by mock provider          |
| `mockLocationsEnabled` | `Boolean` | (android only) True if device has mock locations enabled               |

Locations parameters `isFromMockProvider` and `mockLocationsEnabled` are not posted to `url` or `syncUrl` by default.
Both can be requested via option `postTemplate`.

Note: Do not use location `id` as unique key in your database as ids will be reused when `option.maxLocations` is reached.

### Activity event
| Activity parameter | Type      | Description                                                            |
|--------------------|-----------|------------------------------------------------------------------------|
| `confidence`       | `Number`  | Percentage indicating the likelihood user is performing this activity. |
| `type`             | `String`  | "IN_VEHICLE", "ON_BICYCLE", "ON_FOOT", "RUNNING", "STILL",             |
|                    |           | "TILTING", "UNKNOWN", "WALKING"                                        |


Event listeners can registered with:

```
const eventSubscription = BackgroundGeolocation.on('event', callbackFn);
```

And unregistered:

```
eventSubscription.remove();
```

**Note:** Components should unregister all event listeners in `componentWillUnmount` method,
individually, or with `removeAllListeners`

## HTTP locations posting

All locations updates are recorded in the local db at all times. When the App is in foreground or background, in addition to storing location in local db,
the location callback function is triggered. The number of locations stored in db is limited by `option.maxLocations` and never exceeds this number.
Instead, old locations are replaced by new ones.

When `option.url` is defined, each location is also immediately posted to url defined by `option.url`.
If the post is successful, the location is marked as deleted in local db.

When `option.syncUrl` is defined, all locations that fail to post locations will be coalesced and sent in some time later in a one single batch.
Batch sync takes place only when the number of failed-to-post locations reaches `option.syncTreshold`.
Locations are sent only in single batch, when the number of locations reaches `option.syncTreshold`. (No individual locations will be sent)

The request body of posted locations is always an array, even when only one location is sent.

Warning: `option.maxLocations` has to be larger than `option.syncThreshold`. It's recommended to be 2x larger. In any other case the location syncing might not work properly.

## Custom post template

With `option.postTemplate` it is possible to specify which location properties should be posted to `option.url` or `option.syncUrl`. This can be useful to reduce
the number of bytes sent "over the wire".

All wanted location properties have to be prefixed with `@`. For all available properties check [Location event](#location-event).

Two forms are supported:

**jsonObject**

```
BackgroundGeolocation.configure({
  postTemplate: {
    lat: '@latitude',
    lon: '@longitude',
    foo: 'bar' // you can also add your own properties
  }
});
```

**jsonArray**
```
BackgroundGeolocation.configure({
  postTemplate: ['@latitude', '@longitude', 'foo', 'bar']
});
```

Note: Keep in mind that all locations (even a single one) will be sent as an array of object(s), when postTemplate is `jsonObject` and array of array(s) for `jsonArray`!

### Android Headless Task (Experimental)

A special task that gets executed when the app is terminated, but the plugin was configured to continue running in the background (option `stopOnTerminate: false`).
In this scenario the [Activity](https://developer.android.com/reference/android/app/Activity.html)
was killed by the system and all registered event listeners will not be triggered until the app is relaunched.

**Note:** Prefer configuration options `url` and `syncUrl` over headless task. Use it sparingly!

#### Task event
| Parameter          | Type      | Description                                                            |
|--------------------|-----------|------------------------------------------------------------------------|
| `event.name`       | `String`  | Name of the event [ "location", "stationary", "activity" ]             |
| `event.params`     | `Object`  | Event parameters. @see [Events](#events)                               |

Keep in mind that the callback function lives in an isolated scope. Variables from a higher scope cannot be referenced!

Following example requires [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) enabled backend server.

```
BackgroundGeolocation.headlessTask(function(event) {
    if (event.name === 'location' ||
      event.name === 'stationary') {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://192.168.81.14:3000/headless');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(event.params));
    }

    return 'Processing event: ' + event.name; // will be logged
});
```

### Example of backend server

[Background-geolocation-server](https://github.com/mauron85/background-geolocation-server) is a backend server written in nodejs
with CORS - Cross-Origin Resource Sharing support.
There are instructions how to run it and simulate locations on Android, iOS Simulator and Genymotion.

## Quirks

### iOS

On iOS the plugin will execute your registered `.on('location', callbackFn)` callback function. You may manually POST the received ```Geolocation``` to your server using standard XHR. However for long running tasks, you need
to wrap your code in `startTask` - `endTask` block.

#### `stationaryRadius` (apply only for DISTANCE_FILTER_PROVIDER)

The plugin uses iOS Significant Changes API, and starts triggering ```callbackFn``` only when a cell-tower switch is detected (i.e. the device exits stationary radius). The function ```switchMode``` is provided to force the plugin to enter "BACKGROUND" stationary or "FOREGROUND" mode.

Plugin cannot detect the exact moment the device moves out of the stationary-radius.  In normal conditions, it can take as much as 3 city-blocks to 1/2 km before stationary-region exit is detected.

### Android

On Android devices it is recommended to have a notification in the drawer (option `startForeground:true`). This gives plugin location service higher priority, decreasing probability of OS killing it. Check [wiki](https://github.com/mauron85/cordova-plugin-background-geolocation/wiki/Android-implementation) for explanation.

#### Custom ROMs

Plugin should work with custom ROMS at least DISTANCE_FILTER_PROVIDER. But ACTIVITY_PROVIDER provider depends on Google Play Services.
Usually ROMs don't include Google Play Services libraries. Strange bugs may occur, like no GPS locations (only from network and passive) and other. When posting issue report, please mention that you're using custom ROM.

#### Multidex

**Note:** Following section was kindly copied from [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/INSTALLATION.md#multidex). Visit link for resolving issue with facebook plugin.

If you have an issue compiling the app and you're getting an error similar to this (`com.android.dex.DexException: Multiple dex files define`):

```
UNEXPECTED TOP-LEVEL EXCEPTION:
com.android.dex.DexException: Multiple dex files define Landroid/support/annotation/AnimRes;
  at com.android.dx.merge.DexMerger.readSortableTypes(DexMerger.java:596)
  at com.android.dx.merge.DexMerger.getSortedTypes(DexMerger.java:554)
  at com.android.dx.merge.DexMerger.mergeClassDefs(DexMerger.java:535)
  at com.android.dx.merge.DexMerger.mergeDexes(DexMerger.java:171)
  at com.android.dx.merge.DexMerger.merge(DexMerger.java:189)
  at com.android.dx.command.dexer.Main.mergeLibraryDexBuffers(Main.java:502)
  at com.android.dx.command.dexer.Main.runMonoDex(Main.java:334)
  at com.android.dx.command.dexer.Main.run(Main.java:277)
  at com.android.dx.command.dexer.Main.main(Main.java:245)
  at com.android.dx.command.Main.main(Main.java:106)
```

Then at least one other plugin you have installed is using an outdated way to declare dependencies such as `android-support` or `play-services-gcm`.
This causes gradle to fail, and you'll need to identify which plugin is causing it and request an update to the plugin author, so that it uses the proper way to declare dependencies for cordova.
See [this for the reference on the cordova plugin specification](https://cordova.apache.org/docs/en/5.4.0/plugin_ref/spec.html#link-18), it'll be usefull to mention it when creating an issue or requesting that plugin to be updated.

Common plugins to suffer from this outdated dependency management are plugins related to *facebook*, *google+*, *notifications*, *crosswalk* and *google maps*.

#### Android Permissions

Android 6.0 "Marshmallow" introduced a new permissions model where the user can turn on and off permissions as necessary. When user disallow location access permissions, error configure callback will be called with error code: 2.


#### Notification icons

**Note:** Only available for API Level >=21.

To use custom notification icons, you need to put icons into *res/drawable* directory **of your app**. You can automate the process  as part of **after_platform_add** hook configured via [config.xml](https://github.com/mauron85/cordova-plugin-background-geolocation-example/blob/master/config.xml). Check [config.xml](https://github.com/mauron85/cordova-plugin-background-geolocation-example/blob/master/config.xml) and [scripts/res_android.js](https://github.com/mauron85/cordova-plugin-background-geolocation-example/blob/master/scripts/res_android.js) of example app for reference.

If you only want a single large icon, set `notificationIconLarge` to null and include your icon's filename in the `notificationIconSmall` parameter.

With Adobe® PhoneGap™ Build icons must be placed into ```locales/android/drawable``` dir at the root of your project. For more information go to [how-to-add-native-image-with-phonegap-build](http://stackoverflow.com/questions/30802589/how-to-add-native-image-with-phonegap-build/33221780#33221780).

### Intel XDK

Plugin will not work in XDK emulator ('Unimplemented API Emulation: BackgroundGeolocation.start' in emulator). But will work on real device.

## Debugging

See [DEBUGGING.md](/DEBUGGING.md)

## Geofencing
There is nice cordova plugin [cordova-plugin-geofence](https://github.com/cowbell/cordova-plugin-geofence), which does exactly that. Let's keep this plugin lightweight as much as possible.

## Changelog

See [CHANGES.md](/CHANGES.md)

## Licence ##

[Apache License](http://www.apache.org/licenses/LICENSE-2.0)

Copyright (c) 2013 Christopher Scott, Transistor Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
