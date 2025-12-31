"use client"

import Link from "next/link"

export default function DrawerNav() {
  const closeDrawer = () => {
    const checkbox = document.getElementById("nav-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  return (
    <ul className="menu m-6 p-3 grid gap-2 w-fit bg-base-200 text-base-content text-2xl rounded-4xl">
      <li>
        <Link href="/" onClick={closeDrawer} className="rounded-full">
          Home
        </Link>
      </li>
      <li>
        <Link href="/dev" onClick={closeDrawer} className="rounded-full">
          dev
        </Link>
      </li>
      <li>
        <Link href="/projects" onClick={closeDrawer} className="rounded-full">
          Projects
        </Link>
      </li>
      <li>
        <a
          href="https://vert.romantcham.fr"
          onClick={closeDrawer}
          className="rounded-full"
        >
          Vert
        </a>
      </li>
    </ul>
  )
}
