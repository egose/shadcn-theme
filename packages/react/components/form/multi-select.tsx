'use client';

import React from 'react';
import _isString from 'lodash-es/isString.js';
import _kebabCase from 'lodash-es/kebabCase.js';

import { cn } from '../../utils/ui';
import { useSelectionFocus, useSelectionInputRef } from '../../lib/selection-focus';
import { Label } from '../ui/label';
import {
  MultiSelector,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  type MultiSelectValue,
} from '../ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface FormMultiSelectProps {
  /** Requested input ID (defaults to the kebab-case name). cmdk owns the final DOM ID; the visible label follows it. */
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  /** Available options with unique values; missing selected IDs remain visible using ID labels. */
  data: MultiSelectValue[] | string[];
  /** Authoritative selected IDs in display order, including IDs absent from data. */
  value: string[];
  /** Requests an updated ID list on user edits; mount and option refreshes do not emit changes. */
  onChange: (values: string[]) => void;
  /** Called when focus leaves the input, badges, and popup as a whole; not on internal focus moves. */
  onBlur?: () => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    trigger?: string;
    input?: string;
    content?: string;
  };
  required?: boolean;
  disabled?: boolean;
  loop?: boolean;
}

/**
 * Controlled multi-select accepting strings or value/label options. Missing metadata
 * falls back to the selected ID; arriving or updated options refresh labels without
 * changing selection. Apply onChange requests to value to accept user edits.
 * Forwards ref to the HTMLInputElement used for search and keyboard navigation (React 18/19).
 */
export const FormMultiSelect = React.forwardRef<HTMLInputElement, FormMultiSelectProps>(
  function FormMultiSelect(props, ref) {
    let { id } = props;
    const {
      name,
      label,
      placeholder = 'Select options...',
      data,
      value = [],
      onChange,
      onBlur,
      classNames,
      required,
      disabled,
      loop = false,
    } = props;
    const focus = useSelectionFocus(onBlur);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const interactedOutside = React.useRef(false);
    const setInputRef = useSelectionInputRef(ref, inputRef);
    const [inputId, setInputId] = React.useState<string>();
    const attachInput = React.useCallback(
      (node: HTMLInputElement | null) => {
        // cmdk assigns its own ID for its label and keyboard focus. Observe it through
        // the public input ref rather than overriding those internal relationships.
        if (node) setInputId(node.id);
        setInputRef(node);
      },
      [setInputRef],
    );
    const options: MultiSelectValue[] = React.useMemo(() => {
      if (!data || data.length === 0) return [];
      if (_isString(data[0])) {
        return (data as string[]).map((currentValue) => ({ label: currentValue, value: currentValue }));
      }
      return data as MultiSelectValue[];
    }, [data]);

    const selectedValues = React.useMemo(() => {
      const optionsByValue = new Map(options.map((option) => [option.value, option]));
      return value.map(
        (currentValue) => optionsByValue.get(currentValue) ?? { value: currentValue, label: currentValue },
      );
    }, [options, value]);

    const handleValueChange = (newValues: MultiSelectValue[]) => {
      onChange(newValues.map((currentValue) => currentValue.value));
    };

    if (!id) id = _kebabCase(name);

    return (
      <div
        ref={focus.wrapperRef}
        onFocusCapture={focus.onFocusCapture}
        onBlurCapture={focus.onBlurCapture}
        className={cn('flex flex-col gap-2', classNames?.wrapper)}
      >
        {label && (
          <Label htmlFor={inputId} className={classNames?.label} required={required}>
            {label}
          </Label>
        )}

        <MultiSelector
          label={label}
          values={selectedValues}
          onValuesChange={handleValueChange}
          loop={loop}
          disabled={disabled}
          className="p-0"
        >
          <Popover>
            <PopoverTrigger asChild>
              <MultiSelectorTrigger className={cn('cursor-pointer', classNames?.trigger)}>
                <MultiSelectorInput
                  ref={attachInput}
                  id={id}
                  disabled={disabled}
                  placeholder={selectedValues.length === 0 ? placeholder : ''}
                  className={classNames?.input}
                />
              </MultiSelectorTrigger>
            </PopoverTrigger>

            <PopoverContent
              ref={focus.contentRef}
              onOpenAutoFocus={(event) => {
                interactedOutside.current = false;
                // Keep search/keyboard focus on the input instead of the popup container.
                event.preventDefault();
                inputRef.current?.focus();
              }}
              onInteractOutside={(event) => {
                if (!focus.isWithin(event.target as Node)) interactedOutside.current = true;
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                const active = inputRef.current?.ownerDocument.activeElement;
                // Escape/close restores the input; outside focus must stay outside.
                if (
                  !interactedOutside.current &&
                  (!active || active === inputRef.current?.ownerDocument.body || focus.isWithin(active))
                ) {
                  inputRef.current?.focus();
                }
                focus.onCloseAutoFocus();
              }}
              align="start"
              className={cn('w-[var(--radix-popover-trigger-width)] p-0', classNames?.content)}
            >
              <MultiSelectorList className="static relative border-none shadow-none">
                {options.map((option) => (
                  <MultiSelectorItem key={option.value} value={option.value} label={option.label}>
                    <span>{option.label}</span>
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </PopoverContent>
          </Popover>
        </MultiSelector>
      </div>
    );
  },
);
