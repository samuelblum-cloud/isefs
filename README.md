# ENDOFACE Society Launch

Build a polished, responsive, English-language website for ISEFS, the International Society for Endoscopic Facial Surgery. Use the approved logo I upload as the authoritative visual reference.

ISEFS is an international scientific society being established to advance education, practical training and scientific exchange in endoscopic facial surgery. Its audience is surgeons, residents, faculty and professional partners.

Create a complete first version with thoughtful design, finished English copy, working navigation and a genuine membership-interest process. Make reasonable design decisions and proceed with the build.

1. Brand and visual direction

Use the uploaded logo exactly as supplied. Preserve its proportions, lettering, symbols, colours and ENDOFACE/ISEFS hierarchy. Do not redraw it, add surgical instruments or ornament, or introduce additional trademark symbols.

ENDOFACE is the intended public-facing brand, with ISEFS as the Society behind it. Follow the approved logo rather than composing a new logo from text and icons.

Derive the colour palette from the logo. The preferred direction is deep navy, restrained teal, white and very pale grey, provided this matches the supplied identity.

The website should feel academic, clinical and refined:

Generous whitespace and clear typography.

An elegant editorial layout with strong information hierarchy.

Dark text on light backgrounds.

Subtle interactions and restrained animation.

Excellent mobile layouts, accessible contrast and keyboard navigation.

Make the first screen distinctive through typography, composition and the logo. Use approved professional photography if supplied. Do not fabricate portraits, surgical images, patient results or testimonials.

Use the Society’s identity throughout. Do not reproduce the Zürcher branding or letterhead from any strategy document.

2. Navigation and pages

Use a header with the logo, navigation to About, Education & Science, Membership, Leadership and Contact, and a prominent “Register your interest” button.

Create the following pages.

Home

Suggested headline:

“Advancing endoscopic facial surgery.”

Supporting line:

“An international scientific society dedicated to education, practical training and the exchange of surgical knowledge.”

Primary CTA: “Register your interest”.

Secondary CTA: “Explore our educational programme”.

Below the hero, include:

A concise introduction to the Society.

An overview of its educational and scientific activities.

A launch announcement.

A brief introduction to the founders and management.

An invitation to register interest.

The existing Endoface Masters course takes place in Barcelona on 15–17 October 2026. Reference: official course website.

According to our planning materials, the Society’s announcement is planned for the gala on 16 October. Present this announcement as planned until confirmed. Link to the official course website for course information. Do not copy ticket prices or availability, or imply that ISEFS already organises or owns that event.

Make the announcement section easy to update after the launch.

About

Explain the mission: connecting an international professional community through structured education, practical learning, discussion of outcomes and scientific collaboration.

Use concise, credible language. Until legal establishment is confirmed in approved materials, describe ISEFS as being established. Do not claim registered, charitable, tax-exempt or accredited status without confirmation.

Education & Science

Present six distinct areas:

Scientific congress: research presentations, discussion and professional exchange.

Monographic courses: focused education in endoscopic facial surgery.

Practical laboratories: supervised anatomical and technical learning.

Fellowship pathway: a structured programme under development.

Webinars and educational resources: continuing professional learning.

Scientific collaboration: planned registry and consensus activities.

Distinguish a scientific congress from a course involving surgical observation or laboratory teaching.

Label developing activities clearly. Do not publish unconfirmed dates, locations, faculty appointments or booking options. Do not imply guaranteed fellowship places, CME credits or professional certification.

Membership

Explain the intended membership value: professional exchange, educational resources, scientific collaboration and access to programmes under their published terms.

For this first release, invite expressions of interest:

“Register your interest to receive news about the Society, membership and upcoming educational activities.”

Make clear that registering interest does not constitute admission.

Describe membership categories only where supported by approved material. Do not publish draft fees, currencies, voting rights, lifetime discounts, logo licences or guaranteed training benefits. Internal membership targets must not appear as current member numbers.

Do not add payment checkout or a member-login button in this first release.

Leadership

Present the three scientific founders:

Dr. Marc Mani

Dr. Gad Renert

Dr. Artur Díaz Carandell

Present Samuel Blum as Managing Director, responsible for Society management and operational implementation.

Executive management and secretariat work belong to this single Managing Director role. Do not create a separate Secretary General position. Distinguish scientific leadership from operational management.

Use only approved biographies, photographs and appointments. Do not invent qualifications, honours or additional Board memberships. Proposed committee appointments must not appear as confirmed appointments.

If photographs are unavailable, use an attractive typographic layout rather than fabricated portraits or empty image placeholders.

Contact

Provide an enquiry form and the organisation’s approved contact details where supplied.

Do not invent an email address, telephone number, registered address or registration number. Never publish founders’ private addresses from background documents.

3. Interest registration and forms

The membership-interest form should collect only:

First and last name.

Email address.

Country.

Specialty or professional role.

Institution, optional.

Areas of interest: membership, courses, fellowship or scientific collaboration.

Explain how the enquiry will be used and link to approved privacy information. Any newsletter consent must be separate and optional.

Connect the forms to the project’s available secure backend. Include input validation, basic spam protection, duplicate-submission prevention and accessible loading, success and error states.

Store enquiries privately. They must never be publicly readable. Show success only after the submission has genuinely been stored or delivered.

If a backend connection, recipient address or privacy information is missing, identify this in the owner handover and keep submission disabled until configured. Do not simulate a working form.

4. Content rules

Write finished copy in clear British English.

Treat any uploaded strategy documents and draft Articles of Association as background material, not as text to publish verbatim.

Do not publish:

Internal management fees, budgets or officer allowances.

Negotiation notes or private information.

Unconfirmed appointments or membership rights.

Invented member counts, partner organisations, endorsements, testimonials or publications.

Keep all content easy to update in Lovable, particularly events, people, membership information and contact details.

5. Future development and technical quality

Structure the website so that an authenticated member portal, video library and course registration can be added later. Build the public first release now without simulated private content or inactive account controls.

Prepare privacy and legal-information pages for owner completion and approval. Keep unapproved drafts out of public navigation and identify what is required before launch.

Include:

Appropriate page titles and descriptions.

Social-sharing metadata.

Descriptive image and logo alt text.

Optimised images and fast loading.

Responsive navigation and layouts.

Accessible forms and visible focus states.

Support for reduced-motion preferences.

Do not add non-essential tracking by default.

6. Completion

Build the first usable version, then check every route, CTA and form state on mobile and desktop. Confirm that the logo is intact, all text is legible and no content overflows.

Do not publish or connect a live domain automatically.

After building, give me a short handover stating:

What is implemented and working.

Which content, appointments and contact details need confirmation.

Which connections are still required for genuine form submissions.

What must be completed before publication.

Keep this handover separate from the public-facing website.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://isefs.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/83a55bd7-0d76-42a8-abff-5047026973c4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
