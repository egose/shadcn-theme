'use client';

import React from 'react';
import _kebabCase from 'lodash-es/kebabCase.js';
import _isString from 'lodash-es/isString.js';
import { cn } from '../../utils/ui';
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
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  data: SelectOption[] | string[];
  defaultValue?: string;
  value?: string;
  onChange: (value?: string) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  id,
  name,
  label,
  placeholder = '',
  data,
  defaultValue,
  value,
  onChange,
  classNames,
  required,
}: FormSelectProps) {
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
    <div className={cn('$form-select space-y-1', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <Select onValueChange={onChange} defaultValue={defaultValue ?? value ?? ''} value={value}>
        <SelectTrigger className="mb-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className={cn(classNames?.input)}>
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
}
