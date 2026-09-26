import { Directive, input } from '@angular/core';
import { classes, hlm } from '@egose/shadcn-theme-ng/utils';

/** Density scale shared by table parts and higher-level components (e.g. data-table). */
export type HlmTableSize = 'sm' | 'default' | 'lg';

@Directive({
  selector: 'div[hlmTableContainer]',
  host: { 'data-slot': 'table-container' },
})
export class HlmTableContainer {
  constructor() {
    classes(() => 'tw:relative tw:w-full tw:overflow-x-auto');
  }
}

/**
 * Directive to apply Shadcn-like styling to a <table> element.
 */
@Directive({
  selector: 'table[hlmTable]',
  host: { 'data-slot': 'table' },
})
export class HlmTable {
  constructor() {
    classes(() => 'tw:w-full tw:caption-bottom tw:text-sm');
  }
}

/**
 * Directive to apply Shadcn-like styling to a <thead> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'thead[hlmTHead],thead[hlmTableHeader]',
  host: { 'data-slot': 'table-header' },
})
export class HlmTHead {
  constructor() {
    classes(() => 'tw:[&_tr]:border-b');
  }
}

/**
 * Directive to apply Shadcn-like styling to a <tbody> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'tbody[hlmTBody],tbody[hlmTableBody]',
  host: { 'data-slot': 'table-body' },
})
export class HlmTBody {
  constructor() {
    classes(() => 'tw:[&_tr:last-child]:border-0');
  }
}

/**
 * Directive to apply Shadcn-like styling to a <tfoot> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'tfoot[hlmTFoot],tfoot[hlmTableFooter]',
  host: { 'data-slot': 'table-footer' },
})
export class HlmTFoot {
  constructor() {
    classes(() => 'tw:bg-muted/50 tw:border-t tw:font-medium tw:[&>tr]:last:border-b-0');
  }
}

/**
 * Directive to apply Shadcn-like styling to a <tr> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'tr[hlmTr],tr[hlmTableRow]',
  host: { 'data-slot': 'table-row' },
})
export class HlmTr {
  constructor() {
    classes(
      () =>
        'tw:hover:bg-muted/50 tw:data-[state=selected]:bg-muted tw:border-b tw:transition-colors tw:has-aria-expanded:bg-muted/50',
    );
  }
}

/**
 * Directive to apply Shadcn-like styling to a <th> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'th[hlmTh],th[hlmTableHead]',
  host: { 'data-slot': 'table-head' },
})
export class HlmTh {
  public readonly size = input<HlmTableSize>('default');

  constructor() {
    classes(() =>
      hlm(
        'tw:text-foreground tw:h-10 tw:px-2 tw:text-start tw:align-middle tw:font-medium tw:whitespace-nowrap tw:[&:has([role=checkbox])]:pe-0',
        this.size() === 'sm' ? 'tw:h-8' : this.size() === 'lg' ? 'tw:h-12' : '',
      ),
    );
  }
}

/**
 * Directive to apply Shadcn-like styling to a <td> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'td[hlmTd],td[hlmTableCell]',
  host: { 'data-slot': 'table-cell' },
})
export class HlmTd {
  public readonly size = input<HlmTableSize>('default');

  constructor() {
    classes(() =>
      hlm(
        'tw:p-2 tw:align-middle tw:whitespace-nowrap tw:[&:has([role=checkbox])]:pe-0',
        this.size() === 'sm' ? 'tw:p-1' : this.size() === 'lg' ? 'tw:p-3' : '',
      ),
    );
  }
}

/**
 * Directive to apply Shadcn-like styling to a <caption> element
 * within an HlmTable context.
 */
@Directive({
  selector: 'caption[hlmCaption],caption[hlmTableCaption]',
  host: { 'data-slot': 'table-caption' },
})
export class HlmCaption {
  constructor() {
    classes(() => 'tw:text-muted-foreground tw:mt-4 tw:text-sm');
  }
}
