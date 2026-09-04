import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Checkbox } from '@egose/shadcn-theme/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@egose/shadcn-theme/components/ui/field';
import { Input } from '@egose/shadcn-theme/components/ui/input';

export default function FieldShowcase() {
  return (
    <ExamplePage
      title="Field"
      description="Field primitives let you compose labels, descriptions, and errors around custom inputs."
    >
      <ExampleSection title="Responsive field groups">
        <FieldSet>
          <FieldLegend>Project settings</FieldLegend>
          <FieldDescription>
            Use field wrappers to keep labels and helper text aligned across controls.
          </FieldDescription>
          <FieldGroup>
            <Field orientation="responsive">
              <FieldLabel htmlFor="project-name">
                <FieldTitle>Name</FieldTitle>
              </FieldLabel>
              <FieldContent>
                <Input id="project-name" defaultValue="Roadmap sync" />
                <FieldDescription>Choose a concise title that appears in notifications and reports.</FieldDescription>
              </FieldContent>
            </Field>
            <FieldSeparator>Notifications</FieldSeparator>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="weekly-summary">
                <FieldTitle>Weekly summary</FieldTitle>
              </FieldLabel>
              <Checkbox id="weekly-summary" defaultChecked />
            </Field>
            <Field orientation="vertical" data-invalid="true">
              <FieldLabel htmlFor="owner-email">
                <FieldTitle>Owner email</FieldTitle>
              </FieldLabel>
              <FieldContent>
                <Input id="owner-email" aria-invalid defaultValue="team@" />
                <FieldError errors={[{ message: 'Please enter a complete email address.' }]} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </ExampleSection>
    </ExamplePage>
  );
}
