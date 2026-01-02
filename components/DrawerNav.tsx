"use client"

import Link from "next/link"

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
        <Link href="/" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.home}
        </Link>
      </li>
      <li>
        <Link href="/dev" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.dev}
        </Link>
      </li>
      <li>
        <Link href="/projects" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.projects}
        </Link>
      </li>
      <li>
        <a
          href="https://vert.romantcham.fr"
          onClick={closeDrawer}
          className="rounded-full w-fit"
        >
          {labels.vert}
        </a>
      </li>
      {showDashboard && (
        <li>
          <Link href="/dashboard" onClick={closeDrawer} className="rounded-full w-fit">
            {labels.dashboard}
          </Link>
        </li>
      )}
    </ul>
  )
}
