import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isefsLogoUrl } from "@/content/assets";
import { registerInvitedCmsUser } from "@/cms/admin-api";

export const Route = createFileRoute("/admin/register")({
  head: () => ({ meta: [{ title: "Activate ISEFS CMS access" }] }),
  component: CmsRegistrationPage,
});

function CmsRegistrationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerInvitedCmsUser(email, password);
      if (result.session) {
        await navigate({ to: "/admin" });
      } else {
        setMessage(
          "Account created. Please confirm your email address, then return to the CMS sign-in page.",
        );
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The account could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-5 py-12">
      <div className="w-full max-w-md rounded-sm border border-rule bg-background p-8 sm:p-10">
        <img
          src={isefsLogoUrl}
          alt="ISEFS — International Society for Endoscopic Facial Surgery"
          className="h-auto w-full max-w-[280px]"
        />
        <p className="eyebrow mt-10">Invitation-only access</p>
        <h1 className="mt-3 text-3xl">Activate your CMS account</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Use the email address authorised by the ISEFS management office. Choose your own password;
          it is handled by the secure authentication service and is never visible to the Society.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="cms-register-email">Email address</Label>
            <Input
              id="cms-register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label htmlFor="cms-register-password">Password</Label>
            <Input
              id="cms-register-password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12"
            />
          </div>
          <div>
            <Label htmlFor="cms-register-confirmation">Confirm password</Label>
            <Input
              id="cms-register-confirmation"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
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
          {message ? (
            <p className="rounded-sm bg-highlight p-3 text-sm text-foreground">{message}</p>
          ) : null}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Activate account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already activated?{" "}
          <Link to="/admin/login" className="link-inline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
