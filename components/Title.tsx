export function Title({
  children,
  className
}: Readonly<{
  children: React.ReactNode;
  className?: String;
}>) {
  return (
    <div className="flex justify-center">
      <h1 className={`p-4 w-fit text-4xl font-bold bg-base-100 rounded-full ${className}`}>
        {children}
      </h1>
    </div>
  );
}