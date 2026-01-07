"use client";

import NavLink from "./NavLink";

type Props = {
  labels: Record<"home" | "projects" | "vert" | "dashboard" | "admin", string>;
  showDashboard?: boolean;
  showAdmin?: boolean;
};

export default function HeaderNav({ labels, showDashboard, showAdmin }: Props) {
  return (
    <nav className="hidden sm:flex gap-2 font-semibold">
      <NavLink
        href="/"
        className="btn btn-ghost rounded-full text-xl"
        activeClassName="bg-primary/20 text-primary"
        exact
      >
        {labels.home}
      </NavLink>
      <NavLink
        href="/projects"
        className="btn btn-ghost rounded-full text-xl"
        activeClassName="bg-primary/20 text-primary"
      >
        {labels.projects}
      </NavLink>
      <NavLink
        href="https://vert.romantcham.fr"
        className="btn btn-ghost rounded-full text-xl"
        external
      >
        {labels.vert}
      </NavLink>
      {showDashboard && (
        <NavLink
          href="/dashboard"
          className="btn btn-ghost rounded-full text-xl"
          activeClassName="bg-primary/20 text-primary"
        >
          {labels.dashboard}
        </NavLink>
      )}
      {showAdmin && (
        <NavLink
          href="/admin"
          className="btn btn-ghost rounded-full text-xl text-warning"
          activeClassName="bg-warning/20 text-warning"
        >
          {labels.admin}
        </NavLink>
      )}
    </nav>
  );
}
