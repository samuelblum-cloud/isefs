import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const areaValues = ["membership", "courses", "fellowship", "collaboration"] as const;

export const interestSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(80),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(80),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(200),
  country: z.string().trim().min(2, "Please enter your country.").max(80),
  specialty: z
    .string()
    .trim()
    .min(2, "Please enter your specialty or professional role.")
    .max(120),
  institution: z.string().trim().max(160).optional().or(z.literal("")),
  areasOfInterest: z
    .array(z.enum(areaValues))
    .min(1, "Please select at least one area of interest."),
  newsletterConsent: z.boolean().default(false),
  privacyAccepted: z
    .boolean()
    .refine((v) => v === true, "Please confirm how your details will be used."),
  // Spam protection
  website: z.string().max(0).optional().or(z.literal("")),
  elapsedMs: z.number().int().nonnegative(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address.")
    .max(200),
  subject: z.string().trim().min(2, "Please enter a subject.").max(160),
  message: z
    .string()
    .trim()
    .min(10, "Please enter a message of at least 10 characters.")
    .max(4000),
  website: z.string().max(0).optional().or(z.literal("")),
  elapsedMs: z.number().int().nonnegative(),
});

export type InterestInput = z.input<typeof interestSchema>;
export type ContactInput = z.input<typeof contactSchema>;

const MIN_COMPLETION_MS = 2500;

export type SubmissionResult =
  | { status: "ok" }
  | { status: "duplicate" }
  | { status: "error"; message: string };

export const submitInterest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => interestSchema.parse(data))
  .handler(async ({ data }): Promise<SubmissionResult> => {
    if (data.website) return { status: "ok" };
    if (data.elapsedMs < MIN_COMPLETION_MS) {
      return {
        status: "error",
        message: "That was submitted very quickly. Please try again.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("interest_registrations").insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      country: data.country,
      specialty: data.specialty,
      institution: data.institution ? data.institution : null,
      areas_of_interest: data.areasOfInterest,
      newsletter_consent: data.newsletterConsent ?? false,
      privacy_accepted_at: new Date().toISOString(),
    });

    if (error) {
      if (error.code === "23505") return { status: "duplicate" };
      console.error("[interest_registrations] insert failed", error.message);
      return {
        status: "error",
        message: "We could not save your registration. Please try again shortly.",
      };
    }

    return { status: "ok" };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<SubmissionResult> => {
    if (data.website) return { status: "ok" };
    if (data.elapsedMs < MIN_COMPLETION_MS) {
      return {
        status: "error",
        message: "That was submitted very quickly. Please try again.",
      };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("contact_enquiries").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    if (error) {
      console.error("[contact_enquiries] insert failed", error.message);
      return {
        status: "error",
        message: "We could not send your enquiry. Please try again shortly.",
      };
    }

    return { status: "ok" };
  });
