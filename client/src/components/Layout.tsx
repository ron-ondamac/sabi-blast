import { ReactNode } from "react";

export default function Layout(props: {
  children: ReactNode;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-xs font-bold tracking-wider text-amber-400">
              BD
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Blast Design & Fragmentation Prototype
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={props.onLogout}
            className="self-start border border-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-black hover:text-white sm:self-auto"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{props.children}</main>
    </div>
  );
}
