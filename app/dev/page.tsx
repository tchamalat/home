import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center justify-between py-20 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Let's dev a little.
        </h1>
        <div className="flex py-20 gap-4 font-medium">
          <a
            className="flex text-orange-800 hover:text-neutral-400 bg-neutral-800 hover:bg-orange-900 items-center justify-center gap-2 rounded-full px-5 transition-colors md:w-[158px]"
            href="https://pve.romantcham.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Proxmox
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
