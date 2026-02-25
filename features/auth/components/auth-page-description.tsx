import { FieldGroup } from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { AlertCircleIcon } from 'lucide-react';

type AuthPageDescriptionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  // Error Alert
  errorTitle?: string;
  errorMessage?: string | null;
  // Success Alert
  successTitle?: string;
  successMessage?: string | null;
};

export function AuthPageDescription({
  title,
  description,
  children,
  errorTitle = 'Error',
  errorMessage,
  successTitle = 'Success',
  successMessage,
}: AuthPageDescriptionProps) {
  return (
    <FieldGroup>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm text-balance">{description}</p>
      </div>
      {errorMessage ? (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert variant="success" className="max-w-md">
          <AlertCircleIcon />
          <AlertTitle>{successTitle}</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {children}
    </FieldGroup>
  );
}
