export const ConfigurationPages = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-dark-green">{title}</h1>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </header>

      <div>{children}</div>
    </div>
  );
};
