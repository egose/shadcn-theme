import React from 'react';
import _get from 'lodash-es/get';
import _startCase from 'lodash-es/startCase';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';

export default function FormError({
  field,
  className = '',
  message = '',
}: {
  field: string;
  className?: string;
  message?: string;
}) {
  const {
    formState: { errors },
  } = useFormContext();

  const fieldError = _get(errors, field);
  if (!fieldError) return null;
  return <div className={cn('text-sm text-danger mb-2', className)}>{message || String(fieldError.message)}</div>;
}
