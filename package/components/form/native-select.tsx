'use client';

import React, { SelectHTMLAttributes } from 'react';
import _kebabCase from 'lodash-es/kebabCase';
import _isString from 'lodash-es/isString';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';

type NativeSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export interface SelectOption {
  label: string;
  value: string;
}

function listToSelectOptions(items: string[]) {
  return items.map((item) => {
    return { label: item, value: item };
  });
}

export interface FormNativeSelectProps extends NativeSelectProps {
  id?: string;
  name: string;
  label: string;
  selectProps: NativeSelectProps;
  data: SelectOption[] | string[];
  defaultValue?: string;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

export function FormNativeSelect({
  id,
  name,
  label,
  selectProps,
  data,
  defaultValue,
  classNames,
  required,
  disabled,
  ...others
}: FormNativeSelectProps) {
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
    <div className={classNames?.wrapper}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <select
        {...selectProps}
        id={id}
        name={name}
        autoComplete={id}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          classNames?.input ?? '',
        )}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        {...others}
      >
        {_options.map((option, index) => {
          return (
            <option
              key={option.value}
              value={option.value}
              // Unfortunately, the selected prop is not properly set at the nested component level.
              // use `defaultValue` in select element.
              // selected={defaultValue ? defaultValue === option.value : index === 0}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
