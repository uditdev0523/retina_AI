import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Hospital,
  Menu,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onOpenDemoModal?: () => void;
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Screening', href: '/screening' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'About', href: '/about' },
];

const workflowSteps = [
  {
    number: '01',
    title: 'Capture',
    description: 'Upload a retinal fundus image.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'Quality Check',
    description: 'Automatically assess whether the image is suitable for analysis.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'AI Analysis',
    description: 'Analyze retinal features and estimate diabetic retinopathy severity.',
    icon: BrainCircuit,
  },
  {
    number: '04',
    title: 'Clinical Review',
    description: 'Provide explainable findings for healthcare professionals to review.',
    icon: ClipboardCheck,
  },
];

const clinicalFeatures = [
  {
    title: 'Image Quality Assessment',
    description: 'Automatically identify poor-quality retinal captures before analysis.',
    icon: ShieldCheck,
  },
  {
    title: 'Explainable AI',
    description: 'Visualize model attention using Grad-CAM and retinal feature overlays.',
    icon: BrainCircuit,
  },
  {
    title: 'Retinal Analysis',
    description: 'Support vessel, optic disc, fovea and lesion analysis.',
    icon: Eye,
  },
  {
    title: 'Clinician Review',
    description: 'Keep healthcare professionals in the decision-making loop.',
    icon: Stethoscope,
  },
  {
    title: 'Telemedicine Ready',
    description: 'Designed for screening workflows across PHCs and remote healthcare settings.',
    icon: Hospital,
  },
  {
    title: 'Audit-Friendly Reports',
    description: 'Provide structured screening information for review and documentation.',
    icon: FileText,
  },
];

const userProfiles = [
  {
    title: 'PHC / Healthcare Worker',
    description: 'Upload retinal images and initiate screening.',
    icon: Activity,
  },
  {
    title: 'Ophthalmologist',
    description: 'Review AI findings and verify screening results.',
    icon: Stethoscope,
  },
  {
    title: 'Healthcare Administrator',
    description: 'Monitor screening activity and clinical workflow.',
    icon: UserRound,
  },
];

const clinicalMetrics = [
  {
    label: 'AI-Assisted Screening',
    value: '<2 sec',
    hint: 'Analysis workflow',
  },
  {
    label: 'Image Quality',
    value: 'Automated',
    hint: 'Pre-analysis check',
  },
  {
    label: 'Explainability',
    value: 'Grad-CAM',
    hint: 'Visual evidence',
  },
  {
    label: 'Clinical Review',
    value: 'Human-in-the-loop',
    hint: 'Doctor verification',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenDemoModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-medical-200 selection:text-slate-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <header className="relative z-10 border-b border-slate-200 bg-white/90 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-medical-200 bg-medical-50 text-medical-700 shadow-sm">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-900">RetinaAI</div>
              </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
              {navItems.map((item) =>
                item.href.startsWith('#') ? (
                  <a key={item.label} href={item.href} className="transition hover:text-slate-900">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} to={item.href} className="transition hover:text-slate-900">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Clinical Screening Platform
              </div>
              <Link
                to="/login"
                className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
              >
                Sign In
              </Link>
              <Link
                to="/screening"
                className="inline-flex items-center gap-2 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-medical-700"
              >
                Start Screening
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                aria-label="Toggle navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
              <div className="flex flex-col gap-2 text-sm font-medium text-slate-600">
                {navItems.map((item) =>
                  item.href.startsWith('#') ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="rounded-lg px-2 py-2 hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <Link
                  to="/login"
                  className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center font-semibold text-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </header>

        <main>
          <section className="mx-auto max-w-6xl py-12 sm:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-medical-200 bg-medical-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-medical-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  AI-Assisted Retinal Screening
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.8rem] lg:leading-[1.05]">
                    Early Detection.<br />
                    Clearer Decisions.<br />
                    Better Eye Care.
                  </h1>

                  <p className="max-w-xl text-lg leading-8 text-slate-600">
                    RetinaAI assists healthcare professionals in screening retinal fundus images for diabetic retinopathy using explainable AI and clinically focused image analysis.
                  </p>

                  <p className="text-sm font-medium text-slate-500">
                    Screening support tool — not a replacement for professional medical diagnosis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to="/screening"
                    className="inline-flex items-center gap-2 rounded-xl bg-medical-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-medical-700"
                  >
                    Start a Screening
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                  >
                    View Clinical Dashboard
                  </Link>
                </div>

                <div className="flex flex-col gap-3 pt-2 text-sm text-slate-700 sm:flex-row sm:flex-wrap">
                  {['Automated image quality check', 'Explainable AI analysis', 'Clinician review workflow'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_-30px_rgba(15,23,42,0.25)]">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Patient</div>
                      <div className="text-sm font-semibold text-slate-900">RA-2026-0148</div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Image Quality: Good — 92%
                    </div>
                  </div>

                  <div className="relative">
                    <img
                      src={`${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`}
                      alt="Retinal fundus image viewer"
                      className="h-[470px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-slate-900/10" />

                    <div className="absolute left-5 top-5 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Eye</div>
                      <div className="text-sm font-semibold text-slate-900">Right Eye</div>
                    </div>

                    <div className="absolute right-5 top-5 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Image Quality</div>
                      <div className="text-sm font-semibold text-slate-900">Good — 92%</div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">AI Screening</div>
                        <div className="mt-1 text-xl font-bold text-slate-900">Moderate NPDR</div>
                        <div className="mt-1 text-sm text-slate-600">Confidence: 91.4%</div>
                      </div>

                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-right shadow-sm">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Clinical note</div>
                        <div className="text-xs font-medium text-amber-800">Lesion burden elevated</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3">
                    {['Original', 'Enhanced', 'Grad-CAM'].map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          index === 2
                            ? 'border border-medical-200 bg-medical-50 text-medical-700'
                            : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-slate-200 bg-white py-6">
            <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
              {clinicalMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{metric.label}</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{metric.value}</div>
                  <div className="mt-1 text-sm text-slate-600">{metric.hint}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="workflow" className="mx-auto max-w-6xl py-20">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-medical-700">Workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                How RetinaAI Supports the Screening Workflow
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.number} className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute right-[-18px] top-12 hidden h-px w-8 bg-slate-200 lg:block" />
                    )}
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-lg font-bold text-medical-700">{step.number}</span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-medical-50 text-medical-700">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-slate-100 py-20">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-700">Retinal Fundus Viewer</div>
                  <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    Quality Passed
                  </div>
                </div>
                <img
                  src={`${import.meta.env.BASE_URL}demo/demo_moderate_dr.png`}
                  alt="Retinal screening preview"
                  className="h-[440px] w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.25)]">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-medical-700">Screening Summary</div>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Patient Case Overview</h3>

                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>Patient ID</span>
                    <span className="font-semibold text-slate-900">RA-2026-0148</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>Eye</span>
                    <span className="font-semibold text-slate-900">Right Eye</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>Image Quality</span>
                    <span className="font-semibold text-slate-900">Passed</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span>AI Classification</span>
                    <span className="font-semibold text-slate-900">Moderate NPDR</span>
                  </div>
                  <div className="flex items-center justify-between pb-3">
                    <span>Confidence</span>
                    <span className="font-semibold text-slate-900">91.4%</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Visual Findings</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    <li>• Microaneurysm regions</li>
                    <li>• Retinal vessel abnormalities</li>
                    <li>• Suspicious lesion regions</li>
                  </ul>
                </div>

                <div className="mt-6 rounded-2xl border border-medical-200 bg-medical-50 p-4 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-medical-700">Explainability:</span>{' '}
                  Grad-CAM regions indicate model attention around detected retinal abnormalities.
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/screening" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                    Review Case
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/reports" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900">
                    Generate Report
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl py-20">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-medical-700">Why RetinaAI</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Clinical Tools Built for Trust and Review
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {clinicalFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-medical-50 text-medical-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-medical-700">Users</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Built for the Complete Screening Workflow
                </h2>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {userProfiles.map((profile) => {
                  const Icon = profile.icon;
                  return (
                    <div key={profile.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-medical-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{profile.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{profile.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl py-20">
            <div className="rounded-[28px] border border-medical-200 bg-medical-50 p-6 text-center text-slate-700 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-medical-700">Clinical Disclaimer</p>
              <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
                RetinaAI is an AI-assisted screening and clinical decision-support system. Results should be reviewed by a qualified healthcare professional and should not be considered a definitive medical diagnosis.
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white py-10">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-medical-200 bg-medical-50 text-medical-700">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-slate-900">RetinaAI</div>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
                AI-assisted diabetic retinopathy screening.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <div className="space-y-2">
                <a href="/" className="block hover:text-slate-900">Home</a>
                <a href="/screening" className="block hover:text-slate-900">Screening</a>
                <a href="/dashboard" className="block hover:text-slate-900">Dashboard</a>
              </div>
              <div className="space-y-2">
                <a href="#workflow" className="block hover:text-slate-900">How It Works</a>
                <a href="/about" className="block hover:text-slate-900">About</a>
                <a href="#" className="block hover:text-slate-900">Privacy</a>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-6xl border-t border-slate-200 pt-6 text-sm text-slate-500">
            Designed for research and clinical screening workflow demonstration.
          </div>
        </footer>
      </div>
    </div>
  );
};
