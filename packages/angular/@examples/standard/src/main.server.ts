import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Build-time entry point for prerendering (ANGEX-08). Only used by
// `ng build` to render static HTML per registered route; the deployed
// GitHub Pages site serves those static files with no Node server.
//
// The extractor passes a server `BootstrapContext` (platform) that must be
// forwarded to `bootstrapApplication`, otherwise route discovery fails with
// NG0401 (Missing Platform).
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
