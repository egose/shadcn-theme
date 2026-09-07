import { Inbox, Settings, Users, Wallet } from 'lucide-react';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Avatar, AvatarFallback, AvatarImage } from '@egose/shadcn-theme/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@egose/shadcn-theme/components/ui/card';
import { Progress } from '@egose/shadcn-theme/components/ui/progress';
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
} from '@egose/shadcn-theme/components/ui/sidebar';

import { teammates } from '../fixtures';

export default function SidebarShowcase() {
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
