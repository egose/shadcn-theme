import React from 'react';
import _kebabCase from 'lodash-es/kebabCase';
import _isString from 'lodash-es/isString';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

function listToSelectOptions(items: string[]) {
  return items.map((item) => {
    return { label: item, value: item };
  });
}

export interface FormSearchableSelectProps {
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

export function FormSearchableSelect({
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
  disabled,
}: FormSearchableSelectProps) {
  let _options: SelectOption[] = [];

  if (data.length > 0) {
    if (_isString(data[0])) {
      _options = listToSelectOptions(data as string[]);
    } else {
      _options = data as SelectOption[];
    }
  }

  if (!id) id = _kebabCase(name);

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value ?? defaultValue ?? '');

  React.useEffect(() => {
    setSelectedValue(value ?? defaultValue ?? '');
  }, [value, defaultValue]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? '' : currentValue;
    setSelectedValue(newValue);
    onChange(newValue);
    setOpen(false);
  };

  return (
    <div className={cn('_searchable-select', classNames?.wrapper)}>
      {label && (
        <Label htmlFor={id} className={classNames?.label} required={required}>
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            appearance="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn('w-full justify-between border-input!', classNames?.input)}
          >
            {selectedValue ? _options.find((opt) => opt.value === selectedValue)?.label : placeholder || 'Select...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label ?? 'option'}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {_options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                    {option.label}
                    <Check className={cn('ml-auto', selectedValue === option.value ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
