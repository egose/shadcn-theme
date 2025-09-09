import { Routes } from '@angular/router';
import { ComponentsLayout } from './pages/components/components';
import { ButtonPage } from './pages/components/button/button';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [{ path: 'button', component: ButtonPage }],
  },
];
