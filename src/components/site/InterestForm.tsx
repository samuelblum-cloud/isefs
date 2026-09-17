import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Field, Honeypot, TextInput } from "@/components/site/FormField";
import { areasOfInterestOptions } from "@/content/site";
import { interestSchema, submitInterest } from "@/lib/enquiries.functions";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

export function InterestForm() {
  const submit = useServerFn(submitInterest);
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [areas, setAreas] = useState<string[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = new FormData(event.currentTarget);
    const payload = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      country: String(form.get("country") ?? ""),
      specialty: String(form.get("specialty") ?? ""),
      institution: String(form.get("institution") ?? ""),
      areasOfInterest: areas,
      newsletterConsent: form.get("newsletterConsent") === "on",
      privacyAccepted: form.get("privacyAccepted") === "on",
      website: honeypot,
      elapsedMs: Date.now() - startedAt.current,
    };

    const parsed = interestSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("idle");
      setFormError("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");

    try {
      const result = await submit({ data: parsed.data });
      if (result.status === "ok") {
        setStatus("success");
      } else if (result.status === "duplicate") {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setFormError(result.message);
      }
    } catch {
      setStatus("error");
      setFormError("We could not reach the Society's servers. Please try again shortly.");
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div
        role="status"
        className="rounded-sm border border-accent/40 bg-surface p-8"
        aria-live="polite"
      >
        <h3 className="text-xl">Thank you — your interest has been recorded.</h3>
        <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
          {status === "duplicate"
            ? "Your email address is already on our list, so there is nothing further to do. We will be in touch as the Society's activities are confirmed."
            : "We will contact you with news about the Society, membership and upcoming educational activities. Registering your interest does not constitute admission to membership."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors["firstName"]}>
          <TextInput
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            error={errors["firstName"]}
          />
        </Field>
        <Field id="lastName" label="Last name" error={errors["lastName"]}>
          <TextInput
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            error={errors["lastName"]}
          />
        </Field>
      </div>

      <Field id="email" label="Email address" error={errors["email"]}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors["email"]}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="country" label="Country" error={errors["country"]}>
          <TextInput
            id="country"
            name="country"
            autoComplete="country-name"
            required
            error={errors["country"]}
          />
        </Field>
        <Field id="specialty" label="Specialty or professional role" error={errors["specialty"]}>
          <TextInput id="specialty" name="specialty" required error={errors["specialty"]} />
        </Field>
      </div>

      <Field id="institution" label="Institution" optional error={errors["institution"]}>
        <TextInput id="institution" name="institution" error={errors["institution"]} />
      </Field>

      <fieldset>
        <legend className="text-sm font-medium text-foreground">Areas of interest</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {areasOfInterestOptions.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-rule px-3.5 py-3 text-sm hover:border-accent"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--accent)]"
                checked={areas.includes(option.value)}
                onChange={(event) =>
                  setAreas((prev) =>
                    event.target.checked
                      ? [...prev, option.value]
                      : prev.filter((v) => v !== option.value),
                  )
                }
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors["areasOfInterest"] ? (
          <p role="alert" className="mt-1.5 text-sm text-destructive">
            {errors["areasOfInterest"]}
          </p>
        ) : null}
      </fieldset>

      <div className="space-y-3 rounded-sm bg-surface p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="privacyAccepted"
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            I understand that my details will be used by the Society to respond to my enquiry and
            to send information about membership and educational activities, as set out in the{" "}
            <Link to="/privacy" className="underline underline-offset-4">
              privacy information
            </Link>
            .
          </span>
        </label>
        {errors["privacyAccepted"] ? (
          <p role="alert" className="text-sm text-destructive">
            {errors["privacyAccepted"]}
          </p>
        ) : null}
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="newsletterConsent"
            className="mt-1 h-4 w-4 accent-[var(--accent)]"
          />
          <span>
            Optional: I would also like to receive the Society's newsletter. I can withdraw this at
            any time.
          </span>
        </label>
      </div>

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Register your interest"
        )}
      </button>
      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your registration" : ""}
      </p>
    </form>
  );
}
