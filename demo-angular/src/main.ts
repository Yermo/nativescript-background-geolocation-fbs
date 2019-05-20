// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import * as app from "tns-core-modules/application"; 

import { 
  android, 
  AndroidApplication, 
  AndroidActivityEventData, 
  AndroidActivityResultEventData, 
  AndroidActivityBundleEventData,
  AndroidActivityBackPressedEventData
} from "tns-core-modules/application";

import { AppModule } from "./app/app.module";

// -----------------------------------------------

// some log messages so the state changes of the app can be observed.

if (android) {

    android.on( AndroidApplication.activityCreatedEvent, function (args: AndroidActivityBundleEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity + ", Bundle: " + args.bundle);
    });

    android.on( AndroidApplication.activityDestroyedEvent, function (args: AndroidActivityEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
    });

    android.on( AndroidApplication.activityStartedEvent, function (args: AndroidActivityEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
    });

    android.on( AndroidApplication.activityPausedEvent, function (args: AndroidActivityEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
    });

    android.on( AndroidApplication.activityResumedEvent, function (args: AndroidActivityEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
    });

    android.on( AndroidApplication.activityStoppedEvent, function (args: AndroidActivityEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
    });

    android.on( AndroidApplication.saveActivityStateEvent, function (args: AndroidActivityBundleEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity + ", Bundle: " + args.bundle);
    });

    android.on( AndroidApplication.activityResultEvent, function (args: AndroidActivityResultEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity +
            ", requestCode: " + args.requestCode + ", resultCode: " + args.resultCode + ", Intent: " + args.intent);
    });

    android.on( AndroidApplication.activityBackPressedEvent, function (args: AndroidActivityBackPressedEventData ) {
        console.log("main: Event: " + args.eventName + ", Activity: " + args.activity);
        // Set args.cancel = true to cancel back navigation and do something custom.
    });
}

// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.

platformNativeScriptDynamic().bootstrapModule(AppModule);
