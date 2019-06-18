import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomePageComponent } from "./pages/home/home-page.component";
import { DebugLogPageComponent } from "./pages/debuglog/debug-log-page.component";
import { LocationsPageComponent } from "./pages/locations/locations-page.component";
import { SettingsPageComponent } from "./pages/settings/settings-page.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomePageComponent },
    { path: "debuglog", component: DebugLogPageComponent },
    { path: "locations", component: LocationsPageComponent },
    { path: "settings", component: SettingsPageComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
