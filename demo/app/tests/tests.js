var BackgroundGeolocationFbs = require("nativescript-background-geolocation-fbs").BackgroundGeolocationFbs;
var backgroundGeolocationFbs = new BackgroundGeolocationFbs();

describe("greet function", function() {
    it("exists", function() {
        expect(backgroundGeolocationFbs.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(backgroundGeolocationFbs.greet()).toEqual("Hello, NS");
    });
});