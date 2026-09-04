'use client';

import { useState } from 'react';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@egose/shadcn-theme/components/ui/card';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [resetNotice, setResetNotice] = useState(false);

  return (
    <ExamplePage title="Card" description="A container for grouping related content and actions into a single surface.">
      <ExampleSection
        title="Login Card"
        description="A login form composed with CardHeader, CardContent, and CardFooter. The footer submit button is associated with the form through its form attribute."
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
            <CardAction>
              <Button type="button" variant="link">
                Sign Up
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form
              id="login-form"
              onSubmit={(event) => {
                event.preventDefault();
                const email = new FormData(event.currentTarget).get('email');
                setSignedInEmail(typeof email === 'string' ? email : null);
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="ml-auto h-auto p-0 text-sm"
                      onClick={() => setResetNotice(true)}
                    >
                      Forgot your password?
                    </Button>
                  </div>
                  <Input id="password" name="password" type="password" required />
                  {resetNotice ? (
                    <p role="status" className="text-sm text-muted-foreground">
                      Password reset is not part of this demo — no email is sent.
                    </p>
                  ) : null}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" form="login-form" className="w-full">
              Login
            </Button>
            <Button type="button" variant="primary" className="w-full">
              Login with Google
            </Button>
            {signedInEmail ? (
              <p role="status" className="text-sm text-muted-foreground">
                Signed in as {signedInEmail}
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </ExampleSection>
    </ExamplePage>
  );
}
