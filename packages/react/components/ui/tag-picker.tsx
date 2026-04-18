import { IconPlus, IconX } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { cn } from '../../utils/ui';
import { Badge } from './badge';

function normalizeTagName(name: string) {
  return name.replace(/\s+/g, ' ').trim();
}

export interface TagPickerProps {
  id?: string;
  value: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TagPicker({
  id,
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  disabled = false,
  className,
}: TagPickerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const selectedKeys = useMemo(() => new Set(value.map((item) => item.toLocaleLowerCase())), [value]);
  const normalizedInput = normalizeTagName(inputValue);
  const normalizedInputKey = normalizedInput.toLocaleLowerCase();

  const filteredSuggestions = useMemo(() => {
    return suggestions
      .filter((suggestion) => !selectedKeys.has(suggestion.toLocaleLowerCase()))
      .filter((suggestion) => {
        if (!normalizedInput) {
          return true;
        }
        return suggestion.toLocaleLowerCase().includes(normalizedInputKey);
      })
      .slice(0, 8);
  }, [normalizedInput, normalizedInputKey, selectedKeys, suggestions]);

  const canCreate =
    !!normalizedInput &&
    !selectedKeys.has(normalizedInputKey) &&
    !suggestions.some((suggestion) => suggestion.toLocaleLowerCase() === normalizedInputKey);

  const addTag = (rawName: string) => {
    const nextName = normalizeTagName(rawName);
    if (!nextName) {
      setInputValue('');
      return;
    }

    const nextKey = nextName.toLocaleLowerCase();
    const matchingSuggestion = suggestions.find((suggestion) => suggestion.toLocaleLowerCase() === nextKey);
    const finalName = matchingSuggestion ?? nextName;

    if (selectedKeys.has(finalName.toLocaleLowerCase())) {
      setInputValue('');
      return;
    }

    onChange([...value, finalName]);
    setInputValue('');
  };

  const removeTag = (tagName: string) => {
    onChange(value.filter((item) => item.toLocaleLowerCase() !== tagName.toLocaleLowerCase()));
  };

  const showMenu = !disabled && isFocused && (filteredSuggestions.length > 0 || canCreate);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <div
          className={cn(
            'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border bg-background px-2 py-1 text-sm',
            'focus-within:ring-1 focus-within:ring-ring',
            disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          {value.map((tagName) => (
            <Badge key={tagName} variant="secondary" className="flex items-center gap-1 rounded-md px-1.5">
              <span className="text-xs">{tagName}</span>
              {!disabled && (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center rounded-md p-1 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:bg-red-100 focus-visible:outline-none"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => removeTag(tagName)}
                  aria-label={`Remove ${tagName}`}
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              )}
            </Badge>
          ))}

          <input
            id={id}
            value={inputValue}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ''}
            className="min-w-24 flex-1 border-0 bg-transparent p-0 pl-1 text-sm outline-none placeholder:text-muted-foreground"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              window.setTimeout(() => setIsFocused(false), 100);
            }}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if ((event.key === 'Enter' || event.key === ',') && normalizedInput) {
                event.preventDefault();
                addTag(normalizedInput);
              }

              if (event.key === 'Backspace' && !inputValue && value.length > 0) {
                event.preventDefault();
                removeTag(value[value.length - 1]);
              }
            }}
          />
        </div>

        {showMenu && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-background p-1 shadow-md">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addTag(suggestion)}
              >
                <span>{suggestion}</span>
                <span className="text-xs text-muted-foreground">Existing</span>
              </button>
            ))}

            {canCreate && (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addTag(normalizedInput)}
              >
                <IconPlus className="h-3.5 w-3.5" />
                <span>Create &quot;{normalizedInput}&quot;</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
