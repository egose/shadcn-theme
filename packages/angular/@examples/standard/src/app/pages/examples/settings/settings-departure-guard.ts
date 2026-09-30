import type { CanDeactivateFn } from '@angular/router';
import type { SettingsExamplePage } from './settings';

// Angular can deactivate a recognized route before an outlet instantiates it.
// With no page instance there is no local draft to protect.
export const settingsDepartureGuard: CanDeactivateFn<SettingsExamplePage | null> = (page) =>
  page ? page.canDeactivate() : true;
