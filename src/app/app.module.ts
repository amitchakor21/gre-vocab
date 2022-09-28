import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {ConfigService} from "./api/config.service";
import {FormsModule} from "@angular/forms";
import {TestComponent} from './test/test.component';
import {SearchInputComponent} from './search-input/search-input.component';
import {VocabStore} from "./store/vocab-store.service";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {PaginatorModule} from "primeng/paginator";
import {CardModule} from "primeng/card";
import { InitialCardComponent } from './initial-card/initial-card.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SliderModule} from "primeng/slider";
import {FieldsetModule} from "primeng/fieldset";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    SearchInputComponent,
    InitialCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    PaginatorModule,
    CardModule,
    BrowserAnimationsModule,
    SliderModule,
    FieldsetModule,
    InputTextareaModule,
    ButtonModule
  ],
  providers: [ConfigService, VocabStore],
  bootstrap: [AppComponent]
})
export class AppModule {
}
