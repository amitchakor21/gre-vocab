import { Component } from '@angular/core';
import {EnvironmentService} from '@apps/shared/services';


@Component({
  selector: 'apps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ui';
  public readonly environmentName: string = '';
  public readonly version: string = '';

  constructor(private environmentService: EnvironmentService){
    this.environmentName = environmentService.ENVIRONMENT_NAME;

    if (this.environmentService.VERSION) {
      this.version = `Version: ${this.environmentService.VERSION}`;
    }
  }
}
