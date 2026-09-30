'use client';

import React from 'react';
import _kebabCase from 'lodash-es/kebabCase.js';
import _isString from 'lodash-es/isString.js';
import { cn } from '../../utils/ui';
import { useSelectionFocus } from '../../lib/selection-focus';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface SelectOption {
  label: string;
  value: string;
}

function listToSelectOptions(items: string[]) {
  return items.map((item) => {
    return { label: item, value: item };
  });
}

export interface FormSelectProps {
  /** Focusable trigger ID and label target; defaults to the kebab-cased name. */
  id?: string;
  /** Native form field name used when contributing the selected value to FormData. */
  name: string;
  label?: string;
  placeholder?: string;
  data: SelectOption[] | string[];
  defaultValue?: string;
  value?: string;
  onChange: (value?: string) => void;
  /** Called when focus leaves the whole field, including its popup; not on internal focus moves. */
  onBlur?: () => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
  /** Marks the label and forwards required state to the Radix select primitive. */
  required?: boolean;
  /** Disables the select trigger and its native form control. */
  disabled?: boolean;
}

/** Single selection with string options or distinct values and human-readable labels. Uses value for controlled selection or defaultValue for an initial uncontrolled selection. Forwards ref to the HTMLButtonElement trigger (React 18/19). */
export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(function FormSelect(props, ref) {
  let { id } = props;
  const {
    name,
    label,
    placeholder = '',
    data,
    defaultValue,
    value,
    onChange,
    onBlur,
    classNames,
    required,
    disabled,
  } = props;
  const focus = useSelectionFocus(onBlur);
  let _options: SelectOption[] = [];
  if (data.length > 0) {
    if (_isString(data[0])) {
      _options = listToSelectOptions(data as string[]);
    } else {
      _options = data as SelectOption[];
    }
  }

  if (!id) id = _kebabCase(name);

  return (
    <div
      ref={focus.wrapperRef}
      onFocusCapture={focus.onFocusCapture}
      onBlurCapture={focus.onBlurCapture}
      className={cn('$form-select space-y-1', classNames?.wrapper)}
    >
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <Select
        name={name}
        required={required}
        disabled={disabled}
        onValueChange={onChange}
        defaultValue={defaultValue ?? value ?? ''}
        value={value}
      >
        <SelectTrigger ref={ref} id={id} className="mb-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          ref={focus.contentRef}
          onCloseAutoFocus={focus.onCloseAutoFocus}
          className={cn(classNames?.input)}
        >
          {_options.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
});
