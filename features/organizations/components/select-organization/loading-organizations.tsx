export function LoadingOrganizations() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Loading...</h1>
        <p className="text-muted-foreground text-sm">
          Please wait while we prepare your organizations.
        </p>
      </div>
    </div>
  );
}
