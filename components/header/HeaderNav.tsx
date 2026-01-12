"use client";

import NavLink from "./NavLink";

type Props = {
  labels: Record<"home" | "projects" | "vert" | "dashboard" | "admin", string>;
  showDashboard?: boolean;
  showAdmin?: boolean;
};

export default function HeaderNav({ labels, showDashboard = false, showAdmin = false }: Props) {
  
  return (
    <nav className="hidden smmd:flex gap-2 font-semibold">
      <NavLink
        href="/"
        className="rounded-full"
        activeClassName="bg-primary/20 text-primary"
        exact
      >
        <span>{labels.home}</span>
      </NavLink>
      <NavLink
        href="/projects"
        className="rounded-full"
        activeClassName="bg-primary/20 text-primary"
      >
        <span>{labels.projects}</span>
      </NavLink>
      <NavLink
        href="https://vert.romantcham.fr"
        className="rounded-full"
        external
      >
        <span>{labels.vert}</span>
      </NavLink>
      {showDashboard && (
        <NavLink
          href="/dashboard"
          className="rounded-full"
          activeClassName="bg-primary/20 text-primary"
        >
          <span>{labels.dashboard}</span>
        </NavLink>
      )}
      {showAdmin && (
        <NavLink
          href="/admin"
          className="rounded-full text-warning"
          activeClassName="bg-warning/20 text-warning"
        >
          <span>{labels.admin}</span>
        </NavLink>
      )}
    </nav>
  );
}
