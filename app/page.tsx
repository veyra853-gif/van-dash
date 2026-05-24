"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { push } = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      username: event.currentTarget.username.value,
      password: event.currentTarget.password.value,
    };

    try {
      const { data } = await axios.post("/api/auth/login", payload);

      alert(JSON.stringify(data));
      window.location.replace("/dashboard");
    } catch (e) {
      const error = e as AxiosError;

      alert(error.message);
    }
  };

  return (



<>
  <section className="min-h-screen w-full bg-gradient-to-br from-[#0b0f1a] via-[#0d1224] to-[#111827] px-4 py-10 flex items-center justify-center">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="rounded-2xl bg-white shadow-[0_10px_30px_rgba(255,255,255,0.2)] ring-1 ring-white/70 p-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={180}
            priority
            className="w-36 sm:w-44 h-auto"
          />
        </div>
      </div>

      {/* Card */}
      <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative p-6 sm:p-8">
          <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
          <p className="text-center text-sm text-white/60 mt-1 mb-6">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                className="w-full rounded-xl bg-white/5 text-white placeholder-white/40 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#f0b187]/60 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full rounded-xl bg-white/5 text-white placeholder-white/40 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#f0b187]/60 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#c98275] via-[#b97369] to-[#a8635a] text-white font-medium py-3 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c98275]/70 focus-visible:ring-offset-black/20"
            >
              <span>Login</span>
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-white/50">
        <span>© {new Date().getFullYear()} Vanguard Group</span>
      </div>
    </div>
  </section>
  <style
        dangerouslySetInnerHTML={{
          __html: "\n  #sidenavv{\n    display:none;\n} ",
        }}
      />
</>

  );
}