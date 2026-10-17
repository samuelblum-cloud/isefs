DROP POLICY IF EXISTS "Public can view CMS media" ON storage.objects;
CREATE POLICY "CMS admins list media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'cms-media' AND public.cms_is_admin());