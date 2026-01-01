import Link from "next/link";

export function Section({
  children,
  className,
  title,
  link,
}: Readonly<{
  children: React.ReactNode;
  className?: String;
  title?: String;
  link?: string;
}>) {
  return (
    <section className={`p-6 flex flex-col space-y-4 bg-base-100 rounded-4xl animate-fade-in-scale ${className}`}>
      { title && (
        link ? (
          <Link href={link} className="w-fit">
            <h2 className="btn bg-base-300 rounded-full text-2xl font-bold h-fit">
              {title}
            </h2>
          </Link>
        ) : (
          <h2 className="text-2xl font-bold">
            {title}
          </h2>
        )
      )}
      {children}
    </section>
  );
}