'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { FormTextInput } from './text-input';
import type { FormTextInputProps } from './text-input';
import { convertToHours, convertFromHours, convertToWholeFromHours } from '../../lib/number';

export interface FormTimeInputProps extends Omit<FormTextInputProps, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
}

export function FormTimeInput({ value: parentValue = 0, onChange, ...rest }: FormTimeInputProps) {
  const [value, setValue] = useState<string>(String(parentValue));

  useEffect(() => {
    setValue(String(parentValue ?? ''));
  }, [parentValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = convertToHours(e.target.value);
    const numericValue = Number(newValue);

    setValue(newValue);
    onChange?.(numericValue);
  };

  const displayText = convertFromHours(value);
  const displayWhole = convertToWholeFromHours(value);
  const title = displayText !== displayWhole ? `${displayText} (${displayWhole})` : displayText;

  return <FormTextInput {...rest} value={value} onChange={handleChange} onBlur={handleBlur} title={title} />;
}
