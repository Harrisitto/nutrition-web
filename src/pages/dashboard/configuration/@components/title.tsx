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
    <div className="w-full space-y-6">
      <header className="animate-fade-in border-l-4 border-nutrition-green pl-4">
        <h1 className="text-2xl font-bold text-text-title md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-text-muted leading-relaxed">
          {description}
        </p>
      </header>

      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
};
