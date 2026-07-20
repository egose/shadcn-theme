import { Component } from '@angular/core';
import { HlmBreadcrumbImports } from '@egose/shadcn-theme-ng/breadcrumb';

@Component({
  selector: 'app-breadcrumb-page',
  imports: [HlmBreadcrumbImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Breadcrumb</h3>
    <p class="tw:text-gray-500 tw:mb-4">Navigation trail.</p>

    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink href="/">Home</a>
        </li>
        <li hlmBreadcrumbSeparator></li>
        <li hlmBreadcrumbItem>
          <a hlmBreadcrumbLink href="/components">Components</a>
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
