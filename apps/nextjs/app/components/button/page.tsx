'use client';

import { IconInbox } from '@tabler/icons-react';
import _startCase from 'lodash-es/startCase';
import { Button } from '../../../../../packages/react/components/ui/button';

const variants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'light',
  'dark',
  'link',
  'destructive',
  'accent',
  'muted',
] as const;

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Button</h1>

      <div className="font-semibold">
        <h3>Basic</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant}>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Basic - disabled</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} disabled>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Basic - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Basic - disabled - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} disabled loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Basic - thin</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} thin>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outline>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline - disabled</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outline disabled>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outline loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline - disabled - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outline disabled loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline - thin</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outline thin>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline filled</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outlineFilled>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline filled - disabled</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outlineFilled disabled>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline filled - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outlineFilled loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline filled - disabled - loading</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outlineFilled disabled loading>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Outline filled - thin</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} outlineFilled thin>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold mt-4">
        <h3>Icon</h3>
        <div className="flex gap-2">
          {variants.map((variant) => {
            return (
              <Button key={variant} variant={variant} left={<IconInbox />}>
                {_startCase(variant)}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
