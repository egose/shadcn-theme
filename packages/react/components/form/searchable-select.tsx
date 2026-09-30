'use client';

import React from 'react';
import _kebabCase from 'lodash-es/kebabCase.js';
import _isString from 'lodash-es/isString.js';
import { cn } from '../../utils/ui';
import { useSelectionFocus } from '../../lib/selection-focus';
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
  /** Focusable trigger ID and label target; defaults to the kebab-cased name. */
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  /** Search matches labels and values. Values must be unique; labels may repeat. Strings serve as both. */
  data: SelectOption[] | string[];
  defaultValue?: string;
  value?: string;
  /** Emits the selected value, or an empty string when the same value is selected again. */
  onChange: (value?: string) => void;
  /** Called when focus leaves the whole field, including its popup; not on internal focus moves. */
  onBlur?: () => void;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
  };
  required?: boolean;
  disabled?: boolean;
}

/** Searchable single selection by human label or stable ID; selecting an option emits its value and closes the popup. Forwards ref to the HTMLButtonElement trigger (React 18/19). */
export const FormSearchableSelect = React.forwardRef<HTMLButtonElement, FormSearchableSelectProps>(
  function FormSearchableSelect(props, ref) {
    let { id } = props;
    const {
      name,
      label,
      placeholder = '',
      data,
      defaultValue,
      value,
      onChange,
      onBlur,
      classNames,
      required,
      disabled,
    } = props;
    const focus = useSelectionFocus(onBlur);
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
      <div
        ref={focus.wrapperRef}
        onFocusCapture={focus.onFocusCapture}
        onBlurCapture={focus.onBlurCapture}
        className={cn('$form-searchable-select space-y-1', classNames?.wrapper)}
      >

        {label && (
          <Label htmlFor={id} className={classNames?.label} required={required}>
                      {label}

          </Label>
        )}

        <Popover open={open} onOpenChange={setOpen}>

          <PopoverTrigger asChild>

            <Button
              ref={ref}
              id={id}
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

          <PopoverContent ref={focus.contentRef} onCloseAutoFocus={focus.onCloseAutoFocus} className="w-full p-0">

            <Command>

              <CommandInput placeholder={`Search ${label ?? 'option'}...`} className="h-9" />

              <CommandList>
                              <CommandEmpty>No option found.</CommandEmpty>

                <CommandGroup>

                  {_options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      keywords={[option.label]}
                      onSelect={handleSelect}
                    >
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
  },
);
