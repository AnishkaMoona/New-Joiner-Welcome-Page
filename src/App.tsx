/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Search,
  Clock,
  User,
  Mail,
  MessageSquare,
  Building2,
  Laptop,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  Bookmark,
  FileText,
  Sparkles,
  Share2,
  Check,
  Edit3,
} from 'lucide-react';

// Types
interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  day: 'day-1' | 'day-2' | 'day-3' | 'day-4-5';
  category: 'Setup' | 'Team' | 'Dev' | 'Admin';
  estimatedMinutes: number;
  completed: boolean;
  isCustom?: boolean;
}

interface ContactPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  focus: string;
  email: string;
  slackHandle: string;
  hours: string;
  category: 'Buddy' | 'Manager' | 'IT' | 'HR' | 'Workplace';
  avatarInitials: string;
}

interface UsefulLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'Company' | 'Tools' | 'Engineering' | 'Admin';
  tag: string;
  requiresSSO: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Schedule' | 'Tools & Access' | 'Benefits' | 'Culture';
}

// Initial Sample Data
const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // Day 1
  {
    id: 'chk-1',
    title: 'Set up laptop, password manager, and 2FA',
    description: 'Log into 1Password, configure Google Workspace with hardware key or authenticator app, and set up biometric sign-in.',
    day: 'day-1',
    category: 'Setup',
    estimatedMinutes: 30,
    completed: true,
  },
  {
    id: 'chk-2',
    title: 'Join key Slack channels and post your intro',
    description: 'Join #announcements, #watercooler, and #team-product. Share a quick hello, photo of your workspace or pet!',
    day: 'day-1',
    category: 'Team',
    estimatedMinutes: 15,
    completed: true,
  },
  {
    id: 'chk-3',
    title: 'Complete HR onboarding profile & direct deposit',
    description: 'Verify your emergency contact, tax withholding, and payroll account details in the employee portal.',
    day: 'day-1',
    category: 'Admin',
    estimatedMinutes: 20,
    completed: false,
  },
  {
    id: 'chk-4',
    title: 'First coffee chat with your Onboarding Buddy',
    description: 'Casual 30-min sync to ask early questions, learn the team rhythm, and hear the inside scoop.',
    day: 'day-1',
    category: 'Team',
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 'chk-5',
    title: 'Manager 1:1: Week 1 expectations and goals',
    description: 'Review your 30-60-90 day orientation framework, working hours, and initial focus areas with David.',
    day: 'day-1',
    category: 'Team',
    estimatedMinutes: 45,
    completed: false,
  },
  // Day 2
  {
    id: 'chk-6',
    title: 'Request tool permissions via IT Self-Service',
    description: 'Submit access requests for GitHub, Figma, Jira, and staging AWS/GCP developer environments.',
    day: 'day-2',
    category: 'Setup',
    estimatedMinutes: 20,
    completed: false,
  },
  {
    id: 'chk-7',
    title: 'Clone repositories and run the local development build',
    description: 'Follow the repository README to clone the main codebase, install dependencies, and run tests locally.',
    day: 'day-2',
    category: 'Dev',
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 'chk-8',
    title: 'Attend your first daily team standup',
    description: 'Tune in to the 10:00 AM team standup. No pressure to present—just observe the flow and say a quick hi!',
    day: 'day-2',
    category: 'Team',
    estimatedMinutes: 15,
    completed: false,
  },
  {
    id: 'chk-9',
    title: 'Review team architecture overview & coding guidelines',
    description: 'Read through the system architecture diagram and style guide in the engineering handbook.',
    day: 'day-2',
    category: 'Dev',
    estimatedMinutes: 40,
    completed: false,
  },
  // Day 3
  {
    id: 'chk-10',
    title: 'Starter issue pairing session with buddy',
    description: 'Pick an introductory "good first issue" or documentation update and pair-program with Maya to get familiar with CI/CD.',
    day: 'day-3',
    category: 'Dev',
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 'chk-11',
    title: 'Schedule two 15-minute cross-team meet-and-greets',
    description: 'Reach out to counterparts in Product Design and Quality Assurance to understand how handoffs happen.',
    day: 'day-3',
    category: 'Team',
    estimatedMinutes: 20,
    completed: false,
  },
  {
    id: 'chk-12',
    title: 'Test your staging deployment & VPN credentials',
    description: 'Verify your Tailscale/VPN profile and access the staging environment to ensure all routes resolve smoothly.',
    day: 'day-3',
    category: 'Setup',
    estimatedMinutes: 20,
    completed: false,
  },
  // Day 4-5
  {
    id: 'chk-13',
    title: 'Submit and merge your first pull request',
    description: 'Ship your small starter fix or doc improvement through code review to verify GitHub actions and deployment pipeline.',
    day: 'day-4-5',
    category: 'Dev',
    estimatedMinutes: 45,
    completed: false,
  },
  {
    id: 'chk-14',
    title: 'Enroll in healthcare, pension, and wellness benefits',
    description: 'Choose your medical, dental, and vision plan tier. Don’t forget to claim your $500 home office setup stipend!',
    day: 'day-4-5',
    category: 'Admin',
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 'chk-15',
    title: 'Friday week-one reflection 1:1 with your manager',
    description: 'Reflect on what went well, what felt overwhelming, and align on initial sprint priorities for week two.',
    day: 'day-4-5',
    category: 'Team',
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 'chk-16',
    title: 'Log off on time and celebrate finishing week one!',
    description: 'Step away from the screen, unwind, and congratulate yourself. You made it through the hardest week.',
    day: 'day-4-5',
    category: 'Team',
    estimatedMinutes: 5,
    completed: false,
  },
];

const CONTACTS: ContactPerson[] = [
  {
    id: 'c-1',
    name: 'Maya Chen',
    role: 'Staff Software Engineer',
    department: 'Core Platform',
    focus: 'Onboarding Buddy & Tech Mentor. Reach out for repo setup, architecture questions, pairing, or lunch recommendations.',
    email: 'maya.chen@acme.internal',
    slackHandle: '@maya.chen',
    hours: 'Mon–Fri, 9:00 AM – 5:00 PM',
    category: 'Buddy',
    avatarInitials: 'MC',
  },
  {
    id: 'c-2',
    name: 'David Miller',
    role: 'Engineering Manager',
    department: 'Product Engineering',
    focus: 'Direct Manager. Reach out for 30-60-90 day roadmap, team priorities, 1:1 check-ins, and performance guidance.',
    email: 'david.miller@acme.internal',
    slackHandle: '@david.m',
    hours: 'Mon–Fri, 8:30 AM – 4:30 PM',
    category: 'Manager',
    avatarInitials: 'DM',
  },
  {
    id: 'c-3',
    name: 'Global IT Support Desk',
    role: 'IT Operations & Security',
    department: 'Infrastructure & Support',
    focus: 'Hardware issues, VPN tokens, 1Password access, software licenses, Okta SSO, and multi-factor authentication.',
    email: 'helpdesk@acme.internal',
    slackHandle: '#help-it-support',
    hours: '24/5 coverage (Slack & Ticket)',
    category: 'IT',
    avatarInitials: 'IT',
  },
  {
    id: 'c-4',
    name: 'Sarah Jenkins',
    role: 'Senior People Partner',
    department: 'People Operations & HR',
    focus: 'Benefits enrollment, payroll, vacation policy, wellness perks, healthcare questions, and workplace accommodations.',
    email: 'sarah.jenkins@acme.internal',
    slackHandle: '@sarah.j',
    hours: 'Mon–Fri, 9:00 AM – 5:30 PM',
    category: 'HR',
    avatarInitials: 'SJ',
  },
  {
    id: 'c-5',
    name: 'Alex Rivera',
    role: 'Workplace Experience Lead',
    department: 'Facilities & Workplace',
    focus: 'Office badge access, desk ergonomic gear, mail & deliveries, visitor passes, and team social events.',
    email: 'workplace@acme.internal',
    slackHandle: '#workplace-office',
    hours: 'Mon–Fri, 8:00 AM – 4:30 PM',
    category: 'Workplace',
    avatarInitials: 'AR',
  },
];

const USEFUL_LINKS: UsefulLink[] = [
  {
    id: 'l-1',
    title: 'Company Notion Handbook',
    description: 'Our central source of truth for company history, team structures, cultural values, and working norms.',
    url: 'https://notion.so/acme/welcome-handbook',
    category: 'Company',
    tag: 'Handbook',
    requiresSSO: true,
  },
  {
    id: 'l-2',
    title: 'People Portal & HR Hub',
    description: 'Manage payroll direct deposit, request paid time off (PTO), view public holidays, and review perks.',
    url: 'https://people.acme.internal/portal',
    category: 'Admin',
    tag: 'HR & Payroll',
    requiresSSO: true,
  },
  {
    id: 'l-3',
    title: 'GitHub Organization',
    description: 'Access all team repositories, continuous deployment actions, pull request templates, and code standards.',
    url: 'https://github.com/acme-engineering',
    category: 'Engineering',
    tag: 'Codebase',
    requiresSSO: true,
  },
  {
    id: 'l-4',
    title: 'Slack Workspace',
    description: 'Daily team communication, project channels, emergency support, and watercooler social hubs.',
    url: 'https://acme-team.slack.com',
    category: 'Tools',
    tag: 'Communication',
    requiresSSO: true,
  },
  {
    id: 'l-5',
    title: 'Figma Design System',
    description: 'UI components, color tokens, icons, and official product interaction guidelines crafted by product design.',
    url: 'https://figma.com/@acme-design',
    category: 'Engineering',
    tag: 'Design',
    requiresSSO: true,
  },
  {
    id: 'l-6',
    title: 'Expensify & Reimbursements',
    description: 'Submit receipts for your home office setup stipend, team onboarding lunch, and learning budget.',
    url: 'https://expensify.acme.internal',
    category: 'Admin',
    tag: 'Finances',
    requiresSSO: true,
  },
  {
    id: 'l-7',
    title: 'IT Access & Software Catalog',
    description: 'Request JetBrains, GitHub Copilot, Docker Pro licenses, and cloud staging permissions.',
    url: 'https://it-requests.acme.internal',
    category: 'Tools',
    tag: 'IT Portal',
    requiresSSO: true,
  },
  {
    id: 'l-8',
    title: 'Team Calendar & All-Hands',
    description: 'Subscribe to company bi-weekly all-hands, demo days, engineering lightning talks, and holidays.',
    url: 'https://calendar.google.com/calendar/u/0/r',
    category: 'Company',
    tag: 'Calendar',
    requiresSSO: false,
  },
];

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'When is my first 1:1 with my manager, and what should I prepare?',
    answer: 'Your manager will set up an initial welcome check-in on Day 1 or Day 2. You don’t need to prepare a formal agenda—the focus is on getting to know each other, discussing how you like to communicate and receive feedback, and clarifying your week-one priorities.',
    category: 'Schedule',
  },
  {
    id: 'faq-2',
    question: 'How do I claim my home office setup stipend?',
    answer: 'Every full-time team member receives a $500 home office equipment allowance. Purchase your ergonomic desk gear, chair, monitor riser, or lighting, and submit the invoice in Expensify under category "Onboarding Office Stipend". Reimbursements are processed on the next bi-weekly payroll.',
    category: 'Benefits',
  },
  {
    id: 'faq-3',
    question: 'What are our core working hours and remote flexibility expectations?',
    answer: 'We operate with trust and autonomy. Our core overlap hours are 10:00 AM to 3:00 PM in your local time zone for synchronous meetings and pairing. Outside of that window, you have the flexibility to structure your day in the way that best supports your focus and family.',
    category: 'Culture',
  },
  {
    id: 'faq-4',
    question: 'How do I request developer tools, licenses, or cloud access?',
    answer: 'Visit the IT Access Catalog (link in the Useful Links section) and submit a request. Standard developer packages (JetBrains, GitHub Copilot, Figma Viewer) are auto-approved within 1 business day. For custom infrastructure permissions, your manager will receive a one-click Slack approval prompt.',
    category: 'Tools & Access',
  },
  {
    id: 'faq-5',
    question: 'What should I do if I get stuck or blocked while onboarding?',
    answer: 'Please do not suffer in silence! Everyone on the team remembers their first week. First, check with your Onboarding Buddy on Slack. If they’re in a meeting, ask in #team-product or #ask-engineering. Asking questions early saves everyone time and is actively celebrated.',
    category: 'Culture',
  },
  {
    id: 'faq-6',
    question: 'Where can I find fun social groups and interest channels on Slack?',
    answer: 'Browse channels starting with #club- or #social-! Some popular ones include #social-pets (share animal photos!), #social-coffee, #club-books, #club-gaming, and #foodies. Everyone is encouraged to join whatever speaks to their hobbies.',
    category: 'Culture',
  },
];

export default function App() {
  // Joiner Name Personalization (Saved in localStorage)
  const [joinerName, setJoinerName] = useState<string>(() => {
    return localStorage.getItem('newjoiner_name') || 'New Teammate';
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(joinerName);

  // Checklist State (Saved in localStorage)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('newjoiner_checklist_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CHECKLIST;
  });

  // Checklist Filter
  const [activeDayFilter, setActiveDayFilter] = useState<string>('all');
  const [checklistSearch, setChecklistSearch] = useState<string>('');

  // New custom task form state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDay, setNewTaskDay] = useState<'day-1' | 'day-2' | 'day-3' | 'day-4-5'>('day-1');
  const [newTaskMinutes, setNewTaskMinutes] = useState(20);

  // Contacts State
  const [contactCategoryFilter, setContactCategoryFilter] = useState<string>('all');
  const [copiedContactId, setCopiedContactId] = useState<string | null>(null);

  // Links State
  const [linkCategoryFilter, setLinkCategoryFilter] = useState<string>('all');
  const [linkSearch, setLinkSearch] = useState<string>('');
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // FAQ State
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Notes Scratchpad (Saved in localStorage)
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem('newjoiner_notes') || '';
  });
  const [notesSavedIndicator, setNotesSavedIndicator] = useState(false);

  // Global search / jump state
  const [activeNavSection, setActiveNavSection] = useState<'checklist' | 'contacts' | 'links' | 'faq'>('checklist');

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('newjoiner_checklist_v1', JSON.stringify(checklist));
    } catch {
      // Ignore storage errors
    }
  }, [checklist]);

  // Save joiner name
  useEffect(() => {
    try {
      localStorage.setItem('newjoiner_name', joinerName);
    } catch {
      // Ignore
    }
  }, [joinerName]);

  // Save notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    try {
      localStorage.setItem('newjoiner_notes', val);
      setNotesSavedIndicator(true);
      setTimeout(() => setNotesSavedIndicator(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Checklist toggles
  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleResetChecklist = () => {
    if (window.confirm('Reset the checklist to original first-week default tasks?')) {
      setChecklist(DEFAULT_CHECKLIST);
    }
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Personal onboarding task added by you.',
      day: newTaskDay,
      category: 'Admin',
      estimatedMinutes: Number(newTaskMinutes) || 15,
      completed: false,
      isCustom: true,
    };

    setChecklist((prev) => [newItem, ...prev]);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  // Copy email / Slack helper
  const handleCopyText = (text: string, id: string, type: 'contact' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'contact') {
      setCopiedContactId(id);
      setTimeout(() => setCopiedContactId(null), 2200);
    } else {
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2200);
    }
  };

  // Progress metrics
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter((item) => item.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const remainingMinutes = checklist
    .filter((item) => !item.completed)
    .reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  // Filtered Checklist
  const filteredChecklist = useMemo(() => {
    return checklist.filter((item) => {
      const matchesDay = activeDayFilter === 'all' || item.day === activeDayFilter;
      const matchesSearch =
        item.title.toLowerCase().includes(checklistSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(checklistSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(checklistSearch.toLowerCase());
      return matchesDay && matchesSearch;
    });
  }, [checklist, activeDayFilter, checklistSearch]);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return CONTACTS.filter((c) => {
      if (contactCategoryFilter === 'all') return true;
      return c.category.toLowerCase() === contactCategoryFilter.toLowerCase();
    });
  }, [contactCategoryFilter]);

  // Filtered Links
  const filteredLinks = useMemo(() => {
    return USEFUL_LINKS.filter((l) => {
      const matchesCat = linkCategoryFilter === 'all' || l.category.toLowerCase() === linkCategoryFilter.toLowerCase();
      const matchesSearch =
        l.title.toLowerCase().includes(linkSearch.toLowerCase()) ||
        l.description.toLowerCase().includes(linkSearch.toLowerCase()) ||
        l.tag.toLowerCase().includes(linkSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [linkCategoryFilter, linkSearch]);

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return FAQS.filter((f) => {
      return (
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.category.toLowerCase().includes(faqSearch.toLowerCase())
      );
    });
  }, [faqSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 pb-24 md:pb-16">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#welcome" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20">
              Ac
            </span>
            <span>Acme Welcome</span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#checklist"
              onClick={() => setActiveNavSection('checklist')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                activeNavSection === 'checklist' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              First-Week Checklist
            </a>
            <a
              href="#contacts"
              onClick={() => setActiveNavSection('contacts')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                activeNavSection === 'contacts' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Who to Ask
            </a>
            <a
              href="#links"
              onClick={() => setActiveNavSection('links')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                activeNavSection === 'links' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Useful Links
            </a>
            <a
              href="#faq"
              onClick={() => setActiveNavSection('faq')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                activeNavSection === 'faq' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Print or export checklist as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Hero Welcome Section */}
        <section id="welcome" className="relative rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50/60 to-white border border-blue-100/80 p-6 sm:p-8 overflow-hidden shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
              <span>Onboarding Companion</span>
              <span aria-hidden="true">·</span>
              <span>Week 1 Orientation</span>
              <span aria-hidden="true">·</span>
              <span>All progress auto-saved</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Welcome to Acme, {joinerName}!
              </h1>
              {!isEditingName ? (
                <button
                  onClick={() => {
                    setTempName(joinerName);
                    setIsEditingName(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded hover:bg-blue-100/50 transition-colors"
                  title="Personalize your name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (tempName.trim()) setJoinerName(tempName.trim());
                    setIsEditingName(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-sm px-2.5 py-1 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="text-xs px-2 py-1 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Starting a new job can feel overwhelming. Take a deep breath—your first week is entirely about settling in, meeting your teammates, getting your tools running, and absorbing the culture at a comfortable pace.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Completion</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 tabular-nums">{progressPercent}%</div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Tasks Checked</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-800 tabular-nums">
                  {completedTasks}/{totalTasks}
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Est. Remaining</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-800 tabular-nums">
                  {Math.round(remainingMinutes / 60)}h {remainingMinutes % 60}m
                </div>
              </div>
              <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Next Milestone</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1 truncate">
                  {completedTasks === totalTasks ? 'Week 1 Complete! 🎉' : 'Day 1 Warmup'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>First-Week Momentum</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: FIRST-WEEK CHECKLIST */}
        <section id="checklist" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>01. First-Week Checklist</span>
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>Ticks are remembered in your browser</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>Paced day-by-day</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>

              <button
                onClick={handleResetChecklist}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Restore default checklist"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Checklist Filters and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveDayFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDayFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Tasks ({checklist.length})
              </button>
              <button
                onClick={() => setActiveDayFilter('day-1')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDayFilter === 'day-1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Day 1 (Setup)
              </button>
              <button
                onClick={() => setActiveDayFilter('day-2')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDayFilter === 'day-2'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Day 2 (Tools)
              </button>
              <button
                onClick={() => setActiveDayFilter('day-3')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDayFilter === 'day-3'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Day 3 (Deep Dive)
              </button>
              <button
                onClick={() => setActiveDayFilter('day-4-5')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeDayFilter === 'day-4-5'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Day 4–5 (First PR)
              </button>
            </div>

            {/* Checklist Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search checklist..."
                value={checklistSearch}
                onChange={(e) => setChecklistSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Add Custom Task Inline Drawer / Modal */}
          {showAddTaskModal && (
            <form
              onSubmit={handleAddCustomTask}
              className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-3"
            >
              <div className="font-semibold text-xs text-blue-900">Add a Custom Onboarding Task</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Task title (e.g., Get added to mobile release squad)"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="sm:col-span-2 text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <select
                  value={newTaskDay}
                  onChange={(e) => setNewTaskDay(e.target.value as any)}
                  className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="day-1">Day 1: Setup & Essentials</option>
                  <option value="day-2">Day 2: Tools & Access</option>
                  <option value="day-3">Day 3: Deep Dive</option>
                  <option value="day-4-5">Day 4–5: First Contribution</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-600">Est. minutes:</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    step="5"
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                    className="w-16 text-xs px-2 py-1 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Checklist Items List */}
          <div className="space-y-2.5">
            {filteredChecklist.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                No checklist items match your current filter.
              </div>
            ) : (
              filteredChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`group relative flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  {/* Checkbox Touch Target (min 44x44px hitbox) */}
                  <div className="min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0 mt-0.5">
                    {item.completed ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center transition-transform group-active:scale-95 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500 bg-white transition-colors" />
                    )}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h3
                        className={`text-sm font-semibold tracking-tight transition-colors ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        item.completed ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {item.description}
                    </p>

                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        {item.day === 'day-1'
                          ? 'Day 1'
                          : item.day === 'day-2'
                          ? 'Day 2'
                          : item.day === 'day-3'
                          ? 'Day 3'
                          : 'Day 4–5'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>~{item.estimatedMinutes} min</span>
                      </span>
                      {item.isCustom && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-600 font-medium">Custom task</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action or Delete for custom item */}
                  {item.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(item.id);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors shrink-0"
                      title="Delete custom task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 2: WHO TO ASK */}
        <section id="contacts" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">02. Who to Ask</h2>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>Key support contacts for your first month</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>Never hesitate to reach out</span>
              </div>
            </div>

            {/* Filter Pills / Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setContactCategoryFilter('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  contactCategoryFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setContactCategoryFilter('buddy')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  contactCategoryFilter === 'buddy'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buddy
              </button>
              <button
                onClick={() => setContactCategoryFilter('manager')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  contactCategoryFilter === 'manager'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Manager
              </button>
              <button
                onClick={() => setContactCategoryFilter('it')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  contactCategoryFilter === 'it'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                IT Help
              </button>
              <button
                onClick={() => setContactCategoryFilter('hr')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  contactCategoryFilter === 'hr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                People / HR
              </button>
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 hover:shadow-xs transition-all"
              >
                <div className="space-y-3">
                  {/* Header / Avatar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 border border-blue-200/60">
                        {contact.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{contact.name}</h3>
                        <div className="text-xs text-slate-500">{contact.role}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {contact.category}
                    </span>
                  </div>

                  {/* Focus Description */}
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                    {contact.focus}
                  </p>

                  {/* Hours */}
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{contact.hours}</span>
                  </div>
                </div>

                {/* Contact Action Triggers */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-slate-700 hover:text-blue-600 font-medium truncate flex items-center gap-1.5"
                      title={contact.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                    <button
                      onClick={() => handleCopyText(contact.email, `${contact.id}-email`, 'contact')}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                      title="Copy Email"
                    >
                      {copiedContactId === `${contact.id}-email` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="text-slate-600 truncate flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-[11px] text-slate-700 truncate">{contact.slackHandle}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(contact.slackHandle, `${contact.id}-slack`, 'contact')}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                      title="Copy Slack handle"
                    >
                      {copiedContactId === `${contact.id}-slack` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: USEFUL LINKS */}
        <section id="links" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">03. Useful Links</h2>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>Core portals, documents, and toolkits bookmarked for you</span>
              </div>
            </div>

            {/* Links Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search links..."
                value={linkSearch}
                onChange={(e) => setLinkSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setLinkCategoryFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                linkCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Links
            </button>
            <button
              onClick={() => setLinkCategoryFilter('company')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                linkCategoryFilter === 'company'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Company & Culture
            </button>
            <button
              onClick={() => setLinkCategoryFilter('tools')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                linkCategoryFilter === 'tools'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tools & Comms
            </button>
            <button
              onClick={() => setLinkCategoryFilter('engineering')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                linkCategoryFilter === 'engineering'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Engineering
            </button>
            <button
              onClick={() => setLinkCategoryFilter('admin')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                linkCategoryFilter === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Admin & Expenses
            </button>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredLinks.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                No links match your search.
              </div>
            ) : (
              filteredLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{link.title}</span>
                      </h3>
                      {link.requiresSSO && (
                        <span className="text-[10px] text-slate-500 font-medium">SSO Required</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {link.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{link.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">{link.url.replace('https://', '')}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(link.url, link.id, 'link')}
                        className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors flex items-center gap-1"
                        title="Copy URL"
                      >
                        {copiedLinkId === link.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 4: FAQ ACCORDION */}
        <section id="faq" className="space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">04. Frequently Asked Questions</h2>
              <div className="text-xs text-slate-500 mt-0.5">
                <span>The practical things new joiners wonder about most</span>
              </div>
            </div>

            {/* FAQ Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Accordion Container */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {filteredFAQs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No questions found matching your search. Try searching for "expenses", "hours", or "buddy".
              </div>
            ) : (
              filteredFAQs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className="transition-colors">
                    <button
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors focus-visible:outline-none focus-visible:bg-slate-50"
                    >
                      <span className="text-sm font-semibold text-slate-900 text-balance">
                        {faq.question}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 hidden sm:inline">{faq.category}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-blue-50/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* SECTION 5: PERSONAL SCRATCHPAD & QUICK NOTES */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">My Week-One Scratchpad</h3>
            </div>
            <div className="text-[11px] text-slate-400">
              {notesSavedIndicator ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved locally
                </span>
              ) : (
                <span>Auto-saved to your browser</span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Jot down quick thoughts, temporary passwords, questions for your 1:1, or links your buddy pasted in Slack.
          </p>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="e.g. Ask Maya about the auth service migration; 1:1 with David on Thursday at 2pm..."
            rows={3}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Acme Corporation</span>
            <span aria-hidden="true">·</span>
            <span>New Joiner Guide</span>
            <span aria-hidden="true">·</span>
            <span>Version 2026.1</span>
          </div>
          <div>
            Need something not listed here? Ask in <span className="font-mono text-slate-700">#ask-engineering</span> or ping your buddy.
          </div>
        </footer>
      </main>

      {/* Mobile Sticky Bottom Navigation (Ergonomic Thumb-Zone, under 15% viewport height) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-4 gap-1 items-center">
          <a
            href="#checklist"
            onClick={() => setActiveNavSection('checklist')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
              activeNavSection === 'checklist' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Checklist</span>
          </a>

          <a
            href="#contacts"
            onClick={() => setActiveNavSection('contacts')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
              activeNavSection === 'contacts' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Contacts</span>
          </a>

          <a
            href="#links"
            onClick={() => setActiveNavSection('links')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
              activeNavSection === 'links' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Links</span>
          </a>

          <a
            href="#faq"
            onClick={() => setActiveNavSection('faq')}
            className={`min-h-[44px] flex flex-col items-center justify-center rounded-lg transition-colors ${
              activeNavSection === 'faq' ? 'text-blue-600 bg-blue-50/70 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">FAQ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
