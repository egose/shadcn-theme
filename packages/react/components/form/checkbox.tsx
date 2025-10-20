import React from 'react';
import _kebabCase from 'lodash-es/kebabCase';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export interface FormCheckboxProps {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    checkbox?: string;
  };
}

export function FormCheckbox({
  id,
  name,
  label,
  required,
  disabled,
  checked,
  onCheckedChange,
  classNames,
}: FormCheckboxProps) {
  const checkboxId = id || _kebabCase(name);

  return (
    <div className={cn('flex items-center gap-3', classNames?.wrapper)}>
      <Checkbox
        id={checkboxId}
        name={name}
        disabled={disabled}
        required={required}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(classNames?.checkbox)}
      />

      {label && (
        <Label htmlFor={checkboxId} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}
    </div>
  );
}
