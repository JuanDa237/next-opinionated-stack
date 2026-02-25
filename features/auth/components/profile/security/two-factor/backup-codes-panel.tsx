'use client';

import { useState } from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Icons
import { InfoIcon, Copy, Download } from 'lucide-react';

export function BackupCodesPanel({
  backupCodes,
  onDone,
}: {
  backupCodes: string[];
  onDone: () => void;
}) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const backupCodesText = backupCodes.join('\n');

  const handleCopyCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodesText);
      setCopySuccess('Backup codes copied.');
    } catch {
      setCopySuccess('Copy failed. Please select and copy manually.');
    }
  };

  const handleDownloadCodes = () => {
    const blob = new Blob([backupCodesText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup-codes.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col">
      <Alert>
        <InfoIcon />
        <AlertTitle>Backup Codes</AlertTitle>
        <AlertDescription>
          Save these backup codes in a safe place. You can use them to access your account.
        </AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2 my-4 justify-end">
        <Button type="button" variant="outline" size="icon" onClick={handleCopyCodes}>
          <Copy />
        </Button>
        <Button type="button" variant="outline" size="icon" onClick={handleDownloadCodes}>
          <Download />
        </Button>
        {copySuccess ? (
          <span className="text-xs text-muted-foreground self-center">{copySuccess}</span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 text-center bg-primary-foreground p-4 border-1">
        {backupCodes.map((code, index) => (
          <div key={index} className="font-mono text-sm">
            {code}
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={onDone}>
        Done. I&apos;ve saved my backup codes.
      </Button>
    </div>
  );
}
