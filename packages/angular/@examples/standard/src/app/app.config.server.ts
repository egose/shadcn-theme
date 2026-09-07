import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

// Server configuration for build-time prerendering (ANGEX-08 GitHub Pages
// routing contract). The application builder renders every registered route
// to static HTML from this config; no server bundle is deployed.
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
