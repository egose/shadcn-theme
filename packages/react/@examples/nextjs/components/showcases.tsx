'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';
import type { DateRange } from 'react-day-picker';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronsUpDown,
  CreditCard,
  FileText,
  FolderOpen,
  Inbox,
  Link2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  Sparkles,
  Star,
  Upload,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';

import { ExampleGrid, ExampleInline, ExamplePage, ExampleSection, ExampleStack } from './showcase-shell';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { AspectRatio } from '../../../components/ui/aspect-ratio';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { BasicAlert } from '../../../components/ui/basic-alert';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../components/ui/breadcrumb';
import { Button } from '../../../components/ui/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../../../components/ui/button-group';
import { Calendar } from '../../../components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Checkbox } from '../../../components/ui/checkbox';
import { CopyableButton } from '../../../components/ui/copy-button';
import { DirectionProvider } from '../../../components/ui/direction';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../../components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../../components/ui/empty';
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
} from '../../../components/ui/field';
import { FileInputAsButton } from '../../../components/ui/extension/file-input';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
  type MultiSelectValue,
} from '../../../components/ui/multi-select';
import { Input } from '../../../components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../../../components/ui/input-group';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../../../components/ui/input-otp';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '../../../components/ui/item';
import { Kbd, KbdGroup } from '../../../components/ui/kbd';
import { Label } from '../../../components/ui/label';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '../../../components/ui/menubar';
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '../../../components/ui/native-select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../components/ui/pagination';
import { Progress } from '../../../components/ui/progress';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '../../../components/ui/sidebar';
import { Skeleton } from '../../../components/ui/skeleton';
import { Spinner } from '../../../components/ui/spinner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { TagPicker } from '../../../components/ui/tag-picker';
import { Textarea } from '../../../components/ui/textarea';
import { Toggle } from '../../../components/ui/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { UnstyledButton } from '../../../components/ui/unstyled-button';

import { FormCheckbox } from '../../../components/form/checkbox';
import { FormDateRangePicker } from '../../../components/form/date-range-picker';
import { FormMultiSelect } from '../../../components/form/multi-select';
import { FormTagPicker } from '../../../components/form/tag-picker';
import { HookFormCheckbox } from '../../../components/form/hook-checkbox';
import { HookFormDatePicker } from '../../../components/form/hook-date-picker';
import { HookFormMultiSelect } from '../../../components/form/hook-multi-select';
import { HookFormNativeSelect } from '../../../components/form/hook-native-select';
import { HookFormSearchableSelect } from '../../../components/form/hook-searchable-select';
import { HookFormSelect } from '../../../components/form/hook-select';
import { HookFormTagPicker } from '../../../components/form/hook-tag-picker';
import { HookFormTextInput } from '../../../components/form/hook-text-input';
import { HookFormTextarea } from '../../../components/form/hook-textarea';
import { HookFormTimeInput } from '../../../components/form/hook-time-input';
import { FormTextInput } from '../../../components/form/text-input';
import { FormTimeInput } from '../../../components/form/time-input';

const teammates = [
  { name: 'Ava Stone', initials: 'AS', src: 'https://i.pravatar.cc/120?img=32', role: 'Design' },
  { name: 'Kai Miller', initials: 'KM', src: 'https://i.pravatar.cc/120?img=12', role: 'Frontend' },
  { name: 'Ruth Chen', initials: 'RC', src: 'https://i.pravatar.cc/120?img=48', role: 'Backend' },
];

const selectOptions = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Enterprise', value: 'enterprise' },
];

const searchableOptions = [
  { label: 'Berlin', value: 'berlin' },
  { label: 'Lisbon', value: 'lisbon' },
  { label: 'Seoul', value: 'seoul' },
  { label: 'Toronto', value: 'toronto' },
];

const multiSelectOptions = [
  { value: 'ops', label: 'Operations' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'data', label: 'Data' },
  { value: 'growth', label: 'Growth' },
];

const tagSuggestions = ['Bug', 'Design System', 'Docs', 'Performance', 'Research', 'UX'];

const releaseAudienceOptions = [
  { label: 'Internal only', value: 'internal' },
  { label: 'Private beta', value: 'beta' },
  { label: 'Public launch', value: 'public' },
];

const orders = [
  { customer: 'Northwind', plan: 'Growth', amount: '$1,240', status: 'Paid' },
  { customer: 'Argon Labs', plan: 'Starter', amount: '$420', status: 'Pending' },
  { customer: 'Marble HQ', plan: 'Enterprise', amount: '$6,800', status: 'Paid' },
];

export function ComponentShowcase({ slug }: { slug: string }) {
  const Showcase = componentShowcases[slug];

  if (!Showcase) {
    return null;
  }

  return <Showcase />;
}

export function FormShowcase({ slug }: { slug: string }) {
  const Showcase = formShowcases[slug];

  if (!Showcase) {
    return null;
  }

  return <Showcase />;
}

export function RealExampleShowcase({ slug }: { slug: string }) {
  const Showcase = realExampleShowcases[slug];

  if (!Showcase) {
    return null;
  }

  return <Showcase />;
}

function AspectRatioShowcase() {
  return (
    <ExamplePage
      title="Aspect Ratio"
      description="Preserve consistent media framing while letting the surrounding layout stay flexible."
    >
      <ExampleSection
        title="Product imagery"
        description="Use aspect ratio containers to keep cards aligned before assets finish loading."
      >
        <ExampleGrid>
          {[4 / 3, 16 / 9, 1].map((ratio) => (
            <div key={ratio} className="space-y-3">
              <AspectRatio ratio={ratio}>
                <div className="flex h-full items-center justify-center rounded-xl border bg-gradient-to-br from-muted to-muted/30 text-sm font-medium text-muted-foreground">
                  {ratio === 1 ? '1:1 thumbnail' : ratio === 16 / 9 ? '16:9 hero' : '4:3 preview'}
                </div>
              </AspectRatio>
              <p className="text-sm text-muted-foreground">
                Ratio {ratio === 1 ? '1:1' : ratio === 16 / 9 ? '16:9' : '4:3'}
              </p>
            </div>
          ))}
        </ExampleGrid>
      </ExampleSection>
    </ExamplePage>
  );
}

function AvatarShowcase() {
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

function BasicAlertShowcase() {
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

function BreadcrumbShowcase() {
  return (
    <ExamplePage
      title="Breadcrumb"
      description="Show users where they are inside hierarchical navigation and long workflows."
    >
      <ExampleSection title="Standard breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Roadmap</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ExampleSection>
      <ExampleSection title="Collapsed path">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Integrations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Stripe billing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ExampleSection>
    </ExamplePage>
  );
}

function CalendarShowcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(), to: new Date() });

  return (
    <ExamplePage
      title="Calendar"
      description="Use the calendar primitive for single-date selection, ranges, and scheduling interfaces."
    >
      <ExampleGrid>
        <ExampleSection title="Single date" description="A simple single-date selection calendar.">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-xl border" />
        </ExampleSection>
        <ExampleSection title="Date range" description="Two-month range selection for report and booking filters.">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            className="rounded-xl border"
          />
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function CopyButtonShowcase() {
  return (
    <ExamplePage
      title="Copy Button"
      description="Inline copy actions are useful for IDs, API keys, and generated snippets."
    >
      <ExampleSection title="Copyable text and custom values">
        <ExampleStack>
          <CopyableButton className="text-sm font-medium">api_live_01HZX3T2A9</CopyableButton>
          <CopyableButton value="Support escalated from roadmap board #42" className="text-sm font-medium text-primary">
            Copy escalation note
          </CopyableButton>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function DirectionShowcase() {
  return (
    <ExamplePage
      title="Direction"
      description="Wrap directional primitives when you need consistent RTL and LTR rendering."
    >
      <ExampleGrid>
        <ExampleSection title="LTR">
          <DirectionProvider dir="ltr" direction="ltr">
            <ExampleStack>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </ExampleStack>
          </DirectionProvider>
        </ExampleSection>
        <ExampleSection title="RTL">
          <DirectionProvider dir="rtl" direction="rtl">
            <ExampleStack>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </ExampleStack>
          </DirectionProvider>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function DrawerShowcase() {
  return (
    <ExamplePage
      title="Drawer"
      description="Drawers are well suited for secondary flows, especially on mobile-sized viewports."
    >
      <ExampleSection title="Bottom drawer" description="Pair the drawer with a concise summary and primary actions.">
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Open billing drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Confirm plan change</DrawerTitle>
              <DrawerDescription>
                Switching to Growth unlocks unlimited dashboards for your workspace.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 text-sm text-muted-foreground">
              Your next invoice will update immediately after confirmation.
            </div>
            <DrawerFooter>
              <Button>Continue</Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ExampleSection>
    </ExamplePage>
  );
}

function DropdownMenuShowcase() {
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(true);
  const [showArchived, setShowArchived] = React.useState(false);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <ExamplePage title="Dropdown Menu" description="Dropdown menus group contextual actions behind a compact trigger.">
      <ExampleSection title="Contextual actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" appearance="outline">
              View options
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Inbox</DropdownMenuLabel>
            <DropdownMenuItem>
              New view
              <DropdownMenuShortcut>V</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Share
              <DropdownMenuShortcut>S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showUnreadOnly}
              onCheckedChange={(checked) => setShowUnreadOnly(Boolean(checked))}
            >
              Unread only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showArchived}
              onCheckedChange={(checked) => setShowArchived(Boolean(checked))}
            >
              Include archived
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Density</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                  <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </ExampleSection>
    </ExamplePage>
  );
}

function EmptyShowcase() {
  return (
    <ExamplePage
      title="Empty"
      description="Empty states help explain why content is missing and what the user can do next."
    >
      <ExampleGrid>
        <ExampleSection title="No documents yet">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderOpen className="size-4" />
              </EmptyMedia>
              <EmptyTitle>Create your first brief</EmptyTitle>
              <EmptyDescription>
                Draft a project brief to align scope, ownership, and delivery milestones.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>New brief</Button>
            </EmptyContent>
          </Empty>
        </ExampleSection>
        <ExampleSection title="No search results">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No matches for “Q4 launch”</EmptyTitle>
              <EmptyDescription>Try broadening your filters or searching by owner, status, or tag.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function FieldShowcase() {
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

function FileInputShowcase() {
  const [files, setFiles] = React.useState<string[]>([]);

  return (
    <ExamplePage
      title="File Input"
      description="This extension hides the native file picker behind a themed button trigger."
    >
      <ExampleSection
        title="Upload trigger"
        description="Use the selected file list below to confirm user feedback after a pick action."
      >
        <ExampleStack>
          <FileInputAsButton
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
          >
            <span className="inline-flex items-center gap-2">
              <Upload className="size-4" />
              Select assets
            </span>
          </FileInputAsButton>
          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            {files.length ? files.join(', ') : 'No files selected yet.'}
          </div>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function InputShowcase() {
  return (
    <ExamplePage
      title="Input"
      description="Use the input primitive for common text entry states before layering on form wrappers."
    >
      <ExampleGrid>
        <ExampleSection title="Common states">
          <ExampleStack>
            <Input placeholder="Search releases..." />
            <Input type="email" defaultValue="owner@example.com" />
            <Input type="password" value="secret-value" readOnly />
            <Input placeholder="Disabled input" disabled />
          </ExampleStack>
        </ExampleSection>
        <ExampleSection title="Inline with label">
          <div className="space-y-2">
            <Label htmlFor="workspace-domain" required>
              Workspace domain
            </Label>
            <Input id="workspace-domain" defaultValue="egose-inc" />
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function InputGroupShowcase() {
  return (
    <ExamplePage
      title="Input Group"
      description="Input groups combine text fields with icons, prefixes, suffixes, and actions."
    >
      <ExampleGrid>
        <ExampleSection title="Inline addon">
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <Search className="size-4" />
                Search
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="Filter issues" />
          </InputGroup>
        </ExampleSection>
        <ExampleSection title="Action buttons">
          <InputGroup>
            <InputGroupInput defaultValue="billing@egose.dev" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-sm" aria-label="Invite member">
                <UserPlus className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ExampleSection>
        <ExampleSection title="Stacked helper text">
          <InputGroup>
            <InputGroupAddon align="block-start">
              <InputGroupText>Notes</InputGroupText>
            </InputGroupAddon>
            <InputGroupTextarea rows={4} placeholder="Capture customer context before the handoff." />
            <InputGroupAddon align="block-end">
              <InputGroupText>Markdown supported</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function InputOTPShowcase() {
  const [otp, setOtp] = React.useState('');

  return (
    <ExamplePage
      title="Input OTP"
      description="OTP inputs segment verification codes while preserving keyboard-friendly entry."
    >
      <ExampleSection
        title="Verification code"
        description="The controlled value below mirrors the currently entered code."
      >
        <ExampleStack>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">Current value: {otp || 'empty'}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function ItemShowcase() {
  return (
    <ExamplePage title="Item" description="Items are flexible row primitives for feeds, lists, and settings summaries.">
      <ExampleSection title="List rows">
        <ItemGroup>
          {teammates.map((person) => (
            <Item key={person.name} variant="outline">
              <ItemMedia variant="image">
                <img src={person.src} alt={person.name} className="h-full w-full object-cover" />
              </ItemMedia>
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{person.name}</ItemTitle>
                  <Badge variant="secondary">{person.role}</Badge>
                </ItemHeader>
                <ItemDescription>{person.name} owns the weekly planning ritual and release notes.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="secondary" size="sm">
                  Message
                </Button>
              </ItemActions>
            </Item>
          ))}
          <ItemSeparator />
          <Item variant="muted" size="xs">
            <ItemMedia variant="icon">
              <Bell className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Notifications are enabled</ItemTitle>
              <ItemDescription>Delivery summaries will arrive every Monday morning.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </ExampleSection>
    </ExamplePage>
  );
}

function KbdShowcase() {
  return (
    <ExamplePage title="Kbd" description="Keyboard labels are useful in menus, tooltips, and onboarding hints.">
      <ExampleGrid>
        <ExampleSection title="Shortcut groups">
          <ExampleStack>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>Open command palette</span>
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>New project</span>
              <KbdGroup>
                <Kbd>Shift</Kbd>
                <Kbd>N</Kbd>
              </KbdGroup>
            </div>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function LabelShowcase() {
  return (
    <ExamplePage
      title="Label"
      description="Labels provide accessible names, required indicators, and pairing with controls."
    >
      <ExampleGrid>
        <ExampleSection title="Form rows">
          <ExampleStack>
            <div className="space-y-2">
              <Label htmlFor="project-label" required>
                Project name
              </Label>
              <Input id="project-label" defaultValue="North star redesign" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="notify-team" defaultChecked />
              <Label htmlFor="notify-team">Notify the team when this ships</Label>
            </div>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function MenubarShowcase() {
  const [autoSave, setAutoSave] = React.useState(true);
  const [density, setDensity] = React.useState('comfortable');

  return (
    <ExamplePage
      title="Menubar"
      description="Menubars expose application-wide actions in a familiar desktop-style pattern."
    >
      <ExampleSection title="Workspace menu">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New document
                <MenubarShortcut>Ctrl+N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Duplicate
                <MenubarShortcut>Ctrl+D</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarCheckboxItem checked={autoSave} onCheckedChange={(checked) => setAutoSave(Boolean(checked))}>
                Auto-save
              </MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value={density} onValueChange={setDensity}>
                <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                <MenubarRadioItem value="spacious">Spacious</MenubarRadioItem>
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Export</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>CSV</MenubarItem>
                  <MenubarItem>PDF</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </ExampleSection>
    </ExamplePage>
  );
}

function MultiSelectShowcase() {
  const [values, setValues] = React.useState<MultiSelectValue[]>([multiSelectOptions[0], multiSelectOptions[2]]);

  return (
    <ExamplePage
      title="Multi Select"
      description="The extension multi-select supports chip-based selection with keyboard navigation."
    >
      <ExampleSection title="Team ownership">
        <ExampleStack>
          <MultiSelector values={values} onValuesChange={setValues}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Add a team..." />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {multiSelectOptions.map((option) => (
                  <MultiSelectorItem key={option.value} value={option.value} label={option.label}>
                    {option.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          <p className="text-sm text-muted-foreground">Selected: {values.map((value) => value.label).join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function TagPickerShowcase() {
  const [tags, setTags] = React.useState(['Design System', 'Docs']);

  return (
    <ExamplePage
      title="Tag Picker"
      description="Tag picker supports reusable suggestions while still letting users create new tags inline."
    >
      <ExampleSection title="Creatable tags">
        <ExampleStack>
          <TagPicker value={tags} onChange={setTags} suggestions={tagSuggestions} placeholder="Add a tag..." />
          <p className="text-sm text-muted-foreground">Selected: {tags.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function PaginationShowcase() {
  return (
    <ExamplePage
      title="Pagination"
      description="Pagination primitives work for search results, tables, and archive navigation."
    >
      <ExampleSection title="Page navigation">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ExampleSection>
    </ExamplePage>
  );
}

function ProgressShowcase() {
  return (
    <ExamplePage
      title="Progress"
      description="Progress bars communicate background work, upload completion, and onboarding status."
    >
      <ExampleSection title="Progress states">
        <ExampleStack>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Import contacts</span>
              <span>24%</span>
            </div>
            <Progress value={24} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sync billing data</span>
              <span>68%</span>
            </div>
            <Progress value={68} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Publish release</span>
              <span>100%</span>
            </div>
            <Progress value={100} />
          </div>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function ScrollAreaShowcase() {
  return (
    <ExamplePage
      title="Scroll Area"
      description="Scroll areas keep long lists contained without giving up custom visual treatment."
    >
      <ExampleSection title="Recent activity">
        <ScrollArea className="h-72 rounded-xl border">
          <div className="space-y-3 p-4">
            {Array.from({ length: 14 }).map((_, index) => (
              <div key={index} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">Activity #{index + 1}</div>
                <p className="mt-1 text-muted-foreground">
                  Billing sync finished for the {index + 1} most recent workspaces.
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ExampleSection>
    </ExamplePage>
  );
}

function SelectShowcase() {
  const [plan, setPlan] = React.useState('growth');

  return (
    <ExamplePage
      title="Select"
      description="Use the custom select when you need richer floating content than a native select can provide."
    >
      <ExampleGrid>
        <ExampleSection title="Grouped options">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="plan-select">Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger id="plan-select">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Plans</SelectLabel>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function SeparatorShowcase() {
  return (
    <ExamplePage
      title="Separator"
      description="Separators create rhythm between adjacent groups without adding heavy visual weight."
    >
      <ExampleGrid>
        <ExampleSection title="Horizontal">
          <div className="space-y-3 text-sm">
            <div>Overview</div>
            <Separator />
            <div>Members</div>
            <Separator />
            <div>Billing</div>
          </div>
        </ExampleSection>
        <ExampleSection title="Vertical">
          <div className="flex h-10 items-center gap-3 text-sm">
            <span>Today</span>
            <Separator orientation="vertical" />
            <span>This week</span>
            <Separator orientation="vertical" />
            <span>This month</span>
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function SidebarShowcase() {
  return (
    <ExamplePage
      title="Sidebar"
      description="Sidebar primitives support full application shells, nested navigation, and collapsed states."
    >
      <ExampleSection
        title="Mini application shell"
        description="This preview uses the lower-level sidebar primitives directly inside the example page."
      >
        <SidebarProvider defaultOpen className="min-h-[420px] overflow-hidden rounded-xl border">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarInput placeholder="Search workspace" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive tooltip="Inbox">
                        <Inbox />
                        <span>Inbox</span>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>4</SidebarMenuBadge>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Customers">
                        <Users />
                        <span>Customers</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Billing">
                        <Wallet />
                        <span>Billing</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Quarterly forecast</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Budget approvals</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Settings">
                        <Settings />
                        <span>Preferences</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Ava Stone">
                    <Avatar size="sm">
                      <AvatarImage src={teammates[0].src} alt={teammates[0].name} />
                      <AvatarFallback>{teammates[0].initials}</AvatarFallback>
                    </Avatar>
                    <span>{teammates[0].name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <div className="border-b p-3">
              <SidebarTrigger />
            </div>
            <div className="space-y-4 p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Forecast</CardTitle>
                  <CardDescription>Use the trigger to collapse and expand the sidebar preview.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={74} />
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function SkeletonShowcase() {
  return (
    <ExamplePage
      title="Skeleton"
      description="Skeleton placeholders reduce perceived waiting time while data is loading."
    >
      <ExampleSection title="Card placeholder">
        <div className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </ExampleSection>
    </ExamplePage>
  );
}

function SonnerShowcase() {
  return (
    <ExamplePage
      title="Sonner"
      description="The example app already mounts the shared toaster, so this page focuses on triggering common toast variants."
    >
      <ExampleSection title="Toast variants">
        <ExampleInline>
          <Button
            onClick={() => toast.success('Workspace synced', { description: 'All invoices are now up to date.' })}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info('Heads up', { description: 'Your export will be ready in a few seconds.' })}
          >
            Info
          </Button>
          <Button
            variant="warning"
            onClick={() => toast.warning('Action required', { description: 'A payment method expires this week.' })}
          >
            Warning
          </Button>
          <Button
            variant="danger"
            onClick={() => toast.error('Sync failed', { description: 'We could not connect to the billing provider.' })}
          >
            Error
          </Button>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}

function SpinnerShowcase() {
  return (
    <ExamplePage
      title="Spinner"
      description="Spinners are useful for small inline loading moments and pending actions."
    >
      <ExampleSection title="Sizes and labels">
        <ExampleInline className="items-end">
          <Spinner size="small" />
          <Spinner size="medium" />
          <Spinner size="large">Loading dashboard</Spinner>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}

function TableShowcase() {
  return (
    <ExamplePage title="Table" description="Tables are best for structured, comparable data with predictable columns.">
      <ExampleSection title="Billing snapshot">
        <Table>
          <TableCaption>Recent subscription renewals</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.customer}>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.plan}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$8,460</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ExampleSection>
    </ExamplePage>
  );
}

function TextareaShowcase() {
  return (
    <ExamplePage
      title="Textarea"
      description="Textarea supports longer messages, internal notes, and drafting workflows."
    >
      <ExampleGrid>
        <ExampleSection title="Default and disabled states">
          <ExampleStack>
            <Textarea rows={5} placeholder="Add customer context for the next handoff..." />
            <Textarea rows={4} disabled defaultValue="This field is intentionally disabled in readonly review mode." />
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function ToggleShowcase() {
  const [active, setActive] = React.useState(false);

  return (
    <ExamplePage title="Toggle" description="Use single toggles for on/off formatting or persistent pressed states.">
      <ExampleSection title="Pressed states">
        <ExampleInline>
          <Toggle pressed={active} onPressedChange={setActive}>
            <Star className="size-4" />
            Favorite
          </Toggle>
          <Toggle variant="outline" size="lg" defaultPressed>
            <Sparkles className="size-4" />
            Highlight
          </Toggle>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}

function TooltipShowcase() {
  return (
    <ExamplePage
      title="Tooltip"
      description="Tooltips communicate short contextual hints without consuming permanent layout space."
    >
      <ExampleSection title="Hints and shortcuts">
        <ExampleInline>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" appearance="outline">
                Invite member
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Invite a collaborator
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>I</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </ExampleInline>
      </ExampleSection>
    </ExamplePage>
  );
}

function UnstyledButtonShowcase() {
  return (
    <ExamplePage
      title="Unstyled Button"
      description="Use the unstyled button when you need button semantics without inheriting preset visuals."
    >
      <ExampleSection title="Custom presentation">
        <UnstyledButton className="rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted">
          <div className="font-medium">Behavior-only button</div>
          <p className="mt-1 text-sm text-muted-foreground">
            This stays fully clickable while letting you control every visual detail yourself.
          </p>
        </UnstyledButton>
      </ExampleSection>
    </ExamplePage>
  );
}

function CheckboxFormShowcase() {
  const [checked, setChecked] = React.useState(true);

  return (
    <ExamplePage
      title="Form Checkbox"
      description="The form checkbox wraps the checkbox primitive with label handling and simple controlled usage."
    >
      <ExampleSection title="Standalone checkbox field">
        <ExampleStack>
          <FormCheckbox
            name="updates"
            label="Email me weekly updates"
            checked={checked}
            onCheckedChange={(value) => setChecked(Boolean(value))}
          />
          <p className="text-sm text-muted-foreground">Current value: {String(checked)}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function DateRangePickerFormShowcase() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: new Date(), to: new Date() });

  return (
    <ExamplePage
      title="Date Range Picker"
      description="Use the date range picker for filters, reports, and booking windows."
    >
      <ExampleSection title="Controlled range selection">
        <ExampleStack>
          <FormDateRangePicker name="reporting-window" label="Reporting window" value={range} onChange={setRange} />
          <p className="text-sm text-muted-foreground">
            Selected: {range?.from?.toLocaleDateString() ?? 'n/a'} - {range?.to?.toLocaleDateString() ?? 'n/a'}
          </p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookCheckboxFormShowcase() {
  const methods = useForm<{ approved: boolean }>({ defaultValues: { approved: true } });

  return (
    <ExamplePage
      title="Hook Checkbox"
      description="Connect checkbox fields to react-hook-form with validation and form context."
    >
      <ExampleSection title="Submit with form context">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Submitted', { description: JSON.stringify(data) }))}
          >
            <HookFormCheckbox name="approved" label="I approve this rollout" />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookDatePickerFormShowcase() {
  const methods = useForm<{ launchDate?: Date }>({ defaultValues: { launchDate: new Date() } });

  return (
    <ExamplePage
      title="Hook Date Picker"
      description="Hook form wrappers keep controlled date pickers aligned with validation and submission."
    >
      <ExampleSection title="Launch date">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: String(data.launchDate) }))}
          >
            <HookFormDatePicker name="launchDate" label="Launch date" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookMultiSelectFormShowcase() {
  const methods = useForm<{ teams: string[] }>({ defaultValues: { teams: ['ops', 'design'] } });

  return (
    <ExamplePage
      title="Hook Multi Select"
      description="Multi select integrates with react-hook-form when you need chip-based selection inside validated forms."
    >
      <ExampleSection title="Team ownership">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.teams.join(', ') }))}
          >
            <HookFormMultiSelect name="teams" label="Teams" data={multiSelectOptions} placeholder="Add a team" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookNativeSelectFormShowcase() {
  const methods = useForm<{ plan: string }>({ defaultValues: { plan: 'growth' } });

  return (
    <ExamplePage
      title="Hook Native Select"
      description="Register a native select directly through the form context wrapper."
    >
      <ExampleSection title="Plan selector">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.plan }))}
          >
            <HookFormNativeSelect name="plan" label="Plan" data={selectOptions} />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookSearchableSelectFormShowcase() {
  const methods = useForm<{ city: string }>({ defaultValues: { city: 'lisbon' } });

  return (
    <ExamplePage
      title="Hook Searchable Select"
      description="Use the searchable select wrapper when options are easier to scan through typeahead."
    >
      <ExampleSection title="Preferred city">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.city }))}
          >
            <HookFormSearchableSelect
              name="city"
              label="Preferred city"
              data={searchableOptions}
              placeholder="Select a city"
            />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookSelectFormShowcase() {
  const methods = useForm<{ tier: string }>({ defaultValues: { tier: 'starter' } });

  return (
    <ExamplePage
      title="Hook Select"
      description="The hook-form select wrapper keeps value changes and validation centralized in form state."
    >
      <ExampleSection title="Tier selector">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.tier }))}
          >
            <HookFormSelect name="tier" label="Tier" data={selectOptions} placeholder="Choose a tier" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookTagPickerFormShowcase() {
  const methods = useForm<{ tags: string[] }>({ defaultValues: { tags: ['Docs'] } });

  return (
    <ExamplePage
      title="Hook Tag Picker"
      description="Bind tag creation and suggestion picking directly to react-hook-form field arrays of strings."
    >
      <ExampleSection title="Release tags">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.tags.join(', ') }))}
          >
            <HookFormTagPicker name="tags" label="Tags" suggestions={tagSuggestions} placeholder="Add a tag" />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookTextInputFormShowcase() {
  const methods = useForm<{ projectName: string; ownerEmail: string }>({
    defaultValues: { projectName: 'Release review', ownerEmail: '' },
  });

  return (
    <ExamplePage
      title="Hook Text Input"
      description="Hook text inputs are useful for plain registered fields with field-level validation."
    >
      <ExampleSection title="Project details">
        <FormProvider {...methods}>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: JSON.stringify(data) }))}
          >
            <HookFormTextInput
              name="projectName"
              label="Project name"
              rules={{ required: 'Project name is required.' }}
            />
            <HookFormTextInput name="ownerEmail" label="Owner email" rules={{ required: 'Email is required.' }} />
            <div className="md:col-span-2">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookTextareaFormShowcase() {
  const methods = useForm<{ notes: string }>({
    defaultValues: { notes: 'Summarize the customer call before handoff.' },
  });

  return (
    <ExamplePage
      title="Hook Textarea"
      description="Textarea fields can be registered directly when you do not need a custom controller."
    >
      <ExampleSection title="Internal notes">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: data.notes }))}
          >
            <HookFormTextarea
              name="notes"
              label="Internal notes"
              rows={5}
              rules={{ required: 'Notes are required.' }}
            />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function HookTimeInputFormShowcase() {
  const methods = useForm<{ estimate: number }>({ defaultValues: { estimate: 2 } });

  return (
    <ExamplePage
      title="Hook Time Input"
      description="The hook time input keeps normalized hour values in form state while users type flexible durations."
    >
      <ExampleSection title="Estimate">
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((data) => toast.success('Saved', { description: String(data.estimate) }))}
          >
            <HookFormTimeInput name="estimate" label="Estimate" rules={{ required: 'Estimate is required.' }} />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function RealExampleHookFormShowcase() {
  const methods = useForm<{
    projectName: string;
    ownerEmail: string;
    plan: string;
    city: string;
    audience: string;
    launchDate?: Date;
    estimate: number;
    teams: string[];
    tags: string[];
    notes: string;
    approved: boolean;
  }>({
    defaultValues: {
      projectName: 'Insights Hub',
      ownerEmail: 'ava@company.com',
      plan: 'growth',
      city: 'lisbon',
      audience: 'beta',
      launchDate: new Date(),
      estimate: 6,
      teams: ['product', 'design'],
      tags: ['Docs', 'Research'],
      notes: 'Coordinate launch copy, QA sign-off, and customer success enablement before rollout.',
      approved: true,
    },
  });

  const values = methods.watch();

  return (
    <ExamplePage
      title="Real Example Form"
      description="A realistic launch request flow showing how every hook-form field works together inside one form."
    >
      <ExampleSection title="Launch request">
        <FormProvider {...methods}>
          <form
            className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]"
            onSubmit={methods.handleSubmit((data) =>
              toast.success('Launch request saved', {
                description: `${data.projectName} is set for ${data.launchDate?.toLocaleDateString() ?? 'TBD'}.`,
              }),
            )}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <HookFormTextInput
                name="projectName"
                label="Project name"
                rules={{ required: 'Project name is required.' }}
              />
              <HookFormTextInput
                name="ownerEmail"
                label="Owner email"
                rules={{ required: 'Owner email is required.' }}
              />
              <HookFormNativeSelect name="plan" label="Plan" data={selectOptions} />
              <HookFormSearchableSelect
                name="city"
                label="Launch city"
                data={searchableOptions}
                placeholder="Select a city"
              />
              <HookFormSelect
                name="audience"
                label="Audience"
                data={releaseAudienceOptions}
                placeholder="Select audience"
              />
              <HookFormDatePicker
                name="launchDate"
                label="Launch date"
                rules={{ required: 'Launch date is required.' }}
              />
              <div className="md:col-span-2">
                <HookFormTimeInput
                  name="estimate"
                  label="Estimated rollout time"
                  rules={{ required: 'Estimated rollout time is required.' }}
                />
              </div>
              <div className="md:col-span-2">
                <HookFormMultiSelect
                  name="teams"
                  label="Owning teams"
                  data={multiSelectOptions}
                  placeholder="Add a team"
                  rules={{ validate: (value) => value.length > 0 || 'Select at least one team.' }}
                />
              </div>
              <div className="md:col-span-2">
                <HookFormTagPicker
                  name="tags"
                  label="Tags"
                  suggestions={tagSuggestions}
                  placeholder="Add a tag"
                  rules={{ validate: (value) => value.length > 0 || 'Add at least one tag.' }}
                />
              </div>
              <div className="md:col-span-2">
                <HookFormTextarea
                  name="notes"
                  label="Launch notes"
                  rows={5}
                  rules={{ required: 'Launch notes are required.' }}
                />
              </div>
              <div className="md:col-span-2">
                <HookFormCheckbox
                  name="approved"
                  label="I confirm the rollout checklist has been reviewed with stakeholders"
                  rules={{ validate: (value) => value || 'Approval is required before submitting.' }}
                />
              </div>
              <div className="flex flex-wrap gap-3 md:col-span-2">
                <Button type="submit">Save launch request</Button>
                <Button type="button" variant="secondary" onClick={() => methods.reset()}>
                  Reset
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Live payload</h3>
                <p className="text-sm text-muted-foreground">
                  This preview updates as each hook-based field writes into the shared form state.
                </p>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-3 text-xs leading-5">
                {JSON.stringify(values, null, 2)}
              </pre>
            </div>
          </form>
        </FormProvider>
      </ExampleSection>
    </ExamplePage>
  );
}

function TextInputFormShowcase() {
  const [duration, setDuration] = React.useState(1.5);

  return (
    <ExamplePage
      title="Text Input"
      description="Use the standalone form field wrappers for simple labeled inputs outside form context."
    >
      <ExampleGrid>
        <ExampleSection title="Basic fields">
          <ExampleStack>
            <FormTextInput name="firstName" label="First name" placeholder="Ava" />
            <FormTextInput name="email" label="Email" type="email" placeholder="team@example.com" />
          </ExampleStack>
        </ExampleSection>
        <ExampleSection title="Related time field">
          <ExampleStack>
            <FormTimeInput name="duration" label="Estimated duration" value={duration} onChange={setDuration} />
            <p className="text-sm text-muted-foreground">Normalized hours: {duration}</p>
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}

function MultiSelectFormShowcase() {
  const [teams, setTeams] = React.useState(['ops', 'product']);

  return (
    <ExamplePage
      title="Multi Select"
      description="Use the standalone form wrapper when you want labels and layout around a controlled multi select field."
    >
      <ExampleSection title="Controlled teams">
        <ExampleStack>
          <FormMultiSelect name="teams" label="Teams" data={multiSelectOptions} value={teams} onChange={setTeams} />
          <p className="text-sm text-muted-foreground">Selected: {teams.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function TagPickerFormShowcase() {
  const [tags, setTags] = React.useState(['Bug', 'Research']);

  return (
    <ExamplePage
      title="Tag Picker"
      description="Standalone tag picker fields cover freeform tagging flows without requiring a full form context."
    >
      <ExampleSection title="Controlled tags">
        <ExampleStack>
          <FormTagPicker name="tags" label="Tags" value={tags} onChange={setTags} suggestions={tagSuggestions} />
          <p className="text-sm text-muted-foreground">Selected: {tags.join(', ')}</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

function TimeInputFormShowcase() {
  const [value, setValue] = React.useState(2.25);

  return (
    <ExamplePage
      title="Time Input"
      description="Time input normalizes flexible duration entry into numeric hour values."
    >
      <ExampleSection title="Controlled duration">
        <ExampleStack>
          <FormTimeInput name="time" label="Time spent" value={value} onChange={setValue} />
          <p className="text-sm text-muted-foreground">Stored value: {value} hours</p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}

const componentShowcases: Record<string, React.ComponentType> = {
  'aspect-ratio': AspectRatioShowcase,
  avatar: AvatarShowcase,
  'basic-alert': BasicAlertShowcase,
  breadcrumb: BreadcrumbShowcase,
  calendar: CalendarShowcase,
  'copy-button': CopyButtonShowcase,
  direction: DirectionShowcase,
  drawer: DrawerShowcase,
  'dropdown-menu': DropdownMenuShowcase,
  empty: EmptyShowcase,
  field: FieldShowcase,
  'file-input': FileInputShowcase,
  input: InputShowcase,
  'input-group': InputGroupShowcase,
  'input-otp': InputOTPShowcase,
  item: ItemShowcase,
  kbd: KbdShowcase,
  label: LabelShowcase,
  menubar: MenubarShowcase,
  'multi-select': MultiSelectShowcase,
  pagination: PaginationShowcase,
  progress: ProgressShowcase,
  'scroll-area': ScrollAreaShowcase,
  select: SelectShowcase,
  separator: SeparatorShowcase,
  sidebar: SidebarShowcase,
  skeleton: SkeletonShowcase,
  sonner: SonnerShowcase,
  spinner: SpinnerShowcase,
  table: TableShowcase,
  'tag-picker': TagPickerShowcase,
  textarea: TextareaShowcase,
  toggle: ToggleShowcase,
  tooltip: TooltipShowcase,
  'unstyled-button': UnstyledButtonShowcase,
};

const formShowcases: Record<string, React.ComponentType> = {
  checkbox: CheckboxFormShowcase,
  'date-range-picker': DateRangePickerFormShowcase,
  'hook-checkbox': HookCheckboxFormShowcase,
  'hook-date-picker': HookDatePickerFormShowcase,
  'hook-multi-select': HookMultiSelectFormShowcase,
  'hook-native-select': HookNativeSelectFormShowcase,
  'real-example-form': RealExampleHookFormShowcase,
  'hook-searchable-select': HookSearchableSelectFormShowcase,
  'hook-select': HookSelectFormShowcase,
  'hook-tag-picker': HookTagPickerFormShowcase,
  'hook-text-input': HookTextInputFormShowcase,
  'hook-textarea': HookTextareaFormShowcase,
  'hook-time-input': HookTimeInputFormShowcase,
  'multi-select': MultiSelectFormShowcase,
  'tag-picker': TagPickerFormShowcase,
  'text-input': TextInputFormShowcase,
  'time-input': TimeInputFormShowcase,
};

const realExampleShowcases: Record<string, React.ComponentType> = {
  'real-example-form': RealExampleHookFormShowcase,
};
