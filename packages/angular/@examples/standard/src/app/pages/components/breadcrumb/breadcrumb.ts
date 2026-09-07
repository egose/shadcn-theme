import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-page',
  imports: [DemoHeaderComponent, HlmBreadcrumbImports],
  template: `
    <app-demo-header title="Breadcrumb" description="Navigation trail." />

    <nav hlmBreadcrumb aria-label="Page sections">
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/">Home</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink link="/components">Components</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <span hlmBreadcrumbPage>Breadcrumb</span>
        </li>
      </ol>
    </nav>
  `,
})
export class BreadcrumbPage {}
