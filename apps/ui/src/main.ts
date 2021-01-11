import {enableProdMode, isDevMode} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {EnvironmentService} from '@apps/shared/services';

import(
  /* webpackPrefetch: true */
  /* webpackIgnore: true */
  './environments/environment.js').then((module) => {
  const environment: EnvironmentService = module.environment;
  if (module.environment.production) {
    console.log(`Enabling prod mode...`);
    enableProdMode();
  } else {
    console.log(`Staying in dev mode...`);
  }

  console.log(`Initial load, isDevMode: `, isDevMode());
  platformBrowserDynamic([{provide: EnvironmentService, useValue: environment}]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
});

