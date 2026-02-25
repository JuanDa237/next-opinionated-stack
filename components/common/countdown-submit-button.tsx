'use client';

import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

/**
 * Countdown-aware button that temporarily disables itself and updates its label.
 *
 * Usage notes:
 * - Increment `cooldownKey` after a successful action to start the cooldown.
 * - Set `initialCooldownSeconds` to start with a locked state (e.g. first load).
 * - Use `onCooldownChange` to sync external state with the cooldown status.
 */
type CountdownSubmitButtonProps = Omit<
  ComponentProps<typeof Button>,
  'type' | 'form' | 'onClick' | 'disabled'
> & {
  /** HTML form id to associate with when used as a submit button. */
  formId?: string;
  /** Button type when used in forms. Defaults to `submit`. */
  type?: ComponentProps<'button'>['type'];

  /** External submitting state to show `submittingLabel` and disable the button. */
  isSubmitting?: boolean;
  /** Label while submitting. */
  submittingLabel?: string;

  /** External disabled state. Cooldown and submitting states also disable. */
  disabled?: boolean;

  /** Increment to trigger a new cooldown cycle. */
  cooldownKey: number;
  /** Base duration in seconds for the cooldown. Defaults to 30. */
  baseResendSeconds?: number;
  /** Initial cooldown duration in seconds, used on mount. */
  initialCooldownSeconds?: number;
  /** Default label when idle. */
  label?: string;

  /** Label factory while cooldown is active. */
  cooldownLabel?: (seconds: number) => string;
  /** Notifies when cooldown starts or finishes. */
  onCooldownChange?: (isActive: boolean) => void;
  /** Click handler when used as a non-submit action. */
  onClick?: ComponentProps<'button'>['onClick'];
};

/**
 * Renders a button with an optional cooldown timer.
 */
export function CountdownSubmitButton({
  formId,
  type = 'submit',
  isSubmitting = false,
  disabled = false,
  cooldownKey,
  baseResendSeconds = 30,
  initialCooldownSeconds = 0,
  label = 'Send',
  submittingLabel = 'Sending...',
  cooldownLabel = seconds => `Send available in ${seconds}s`,
  onCooldownChange,
  onClick,
  className,
  variant,
  size,
}: CountdownSubmitButtonProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState(initialCooldownSeconds);
  const [_resendCount, setResendCount] = useState(() => (initialCooldownSeconds > 0 ? 1 : 0));

  useEffect(() => {
    if (cooldownKey <= 0) {
      return;
    }

    setResendCount(current => {
      const next = current + 1;
      setCooldownSeconds(baseResendSeconds * next);
      return next;
    });
  }, [cooldownKey, baseResendSeconds]);

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCooldownSeconds(current => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    onCooldownChange?.(cooldownSeconds > 0);
  }, [cooldownSeconds, onCooldownChange]);

  const isCooldownActive = cooldownSeconds > 0;
  const isDisabled = disabled || isSubmitting || isCooldownActive;

  return (
    <Button
      type={type}
      form={formId}
      className={className}
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
    >
      {isSubmitting ? submittingLabel : isCooldownActive ? cooldownLabel(cooldownSeconds) : label}
    </Button>
  );
}
