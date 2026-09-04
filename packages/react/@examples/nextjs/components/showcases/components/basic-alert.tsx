import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { BasicAlert } from '@egose/shadcn-theme/components/ui/basic-alert';

export default function BasicAlertShowcase() {
  const variants = ['primary', 'success', 'warning', 'danger', 'info', 'accent', 'muted'] as const;

  return (
    <ExamplePage
      title="Basic Alert"
      description="Use preset alerts when you want a faster, opinionated API over the lower-level alert primitive."
    >
      <ExampleSection title="Common variants">
        <ExampleStack>
          {variants.map((variant) => (
            <BasicAlert
              key={variant}
              variant={variant}
              appearance="light"
              title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} status`}
              description="This variant applies a matching icon and color treatment automatically."
            />
          ))}
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
