"use client";

import NavLink from "./NavLink";

type Props = {
  labels: Record<"home" | "projects" | "vert" | "picture_app" | "admin", string>;
  showPictureApp?: boolean;
  showAdmin?: boolean;
};

export default function HeaderNav({ labels, showPictureApp = false, showAdmin = false }: Props) {
  
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
      {/*<NavLink
        href="https://vert.romantcham.fr"
        className="rounded-full"
        external
      >
        <span>{labels.vert}</span>
      </NavLink>*/}
      {showPictureApp && (
        <NavLink
          href="/apps"
          className="rounded-full"
          activeClassName="bg-primary/20 text-primary"
        >
          <span>{labels.picture_app}</span>
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
