import React from 'react';
import { cn } from '../../lib/utils';
import type { UserMenuSection } from './types';

interface MobileMenuProps {
  sections: UserMenuSection[];
  aslink?: React.ElementType;
  onClick?: () => void;
}

export function MobileMenu({ sections, aslink, onClick }: MobileMenuProps) {
  const LinkComponent = aslink ?? 'a';

  return (
    <div className="w-full bg-white p-2 space-y-4">
      {sections.map((section, sectionIndex) => (
        <div key={section.label ?? sectionIndex} className="space-y-2">
          {/* Section label */}
          {section.label && <div className="text-sm font-semibold text-gray-500">{section.label}</div>}

          {/* Section items */}
          {section.items?.length ? (
            <ul className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <li key={item.label ?? itemIndex} className="cursor-pointer" onClick={onClick}>
                  {item.link ? (
                    <LinkComponent
                      to={item.link}
                      href={item.link}
                      className={cn('block w-full px-3 py-1 rounded hover:bg-gray-100', item.className)}
                    >
                      {item.label}
                    </LinkComponent>
                  ) : (
                    <button
                      onClick={item.action}
                      className={cn(
                        'block w-full text-left px-3 py-1 rounded hover:bg-gray-100 cursor-pointer',
                        item.className,
                      )}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          {/* Separator */}
          {section.separator && <hr className="my-2" />}
        </div>
      ))}
    </div>
  );
}
