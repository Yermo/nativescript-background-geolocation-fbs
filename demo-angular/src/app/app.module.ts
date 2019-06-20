import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { HomePageComponent } from "./pages/home/home-page.component";
import { DebugLogPageComponent } from "./pages/debuglog/debug-log-page.component";
import { LocationsPageComponent } from "./pages/locations/locations-page.component";
import { SettingsPageComponent } from "./pages/settings/settings-page.component";

import { LocationsListComponent } from "./components/locations-list/locations-list.component";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUIListViewModule 
    ],
    declarations: [
        AppComponent,
        HomePageComponent,
        LocationsListComponent,
        DebugLogPageComponent,
        LocationsPageComponent,
        SettingsPageComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/

export class AppModule { }
