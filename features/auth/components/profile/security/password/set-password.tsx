import { SetPasswordButton } from './set-password-button';

export function SetPassword() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Set password</h3>
        <p className="text-sm text-muted-foreground">
          We will send you an email with the steps to continue.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
        <SetPasswordButton />
      </div>
    </div>
  );
}
