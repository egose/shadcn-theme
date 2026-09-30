'use client';

import * as React from 'react';

/** Compose the selection input's internal ref with an external React 18/19 ref. */
export function useSelectionInputRef(
  ref: React.ForwardedRef<HTMLInputElement>,
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
) {
  const cleanupRef = React.useRef<(() => void) | undefined>(undefined);
  return React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        if (node === null && cleanupRef.current) {
          const cleanup = cleanupRef.current;
          cleanupRef.current = undefined;
          cleanup();
        } else {
          // React 19 callback refs may return cleanup. Handle it when our composed
          // ref detaches, while keeping this callback's return type valid in React 18.
          const cleanup: unknown = ref(node);
          cleanupRef.current = typeof cleanup === 'function' ? () => cleanup() : undefined;
        }
      } else if (ref) {
        ref.current = node;
      }
    },
    [inputRef, ref],
  );
}

/** Internal focus boundary shared by selection fields, including their portalled content. */
export function useSelectionFocus(onBlur?: () => void) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const focused = React.useRef(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isWithin = (target: Node | null) =>
    !!target && (!!wrapperRef.current?.contains(target) || !!contentRef.current?.contains(target));

  const cancelCheck = () => clearTimeout(timer.current);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const checkFocus = () => {
    cancelCheck();
    // Radix moves focus during portal mount/unmount. Evaluate the settled destination,
    // rather than treating the trigger's native blur as leaving the composite field.
    timer.current = setTimeout(() => {
      const wrapper = wrapperRef.current;
      if (wrapper && focused.current && !isWithin(wrapper.ownerDocument.activeElement)) {
        focused.current = false;
        onBlur?.();
      }
    }, 0);
  };

  return {
    wrapperRef,
    contentRef,
    isWithin,
    onFocusCapture: () => {
      cancelCheck();
      focused.current = true;
    },
    onBlurCapture: checkFocus,
    // Removing a focused portal does not consistently dispatch a native blur event.
    onCloseAutoFocus: checkFocus,
  };
}
