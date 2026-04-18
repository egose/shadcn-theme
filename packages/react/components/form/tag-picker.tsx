import _kebabCase from 'lodash-es/kebabCase';

import { cn } from '../../utils/ui';
import { Label } from '../ui/label';
import { TagPicker } from '../ui/tag-picker';

export interface FormTagPickerProps {
  id?: string;
  name: string;
  label?: string;
  value: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
}

export function FormTagPicker({
  id,
  name,
  label,
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  disabled = false,
  required = false,
  classNames,
}: FormTagPickerProps) {
  if (!id) id = _kebabCase(name);

  return (
    <div className={cn('space-y-2', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <TagPicker
        id={id}
        value={value}
        onChange={onChange}
        suggestions={suggestions}
        placeholder={placeholder}
        disabled={disabled}
        className={classNames?.input}
      />
    </div>
  );
}
