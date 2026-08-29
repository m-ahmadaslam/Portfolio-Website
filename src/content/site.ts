// single source of truth. copy is drawn from Ahmad's resume and real projects,
// fact-checked and written in a portfolio voice. no em dashes.

export const profile = {
  name: "Muhammad Ahmad Aslam",
  role: "AI Full-Stack Developer",
  location: "Riyadh, Saudi Arabia",
  email: "muhammad.ahmadaslam2003@gmail.com",
  phoneDisplay: "+966 53 853 0497",
  phoneHref: "+966538530497",
  resume: "/resume",
  resumeFile: "/Ahmad-Aslam-Resume.pdf",
  socials: {
    github: "https://github.com/m-ahmadaslam",
    linkedin: "https://www.linkedin.com/in/muhammad-ahmad-aslam",
    website: "https://ahmadaslam-portfolio-website.vercel.app/",
    kanz: "https://try.ka.nz/ai/muhammadaslam", // Kanz AI portfolio entry (Listen, graded Gold)
  },
  status: {
    label: "AI Software Engineer",
    org: "Turing",
    note: "Frontier AI Lab · Agent capability",
    available: "Open to full-stack & AI roles",
  },
  headline: ["I build full-stack products,", "and the AI that powers them."],
  intro:
    "I'm an AI full-stack developer and Computer Science graduate who ships the whole stack, from the interface down to the model serving it. At **Turing**, I work with a leading **Frontier AI Lab** to push the limits of agent capability. On my own I built **Listen**, a real-time Pakistan Sign Language system that reached **98.16% accuracy**, was graded **Gold** by independent AI judges, and came out of the **Kanz AI** cohort that set a **Guinness World Record**. Give me a hard problem that spans product and ML, and I'll **own it end to end**.",
} as const;

export const about = {
  lead: "I build software across the whole stack, from the interface people touch to the models and services running underneath it.",
  paragraphs: [
    "Most of what I build is meant to be used, not demoed. **Listen**, my final-year project, is a real-time Pakistan Sign Language recognizer that streams camera frames to a model over WebSocket and returns a word in under 200ms, at **98.16% accuracy** across 64 sign classes. Independent AI judges graded it **Gold**, the highest tier, through the **Kanz AI** initiative, the same cohort that set a **Guinness World Record** for the largest AI training session. **Zero Limit Apparel**, the e-commerce brand I founded, has been in live production with real customers and real orders, not a demo store. I care about the part that comes after launch, because the thing still has to work next week.",
    "The range is the point. At **Turing** I work with a leading **Frontier AI Lab** to improve agent capability: I build Python backend connectors that replicate tools like Slack and Jira, validated through Docker test suites, design and calibrate the evaluation tasks used to grade coding agents against verified ground truth, and fine-tune frontier models through RLHF and SFT while mentoring a small team of AI trainers. Before that I shipped full-stack features and 10+ authenticated REST APIs inside a production MERN codebase at **Wamo Labs**, and built machine-learning and financial-modeling dashboards at **Alfanar**. I'm a **Computer Science graduate**, and I move between product code and applied ML without treating either as someone else's job.",
  ],
  now: [
    "Improving agent capability for a Frontier AI Lab through Turing, across connectors, evaluation, and RLHF/SFT",
    "Going deeper on RAG, LangChain, LangGraph, and agentic AI workflows",
    "Computer Science graduate (BSc, Bahria University)",
  ],
  facts: [
    { k: "Based in", v: "Riyadh, Saudi Arabia" },
    { k: "Currently", v: "AI Software Engineer at Turing (Contract)" },
    { k: "Education", v: "BSc Computer Science, Bahria University" },
    { k: "Focus", v: "AI full-stack, applied ML, agentic AI" },
  ],
} as const;

export const capabilities = [
  {
    title: "AI full-stack engineering",
    body: "Type-safe web apps on the MERN stack and Next.js, with authentication, RBAC, and real-time features, taken from first pixel to production.",
  },
  {
    title: "Applied machine learning",
    body: "Computer vision and classical ML in production: a real-time sign-language model at 98.16% accuracy, plus SMOTE-balanced classifiers selected by F1 score.",
  },
  {
    title: "Agentic AI & LLMs",
    body: "RAG, LangChain, and LangGraph pipelines, plus RLHF and SFT fine-tuning and structured evaluation of frontier-model outputs.",
  },
] as const;

export type Experience = {
  company: string;
  role: string;
  location: string;
  mode: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  bullets: string[];
};

export const experiences: Experience[] = [
  {
    company: "Turing",
    role: "AI Software Engineer",
    location: "United States",
    mode: "Remote · Contract",
    start: "Dec 2025",
    end: "Present",
    current: true,
    summary:
      "AI Software Engineer on Turing's work with a leading Frontier AI Lab to improve agent capability.",
    bullets: [
      "Build Python backend connectors that faithfully replicate SaaS tools like Slack and Jira, validated through Docker-based test suites, giving a Frontier AI Lab's coding agents realistic multi-system environments to act in.",
      "Design and calibrate coding-agent evaluation tasks spanning SQL audits, ticket-tracker and document workflows, and multi-system business logic, each with verified ground truth checked against live databases.",
      "Run oracle, adversarial, and stability QC batteries in Docker to tune pass-rate bands, authoring QC reports with a 100% clean-pass record and root-causing model-versus-gold disagreements without weakening verifiers.",
      "Fine-tune frontier models through RLHF and SFT with side-by-side multi-turn evaluation and curated instruction-response pairs, holding a perfect quality score across all evaluation dimensions.",
      "Lead and mentor a 5-person AI trainer team, defining evaluation criteria and documentation with cross-functional partners and building annotation and prompt-testing tooling that improves scoring consistency.",
    ],
  },
  {
    company: "Wamo Labs",
    role: "MERN Stack Developer Intern",
    location: "Lahore, Pakistan",
    mode: "Internship",
    start: "Oct 2025",
    end: "Jan 2026",
    summary: "Full-stack feature work inside an existing production MERN codebase.",
    bullets: [
      "Shipped full-stack features across the MERN stack inside an existing production codebase, using Git version control and CI/CD deploys.",
      "Engineered 10+ REST APIs with JWT-based authentication and role-based access control (RBAC), and contributed to sprint planning and code reviews in the team's Agile process.",
    ],
  },
  {
    company: "Alfanar Projects",
    role: "Full-Stack & Machine Learning Intern",
    location: "Riyadh, KSA",
    mode: "Internship",
    start: "Jun 2025",
    end: "Sep 2025",
    summary: "Machine-learning and financial-modeling tools for enterprise data.",
    bullets: [
      "Developed a six-page Streamlit app comparing Random Forest, XGBoost, and CatBoost classifiers (SMOTE-balanced) on enterprise clinical data to flag antibiotic-prescription mismatches, auto-selecting the best model by F1 score at 95% accuracy.",
      "Architected a financial-modeling dashboard (Next.js, FastAPI) parsing an 85,569-field Excel model into automated monthly timelines, plus an AI analyst panel using Hugging Face's Qwen2.5-7B-Instruct for investment narratives from a custom scoring engine.",
    ],
  },
];

export const education = {
  school: "Bahria University",
  program: "BSc, Computer Science",
  location: "Lahore, Pakistan",
  start: "2022",
  end: "2026",
  points: [
    "Final-year project: Listen, real-time Pakistan Sign Language recognition (graded A)",
    "Focus areas: machine learning, computer vision, full-stack systems",
  ],
} as const;

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  oneLiner: string;
  summary: string;
  detail: string;
  highlights: string[];
  stack: string[];
  links: { live?: string; repo?: string; docs?: string };
  image: string;
  featured: boolean;
  year: string;
  team?: string; // shown when the build was genuinely shared. solo projects omit it.
  active?: boolean; // still shipping releases / commits today
  metrics?: { value: string; label: string; href?: string; live?: boolean }[]; // durable traction stats; live pulls the real number
  badges?: { src: string; alt: string; href: string }[]; // live shields.io badges
};

export const projects: Project[] = [
  {
    slug: "listen",
    name: "Listen",
    tagline: "Bridging silence with words",
    oneLiner:
      "A real-time Pakistan Sign Language recognizer that streams camera frames to a deep model over WebSocket and returns a word in under 200ms, at 98.16% accuracy across 64 sign classes.",
    summary:
      "Listen is my final-year project: a Flutter app streams live camera frames over WebSocket to a FastAPI service running a Conv1D + BiLSTM + Attention model on MediaPipe landmarks. It reaches 98.16% top-1 accuracy on 64 PSL word classes with sub-200ms latency, using EMA smoothing and a finite-state commit pipeline to stabilize predictions. It earned an A academically and was graded Gold, the highest tier, by independent AI judges through the Kanz AI initiative.",
    detail: `Sign language recognition has to be **real-time to be useful**. A recognizer that is accurate but laggy is just a slower keyboard. Listen streams live camera frames from a **Flutter** app over a **WebSocket** to a **FastAPI** backend deployed on Railway, extracts hand and pose landmarks with **MediaPipe**, and runs a **Conv1D + BiLSTM + Attention** model exported to **TFLite**, returning a predicted word in **under 200ms**.

The model reaches **98.16% top-1 accuracy** across **64 PSL word classes**. Raw per-frame predictions are noisy, so the pipeline stabilizes them with **exponential moving average smoothing** and a **finite-state commit** step that only emits a word once the model is confident over a run of frames, which is what makes the output readable instead of flickering. Recognized words and session data persist to **Neon PostgreSQL**.

Listen was a **three-person** final-year project, and I owned the model and the real-time serving path end to end. It earned an **A** academically and was graded **Gold**, the highest tier, by independent AI judges through the **Kanz AI** initiative, a program that separately set a Guinness World Record for the most participants in an AI training session. [See the Kanz AI portfolio entry](https://try.ka.nz/ai/muhammadaslam).`,
    highlights: [
      "Sub-200ms end to end: Flutter camera frames streamed over WebSocket to a FastAPI service on Railway",
      "98.16% top-1 accuracy on 64 PSL word classes with a Conv1D + BiLSTM + Attention model exported to TFLite",
      "MediaPipe hand and pose landmarks as input features instead of raw pixels",
      "EMA smoothing plus a finite-state commit pipeline so predictions read cleanly instead of flickering",
      "Graded Gold, the highest tier, by independent AI judges through [Kanz AI](https://try.ka.nz/ai/muhammadaslam); A grade academically",
    ],
    stack: ["Python", "TensorFlow", "FastAPI", "Flutter", "MediaPipe", "WebSockets", "Docker", "Neon PostgreSQL", "TFLite", "Railway"],
    links: {
      repo: "https://github.com/ahsanFS1/Listen",
      docs: "https://try.ka.nz/ai/muhammadaslam",
    },
    image: "/assets/shots/listen-showcase.webp",
    featured: true,
    year: "2026",
    team: "Three-person final-year project",
    metrics: [
      { value: "98.16%", label: "top-1 accuracy" },
      { value: "Gold", label: "Kanz AI rating", href: "https://try.ka.nz/ai/muhammadaslam" },
      { value: "<200ms", label: "inference latency" },
    ],
  },
  {
    slug: "zero-limit",
    name: "Zero Limit Apparel",
    tagline: "A live e-commerce brand, end to end",
    oneLiner:
      "A full-stack e-commerce platform I founded and run in production, with a real catalog, cart, and secure checkout, serving real customers.",
    summary:
      "Zero Limit Apparel is my own apparel brand, built and operated as a live production store rather than a demo. A Next.js and Node.js backend powers the catalog, cart, and secure checkout, with Meta Pixel wired in for conversion tracking. Image optimization and code-splitting cut load time by roughly 40% and keep Lighthouse scores in the 90s, with continuous deploys on Vercel.",
    detail: `Zero Limit is a real business, not a portfolio demo. It is my own apparel brand, live in production with real customers and real orders. Building and running it end to end meant owning the parts a tutorial store skips: a **Next.js** and **Node.js** backend behind the storefront, a product catalog, a cart, and a **secure checkout** flow that has to work correctly every time money changes hands.

Because it is a live store, performance is a revenue question, not a vanity metric. **Image optimization** and **code-splitting** cut initial load time by **roughly 40%** and keep Lighthouse scores in the **90s**, which matters when a slow page is an abandoned cart. **Meta Pixel** is wired in for conversion tracking, and every change ships through **Vercel** CI/CD.

Running my own store taught me the commercial side of engineering: that a checkout bug is lost trust, that a slow image is a lost sale, and that shipping is only the start of owning something people depend on.`,
    highlights: [
      "Live production e-commerce for my own brand, real customers and real orders, not a demo",
      "Next.js and Node.js backend: product catalog, cart, and secure checkout",
      "~40% faster initial load via image optimization and code-splitting, Lighthouse in the 90s",
      "Meta Pixel conversion tracking and continuous deploys on Vercel",
    ],
    stack: ["Next.js", "Node.js", "TypeScript", "MongoDB", "Meta Pixel", "Vercel"],
    links: { live: "https://zero-limit.vercel.app" },
    image: "/assets/shots/zero-limit-brand.webp",
    featured: true,
    year: "2024",
    active: true,
    metrics: [
      { value: "~40%", label: "faster load" },
      { value: "90+", label: "Lighthouse" },
      { value: "Live", label: "in production", href: "https://zero-limit.vercel.app" },
    ],
  },
  {
    slug: "market-craft",
    name: "Market Craft",
    tagline: "A live full-stack marketing platform",
    oneLiner:
      "A production marketing-agency platform with a MongoDB-backed lead funnel, an interactive marketing-score quiz, and a static blog, built on Next.js 15 and React 19.",
    summary:
      "Market Craft is a live full-stack platform for a digital marketing agency, built on Next.js 15 App Router and React 19 with Tailwind and shadcn/ui. A contact form persists every lead to MongoDB through Mongoose and fires a templated notification over Nodemailer, while a client-side Marketing Score quiz rates a visitor's marketing maturity in real time and rewards the result with confetti. Framer Motion drives the transitions, and a static three-post blog closes the funnel.",
    detail: `Market Craft is a marketing site whose job is to **convert**, so it is built like a product, not a brochure. The front end runs on **Next.js 15** App Router and **React 19**, styled with **Tailwind** and **shadcn/ui**, with **Framer Motion** handling the page and section transitions.

The full-stack half is where the value is. The contact form persists every lead to **MongoDB** through **Mongoose** and fires a templated notification email over **Nodemailer**, so an inquiry is captured and routed the moment it lands, rather than disappearing into an inbox.

The standout feature is an interactive **Marketing Score** quiz: it scores a visitor's marketing maturity entirely **client-side**, animates the reveal, and celebrates the result with **canvas-confetti**, turning a passive landing page into a lead-qualifying tool. A static **three-post blog** rounds out the funnel.`,
    highlights: [
      "Live production marketing platform on Next.js 15 App Router and React 19",
      "MongoDB lead capture via Mongoose, with a Nodemailer notification email on every submit",
      "Interactive Marketing Score quiz that rates marketing maturity client-side, with canvas-confetti",
      "shadcn/ui component system, Framer Motion transitions, and a static three-post blog",
    ],
    stack: ["Next.js", "React 19", "TypeScript", "Tailwind", "shadcn/ui", "Framer Motion", "MongoDB", "Mongoose", "Nodemailer"],
    links: {
      live: "https://marketcraft.vercel.app",
      // TODO: add the public Market Craft repo URL when ready.
    },
    image: "/assets/shots/market-craft.webp",
    featured: true,
    year: "2025",
    active: true,
    metrics: [
      { value: "Live", label: "in production", href: "https://marketcraft.vercel.app" },
      { value: "Next.js 15", label: "React 19 · App Router" },
      { value: "MongoDB", label: "lead capture + email" },
    ],
  },
  {
    slug: "antibiotic-classifier",
    name: "Antibiotic Resistance Classifier",
    tagline: "Clinical ML that flags prescription mismatches",
    oneLiner:
      "A six-page Streamlit app that trains and compares Random Forest, XGBoost, and CatBoost on SMOTE-balanced clinical data to flag antibiotic Match / Mismatch cases, led by CatBoost at 97.0% accuracy.",
    summary:
      "An end-to-end Streamlit app that predicts whether an antibiotic prescription matches a lab report's resistance profile. It trains Random Forest, XGBoost, and CatBoost on a SMOTE-balanced dataset, then auto-selects the strongest by weighted F1: CatBoost at 0.965 F1 and 97.0% accuracy, ahead of Random Forest (0.960) and XGBoost (0.940). Six pages run from data exploration through training, evaluation, and single-case prediction, plus a keyword-driven assistant that answers questions about the results.",
    detail: `Prescribing an antibiotic a pathogen already resists is a real clinical risk, so this project frames the check as a **Match / Mismatch** classification over lab-report features: given a case, does the prescribed drug fit the resistance profile or not?

Three models compete for the job. **Random Forest**, **XGBoost**, and **CatBoost** are each trained on a **SMOTE-balanced** dataset to correct class imbalance, then compared on **weighted F1** so the winner is chosen on balanced performance rather than raw accuracy. **CatBoost** leads at **0.965 F1** and **97.0% accuracy**, ahead of Random Forest (0.960 F1) and XGBoost (0.940 F1), and is selected automatically.

The whole thing ships as a **six-page Streamlit app**: data exploration, model training, evaluation, and single-case prediction, plus a **keyword-driven assistant** that answers questions about the model and its results. The assistant is deliberately rule-based, not an LLM, which keeps its answers grounded in the actual metrics.`,
    highlights: [
      "Match / Mismatch prediction on clinical lab-report features, framed as a binary classifier",
      "Random Forest, XGBoost, and CatBoost trained on SMOTE-balanced data and compared by weighted F1",
      "CatBoost auto-selected as best at 0.965 weighted F1 and 97.0% accuracy",
      "Six-page Streamlit app: exploration, training, evaluation, and single-case prediction",
      "Keyword-driven assistant grounded in the model results (rule-based, not an LLM)",
    ],
    stack: ["Python", "Streamlit", "scikit-learn", "XGBoost", "CatBoost", "SMOTE", "pandas"],
    links: {
      live: "https://antibiotic-resistance-classifier-ukfrkjc6rvna34cfriikdp.streamlit.app",
      // TODO: add the public Antibiotic Classifier repo URL when ready.
    },
    image: "/assets/shots/antibiotic-classifier.webp",
    featured: true,
    year: "2025",
    metrics: [
      { value: "97.0%", label: "best accuracy" },
      { value: "0.965", label: "weighted F1" },
      { value: "3", label: "models compared" },
    ],
  },
  {
    slug: "ticket-system",
    name: "Ticket Management System",
    tagline: "Multi-role workflow, built like production",
    oneLiner:
      "A multi-role ticketing platform with 10+ RESTful APIs, built as a production-style backend to practice the service architecture real teams use.",
    summary:
      "A self-directed backend project mirroring the architecture I worked in at Wamo Labs: a production-style, service-oriented Node.js and Express API with 10+ RESTful endpoints organized into routers, controllers, and middleware, backed by PostgreSQL through Sequelize ORM, with a Next.js front end and multi-role access control.",
    detail: `This is deliberate practice, not a tutorial follow-along. After working inside a production MERN codebase at Wamo Labs, I wanted to rebuild that kind of **service-oriented backend** from an empty repo, to understand the architecture rather than just use it. The result is a multi-role ticketing platform on **Node.js** and **Express**, with a **Next.js** front end.

The backend is structured the way a real team structures one: **10+ RESTful APIs** split cleanly into **routers, controllers, and middleware**, with **PostgreSQL** accessed through **Sequelize ORM** rather than hand-written SQL. Roles gate what each user can see and do, which is where most of the interesting authorization logic lives.`,
    highlights: [
      "Production-style, service-oriented backend built from an empty repo to internalize the architecture",
      "10+ RESTful APIs organized into routers, controllers, and middleware",
      "PostgreSQL via Sequelize ORM, with multi-role access control",
      "Next.js front end over an Express API",
    ],
    stack: ["Next.js", "Node.js", "Express", "PostgreSQL", "Sequelize ORM"],
    links: {
      repo: "https://github.com/m-ahmadaslam/Ticket-Management-System",
    },
    image: "/assets/shots/ticket-system.webp",
    featured: false,
    year: "2026",
  },
  {
    slug: "financial-forecasting",
    name: "Financial Forecasting Dashboard",
    tagline: "An enterprise Excel model, made interactive",
    oneLiner:
      "An Alfanar web app that turns a large, formula-heavy Excel financial model into an interactive Next.js and FastAPI dashboard, with month-by-month project timelines and an AI analyst that scores each project and writes its investment memo.",
    summary:
      "Built at Alfanar, this app digitizes a large, formula-heavy Excel financial model into an interactive product. A Next.js frontend handles auth and a multi-step project form; a separate FastAPI backend parses all 85,569 fields across 6 sheets with openpyxl and computes month-by-month timelines (164 fields per period). A deterministic scoring engine then feeds a hosted Qwen2.5-7B model that writes the investment memo and answers follow-up questions.",
    detail: `Alfanar ran its project financials in one large, formula-heavy Excel workbook. This app turns that workbook into an interactive product: a **Next.js** frontend where a user signs in, fills a multi-step project form, and reads the result in a dashboard, talking to a separate **FastAPI** backend that does the numerical heavy lifting.

The backend parses the source workbook with **openpyxl**, walking every sheet to classify each cell as an input or a calculated field: **85,569 fields across 6 sheets** in all. From those inputs it generates a month-by-month project timeline, computing **164 timeline fields per period** against a start-to-end date range.

On top sits an **AI Analyst** panel. A fully deterministic scoring engine computes financial, risk, sustainability, and operational sub-scores from the saved project data, then hands that summary to a hosted **Qwen2.5-7B** model (via Hugging Face) that writes a plain-English investment memo and answers follow-up chat questions. The scoring is plain arithmetic, not a black box, so every number the model talks about is traceable, and an offline keyword fallback keeps the panel useful when the model is unavailable.

Auth is handled with **NextAuth** credential login over **MongoDB**, with bcrypt hashing and JWT sessions, and multi-step drafts persist to Mongo as the user works.`,
    highlights: [
      "Parses an 85,569-field Excel workbook (6 sheets) with openpyxl, classifying every cell as input or formula",
      "FastAPI backend generates month-by-month timelines, computing 164 timeline fields per period",
      "AI Analyst: a deterministic scoring engine (financial, risk, sustainability, operational) feeds a hosted Qwen2.5-7B model that writes the investment memo",
      "NextAuth credential auth with JWT sessions and bcrypt over MongoDB, with persisted multi-step project drafts",
      "A Next.js frontend and a separate Python FastAPI service, integrated over HTTP",
    ],
    stack: ["Next.js 15", "React 19", "TypeScript", "Tailwind", "NextAuth.js", "MongoDB", "FastAPI", "Python", "openpyxl", "Hugging Face"],
    links: {
      repo: "https://github.com/m-ahmadaslam/Financial-Forecasting-Dashboard",
    },
    image: "/assets/shots/financial-forecasting.webp",
    featured: false,
    year: "2025",
    metrics: [
      { value: "85,569", label: "Excel fields parsed" },
      { value: "164", label: "timeline fields / period" },
      { value: "6", label: "source sheets" },
    ],
  },
];

// projects with a public web deploy get a url bar in the window chrome.
// antibiotic-classifier is omitted on purpose: its Streamlit URL is too long to read
// in a window chrome, and its shot is a designed stat card rather than a screenshot.
export const WEB_PROJECTS = ["zero-limit", "market-craft"];

// display order for the featured projects on the home and projects pages.
// Listen leads (real-time model graded Gold), then the two live/ML builds, then the store.
export const FEATURED_ORDER = ["listen", "antibiotic-classifier", "market-craft", "zero-limit"];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  },
  {
    group: "Web & product",
    items: ["React", "Next.js", "Node", "Express", "Tailwind", "FastAPI", "Flutter"],
  },
  {
    group: "Data & DevOps",
    items: ["PostgreSQL", "MongoDB", "Supabase", "Neon", "Docker", "Kubernetes", "CI/CD", "Vercel"],
  },
  {
    group: "AI & ML",
    items: ["TensorFlow", "MediaPipe", "Scikit-learn", "XGBoost", "Hugging Face", "RAG", "LangChain", "LangGraph", "RLHF / SFT"],
  },
];

// curated stack for the home 3D crystal cloud. each crystal shows its `logo` on the
// front facet (tinted lavender to sit inside the glass) and its `label` on the back,
// so rotating it reveals the name. entries WITHOUT a `logo` (e.g. FastAPI) simply show
// the name on both faces. logos are Simple Icons SVGs in public/assets/logos/ — to add
// one, drop its <slug>.svg there and set `logo` to that path.
export const skillOrbs: { label: string; logo?: string }[] = [
  { label: "TypeScript", logo: "/assets/logos/typescript.svg" },
  { label: "JavaScript", logo: "/assets/logos/javascript.svg" },
  { label: "Python", logo: "/assets/logos/python.svg" },
  { label: "React", logo: "/assets/logos/react.svg" },
  { label: "Next.js", logo: "/assets/logos/nextdotjs.svg" },
  { label: "Node.js", logo: "/assets/logos/nodedotjs.svg" },
  { label: "Express", logo: "/assets/logos/express.svg" },
  { label: "Tailwind", logo: "/assets/logos/tailwindcss.svg" },
  { label: "Redux", logo: "/assets/logos/redux.svg" },
  { label: "HTML5", logo: "/assets/logos/html5.svg" },
  { label: "PostgreSQL", logo: "/assets/logos/postgresql.svg" },
  { label: "MongoDB", logo: "/assets/logos/mongodb.svg" },
  { label: "MySQL", logo: "/assets/logos/mysql.svg" },
  { label: "Redis", logo: "/assets/logos/redis.svg" },
  { label: "Docker", logo: "/assets/logos/docker.svg" },
  { label: "Kubernetes", logo: "/assets/logos/kubernetes.svg" },
  { label: "TensorFlow", logo: "/assets/logos/tensorflow.svg" },
  { label: "LangChain", logo: "/assets/logos/langchain.svg" },
  { label: "LangGraph", logo: "/assets/logos/langgraph.svg" },
  { label: "FastAPI" },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

export const certifications: Certification[] = [
  {
    name: "Kanz AI Hackathon (Gold Rating)",
    issuer: "Kanz AI / LAU ACE",
    date: "2026",
    url: "https://try.ka.nz/ai/muhammadaslam",
  },
  {
    name: "Oracle Agentic AI Foundations",
    issuer: "Oracle",
    date: "2026",
  },
  {
    name: "AWS Architecture Job Simulation",
    issuer: "Forage",
    date: "2025",
  },
  {
    name: "Machine Learning with Python",
    issuer: "IBM",
    date: "2024",
  },
  {
    name: "Full-Stack Web Development",
    issuer: "DevTown",
    date: "2024",
  },
];

// no "Contact" here on purpose: the "Get in touch" button in the header already
// goes to /contact, so a second link would be redundant.
export const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;
