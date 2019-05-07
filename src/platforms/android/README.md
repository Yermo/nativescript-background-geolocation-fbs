# External Libraries

It tooks some trial and error but it looks like all that's needed to include an external *.aar file is to copy it into
the platforms/android/libs directory. It gets pulled in automatically by the NativeScript android runtime during 'tns plugin build'

The background-geolocation-android library has a number of dependencies which do not get included in the generated aar file, however.

This is probably the reason the author of that library imports the library source into his cordova-plugin-background-geolocation and react-native-background-geolocation projects.
In those projects, the library is referenced as a git submodule and is pulled in via an include in settings.gradle. That approach, will not work here, I don't think, which is
why I have duplicated the gradle setup from the geolocation library here to pull in the required dependencies.

There has to be a better way.

# include.gradle weirdness

For some reason, comments in the gradle file are getting mangled. The following block:

```
// copied with edits from the background-geolocation-android project
//
// It looks like the dependencies for background-geolocation-android are not included in the generated
// aar file. By including all this mess here, it seems to work, however there has to be a cleaner way. 
 
// FIXME: I do not yet understand why I get "Could not get unknown property" if I structure the gradle file
// the way it is done in the background-geolocation-android project. I suspect it's because of how
// the NativeScript android platform processes gradle files.
```

generates the error:

```
FAILURE: Build failed with an exception.

* Where:
Build file '/tmp/android-project119319-10051-75dtcj.hst33/nativescript_background_geolocation_fbs/build.gradle' line: 103

* What went wrong:
Could not compile build file '/tmp/android-project119319-10051-75dtcj.hst33/nativescript_background_geolocation_fbs/build.gradle'.
> startup failed:
  build file '/tmp/android-project119319-10051-75dtcj.hst33/nativescript_background_geolocation_fbs/build.gradle': 103: expecting EOF, found 'for' @ line 103, column 14.
     dependencies for background-geolocation-android are not included in the generated */
```

# Android permissions and dependencies

* (Optional) Use AndroidManifest.xml to describe any permissions, features or other configuration specifics required or used by your plugin for Android. 
NOTE: The NativeScript CLI will not resolve any contradicting or duplicate entries during the merge. After the plugin is installed, you need to manually resolve such issues.

* (Optional) Use include.gradle configuration to describe any native dependencies. If there are no such, this file can be removed. For more information, see the [include.gradle Specification](http://docs.nativescript.org/plugins/plugins#includegradle-specification)


[Read more about nativescript plugins](http://docs.nativescript.org/plugins/plugins)
