export function Section({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex gap-4 bg-background_2 flex-col items-center justify-between p-14 sm:items-start rounded-4xl m-4">
        {children}
    </div>
  );
}