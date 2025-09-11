import { Routes } from '@angular/router';
import { ComponentsLayout } from './pages/components/components';
import { ButtonPage } from './pages/components/button/button';
import { Badgeage } from './pages/components/badge/badge';
import { SpinnerPage } from './pages/components/spinner/spinner';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [
      { path: 'button', component: ButtonPage },
      { path: 'badge', component: Badgeage },
      { path: 'spinner', component: SpinnerPage },
    ],
  },
];
