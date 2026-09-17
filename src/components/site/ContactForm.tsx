import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Field, Honeypot, TextArea, TextInput } from "@/components/site/FormField";
import { contactSchema, submitContact } from "@/lib/enquiries.functions";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const submit = useServerFn(submitContact);
  const startedAt = useRef(Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
      website: honeypot,
      elapsedMs: Date.now() - startedAt.current,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setFormError("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");

    try {
      const result = await submit({ data: parsed.data });
      if (result.status === "error") {
        setStatus("error");
        setFormError(result.message);
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setFormError("We could not reach the Society's servers. Please try again shortly.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="rounded-sm border border-accent/40 bg-surface p-8">
        <h3 className="text-xl">Thank you — your enquiry has been received.</h3>
        <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">
          Your message has been recorded and the Society's office will respond as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors["name"]}>
          <TextInput id="name" name="name" autoComplete="name" required error={errors["name"]} />
        </Field>
        <Field id="contact-email" label="Email address" error={errors["email"]}>
          <TextInput
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            error={errors["email"]}
          />
        </Field>
      </div>

      <Field id="subject" label="Subject" error={errors["subject"]}>
        <TextInput id="subject" name="subject" required error={errors["subject"]} />
      </Field>

      <Field id="message" label="Message" error={errors["message"]}>
        <TextArea id="message" name="message" rows={6} required error={errors["message"]} />
      </Field>

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
          "Send enquiry"
        )}
      </button>
    </form>
  );
}
