<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Board interest-registration PDFs are generated exclusively in the authenticated CMS browser from its loaded snapshot, with an explicit field allowlist; this keeps exports read-only and independent of backend permissions or public forms.
- PDF reports embed the approved font assets and derive colours from global design tokens; this preserves branding without adding a separate palette.
