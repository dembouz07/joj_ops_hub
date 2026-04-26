interface PageHeaderProps {
  title?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
}

export default function PageHeader({ title, actions, filters }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {filters && (
        <div className="flex flex-wrap items-center gap-2">{filters}</div>
      )}
    </div>
  );
}
