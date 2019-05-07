
# multiple declarations in ngdemo

Many hours were lost trying to track down the cause of:

```
Found peer TypeScript 3.1.6
node_modules/tns-core-modules/module.d.ts(70,5): error TS2300: Duplicate identifier 'markup'.
node_modules/tns-core-modules/module.d.ts(71,5): error TS2300: Duplicate identifier 'script'.
node_modules/tns-core-modules/module.d.ts(72,5): error TS2300: Duplicate identifier 'style'.
node_modules/tns-core-modules/tns-core-modules.d.ts(4,1): error TS6200: Definitions of the following identifiers conflict with those in another file: "audio", "beacon", "cspreport", "download", "embed", "eventsource", "favicon", "fetch", "font", "form", "frame", "hyperlink", "iframe", "image", "imageset", "import", "internal", "location", "manifest", "object", "ping", "plugin", "prefetch", "script", "serviceworker", "sharedworker", "subresource", "style", "track", "video", "worker", "xmlhttprequest", "xslt", HeaderInit, WeakRef
../src/node_modules/tns-core-modules/module.d.ts(70,5): error TS2300: Duplicate identifier 'markup'.
../src/node_modules/tns-core-modules/module.d.ts(71,5): error TS2300: Duplicate identifier 'script'.
../src/node_modules/tns-core-modules/module.d.ts(72,5): error TS2300: Duplicate identifier 'style'.
../src/node_modules/tns-core-modules/tns-core-modules.d.ts(4,1): error TS6200: Definitions of the following identifiers conflict with those in another file: "audio", "beacon", "cspreport", "download", "embed", "eventsource", "favicon", "fetch", "font", "form", "frame", "hyperlink", "iframe", "image", "imageset", "import", "internal", "location", "manifest", "object", "ping", "plugin", "prefetch", "script", "serviceworker", "sharedworker", "subresource", "style", "track", "video", "worker", "xmlhttprequest", "xslt", HeaderInit, WeakRef
../src/node_modules/tns-core-modules/tns-core-modules.d.ts(5,5): error TS2432: In an enum with multiple declarations, only one declaration can omit an initializer for its first enum element.
```

The above error would occur if I used the tsconfig.json created by the "tns create <...> --ng" template. Copying the tsconfig.json from the plugin seed demo seems to
have resolved this problem. However, the problem below occurred afterwards.

# Program type already present in ngdemo

```
D8: Program type already present: android.support.design.widget.CoordinatorLayout$SavedState

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:transformDexArchiveWithExternalLibsDexMergerForDebug'.
> com.android.builder.dexing.DexArchiveMergerException: Error while merging dex archives: 
  Learn how to resolve the issue at https://developer.android.com/studio/build/dependencies#duplicate_classes.
  Program type already present: android.support.design.widget.CoordinatorLayout$SavedState
```

See: https://github.com/NativeScript/android-runtime/issues/1158

Adding 

```
dependencies {
    debugImplementation "com.android.support:design:27.1.0"
}
```

to App_Resources/Android/app.gradle fixed this error but I suspect it will resurface.
