"use client"

import Link from "next/link"

export default function DrawerNav() {
  const closeDrawer = () => {
    const checkbox = document.getElementById("nav-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li>
        <Link href="/" onClick={closeDrawer}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/dev" onClick={closeDrawer}>
          dev
        </Link>
      </li>
      <li>
        <Link href="/projects" onClick={closeDrawer}>
          Projects
        </Link>
      </li>
      <li>
        <a
          href="https://vert.romantcham.fr"
          onClick={closeDrawer}
        >
          Vert
        </a>
      </li>
    </ul>
  )
}
