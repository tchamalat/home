"use client"

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
    <section
      className={`p-6 flex flex-col space-y-4 bg-base-100/90 rounded-4xl
        bg-gradient-to-br from-primary/10 via-base-100/80 to-base-300/60
        shadow-inner shadow-sm shadow-primary/20
        transition-transform duration-300
        hover:scale-102 transform
        hover:shadow-md hover:shadow-primary/40
        border border-primary/10
        ${className}`}
    >
      {title && (
        link ? (
          <Link
            href={link}
            className="rounded-full w-fit"
          >
            <h2 className={`btn bg-base-300 py-1 px-3 rounded-full text-2xl font-bold h-fit`}>
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