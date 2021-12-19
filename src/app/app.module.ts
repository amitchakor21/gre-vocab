import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FiltersSimpleComponent} from "./filters-simple/filters-simple.component";
import {ConfigService} from "./api/config.service";
import {FormsModule} from "@angular/forms";
import { Pallet1Component } from './pallet1/pallet1.component';

@NgModule({
  declarations: [
    AppComponent,
    FiltersSimpleComponent,
    Pallet1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
