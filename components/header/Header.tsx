"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import HeaderNav from "./HeaderNav";
import HeaderAuthButton from "./HeaderAuthButton";
import type { Session } from "next-auth";
import { Menu, Settings } from "lucide-react";
import DrawerSettings from "./DrawerSettings";
import { Locale } from "@/lib/i18n"
import NavLink from "./NavLink";
import DrawerNav from "./DrawerNav";

type HeaderProps = {
  labels: Record<"home" | "projects" | "vert" | "picture_app" | "admin", string>;
  showPictureApp?: boolean;
  showAdmin?: boolean;
  session: Session | null;
  authLabels: Record<"login" | "picture_app" | "logout" | "account", string>;
  locale: Locale;
  langlabels: Record<"lang.en" | "lang.fr", string>;
};

export default function Header({ labels, showPictureApp, showAdmin, session, authLabels, locale, langlabels }: HeaderProps) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);  

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));
      const progress = clamp(scrollY / 80, 0, 1);

      gsap.to(leftRef.current, {
        marginTop: `${16 - 8 * progress}px`,
        marginLeft: `${16 - 8 * progress}px`,
        marginBottom: `${16 - 8 * progress}px`,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(rightRef.current, {
        marginTop: `${16 - 8 * progress}px`,
        marginRight: `${16 - 8 * progress}px`,
        duration: 0.3,
        ease: "power2.out",
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full h-24 z-40 pointer-events-none mask-[linear-gradient(to_bottom,black_60%,transparent_100%)] [backdrop-filter:blur(16px)] [--tw-backdrop-blur:blur(16px)]"
      />
      <header
        className="fixed top-0 left-0 w-full flex z-50 transition-all bg-base-100/80 backdrop-blur-md border-b border-primary/20 shadow-lg"
      >

        <div ref={leftRef} className="flex items-center gap-2 m-4 w-fit h-fit bg-base-100/90 p-2 rounded-full shadow border border-primary/10">
          <div className="drawer smmd:hidden">
            <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex">
              <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle active:animate-ping">
                <Menu size={24} />
              </label>
              <NavLink href="/"
                      className="text-2xl px-3 rounded-full w-fit">
                <span>{labels["home"]}</span>
              </NavLink>
            </div>
            <div className="drawer-side z-50">
              <label htmlFor="nav-drawer" className="drawer-overlay"></label>
              <DrawerNav 
                labels={labels}
                showPictureApp={showPictureApp}
                showAdmin={showAdmin}
              />
            </div>
          </div>

          <HeaderNav 
            labels={labels}
            showPictureApp={showPictureApp}
            showAdmin={showAdmin}
          />
        </div>


        <div className="flex-1"/>

        <div ref={rightRef} className="w-fit h-fit bg-base-100/90 p-2 rounded-full shadow border border-primary/10"
                style={{marginRight: "16px", marginTop: "16px"}}>
          <div className="flex items-center gap-2 drawer drawer-end">
              <HeaderAuthButton 
                session={session}
                labels={authLabels}
              />

              <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex items-center">
                <label htmlFor="settings-drawer" className="btn btn-ghost btn-circle active:animate-spin">
                    <Settings size={24} />
                </label>
              </div>
              <div className="drawer-side z-50">
                <label htmlFor="settings-drawer" className="drawer-overlay"></label>
                <DrawerSettings 
                    locale={locale}
                    labels={langlabels}
                />
              </div>
          </div>
        </div>
      </header>
    </>
  );
}
