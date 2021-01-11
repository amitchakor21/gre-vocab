import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {SharedComponentsButtonModule} from '@apps/shared/components/button';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedComponentsButtonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
