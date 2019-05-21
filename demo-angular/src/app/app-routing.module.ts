import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { HomePageComponent } from "./pages/home/home-page.component";
import { DebugLogPageComponent } from "./pages/debuglog/debug-log-page.component";

const routes: Routes = [
    { path: "", redirectTo: "/locations", pathMatch: "full" },
    { path: "locations", component: HomePageComponent },
    { path: "debuglog", component: DebugLogPageComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
