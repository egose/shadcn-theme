import React from 'react';
import _isString from 'lodash-es/isString';
import _kebabCase from 'lodash-es/kebabCase';

import { cn } from '../../utils/ui';
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
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  data: MultiSelectValue[] | string[];
  value: string[];
  onChange: (values: string[]) => void;
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

export function FormMultiSelect({
  id,
  name,
  label,
  placeholder = 'Select options...',
  data,
  value = [],
  onChange,
  classNames,
  required,
  disabled,
  loop = false,
}: FormMultiSelectProps) {
  const options: MultiSelectValue[] = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (_isString(data[0])) {
      return (data as string[]).map((currentValue) => ({ label: currentValue, value: currentValue }));
    }
    return data as MultiSelectValue[];
  }, [data]);

  const selectedValues = React.useMemo(() => {
    return value
      .map((currentValue) => options.find((option) => option.value === currentValue))
      .filter((option): option is MultiSelectValue => !!option);
  }, [options, value]);

  const handleValueChange = (newValues: MultiSelectValue[]) => {
    onChange(newValues.map((currentValue) => currentValue.value));
  };

  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('flex flex-col gap-2', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <MultiSelector
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
                id={id}
                disabled={disabled}
                placeholder={selectedValues.length === 0 ? placeholder : ''}
                className={classNames?.input}
              />
            </MultiSelectorTrigger>
          </PopoverTrigger>

          <PopoverContent
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
}
