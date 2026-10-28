import { FormEvent, useState } from "react";

type LoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f2f2ef] lg:grid-cols-[1fr_620px]">
      <section className="hidden border-r border-black bg-[#11110f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em]">
          <span className="h-2 w-2 bg-amber-400" />
          Zimbabwe School of Mines
        </div>
        <div className="max-w-xl">
          <p className="mb-6 font-mono text-xs text-white/45">
            BLAST / DESIGN / 01
          </p>
          <h1 className="text-3xl font-medium leading-[1.05] tracking-[-0.04em]">
            Tadiwa Malcom Mleka
          </h1>
          <h1 className="text-3xl font-medium leading-[1.05] tracking-[-0.04em]">
            Candidate Number : Z24191
          </h1>
          <div className="mt-10 h-px bg-white/20" />
          <p className="mt-5 text-md text-white/80 ">
            Blast Design & Fragmentation Prototype for Sabi Gold Mine
          </p>
        </div>
        <p className="font-mono text-xs text-white/35">CANDIDATE Z24191</p>
      </section>

      <section className="flex items-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-14 lg:hidden">
            <span className="mb-5 block h-2 w-2 bg-amber-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Zimbabwe School of Mines
            </p>
          </div>
          <h2 className="mt-3 text-3xl uppercase font-bold tracking-[-0.035em] text-slate-950">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-slate-400 bg-transparent px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-slate-400 bg-transparent px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-black focus:bg-white"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full border border-black bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </form>

          <div className="mt-14 border-t border-slate-300 pt-5 text-xs leading-5 text-slate-500">
            {" "}
          </div>
        </div>
      </section>
    </main>
  );
}
