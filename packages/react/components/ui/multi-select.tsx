import * as React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Command as CommandPrimitive } from 'cmdk';
import { type KeyboardEvent, createContext, forwardRef, useCallback, useContext, useState } from 'react';

import { cn } from '../../utils/ui';
import { Badge } from './badge';
import { Command, CommandEmpty, CommandItem, CommandList } from './command';

export type MultiSelectValue = {
  value: string;
  label: string;
};

interface MultiSelectorProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  values: MultiSelectValue[];
  onValuesChange: (value: MultiSelectValue[]) => void;
  loop?: boolean;
  className?: string;
  children?: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  disabled?: boolean;
}

interface MultiSelectContextProps {
  value: MultiSelectValue[];
  onValueChange: (value: MultiSelectValue) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  ref: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelect must be used within MultiSelectProvider');
  }
  return context;
};

function searchForValue(source: MultiSelectValue[], value: MultiSelectValue) {
  for (let i = 0; i < source.length; i++) {
    if (source[i].value === value.value) {
      return i;
    }
  }
  return -1;
}

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  loop = false,
  className,
  children,
  dir,
  disabled = false,
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onValueChangeHandler = useCallback(
    (val: MultiSelectValue) => {
      if (disabled) return;

      const exists = value.some((currentValue) => currentValue.value === val.value);
      if (exists) {
        onValueChange(value.filter((currentValue) => currentValue.value !== val.value));
      } else {
        onValueChange([...value, val]);
      }
    },
    [disabled, onValueChange, value],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (disabled) return;

      const target = inputRef.current;

      if (!target) return;

      const selectionStart = target.selectionStart ?? 0;
      const selectionEnd = target.selectionEnd ?? 0;

      if (selectionStart !== selectionEnd) {
        return;
      }

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex);
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex = activeIndex - 1 <= 0 ? (value.length - 1 === 0 ? -1 : 0) : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case 'ArrowLeft':
          if (dir === 'rtl') {
            if (value.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else if (value.length > 0 && target.selectionStart === 0) {
            movePrev();
          }
          break;

        case 'ArrowRight':
          if (dir === 'rtl') {
            if (value.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else if (value.length > 0 && (activeIndex !== -1 || loop)) {
            moveNext();
          }
          break;

        case 'Backspace':
        case 'Delete':
          if (value.length > 0) {
            if (activeIndex !== -1 && activeIndex < value.length) {
              onValueChangeHandler(value[activeIndex]);
              moveCurrent();
            } else if (target.selectionStart === 0) {
              onValueChangeHandler(value[value.length - 1]);
            }
          }
          break;

        case 'Enter':
          setOpen(true);
          break;

        case 'Escape':
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setInputValue('');
            setOpen(false);
          }
          break;
      }
    },
    [activeIndex, dir, disabled, loop, onValueChangeHandler, open, value],
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        ref: inputRef,
        disabled,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn('flex flex-col overflow-visible bg-transparent', className)}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { value, onValueChange, activeIndex, disabled } = useMultiSelect();

    const mousePreventDefault = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap gap-1 rounded-lg border bg-background px-2 py-1',
          activeIndex === -1 && 'focus-within:ring-1 focus-within:ring-ring',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        {...props}
      >
        {value.map((item, index) => (
          <Badge
            key={item.value}
            className={cn(
              'flex items-center gap-1 rounded-md px-1.5',
              activeIndex === index && 'ring-2 ring-muted-foreground',
            )}
            variant="secondary"
          >
            <span className="text-xs">{item.label}</span>
            <button
              aria-label={`Remove ${item.label} option`}
              type="button"
              disabled={disabled}
              onMouseDown={mousePreventDefault}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onValueChange(item);
              }}
              className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:bg-red-100 focus-visible:outline-none disabled:cursor-not-allowed"
            >
              <span className="sr-only">Remove {item.label} option</span>
              <IconX className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  },
);

MultiSelectorTrigger.displayName = 'MultiSelectorTrigger';

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, disabled: disabledProp, ...props }, ref) => {
  const { setOpen, inputValue, setInputValue, activeIndex, setActiveIndex, ref: inputRef, disabled } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={0}
      ref={inputRef}
      value={inputValue}
      disabled={disabled || disabledProp}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onBlur={() => {
        setInputValue('');
        setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        'flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:outline-none focus:ring-0',
        className,
        activeIndex !== -1 && 'caret-transparent',
      )}
    />
  );
});

MultiSelectorInput.displayName = 'MultiSelectorInput';

const MultiSelectorContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children }, ref) => {
  const { open } = useMultiSelect();

  if (!open) return null;

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
});

MultiSelectorContent.displayName = 'MultiSelectorContent';

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  return (
    <CommandList
      ref={ref}
      className={cn(
        'absolute top-0 z-100 flex w-full flex-col gap-2 rounded-md border border-muted bg-background p-2 shadow-md scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-lg scrollbar-thumb-muted-foreground transition-colors dark:scrollbar-thumb-muted',
        className,
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">No results found</span>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectorList.displayName = 'MultiSelectorList';

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { value: string; label: string } & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, value, label, children, disabled: disabledProp, ...props }, ref) => {
  const { value: options, onValueChange, setInputValue, disabled } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isIncluded =
    searchForValue(options, {
      value,
      label,
    }) !== -1;

  const isDisabled = disabled || disabledProp;

  return (
    <CommandItem
      ref={ref}
      {...props}
      disabled={isDisabled}
      onSelect={() => {
        if (isDisabled) return;

        onValueChange({
          value,
          label,
        });
        setInputValue('');
      }}
      className={cn(
        'flex cursor-pointer justify-between rounded-md px-2 py-1 transition-colors',
        className,
        isIncluded && 'cursor-default opacity-50',
        isDisabled && 'cursor-not-allowed opacity-50',
      )}
      onMouseDown={mousePreventDefault}
    >
      {children}
      {isIncluded && <IconCheck className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectorItem.displayName = 'MultiSelectorItem';

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
