import { endofaceLogoUrl } from "@/content/assets";
import {
  admissionNotes,
  announcement,
  educationAreas,
  founders,
  legalForm,
  management,
  membershipCategories,
  membershipValue,
  purposeStatements,
  society,
} from "@/content/site";

import type { CmsSeedPage } from "./types";

const founderCards = founders.map((person) => ({
  name: person.name,
  role: person.role,
  summary: "",
  imageUrl: "",
  imageAlt: "",
}));

const educationCards = educationAreas.map((area) => ({
  title: area.title,
  status: area.status,
  body: area.summary,
  detail: area.detail,
  eyebrow: "",
  imageUrl: "",
  imageAlt: "",
  linkLabel: "",
  linkUrl: "",
}));

export const defaultCmsPages: CmsSeedPage[] = [
  {
    slug: "home",
    internalName: "Home",
    pageTitle: "Home",
    metaTitle: "ISEFS — Advancing endoscopic facial surgery",
    metaDescription:
      "ISEFS is an international scientific society being established to advance education, practical training and scientific exchange in endoscopic facial surgery.",
    blocks: [
      {
        type: "hero",
        internalName: "Homepage introduction",
        data: {
          eyebrow: `${society.brand} · by ${society.shortName}`,
          title: society.tagline,
          lead: society.intro,
          statusText: society.status,
          imageUrl: endofaceLogoUrl,
          imageAlt: "ENDOFACE by ISEFS — International Society for Endoscopic Facial Surgery logo",
          primaryLabel: "Explore education",
          primaryUrl: "/education-and-science",
          secondaryLabel: "Register interest",
          secondaryUrl: "/membership#register",
        },
      },
      {
        type: "split_text",
        internalName: "Society introduction",
        data: {
          eyebrow: "The Society",
          title: "A professional community for a demanding discipline",
          paragraphs: [
            "Endoscopic facial surgery is a precise, technically demanding field. Progress depends on careful teaching, honest discussion of outcomes and sustained contact between surgeons working in different centres and health systems.",
            "ISEFS is being established to give that work a permanent home: a scientific society that brings together surgeons, residents, faculty and professional partners around structured education, supervised practical learning and shared scientific enquiry.",
          ],
          linkLabel: "Read about our mission",
          linkUrl: "/about",
          surface: false,
        },
      },
      {
        type: "card_grid",
        internalName: "Areas of activity",
        data: {
          eyebrow: "Education & Science",
          title: "Our areas of activity",
          intro: "",
          columns: "3",
          items: educationCards.map(({ detail: _detail, ...card }) => card),
          footer: "",
          linkLabel: "See the full programme",
          linkUrl: "/education-and-science",
          surface: true,
        },
      },
      {
        type: "event_feature",
        internalName: "Barcelona announcement",
        data: {
          eyebrow: "Launch",
          status: announcement.confirmed ? "Announced" : "Planned",
          title: announcement.heading,
          body: announcement.body,
          eventTitle: announcement.courseName,
          meta: `${announcement.courseDates} · ${announcement.courseLocation}`,
          detail: announcement.courseNote,
          linkLabel: "Visit the official course website",
          linkUrl: announcement.courseUrl,
          surface: false,
        },
      },
      {
        type: "people_grid",
        internalName: "Founders and management",
        data: {
          eyebrow: "Leadership",
          title: "Founders and management",
          intro: "",
          people: [
            ...founderCards,
            {
              name: management.name,
              role: management.role,
              summary: "",
              imageUrl: "",
              imageAlt: "",
            },
          ],
          footer: "",
          linkLabel: "More about the Society's leadership",
          linkUrl: "/leadership",
          surface: true,
        },
      },
      {
        type: "cta",
        internalName: "Membership call to action",
        data: {
          eyebrow: "Membership",
          title: "Register your interest",
          body: "Register your interest to receive news about the Society, membership and upcoming educational activities. Registering interest does not constitute admission to membership.",
          buttonLabel: "Register your interest",
          buttonUrl: "/membership#register",
          surface: false,
        },
      },
    ],
  },
  {
    slug: "about",
    internalName: "About",
    pageTitle: "About the Society",
    metaTitle: "About the Society — ISEFS",
    metaDescription:
      "ISEFS connects an international professional community through structured education, practical learning, discussion of outcomes and scientific collaboration.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "About",
          title: "Connecting an international professional community",
          lead: "ISEFS exists to advance endoscopic facial surgery through education, practical training and scientific exchange between surgeons, residents, faculty and professional partners.",
        },
      },
      {
        type: "split_text",
        internalName: "Mission",
        data: {
          eyebrow: "Mission",
          title: "Why the Society exists",
          paragraphs: [
            "Endoscopic approaches to facial surgery have developed rapidly, but the knowledge behind them is still dispersed. Techniques are refined in individual centres, taught informally and discussed at occasional meetings. Surgeons who wish to learn systematically often have no clear route to follow.",
            `The ${society.name} is being established to address this. Its purpose is to provide a stable, international framework for teaching the discipline, for supervised practical learning, for open discussion of surgical outcomes and for collaborative scientific work.`,
            "The Society is intended for the professional community: surgeons in practice, residents in training, faculty who teach, and the institutional and professional partners who support their work.",
          ],
          linkLabel: "",
          linkUrl: "",
          surface: false,
        },
      },
      {
        type: "card_grid",
        internalName: "Principles",
        data: {
          eyebrow: "Principles",
          title: "How we intend to work",
          intro: "",
          columns: "2",
          items: [
            {
              title: "Structured education",
              body: "Teaching built on a clear curriculum rather than isolated events, so that surgeons at different stages can follow a coherent path.",
            },
            {
              title: "Practical learning",
              body: "Supervised laboratory and technical training that allows technique to be examined carefully, under appropriate guidance.",
            },
            {
              title: "Discussion of outcomes",
              body: "Honest, evidence-led examination of results, including complications, as the basis for improving practice.",
            },
            {
              title: "Scientific collaboration",
              body: "Shared work between centres and countries, so that knowledge accumulates instead of remaining local.",
            },
          ],
          footer: "",
          linkLabel: "",
          linkUrl: "",
          surface: true,
        },
      },
      {
        type: "list",
        internalName: "Statutory purpose",
        data: {
          eyebrow: "Purpose",
          title: "What the Society will do",
          intro: `${legalForm.summary} The purpose set out in its draft articles of association is to:`,
          items: [...purposeStatements],
          footer:
            "The articles of association remain in draft until adopted at the founding meeting.",
          surface: false,
        },
      },
      {
        type: "cta",
        internalName: "Current status",
        data: {
          eyebrow: "",
          title: "Current status",
          body: "The Society is currently being established. Its governing documents, formal registration and admission rules are being prepared, and this website will be updated as each step is completed. Until then, ISEFS makes no claim to registered, charitable, tax-exempt or accredited status, and its programmes are described according to their actual stage of development.",
          buttonLabel: "Register your interest",
          buttonUrl: "/membership#register",
          surface: false,
        },
      },
    ],
  },
  {
    slug: "education-and-science",
    internalName: "Education & Science",
    pageTitle: "Education & Science",
    metaTitle: "Education & Science — ISEFS",
    metaDescription:
      "Congress, monographic courses, practical laboratories, a fellowship pathway under development, webinars and planned scientific collaboration.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Education & Science",
          title: "Our educational and scientific programme",
          lead: "Six distinct areas of activity. Each is described according to its current stage of development; activities still in preparation are labelled as such.",
        },
      },
      {
        type: "card_grid",
        internalName: "Programme areas",
        data: {
          eyebrow: "",
          title: "",
          intro: "",
          columns: "2",
          items: educationCards,
          footer: "",
          linkLabel: "",
          linkUrl: "",
          surface: false,
        },
      },
      {
        type: "notice",
        internalName: "Programme note",
        data: {
          status: "",
          title: "A note on what these activities are",
          body: "ISEFS will develop a coordinated programme of scientific congresses, focused monographic courses, practical laboratories, webinars, fellowship training and collaborative scientific work. Dates, faculty and participation requirements will be published once the relevant programme has been approved.",
          surface: false,
        },
      },
      {
        type: "event_feature",
        internalName: "Related course",
        data: {
          eyebrow: "Related course",
          status: "",
          title: announcement.courseName,
          body: `${announcement.courseName} takes place in ${announcement.courseLocation} on ${announcement.courseDates}.`,
          eventTitle: announcement.courseName,
          meta: `${announcement.courseDates} · ${announcement.courseLocation}`,
          detail: announcement.courseNote,
          linkLabel: "Visit the official course website",
          linkUrl: announcement.courseUrl,
          surface: true,
        },
      },
      {
        type: "cta",
        internalName: "Stay informed",
        data: {
          eyebrow: "",
          title: "Stay informed",
          body: "Register your interest to receive news about the Society, membership and upcoming educational activities as they are confirmed.",
          buttonLabel: "Register your interest",
          buttonUrl: "/membership#register",
          surface: false,
        },
      },
    ],
  },
  {
    slug: "membership",
    internalName: "Membership",
    pageTitle: "Membership",
    metaTitle: "Membership — ISEFS",
    metaDescription:
      "Register your interest to receive news about the Society, membership and upcoming educational activities in endoscopic facial surgery.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Membership",
          title: "Membership of the Society",
          lead: "Membership is intended to connect surgeons, residents, faculty and professional partners to the Society's educational and scientific work.",
        },
      },
      {
        type: "card_grid",
        internalName: "Membership value",
        data: {
          eyebrow: "Intended value",
          title: "What membership is intended to offer",
          intro: "",
          columns: "2",
          items: membershipValue.map((item) => ({ title: item.title, body: item.body })),
          footer:
            "Membership categories, conditions and any contribution are being prepared as part of the Society's establishment and will be published once approved. Nothing on this page constitutes an offer of membership or a commitment to any particular benefit.",
          linkLabel: "",
          linkUrl: "",
          surface: false,
        },
      },
      {
        type: "card_grid",
        internalName: "Membership categories",
        data: {
          eyebrow: "Planned categories",
          title: "Membership categories foreseen",
          intro: "",
          columns: "2",
          items: membershipCategories.map((item) => ({ title: item.title, body: item.body })),
          footer: "",
          linkLabel: "",
          linkUrl: "",
          surface: false,
        },
      },
      {
        type: "list",
        internalName: "Admission process",
        data: {
          eyebrow: "",
          title: "How admission is intended to work",
          intro: "",
          items: [...admissionNotes],
          footer:
            "Formal applications will open once the admission rules and membership regulations have been approved. Until then, please register your interest.",
          surface: false,
        },
      },
      {
        type: "form_split",
        internalName: "Interest registration",
        data: {
          formType: "interest",
          eyebrow: "First step",
          title: "Register your interest",
          body: "Register your interest to receive news about the Society, membership and upcoming educational activities.",
          secondary:
            "Registering your interest does not constitute an application for membership and does not constitute admission. No payment is requested or required at this stage. When formal applications open, we will write to everyone who has registered.",
          anchor: "register",
          surface: true,
        },
      },
    ],
  },
  {
    slug: "leadership",
    internalName: "Leadership",
    pageTitle: "Leadership",
    metaTitle: "Leadership — ISEFS",
    metaDescription:
      "The scientific founders of ISEFS and the Managing Director responsible for Society management and operational implementation.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Leadership",
          title: "Scientific founders and management",
          lead: "The Society distinguishes between its scientific leadership and its operational management.",
        },
      },
      {
        type: "people_grid",
        internalName: "Scientific founders",
        data: {
          eyebrow: "Scientific founders",
          title: "The founding surgeons",
          intro: "",
          people: founderCards,
          footer:
            "The scientific founders lead the Society’s academic direction and its educational and scientific programme. The Society’s complete governance and committee structure will be published as part of its formal establishment.",
          linkLabel: "",
          linkUrl: "",
          surface: false,
        },
      },
      {
        type: "management_profile",
        internalName: "Managing Director",
        data: {
          eyebrow: "Management",
          title: "Society management",
          role: management.role,
          name: management.name,
          summary: management.summary,
          imageUrl: "",
          imageAlt: "",
          surface: true,
        },
      },
    ],
  },
  {
    slug: "contact",
    internalName: "Contact",
    pageTitle: "Contact",
    metaTitle: "Contact — ISEFS",
    metaDescription:
      "Write to the International Society for Endoscopic Facial Surgery about membership, education, scientific collaboration or partnership.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Contact",
          title: "Contact the Society",
          lead: "Enquiries about membership, education, scientific collaboration and partnership are handled by the Society's management office.",
        },
      },
      {
        type: "form_split",
        internalName: "Contact form",
        data: {
          formType: "contact",
          eyebrow: "Management office",
          title: "How to reach us",
          body: "The Society's published contact details are being confirmed as part of its establishment. Until then, please use the form and the management office will reply to you directly.",
          secondary: `The registered office of the Society will be in ${legalForm.seat}.`,
          anchor: "contact",
          surface: false,
        },
      },
    ],
  },
  {
    slug: "legal",
    internalName: "Legal information",
    pageTitle: "Legal information",
    metaTitle: "Legal information — ISEFS",
    metaDescription:
      "Legal information about the International Society for Endoscopic Facial Surgery, its status, and the use of this website.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Legal",
          title: "Legal information",
          lead: "Status of the Society, responsibility for this website and the limits of the information published here.",
        },
      },
      {
        type: "rich_sections",
        internalName: "Legal text",
        data: {
          status: "Draft — pending approval",
          statusMessage:
            "This text is a working draft prepared for review and has not yet been approved.",
          sections: [
            {
              title: "The Society",
              body: `${society.name} (${society.shortName}). ${legalForm.summary} ${society.status} Entries in the commercial register, a registration number and formal contact details will be published once available.`,
            },
            {
              title: "Status of the information",
              body: "Information about membership, educational activities, the fellowship pathway and scientific collaboration describes work in preparation. It does not constitute an offer of membership, a guarantee of any place on a programme, or a commitment to a particular benefit. Activities and dates require approval by the Society's Board.",
            },
            { title: "ENDOFACE Masters", body: announcement.courseNote },
            {
              title: "Medical information",
              body: "This website addresses medical professionals. Nothing published here is medical advice, a treatment recommendation or a substitute for individual clinical judgement, and no member designation is a confirmation of independently assessed clinical competence.",
            },
            {
              title: "Names, logos and content",
              body: `The names ${society.shortName}, ${society.name} and any ${society.brand} signs, together with the logos, text, images and materials on this website, belong to the Society or to its respective rights holders. They may not be used without written permission.`,
            },
            {
              title: "External links",
              body: "This website links to external sites operated by others. The Society is not responsible for their content.",
            },
          ],
          surface: false,
        },
      },
    ],
  },
  {
    slug: "privacy",
    internalName: "Privacy information",
    pageTitle: "Privacy information",
    metaTitle: "Privacy information — ISEFS",
    metaDescription:
      "How the International Society for Endoscopic Facial Surgery handles personal data submitted through its interest registration and contact forms.",
    blocks: [
      {
        type: "page_header",
        internalName: "Page header",
        data: {
          eyebrow: "Privacy",
          title: "Privacy information",
          lead: "How personal data submitted through this website is handled.",
        },
      },
      {
        type: "rich_sections",
        internalName: "Privacy text",
        data: {
          status: "Draft — pending approval",
          statusMessage:
            "This text is a working draft prepared for review. It has not yet been approved and may change before the Society's formal establishment is completed.",
          sections: [
            {
              title: "Who is responsible",
              body: `The International Society for Endoscopic Facial Surgery (ISEFS), being established as an association under Swiss law with its registered office in ${legalForm.seat}, is responsible for the personal data collected through this website. Its management office administers enquiries and interest registrations.`,
            },
            {
              title: "What we collect",
              body: "Interest registration: first name, last name, email address, country, specialty, an optional institution, your selected areas of interest, whether you agreed to receive news, and the time of submission. Contact enquiries: your name, email address, subject and message.",
            },
            {
              title: "Why we use it",
              body: "To respond to your enquiry, to inform you about the Society, its membership and its educational activities, and to prepare membership processes once these are approved. News is only sent where you have agreed to receive it.",
            },
            {
              title: "Who can see it",
              body: "Submissions are stored privately and are not publicly readable. Access is limited to the Society's management office and to service providers engaged to operate the website and its communications on the Society's behalf.",
            },
            {
              title: "How long we keep it",
              body: "Registrations and enquiries are kept for as long as needed to respond to you and to administer the Society's membership processes, and are then deleted or anonymised.",
            },
            {
              title: "Your rights",
              body: "You may ask for access to your data, for its correction or deletion, and you may withdraw your consent to receive news at any time. Please use the contact form to make such a request.",
            },
            {
              title: "Cookies and analytics",
              body: "This website does not use advertising cookies or third-party tracking. Fonts are loaded from Google Fonts, which receives your IP address as part of that request.",
            },
          ],
          surface: false,
        },
      },
    ],
  },
];

export const defaultCmsPageMap = Object.fromEntries(
  defaultCmsPages.map((page) => [page.slug, page]),
) as Record<string, CmsSeedPage>;
