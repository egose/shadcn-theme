import { Routes } from '@angular/router';
import { ComponentsLayout } from './pages/components/components';
import { ButtonPage } from './pages/components/button/button';
import { SpinnerPage } from './pages/components/spinner/spinner';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [
      { path: 'button', component: ButtonPage },
      { path: 'spinner', component: SpinnerPage },
    ],
  },
];
