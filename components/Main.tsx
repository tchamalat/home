export default function Main({
  children,
  className
}: Readonly<{
  children: React.ReactNode;
  className?: String;
}>) {
  return (
      <main className={`flex flex-col space-y-6 ${className}`}>
        {children}
      </main>
  );
}