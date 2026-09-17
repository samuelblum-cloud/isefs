-- ISEFS integrated CMS: structured page versions, content blocks, media and admin access.
-- This migration is additive. Existing public pages and form submissions remain intact.

CREATE TYPE public.cms_admin_role AS ENUM ('owner', 'editor');
CREATE TYPE public.cms_version_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.cms_admin_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_normalised text GENERATED ALWAYS AS (lower(btrim(email))) STORED,
  role public.cms_admin_role NOT NULL DEFAULT 'editor',
  active boolean NOT NULL DEFAULT true,
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email_normalised)
);

CREATE TABLE public.cms_admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.cms_admin_role NOT NULL DEFAULT 'editor',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.cms_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_admin_users
    WHERE user_id = auth.uid() AND active = true
  );
$$;

REVOKE ALL ON FUNCTION public.cms_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.accept_cms_admin_invitation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invited_role public.cms_admin_role;
BEGIN
  SELECT role INTO invited_role
  FROM public.cms_admin_invitations
  WHERE email_normalised = lower(btrim(NEW.email))
    AND active = true
    AND accepted_by IS NULL
  LIMIT 1;

  IF invited_role IS NOT NULL THEN
    INSERT INTO public.cms_admin_users (user_id, role)
    VALUES (NEW.id, invited_role)
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, active = true, updated_at = now();

    UPDATE public.cms_admin_invitations
    SET accepted_by = NEW.id, accepted_at = now()
    WHERE email_normalised = lower(btrim(NEW.email));
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER accept_cms_admin_invitation_on_signup
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.accept_cms_admin_invitation();

-- The known Managing Director address is an invitation, not an authentication secret.
INSERT INTO public.cms_admin_invitations (email, role)
VALUES ('samuel.blum@zurich-law.com', 'owner')
ON CONFLICT (email_normalised) DO NOTHING;

INSERT INTO public.cms_admin_users (user_id, role)
SELECT id, 'owner'::public.cms_admin_role
FROM auth.users
WHERE lower(btrim(email)) = 'samuel.blum@zurich-law.com'
ON CONFLICT (user_id) DO UPDATE
SET role = EXCLUDED.role, active = true, updated_at = now();

UPDATE public.cms_admin_invitations invitation
SET accepted_by = account.id, accepted_at = COALESCE(invitation.accepted_at, now())
FROM auth.users account
WHERE invitation.email_normalised = lower(btrim(account.email))
  AND invitation.email_normalised = 'samuel.blum@zurich-law.com';

CREATE TABLE public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9][a-z0-9-]*$'),
  internal_name text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cms_page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  version_number integer NOT NULL CHECK (version_number > 0),
  status public.cms_version_status NOT NULL DEFAULT 'draft',
  page_title text NOT NULL,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  UNIQUE (page_id, version_number)
);

CREATE UNIQUE INDEX cms_one_draft_per_page
  ON public.cms_page_versions (page_id) WHERE status = 'draft';
CREATE UNIQUE INDEX cms_one_published_per_page
  ON public.cms_page_versions (page_id) WHERE status = 'published';

CREATE TABLE public.cms_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_version_id uuid NOT NULL REFERENCES public.cms_page_versions(id) ON DELETE CASCADE,
  block_type text NOT NULL,
  internal_name text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_version_id, position)
);

CREATE TABLE public.cms_media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  title text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  rights_holder text NOT NULL DEFAULT '',
  rights_note text NOT NULL DEFAULT '',
  focal_x numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (focal_x BETWEEN 0 AND 1),
  focal_y numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (focal_y BETWEEN 0 AND 1),
  is_public boolean NOT NULL DEFAULT true,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.interest_registrations
  ADD COLUMN workflow_status text NOT NULL DEFAULT 'new'
    CHECK (workflow_status IN ('new', 'reviewing', 'contacted', 'closed')),
  ADD COLUMN internal_notes text NOT NULL DEFAULT '';

ALTER TABLE public.contact_enquiries
  ADD COLUMN workflow_status text NOT NULL DEFAULT 'new'
    CHECK (workflow_status IN ('new', 'reviewing', 'answered', 'closed')),
  ADD COLUMN internal_notes text NOT NULL DEFAULT '';

CREATE TRIGGER update_cms_admin_users_updated_at
  BEFORE UPDATE ON public.cms_admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_page_versions_updated_at
  BEFORE UPDATE ON public.cms_page_versions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_content_blocks_updated_at
  BEFORE UPDATE ON public.cms_content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_media_assets_updated_at
  BEFORE UPDATE ON public.cms_media_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.cms_admin_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMS admins can read their own role"
  ON public.cms_admin_users FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND active = true);

CREATE POLICY "CMS owners manage invitations"
  ON public.cms_admin_invitations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_admin_users
      WHERE user_id = auth.uid() AND active = true AND role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cms_admin_users
      WHERE user_id = auth.uid() AND active = true AND role = 'owner'
    )
  );

CREATE POLICY "Published CMS pages are public"
  ON public.cms_pages FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_page_versions
      WHERE page_id = cms_pages.id AND status = 'published'
    ) OR public.cms_is_admin()
  );

CREATE POLICY "CMS admins manage pages"
  ON public.cms_pages FOR ALL TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

CREATE POLICY "Published CMS versions are public"
  ON public.cms_page_versions FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.cms_is_admin());

CREATE POLICY "CMS admins manage page versions"
  ON public.cms_page_versions FOR ALL TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

CREATE POLICY "Published CMS blocks are public"
  ON public.cms_content_blocks FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_page_versions
      WHERE id = cms_content_blocks.page_version_id AND status = 'published'
    ) OR public.cms_is_admin()
  );

CREATE POLICY "CMS admins manage content blocks"
  ON public.cms_content_blocks FOR ALL TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

CREATE POLICY "Public media metadata is readable"
  ON public.cms_media_assets FOR SELECT TO anon, authenticated
  USING (is_public = true OR public.cms_is_admin());

CREATE POLICY "CMS admins manage media metadata"
  ON public.cms_media_assets FOR ALL TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

CREATE POLICY "CMS admins read interest registrations"
  ON public.interest_registrations FOR SELECT TO authenticated
  USING (public.cms_is_admin());
CREATE POLICY "CMS admins update interest registrations"
  ON public.interest_registrations FOR UPDATE TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

CREATE POLICY "CMS admins read contact enquiries"
  ON public.contact_enquiries FOR SELECT TO authenticated
  USING (public.cms_is_admin());
CREATE POLICY "CMS admins update contact enquiries"
  ON public.contact_enquiries FOR UPDATE TO authenticated
  USING (public.cms_is_admin())
  WITH CHECK (public.cms_is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view CMS media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-media');
CREATE POLICY "CMS admins upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-media' AND public.cms_is_admin());
CREATE POLICY "CMS admins update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-media' AND public.cms_is_admin())
  WITH CHECK (bucket_id = 'cms-media' AND public.cms_is_admin());
CREATE POLICY "CMS admins delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cms-media' AND public.cms_is_admin());

CREATE OR REPLACE FUNCTION public.publish_cms_page(target_page_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  draft_version public.cms_page_versions%ROWTYPE;
  next_draft_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.cms_admin_users
    WHERE user_id = auth.uid() AND active = true AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'CMS owner access required to publish';
  END IF;

  SELECT * INTO draft_version
  FROM public.cms_page_versions
  WHERE page_id = target_page_id AND status = 'draft'
  FOR UPDATE;

  IF draft_version.id IS NULL THEN
    RAISE EXCEPTION 'No draft exists for this page';
  END IF;

  UPDATE public.cms_page_versions
  SET status = 'archived'
  WHERE page_id = target_page_id AND status = 'published';

  UPDATE public.cms_page_versions
  SET status = 'published', published_at = now(), updated_at = now()
  WHERE id = draft_version.id;

  INSERT INTO public.cms_page_versions (
    page_id, version_number, status, page_title, meta_title, meta_description, created_by
  ) VALUES (
    target_page_id,
    draft_version.version_number + 1,
    'draft',
    draft_version.page_title,
    draft_version.meta_title,
    draft_version.meta_description,
    auth.uid()
  ) RETURNING id INTO next_draft_id;

  INSERT INTO public.cms_content_blocks (
    page_version_id, block_type, internal_name, position, visible, data
  )
  SELECT next_draft_id, block_type, internal_name, position, visible, data
  FROM public.cms_content_blocks
  WHERE page_version_id = draft_version.id
  ORDER BY position;

  RETURN draft_version.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.save_cms_draft(
  target_version_id uuid,
  input_page_title text,
  input_meta_title text,
  input_meta_description text,
  input_blocks jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  item_position integer := 0;
BEGIN
  IF NOT public.cms_is_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.cms_page_versions
    WHERE id = target_version_id AND status = 'draft'
  ) THEN
    RAISE EXCEPTION 'Draft version not found';
  END IF;

  UPDATE public.cms_page_versions
  SET page_title = input_page_title,
      meta_title = input_meta_title,
      meta_description = input_meta_description,
      updated_at = now()
  WHERE id = target_version_id;

  DELETE FROM public.cms_content_blocks WHERE page_version_id = target_version_id;

  FOR item IN SELECT value FROM jsonb_array_elements(COALESCE(input_blocks, '[]'::jsonb))
  LOOP
    INSERT INTO public.cms_content_blocks (
      page_version_id, block_type, internal_name, position, visible, data
    ) VALUES (
      target_version_id,
      item->>'blockType',
      COALESCE(NULLIF(item->>'internalName', ''), item->>'blockType'),
      item_position,
      COALESCE((item->>'visible')::boolean, true),
      COALESCE(item->'data', '{}'::jsonb)
    );
    item_position := item_position + 1;
  END LOOP;

  RETURN target_version_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_cms_page(
  input_slug text,
  input_internal_name text,
  input_page_title text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_page_id uuid;
BEGIN
  IF NOT public.cms_is_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required';
  END IF;

  INSERT INTO public.cms_pages (slug, internal_name, created_by)
  VALUES (input_slug, input_internal_name, auth.uid())
  RETURNING id INTO new_page_id;

  INSERT INTO public.cms_page_versions (
    page_id, version_number, status, page_title, meta_title, meta_description, created_by
  ) VALUES (
    new_page_id, 1, 'draft', input_page_title, input_page_title || ' — ISEFS', '', auth.uid()
  );

  RETURN new_page_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_cms_admin_invitation(
  input_email text,
  input_role public.cms_admin_role
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_id uuid;
  existing_user_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.cms_admin_users
    WHERE user_id = auth.uid() AND active = true AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'CMS owner access required';
  END IF;

  IF input_email IS NULL OR btrim(input_email) = '' THEN
    RAISE EXCEPTION 'Email address is required';
  END IF;

  INSERT INTO public.cms_admin_invitations (email, role, active)
  VALUES (lower(btrim(input_email)), input_role, true)
  ON CONFLICT (email_normalised) DO UPDATE
  SET email = EXCLUDED.email,
      role = EXCLUDED.role,
      active = true
  RETURNING id INTO invitation_id;

  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE lower(btrim(email)) = lower(btrim(input_email))
  LIMIT 1;

  IF existing_user_id IS NOT NULL THEN
    INSERT INTO public.cms_admin_users (user_id, role, active)
    VALUES (existing_user_id, input_role, true)
    ON CONFLICT (user_id) DO UPDATE
    SET role = EXCLUDED.role, active = true, updated_at = now();

    UPDATE public.cms_admin_invitations
    SET accepted_by = existing_user_id,
        accepted_at = COALESCE(accepted_at, now())
    WHERE id = invitation_id;
  END IF;

  RETURN invitation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_cms_page_version(
  target_page_id uuid,
  source_version_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  source_version public.cms_page_versions%ROWTYPE;
  new_draft_id uuid;
  next_number integer;
BEGIN
  IF NOT public.cms_is_admin() THEN
    RAISE EXCEPTION 'CMS administrator access required';
  END IF;

  SELECT * INTO source_version
  FROM public.cms_page_versions
  WHERE id = source_version_id AND page_id = target_page_id;

  IF source_version.id IS NULL THEN
    RAISE EXCEPTION 'Source version not found';
  END IF;

  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_number
  FROM public.cms_page_versions WHERE page_id = target_page_id;

  DELETE FROM public.cms_page_versions
  WHERE page_id = target_page_id AND status = 'draft';

  INSERT INTO public.cms_page_versions (
    page_id, version_number, status, page_title, meta_title, meta_description, created_by
  ) VALUES (
    target_page_id, next_number, 'draft', source_version.page_title,
    source_version.meta_title, source_version.meta_description, auth.uid()
  ) RETURNING id INTO new_draft_id;

  INSERT INTO public.cms_content_blocks (
    page_version_id, block_type, internal_name, position, visible, data
  )
  SELECT new_draft_id, block_type, internal_name, position, visible, data
  FROM public.cms_content_blocks
  WHERE page_version_id = source_version_id
  ORDER BY position;

  RETURN new_draft_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.publish_cms_page(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.restore_cms_page_version(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_cms_draft(uuid, text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_cms_page(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_cms_admin_invitation(text, public.cms_admin_role) TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_page_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_content_blocks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_media_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_admin_invitations TO authenticated;
GRANT SELECT ON public.cms_admin_users TO authenticated;
GRANT SELECT, UPDATE ON public.interest_registrations TO authenticated;
GRANT SELECT, UPDATE ON public.contact_enquiries TO authenticated;

GRANT SELECT ON public.cms_pages, public.cms_page_versions, public.cms_content_blocks,
  public.cms_media_assets TO anon;
