"use client"

import NavLink from "./NavLink"

type Props = {
  labels: Record<"home" | "dev" | "projects" | "vert" | "dashboard", string>;
  showDashboard?: boolean;
}

export default function DrawerNav({ labels, showDashboard }: Props) {
  const closeDrawer = () => {
    const checkbox = document.getElementById("nav-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  return (
    <ul className="menu m-6 p-3 grid gap-2 w-fit bg-base-200 text-base-content text-2xl rounded-4xl">
      <li>
        <NavLink href="/" onClick={closeDrawer} className="rounded-full w-fit" exact>
          {labels.home}
        </NavLink>
      </li>
      <li>
        <NavLink href="/dev" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.dev}
        </NavLink>
      </li>
      <li>
        <NavLink href="/projects" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.projects}
        </NavLink>
      </li>
      <li>
        <NavLink
          href="https://vert.romantcham.fr"
          onClick={closeDrawer}
          className="rounded-full w-fit"
          external
        >
          {labels.vert}
        </NavLink>
      </li>
      {showDashboard && (
        <li>
          <NavLink href="/dashboard" onClick={closeDrawer} className="rounded-full w-fit">
            {labels.dashboard}
          </NavLink>
        </li>
      )}
    </ul>
  )
}
