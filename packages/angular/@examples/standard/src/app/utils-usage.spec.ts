import { hlm } from '@egose/shadcn-theme-ng/utils';

/**
 * Focused usage coverage for the non-visual `@egose/shadcn-theme-ng/utils`
 * subpath.
 *
 * `utils` ships no component, so it intentionally has no gallery route (the
 * catalog only lists visual demos). This spec documents the consumer-facing
 * contract instead: `hlm()` merges conditional class values (`clsx`) while
 * resolving conflicting Tailwind utilities (`tailwind-merge`). Package
 * internals also use `classes()` for reactive host-class management and
 * `provideSpartanHlm()` for overlay defaults; both are consumed through the
 * same public subpath.
 */
describe('utils usage', () => {
  it('joins static class lists', () => {
    expect(hlm('tw:flex', 'tw:items-center')).toEqual('tw:flex tw:items-center');
  });

  it('supports conditional values like clsx', () => {
    expect(hlm('tw:text-sm', false && 'tw:font-bold', 'tw:truncate')).toEqual('tw:text-sm tw:truncate');
    expect(hlm('tw:text-sm', true && 'tw:font-bold')).toEqual('tw:text-sm tw:font-bold');
  });

  it('lets later conflicting utilities win like tailwind-merge', () => {
    expect(hlm('tw:px-2', 'tw:px-4')).toEqual('tw:px-4');
  });

  it('merges arrays and object maps', () => {
    expect(hlm(['tw:text-sm', { 'tw:hidden': false, 'tw:font-bold': true }])).toEqual('tw:text-sm tw:font-bold');
  });
});
