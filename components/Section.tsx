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
    <section className={`p-10 my-6 bg-base-100 rounded-4xl ${className}`}>
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}