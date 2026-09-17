/**
 * Central content for the ISEFS website.
 * Edit the values here to update events, people, membership information
 * and contact details across every page.
 */

export const society = {
  shortName: "ISEFS",
  name: "International Society for Endoscopic Facial Surgery",
  brand: "ENDOFACE",
  brandNote:
    "ENDOFACE is the Society's flagship educational programme and brand. ISEFS is the scientific society behind it.",
  status: "The Society is currently being established.",
  tagline: "Advancing endoscopic facial surgery.",
  intro:
    "An international scientific society dedicated to education, practical training and the exchange of surgical knowledge.",
} as const;

/**
 * Legal form, taken from the draft Articles of Association (v0.1).
 * `articlesApproved` stays false until the founding meeting adopts them.
 */
export const legalForm = {
  articlesApproved: false,
  summary:
    "ISEFS is being established as a politically and denominationally independent, non-profit association under Articles 60 et seq. of the Swiss Civil Code, with its registered office in Zurich, Switzerland.",
  seat: "Zurich, Switzerland",
  duration: "The duration of the association is unlimited.",
} as const;

/**
 * Purpose statements derived from Article 2 of the draft Articles of Association.
 */
export const purposeStatements = [
  "Promote science, education, patient safety, treatment quality, responsible innovation and international professional exchange in endoscopic facial surgery.",
  "Develop, disseminate and critically discuss scientific, clinical, technical and ethical standards.",
  "Organise congresses, courses, workshops, masterclasses, fellowships and mentoring programmes.",
  "Initiate and support research projects, studies, registries, international collaborations and publications.",
  "Cooperate with universities, clinics, scientific societies, professional associations and authorities.",
  "Support qualified surgeons, physicians in training and other professionals specialised in endoscopic facial surgery.",
] as const;

/**
 * Membership categories foreseen in Article 4 of the draft Articles of Association.
 * These are planned categories; conditions and any contribution require Board approval.
 */
export const membershipCategories = [
  {
    title: "Founding Members",
    body: "Members of the first cohort invited by the Board, holding a special title and the rights set out in the membership regulations.",
  },
  {
    title: "Fellows (FISEFS)",
    body: "Members who meet the professional and practical requirements of a recognised ISEFS learning or credentialing pathway, or equivalent experience.",
  },
  {
    title: "Full Members",
    body: "Individuals with recognised qualifications, a valid licence to practise and good professional standing in endoscopic facial surgery or related fields.",
  },
  {
    title: "Associate Members",
    body: "Other professionals and scientists who support the purpose of the Society.",
  },
  {
    title: "Resident, Trainee or Junior Members",
    body: "Those in training, continuing education or at an early stage of their career.",
  },
  {
    title: "Supporting, Partner or Corporate Members",
    body: "Individuals, institutions and organisations supporting the Society in kind, organisationally or financially.",
  },
  {
    title: "Honorary Members",
    body: "Persons who have rendered outstanding service to the Society or to the field.",
  },
] as const;

/**
 * Admission principles from Article 5 of the draft Articles of Association.
 */
export const admissionNotes = [
  "Applications will undergo professional review by the Credentials and Membership Committee. The Committee will make recommendations to the Board, which will decide on admission. The management office will administer the process and communicate the decision.",
  "The Board may set professional, personal and ethical admission criteria in the membership regulations.",
  "There is no entitlement to membership, and applications may be declined.",
  "Membership, a title or a member mark is not a confirmation of independently assessed clinical competence, nor an endorsement of any particular practice.",
] as const;


/**
 * Contact details. Leave a value as null until it has been approved;
 * the Contact page then shows a short note instead of inventing details.
 */
export const contactDetails = {
  email: null as string | null,
  telephone: null as string | null,
  address: null as string | null,
  registrationNumber: null as string | null,
} as const;

/**
 * Legal and privacy pages are drafts awaiting owner approval.
 * Set to true once the approved text has been inserted.
 */
export const legalStatus = {
  privacyApproved: false,
  legalNoticeApproved: false,
} as const;

/**
 * Launch announcement. Update `confirmed` to true and adjust the copy
 * once the announcement has taken place.
 */
export const announcement = {
  confirmed: false,
  heading: "A Society announcement is planned for October 2026",
  body: "According to current planning, the establishment of the International Society for Endoscopic Facial Surgery is to be announced at the gala evening on 16 October 2026, during the Endo Face Masters course in Barcelona. Details remain subject to confirmation.",
  courseName: "Endo Face Masters",
  courseDates: "15–17 October 2026",
  courseLocation: "Barcelona, Spain",
  courseUrl: "https://www.endofacemasters.com/",
  courseNote:
    "Endo Face Masters is an independent course. ISEFS neither organises nor owns the event. Programme, registration and attendance information is published on the official course website.",
} as const;

export const educationAreas = [
  {
    title: "Scientific congress",
    status: "In preparation",
    summary:
      "A scientific meeting for research presentations, structured discussion and professional exchange between colleagues working in endoscopic facial surgery.",
    detail:
      "The congress is a scientific forum: papers, outcome data and moderated debate. It is distinct from courses that include surgical observation or laboratory teaching.",
  },
  {
    title: "Monographic courses",
    status: "In preparation",
    summary:
      "Focused educational courses covering defined techniques and indications within endoscopic facial surgery.",
    detail:
      "Each course concentrates on a single subject area so that participants can examine technique, planning and decision-making in depth.",
  },
  {
    title: "Practical laboratories",
    status: "In preparation",
    summary:
      "Supervised anatomical and technical learning in a laboratory setting.",
    detail:
      "Laboratory teaching is hands-on and supervised. It is organised separately from the scientific congress and follows the requirements of the host institution.",
  },
  {
    title: "Fellowship pathway",
    status: "Under development",
    summary:
      "A structured training pathway for surgeons seeking sustained, mentored experience.",
    detail:
      "The pathway is under development. Entry requirements, duration and host centres are not yet defined, and no places are available or guaranteed at this stage.",
  },
  {
    title: "Webinars and educational resources",
    status: "In preparation",
    summary:
      "Online sessions and a resource library supporting continuing professional learning between meetings.",
    detail:
      "Resources are intended for members and course participants under their published terms. Schedules will be published once confirmed.",
  },
  {
    title: "Scientific collaboration",
    status: "Planned",
    summary:
      "Planned registry and consensus activities to support shared learning from outcomes.",
    detail:
      "Collaborative work is planned rather than active. Any registry or consensus process will follow appropriate scientific and data-protection standards.",
  },
] as const;

export const founders = [
  {
    name: "Dr. Marc Mani",
    role: "Scientific founder",
  },
  {
    name: "Dr. Gad Renert",
    role: "Scientific founder",
  },
  {
    name: "Dr. Artur Díaz Carandell",
    role: "Scientific founder",
  },
] as const;

export const management = {
  name: "Samuel Blum",
  role: "Managing Director",
  summary:
    "Responsible for the management of the Society and for operational implementation, including administration, coordination of activities and the Society's secretariat.",
} as const;

export const membershipValue = [
  {
    title: "Professional exchange",
    body: "Contact with an international community of surgeons, residents and faculty working in endoscopic facial surgery.",
  },
  {
    title: "Educational resources",
    body: "Access to the Society's educational materials and online sessions under their published terms.",
  },
  {
    title: "Scientific collaboration",
    body: "The opportunity to take part in planned collaborative scientific activities as they are established.",
  },
  {
    title: "Access to programmes",
    body: "Participation in Society programmes and meetings in accordance with the conditions published for each activity.",
  },
] as const;

export const areasOfInterestOptions = [
  { value: "membership", label: "Membership" },
  { value: "courses", label: "Courses" },
  { value: "fellowship", label: "Fellowship" },
  { value: "collaboration", label: "Scientific collaboration" },
] as const;
