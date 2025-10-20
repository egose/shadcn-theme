import React, { TextareaHTMLAttributes, useRef } from 'react';
import _isFunction from 'lodash-es/isFunction';
import _kebabCase from 'lodash-es/kebabCase';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const inputClass = '';

export interface FormTextareaProps extends InputProps {
  id?: string;
  name: string;
  label?: string;
  inputProps?: InputProps & { ref?: any };
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

export function FormTextarea({
  id,
  name,
  label,
  rows = 5,
  classNames,
  required,
  disabled,
  inputProps = {},
  ...rest
}: FormTextareaProps) {
  if (!id) id = _kebabCase(name);
  const _ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={cn('textarea', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <Textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        disabled={disabled}
        autoComplete="off"
        {...inputProps}
        {...rest}
        // Required to bind three potential refs:
        // 1. From the inputProps ex) react-hook-form.
        // 2. From the this component instance itself.
        ref={(el) => {
          if (!el) return;

          [_ref, inputProps.ref].forEach((rf) => {
            if (!rf) return;

            if (_isFunction(rf)) {
              rf(el);
            } else {
              rf.current = el;
            }
          });
        }}
        className={cn(inputClass, classNames?.input)}
      />
    </div>
  );
}
