export interface CvStat { label: string; value: string; }
export interface CvCompetency { k: string; v: string; }
export interface CvExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  context: string;
  bullets: string[];
}
export interface CvProject {
  name: string;
  lang: string;
  desc: string;
  stars: string;
  slug: string;
}
export interface CvStackGroup { group: string; items: string[]; }
export interface CvEducation { title: string; org: string; }
export interface CvLanguage { name: string; level: string; }

export interface CvData {
  name: string;
  handle: string;
  role: string;
  subrole: string;
  location: string;
  mode: string;
  email: string;
  phone: string;
  linkedin: string;
  born: number;
  license: string;
  summary: string;
  stats: CvStat[];
  competencies: CvCompetency[];
  experience: CvExperience[];
  projects: CvProject[];
  stack: CvStackGroup[];
  education: CvEducation[];
  certifications: string[];
  languages: CvLanguage[];
  softSkills: string[];
}

export const cv: CvData = {
  name: 'Giacomo Castello',
  handle: 'giacomocastello',
  role: 'Senior Performance Marketing & Martech Manager',
  subrole: 'Global E-commerce',
  location: 'Palermo, IT',
  mode: 'Remote-first',
  email: 'castello.giacomo.90@gmail.com',
  phone: '+39 388 4740108',
  linkedin: 'https://www.linkedin.com/in/giacomocastello/',
  born: 1990,
  license: 'B',

  summary: `<strong>Senior Digital & Martech Manager</strong> leading global performance marketing for high-end fashion e-commerce. Over the past four years has <strong>scaled paid media from €1.0M to a €2.4M peak</strong> across <strong>8 ad platforms</strong> and <strong>50+ international markets</strong>, contributing to <strong>+38% YoY revenue growth (€41M → €57M)</strong> in the first year on the role. Combines strategic media leadership, cross-functional stakeholder management and hands-on technical execution to deliver measurable P&L impact. Currently <strong>co-leading the marketing function</strong> alongside the Deputy CEO, managing <strong>5 direct reports</strong> and working directly with CEO and CTO on strategic initiatives.`,

  stats: [
    { label: 'paid_media_peak', value: '€2.4M' },
    { label: 'ad_platforms', value: '8' },
    { label: 'markets', value: '50+' },
    { label: 'yoy_revenue_growth', value: '+38%' },
    { label: 'blended_roas', value: '~13x' },
    { label: 'direct_reports', value: '5' },
  ],

  competencies: [
    { k: 'Global Performance & Media', v: 'Full-funnel orchestration across AMER / EMEA / APAC; pacing on ROAS, GMV and contribution margin.' },
    { k: 'E-commerce & Product Logic', v: 'Assortment strategy, pricing windows, promo calendar, feed quality; media–merchandising loop.' },
    { k: 'Leadership & Stakeholders', v: 'Cross-functional team direction; alignment with C-level, IT/BI and external partners.' },
    { k: 'Martech & Data Architecture', v: 'GA4, GTM client + Server-Side GTM, BigQuery, GCP; ETL / API pipelines and data activation.' },
    { k: 'Measurement & Privacy', v: 'Event taxonomy, Consent Mode v2, server-side tagging, QA frameworks and data reliability.' },
    { k: 'Attribution & Experimentation', v: 'MTA, incrementality testing, light MMM, rapid test-and-learn frameworks.' },
    { k: 'AI & Automation', v: 'Asset generation, analysis and ops workflows powered by Python, Apps Script and API integrations.' },
  ],

  experience: [
    {
      title: 'Senior Advertising & Martech Manager',
      company: 'Giglio.com S.p.A.',
      period: '2021 — Present',
      location: 'Palermo / Remote',
      context: 'High-end fashion e-commerce, listed on Euronext Growth Milan.',
      bullets: [
        'Leads the Digital Marketing Unit and <strong>co-leads the marketing function</strong> alongside the Deputy CEO; manages <strong>5 direct reports</strong> across performance, analytics and martech.',
        '<strong>Scaled annual paid media spend from €1.0M to a €2.4M peak</strong> in 2023, currently steering €1.9M+ across <strong>8 platforms</strong> (Google, Meta, TikTok, Pinterest, Microsoft Ads, Criteo, Rakuten, affiliate networks) and <strong>50+ international markets</strong> — up from 15 markets at start.',
        'Contributed to <strong>+38% YoY revenue growth</strong> in the first year on the role (FY21 → FY22, ~€41M → ~€57M) through media mix overhaul, full-funnel orchestration and feed strategy redesign.',
        'Sustains a <strong>blended ROAS of ~13x</strong> through tight pacing, incrementality testing, and continuous creative-audience iteration on premium fashion catalog.',
        'Drives experimentation and decisioning across channels via <strong>incrementality tests, MTA analysis</strong> and structured inputs on media mix, creative and assortment.',
        'Migrated the tracking stack to a <strong>server-side GTM architecture on GA4</strong>, recovering <strong>~30% of conversions</strong> previously lost to ITP, ad-blockers and consent gaps.',
        'Owns the full data pipeline (GA4, sGTM, BigQuery, GCP) and API-based activations for near real-time reporting and optimization, with <strong>end-to-end autonomy</strong> on setup, QA and troubleshooting — no external agency dependency.',
        'Built an <strong>AI-powered feed enrichment pipeline</strong> (GPT-4 + custom prompts) that auto-generates localized titles and descriptions; first production rollout on the DE market processed ~250k size variants and <strong>lifted ROAS from 14.4x to 18.4x (+4 points)</strong>, validated via A/B test at 99% confidence.',
        'Engineered <strong>Apps Script and BigQuery automations</strong> that eliminated hours of weekly manual work and shifted recurring operations (bid changes, budget reallocations, reporting refreshes) to off-hours scheduled jobs.',
      ],
    },
    {
      title: 'Digital Advertising & Martech Lead',
      company: 'Giambrone & Partners',
      period: '2018 — 2021',
      location: 'Palermo / Remote',
      context: 'International law firm — Legal vertical.',
      bullets: [
        'Defined multi-country performance strategy with focus on lead quality and compliance.',
        'Implemented the martech stack (GA / GTM / CRM), measurement by practice area and qualification funnels.',
        'Rationalized media spend, ran test-and-learn programs and produced executive reporting.',
      ],
    },
    {
      title: 'Digital Advertising Lead',
      company: 'Previous Company',
      period: '2015 — 2018',
      location: 'Italy',
      context: '',
      bullets: [
        'Managed paid media operations across Google, Meta and Programmatic with ROAS-based logics and budget / bid automation.',
        'Built dashboards and reporting processes anchored to business KPIs.',
      ],
    },
  ],

  projects: [
    {
      name: 'css-attribution-exposure',
      lang: 'BigQuery',
      desc: 'Designed and deployed a production BigQuery query joining GA4 export and Google Ads Data Transfer tables to detect GCLID mismatches and identify sessions attributable to third-party Comparison Shopping Services active in key European markets. Quantified their conversion contribution and informed bidding and exclusion strategies in FR and DE.',
      stars: 'FR·DE',
      slug: 'css-attribution-exposure',
    },
    {
      name: 'ai-feed-enrichment',
      lang: 'GPT-4 + Merchant Center',
      desc: 'LLM-based pipeline that auto-generates localized product titles and descriptions from catalog data. First production rollout on the DE market processed ~250k size variants; A/B test validated the AI-generated variant at 99% confidence, lifting ROAS from 14.4x → 18.4x (+4 points). Pipeline designed for rollout across multiple markets and languages.',
      stars: '+4pts ROAS',
      slug: 'ai-feed-enrichment',
    },
    {
      name: 'mta-data-lake',
      lang: 'BigQuery architecture',
      desc: 'Unified attribution architecture on BigQuery consolidating GA4, Google Ads, Meta, TikTok and other paid platforms into a single event-level data model. Framework supports custom attribution windows, incrementality overlays and channel-level contribution analysis, enabling media mix decisions beyond platform-reported ROAS.',
      stars: 'designed',
      slug: 'mta-data-lake',
    },
  ],

  stack: [
    { group: 'Ads & Retail Media', items: ['Google Ads', 'Meta', 'TikTok', 'Pinterest', 'Microsoft Ads', 'Criteo', 'Rakuten', 'Affiliate networks'] },
    { group: 'E-commerce Ops', items: ['Merchant Center', 'Feed management', 'Catalog enrichment', 'Product taxonomy'] },
    { group: 'Analytics & Data', items: ['GA4', 'GTM (client + server-side)', 'BigQuery', 'Looker Studio', 'GCP'] },
    { group: 'Privacy & Governance', items: ['Consent Mode v2', 'Server-side tagging', 'Data QA', 'Naming conventions'] },
    { group: 'Dev & Automation', items: ['Python', 'Apps Script', 'REST APIs', 'ETL', 'GPT-4', 'Gemini', 'Claude'] },
    { group: 'Experimentation', items: ['A/B & holdout testing', 'Uplift / incrementality', 'North-star metrics', 'Guardrails'] },
  ],

  education: [
    { title: 'Computer Science Coursework', org: 'University of Palermo (UniPA)' },
    { title: 'Scientific High School Diploma', org: '' },
  ],

  certifications: [
    'Google Ads — Search, Display, Shopping & Measurement',
    'Meta Buying Professional',
    'GA4 & BigQuery Advanced',
    'Python for Marketing Automation',
    'Google Cloud Platform Fundamentals',
  ],

  languages: [
    { name: 'Italian', level: 'native' },
    { name: 'English', level: 'C1 — professional working proficiency' },
  ],

  softSkills: [
    'Cross-Functional Leadership',
    'Stakeholder Management',
    'Data-Driven Decision Making',
    'Strategic Problem Solving',
    'Team Mentoring',
    'Business Acumen',
  ],
};
