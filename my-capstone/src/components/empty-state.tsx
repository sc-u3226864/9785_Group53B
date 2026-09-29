export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-white p-10 text-center">
      <h2 className="font-medium">{title}</h2>
      {description && <p className="mt-1 text-sm text-zinc-600">{description}</p>}
      {action && <div className="mt-4 text-sm">{action}</div>}
    </div>
  );
}