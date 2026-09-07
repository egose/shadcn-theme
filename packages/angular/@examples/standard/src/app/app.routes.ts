import { Routes } from '@angular/router';
import { catalogChildRoutes } from './catalog/catalog';
import { ComponentsLayout } from './pages/components/components';
import { ExamplesLayout } from './pages/examples/examples';
import { NotFoundPage } from './pages/not-found/not-found';

// Child routes, menu groups, and search options are all derived from the
// typed registry in `catalog/catalog.ts`; do not hand-maintain path lists here.
export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [
      ...catalogChildRoutes('component'),
      { path: '', redirectTo: 'button', pathMatch: 'full' },
      // Intentional child wildcard: unknown `/components/<slug>` URLs render
      // the accessible not-found page instead of an empty gallery shell.
      { path: '**', component: NotFoundPage },
    ],
  },
  {
    path: 'examples',
    component: ExamplesLayout,
    children: [
      ...catalogChildRoutes('example'),
      { path: '', redirectTo: 'pricing', pathMatch: 'full' },
      // Intentional child wildcard: unknown `/examples/<slug>` URLs render
      // the accessible not-found page instead of an empty examples shell.
      { path: '**', component: NotFoundPage },
    ],
  },
  { path: '', redirectTo: 'components/button', pathMatch: 'full' },
  // Intentional root wildcard for any other unknown URL.
  { path: '**', component: NotFoundPage },
];
