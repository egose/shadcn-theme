import { ExampleInline, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@egose/shadcn-theme/components/ui/avatar';

import { teammates } from '../fixtures';

export default function AvatarShowcase() {
  return (
    <ExamplePage
      title="Avatar"
      description="Represent people, states, and grouped participants with a consistent footprint."
    >
      <ExampleSection title="Sizes and badges">
        <ExampleInline>
          {['sm', 'default', 'lg'].map((size) => (
            <Avatar key={size} size={size as 'sm' | 'default' | 'lg'}>
              <AvatarImage src={teammates[0].src} alt={teammates[0].name} />
              <AvatarFallback>{teammates[0].initials}</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          ))}
        </ExampleInline>
      </ExampleSection>
      <ExampleSection
        title="Grouped participants"
        description="Use avatar groups to summarize members in collaborative screens."
      >
        <AvatarGroup>
          {teammates.map((person) => (
            <Avatar key={person.name} size="lg">
              <AvatarImage src={person.src} alt={person.name} />
              <AvatarFallback>{person.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </ExampleSection>
    </ExamplePage>
  );
}
