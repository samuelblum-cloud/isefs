CREATE TABLE public.interest_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  email_normalised text GENERATED ALWAYS AS (lower(btrim(email))) STORED,
  country text NOT NULL,
  specialty text NOT NULL,
  institution text,
  areas_of_interest text[] NOT NULL DEFAULT '{}',
  newsletter_consent boolean NOT NULL DEFAULT false,
  privacy_accepted_at timestamp with time zone,
  source text NOT NULL DEFAULT 'website',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX interest_registrations_email_unique ON public.interest_registrations (email_normalised);

CREATE TABLE public.contact_enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.interest_registrations TO service_role;
GRANT ALL ON public.contact_enquiries TO service_role;

ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public read of interest registrations"
  ON public.interest_registrations FOR SELECT TO authenticated USING (false);

CREATE POLICY "No public read of contact enquiries"
  ON public.contact_enquiries FOR SELECT TO authenticated USING (false);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_interest_registrations_updated_at
  BEFORE UPDATE ON public.interest_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_enquiries_updated_at
  BEFORE UPDATE ON public.contact_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();