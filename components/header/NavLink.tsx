"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  external?: boolean;
  onClick?: () => void;
};

export default function NavLink({
  href,
  children,
  className = "",
  activeClassName = "bg-primary/20 text-primary",
  exact = false,
  external = false,
  onClick,
}: Props) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/" || (href === "/" && pathname === "/");

  const combinedClassName = `${className} ${isActive ? activeClassName : ""}`.trim();

  if (external) {
    return (
      <a href={href} className={`btn btn-ghost text-xl ${combinedClassName}`} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`btn btn-ghost text-xl ${combinedClassName}`} onClick={onClick}>
      {children}
    </Link>
  );
}
