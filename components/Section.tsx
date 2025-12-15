export function Section({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="p-10 my-6 bg-base-100 rounded-4xl">
      {children}
    </div>
  );
}