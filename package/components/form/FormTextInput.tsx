'use client';

import React from 'react';
import _kebabCase from 'lodash-es/kebabCase';
import { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const inputClass = '';

export interface FormTextInputProps extends InputProps {
  id?: string;
  name: string;
  label?: string;
  inputProps?: InputProps;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

export default function TextInput({
  id,
  name,
  label,
  type = 'text',
  classNames,
  required,
  disabled,
  inputProps = {},
  ...others
}: FormTextInputProps) {
  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('_text-input', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        autoComplete="off"
        {...inputProps}
        {...others}
        className={cn(inputClass, classNames?.input)}
      />
    </div>
  );
}
