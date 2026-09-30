/** Dispatch the browser editing contract, including its default edit unless canceled. */
export function editPhoneInput(input: HTMLInputElement, inputType: string, data: string | null = null): void {
  const before = new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType, data });
  if (!input.dispatchEvent(before)) return;
  let start = input.selectionStart ?? 0;
  let end = input.selectionEnd ?? start;
  if (start === end) {
    if (inputType === 'deleteContentBackward') start = Math.max(0, start - 1);
    if (inputType === 'deleteContentForward') end = Math.min(input.value.length, end + 1);
  }
  input.setRangeText(data ?? '', start, end, 'end');
  input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType, data }));
}
