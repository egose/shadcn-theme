import '@angular/compiler';
import { APP_ID, Component, provideZonelessChangeDetection } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideServerRendering, renderApplication } from '@angular/platform-server';
import { createServer } from 'node:http';
import { EgFormTextInput } from '../dist/form-text-input/fesm2022/form-text-input.mjs';

class FormTextInputHydrationHost {
  form = new FormGroup({ value: new FormControl('Ada', { nonNullable: true }) });
}

Component({
  selector: 'angular-07-hydration-root',
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input controlName="value" label="Hydrated name" hint="Hydration-safe hint" required />
    </form>
  `,
})(FormTextInputHydrationHost);

const host = '127.0.0.1';
const port = 9877;
const appId = 'angular07';

const server = createServer(async (_request, response) => {
  try {
    const html = await renderApplication(
      (context) =>
        bootstrapApplication(
          FormTextInputHydrationHost,
          {
            providers: [
              { provide: APP_ID, useValue: appId },
              provideZonelessChangeDetection(),
              provideServerRendering(),
              provideClientHydration(withNoHttpTransferCache()),
            ],
          },
          context,
        ),
      {
        document: '<!doctype html><html><head></head><body><angular-07-hydration-root /></body></html>',
        url: `http://${host}:${port}/`,
        allowedHosts: [host],
      },
    );
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/html; charset=utf-8',
    });
    response.end(html);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
    response.end(String(error));
  }
});

server.listen(port, host, () => console.log(`ANGULAR_07_SSR_READY=http://${host}:${port}`));

const close = () => server.close(() => process.exit(0));
process.on('SIGINT', close);
process.on('SIGTERM', close);
