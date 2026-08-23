import { isEqualDate } from '@egose/shadcn-theme/utils/date';
import { convertToHours } from '@egose/shadcn-theme/utils/time';
import { cn } from '@egose/shadcn-theme/utils/ui';
import { DialogManagerProvider } from '@egose/shadcn-theme/components/widgets/dialog-manager';
import type { FormTextareaInputProps } from '@egose/shadcn-theme/components/form/textarea';
import type { SimpleLayoutProps } from '@egose/shadcn-theme/layouts/simple';

export default function Page() {
  const date = new Date(2026, 7, 23);
  const layoutProps = { loading: false } satisfies Pick<SimpleLayoutProps, 'loading'>;
  const textareaProps = { rows: 3 } satisfies FormTextareaInputProps;

  return (
    <DialogManagerProvider>
      <main
        className={cn('server-safe', 'rounded', 'p-2')}
        data-loading={layoutProps.loading}
        data-textarea-rows={textareaProps.rows}
      >
        duration:{convertToHours('90m')};same-day:{String(isEqualDate(date, new Date(date)))}
      </main>
    </DialogManagerProvider>
  );
}
