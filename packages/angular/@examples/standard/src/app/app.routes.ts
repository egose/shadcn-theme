import { Routes } from '@angular/router';
import { ComponentsLayout } from './pages/components/components';
import { ButtonPage } from './pages/components/button/button';
import { Badgeage } from './pages/components/badge/badge';
import { SpinnerPage } from './pages/components/spinner/spinner';
import { AccordionPage } from './pages/components/accordion/accordion';
import { AlertPage } from './pages/components/alert/alert';
import { FormFieldPage } from './pages/components/form-field/form-field';

export const routes: Routes = [
  {
    path: 'components',
    component: ComponentsLayout,
    children: [
      { path: 'button', component: ButtonPage },
      { path: 'badge', component: Badgeage },
      { path: 'spinner', component: SpinnerPage },
      { path: 'accordion', component: AccordionPage },
      { path: 'alert', component: AlertPage },
      { path: 'form-field', component: FormFieldPage },
    ],
  },
];
