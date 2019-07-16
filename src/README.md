# typings

After making changes to the API of the underlying geolocations libraries, remember to regenerate the 
typings from the demo-angular directory:

$ TNS_TYPESCRIPT_DECLARATIONS_PATH="$(pwd}/typings" tns build ios (or android)

Then copy the platform specific BackgroundGeolocation typings file to the platform directory. 
