import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isefsLogoUrl } from "@/content/assets";
import { getCmsSession, signInCms } from "@/cms/admin-api";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "ISEFS CMS login" }] }),
  component: CmsLoginPage,
});

function CmsLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCmsSession()
      .then((session) => {
        if (session) navigate({ to: "/admin" });
      })
      .catch(() => undefined);
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signInCms(email, password);
      await navigate({ to: "/admin" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden border-r border-rule bg-primary px-12 py-16 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
          Management office
        </p>
        <div className="max-w-xl">
          <p className="text-4xl font-semibold leading-tight text-white">
            Manage ISEFS content with confidence.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Edit pages, events, people, images, resources and registrations. Review every change in
            context before publishing it.
          </p>
        </div>
        <p className="text-sm text-white/60">International Society for Endoscopic Facial Surgery</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md rounded-sm border border-rule bg-background p-8 sm:p-10">
          <img
            src={isefsLogoUrl}
            alt="ISEFS — International Society for Endoscopic Facial Surgery"
            className="h-auto w-full max-w-[280px]"
          />
          <p className="eyebrow mt-10">Secure administration</p>
          <h1 className="mt-3 text-3xl">Sign in to the ISEFS CMS</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Use the account invited by the management office. Public account registration is
            disabled.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="cms-email">Email address</Label>
              <Input
                id="cms-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="cms-password">Password</Label>
              <Input
                id="cms-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-12"
              />
            </div>
            {error ? (
              <p
                role="alert"
                className="rounded-sm border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Invited for the first time?{" "}
            <Link to="/admin/register" className="link-inline">
              Activate access
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
