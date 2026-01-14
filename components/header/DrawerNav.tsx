"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import NavLink from "@/components/header/NavLink"

type Props = {
  labels: Record<"home" | "projects" | "vert" | "picture_app" | "admin", string>;
  showPictureApp?: boolean;
  showAdmin?: boolean;
}

export default function DrawerNav({ labels, showPictureApp = false, showAdmin = false }: Props) {
  const drawerRef = useRef(null);
  const closeDrawer = () => {
    const checkbox = document.getElementById("nav-drawer") as HTMLInputElement | null
    if (checkbox) checkbox.checked = false
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
      const progress = clamp(scrollY / 80, 0, 1);

      gsap.to(drawerRef.current, {
        marginTop: `${16 - 8 * progress}px`,
        marginLeft: `${16 - 8 * progress}px`,
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ul ref={drawerRef} className="menu m-4 p-3 grid gap-2 w-fit bg-base-200/90 text-base-content text-2xl rounded-3xl shadow border border-primary/10">
      <li>
        <NavLink href="/" onClick={closeDrawer} className="rounded-full w-fit" exact>
          {labels.home}
        </NavLink>
      </li>
      <li>
        <NavLink href="/projects" onClick={closeDrawer} className="rounded-full w-fit">
          {labels.projects}
        </NavLink>
      </li>
      {/*<li>
        <NavLink
          href="https://vert.romantcham.fr"
          onClick={closeDrawer}
          className="rounded-full w-fit"
          external
        >
          {labels.vert}
        </NavLink>
      </li>*/}
      {showPictureApp && (
        <li>
          <NavLink href="/apps" onClick={closeDrawer} className="rounded-full w-fit">
            {labels.picture_app}
          </NavLink>
        </li>
      )}
      {showAdmin && (
        <li>
          <NavLink href="/admin" onClick={closeDrawer} className="rounded-full w-fit text-warning">
            {labels.admin}
          </NavLink>
        </li>
      )}
    </ul>
  )
}
