export function Section({
  children,
  className,
  title
}: Readonly<{
  children: React.ReactNode;
  className?: String;
  title?: String;
}>) {
  return (
    <section className={`p-6 flex flex-col space-y-4 bg-base-100 rounded-4xl ${className}`}>
      { title && 
        <h2 className="text-2xl font-bold">
          {title}
        </h2>
      }
      {children}
    </section>
  );
}