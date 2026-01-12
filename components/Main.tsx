export default function Main({
  children,
  className,
  title
}: Readonly<{
  children: React.ReactNode;
  className?: String;
  title?: String;
}>) {
  return (
      <main className={`flex flex-col space-y-6 pt-20 bg-base-100/60 ${className}`}>
        {title && 
          <div className="flex justify-center">
            <h1 className={`p-4 w-fit text-4xl font-bold bg-primary/10 rounded-full ${className}`}>
              {title}
            </h1>
          </div>
        }
        {children}
      </main>
  );
}