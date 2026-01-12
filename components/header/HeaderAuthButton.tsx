"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { User } from "lucide-react";

type Props = {
  session: Session | null;
  labels: Record<"login" | "dashboard" | "logout", string>;
};

export default function HeaderAuthButton({ session, labels }: Props) {
  const avatarSrc = session?.user?.image;
  const altText = session?.user?.name ? `${session.user.name} avatar` : labels.login;

  if (!session) {
    return (
      <Link
        href="/login"
        className="btn btn-ghost rounded-full text-lg xs:text-2xl"
        aria-label={labels.login}
      >
        {labels.login}
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end group">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle"
        aria-label={labels.dashboard}
      >
        <div className="avatar">
          <div className="w-10 rounded-full overflow-hidden ring-2 ring-transparent ring-offset-2 ring-offset-base-100 group-focus-within:ring-primary transition-all flex items-center justify-center bg-base-300">
            {avatarSrc ? (
              <Image src={avatarSrc} alt={altText} width={34} height={34} />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
        </div>
      </button>
      <ul className="menu menu-sm dropdown-content z-50 mt-6 p-2 shadow border-2 border-primary/40 bg-base-100/95 rounded-box w-52 translate-x-15">
        <li>
          <button onClick={() => signOut({ callbackUrl: "/" })}>{labels.logout}</button>
        </li>
      </ul>
    </div>
  );
}
