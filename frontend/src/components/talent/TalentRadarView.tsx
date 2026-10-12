import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  TalentProfile, 
  SkillCategory, 
  CareerRoadmapGoal, 
  StudentProject,
  ProjectStatus,
  ProjectVisibility
} from '../../types';
import { 
  Compass, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  Award, 
  Code, 
  Layers, 
  Briefcase, 
  TrendingUp,
  ShieldCheck,
  Eye, 
  EyeOff, 
  UserCheck, 
  Plus, 
  User,
  Lightbulb,
  Check,
  X,
  Globe,
  Lock,
  Trash2,
  Edit3,
  Calendar,
  Share2,
  FolderGit2,
  Heart
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StudentPortfolioEditor } from './StudentPortfolioEditor';

const SHARED_PROJECTS_STORAGE_KEY = 'student_analytics_published_projects';

// Initial cohort projects
const INITIAL_SHARED_PROJECTS: StudentProject[] = [
  {
    id: 'proj-01',
    title: 'Autonomous Multi-Agent AI Research Assistant',
    summary: 'Autonomous LLM agent system that synthesizes multi-source research papers into structured LaTeX literature reviews.',
    description: 'An end-to-end framework integrating vector embeddings, semantic retrieval, and self-correcting prompt loops. Developed for academic researchers dealing with large corpus literature surveys.',
    category: 'ai_ml',
    technologies: ['Python', 'FastAPI', 'PyTorch', 'LangChain', 'PostgreSQL (pgvector)'],
    skillsDemonstrated: ['Agentic Workflows', 'Vector Databases', 'Prompt Engineering', 'Async Python'],
    githubUrl: 'https://github.com/example/research-agent',
    liveUrl: 'https://ai-research-agent.demo.app',
    status: 'completed',
    visibility: 'college_visible',
    ownerStudentId: 'STU-001',
    ownerName: 'Alex Rivera',
    verified: true,
    likes: 38,
    likedBy: ['STU-002', 'STU-003'],
    createdAt: '2026-10-01',
  },
  {
    id: 'proj-02',
    title: 'Distributed Campus Micro-Grid Energy Optimizer',
    summary: 'IoT edge controller predicting energy consumption and load-shedding schedules for university labs.',
    description: 'Hardware prototype reading telemetry sensors across 12 campus buildings. Uses time-series forecasting (LSTM) to optimize solar battery storage discharging during peak grid tariffs.',
    category: 'iot',
    technologies: ['C++', 'Rust', 'TensorFlow Lite', 'MQTT', 'Docker'],
    skillsDemonstrated: ['Edge Computing', 'Embedded Systems', 'Time-Series Forecasting', 'C++ Performance'],
    githubUrl: 'https://github.com/example/microgrid-optimizer',
    status: 'in_progress',
    visibility: 'college_visible',
    ownerStudentId: 'STU-002',
    ownerName: 'Priya Sharma',
    verified: true,
    likes: 27,
    likedBy: ['STU-001'],
    createdAt: '2026-10-05',
  },
  {
    id: 'proj-03',
    title: 'Zero-Knowledge Credential Verification for Student Diplomas',
    summary: 'Early-stage cryptographic idea for tamper-proof student degrees and instant employer verification.',
    description: 'Investigating Circom and snarkjs to generate zero-knowledge proofs for university degrees. Employers can verify degree authenticity without accessing confidential student grade sheets or personal details.',
    category: 'cybersecurity',
    technologies: ['Circom', 'Solidity', 'TypeScript', 'Cryptography'],
    skillsDemonstrated: ['Zero-Knowledge Proofs', 'Smart Contract Auditing', 'Privacy Engineering'],
    status: 'idea',
    visibility: 'college_visible',
    ownerStudentId: 'STU-003',
    ownerName: 'Rahul Verma',
    verified: false,
    likes: 19,
    likedBy: ['STU-004'],
    createdAt: '2026-10-10',
  },
  {
    id: 'proj-04',
    title: 'High-Throughput Financial Stream Analytics Engine',
    summary: 'Low-latency financial order matching and risk analysis engine handling 50,000 events/second.',
    description: 'Built with Java 21 virtual threads, Spring Boot, and Aeron messaging for microsecond-level financial order processing and anomaly detection.',
    category: 'systems',
    technologies: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker'],
    skillsDemonstrated: ['High-Concurrency Systems', 'JVM Optimization', 'Stream Processing'],
    githubUrl: 'https://github.com/example/stream-analytics',
    liveUrl: 'https://stream-analytics.demo.app',
    status: 'completed',
    visibility: 'college_visible',
    ownerStudentId: 'STU-004',
    ownerName: 'Ananya Deshmukh',
    verified: true,
    likes: 42,
    likedBy: ['STU-001', 'STU-002', 'STU-003'],
    createdAt: '2026-09-28',
  },
];

export const TalentRadarView: React.FC = () => {
  const { students, showToast } = useApp();
  const { user, userProfile } = useAuth();

  // Active Tab: 'discover_projects' | 'discover_students' | 'my_portfolio'
  const [activeTab, setActiveTab] = useState<'discover_projects' | 'discover_students' | 'my_portfolio'>('discover_projects');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<'all' | number>('all');
  const [skillFilter, setSkillFilter] = useState<'all' | SkillCategory>('all');

  // Shared Campus Projects State (Persisted)
  const [publishedProjects, setPublishedProjects] = useState<StudentProject[]>(() => {
    try {
      const saved = localStorage.getItem(SHARED_PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed: StudentProject[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => ({
            ...p,
            likes: typeof p.likes === 'number' ? p.likes : (20 + (idx % 5) * 6),
            likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
          }));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SHARED_PROJECTS;
  });

  // Save to localStorage whenever published projects change
  useEffect(() => {
    try {
      localStorage.setItem(SHARED_PROJECTS_STORAGE_KEY, JSON.stringify(publishedProjects));
    } catch (err) {
      console.warn('Failed to persist published projects:', err);
    }
  }, [publishedProjects]);

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<StudentProject | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<TalentProfile | null>(null);

  // New Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'ai_ml',
    technologies: '',
    skillsDemonstrated: '',
    githubUrl: '',
    liveUrl: '',
    status: 'completed' as ProjectStatus,
    visibility: 'college_visible' as ProjectVisibility,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Talent Profiles State
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(() => {
    return students.map((s, idx) => {
      const year = Math.ceil(s.semester / 2) || 1;
      return {
        studentId: s.id,
        studentName: s.name,
        course: s.course,
        year,
        semester: s.semester,
        primarySkills: [
          {
            name: idx % 2 === 0 ? 'Python' : 'Java',
            category: 'languages',
            proficiency: idx % 2 === 0 ? 'advanced' : 'intermediate',
            verificationStatus: idx % 2 === 0 ? 'faculty_verified' : 'student_reported',
            verifiedBy: idx % 2 === 0 ? 'Prof. A. Rivera' : undefined,
          },
          {
            name: idx % 3 === 0 ? 'Machine Learning' : 'Data Structures & Algorithms',
            category: idx % 3 === 0 ? 'ai_ml' : 'dsa',
            proficiency: 'advanced',
            verificationStatus: 'independently_verified',
            verifiedBy: 'LeetCode / Kaggle Verified',
          },
          {
            name: 'React & TypeScript',
            category: 'web_mobile',
            proficiency: 'intermediate',
            verificationStatus: 'faculty_verified',
            verifiedBy: 'Department Lab Evaluation',
          },
          {
            name: 'Docker & Cloud',
            category: 'cloud_devops',
            proficiency: 'beginner',
            verificationStatus: 'student_reported',
          },
        ],
        projects: [
          {
            title: `${s.name.split(' ')[0]}'s Distributed Analytics Engine`,
            description: 'High-throughput stream processing application evaluating telemetry data with 99.8% uptime.',
            technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
            githubUrl: `https://github.com/example/${s.id.toLowerCase()}-engine`,
            verified: true,
            status: 'completed',
            visibility: 'college_visible',
          },
        ],
        certifications: ['AWS Certified Cloud Practitioner', 'TensorFlow Developer Certificate'],
        problemSolvingStats: {
          platform: 'LeetCode',
          problemsSolved: 180 + idx * 45,
          rating: `Rating: ${1650 + idx * 30}`,
        },
        preferredRoles: ['Junior AI/ML Engineer', 'Full Stack Developer'],
        recruiterVisible: true,
        githubUsername: `${s.name.toLowerCase().replace(/\s+/g, '')}-dev`,
        bio: `Passionate Year ${year} engineer specializing in scalable systems and AI-driven telemetry.`,
      };
    });
  });

  const handleMyProfileUpdate = (updatedProfile: TalentProfile) => {
    setTalentProfiles((prev) => {
      const idx = prev.findIndex((p) => p.studentId === updatedProfile.studentId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedProfile;
        return next;
      }
      return [updatedProfile, ...prev];
    });
  };

  // Helper to check ownership
  const currentUserId = user?.id || 'current_user';
  const currentUserName = userProfile?.fullName || 'Alex Rivera';

  // Publish / Add Project Handler
  const handlePublishProject = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!projectForm.title.trim()) {
      errors.title = 'Project title is required.';
    }
    if (!projectForm.summary.trim()) {
      errors.summary = 'Short summary is required.';
    }

    // URL validation if provided
    const isValidUrl = (url: string) => {
      if (!url.trim()) return true;
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (projectForm.githubUrl.trim() && !isValidUrl(projectForm.githubUrl.trim())) {
      errors.githubUrl = 'Enter a valid URL (e.g. https://github.com/user/repo).';
    }
    if (projectForm.liveUrl.trim() && !isValidUrl(projectForm.liveUrl.trim())) {
      errors.liveUrl = 'Enter a valid URL (e.g. https://demo.example.com).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('error', 'Validation Error', 'Please correct the highlighted form errors.');
      return;
    }

    const techList = projectForm.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const skillsList = projectForm.skillsDemonstrated
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProject: StudentProject = {
      id: `proj-${Date.now()}`,
      title: projectForm.title.trim(),
      summary: projectForm.summary.trim(),
      description: projectForm.description.trim() || projectForm.summary.trim(),
      category: projectForm.category,
      technologies: techList.length > 0 ? techList : ['Software Engineering'],
      skillsDemonstrated: skillsList.length > 0 ? skillsList : ['System Design'],
      githubUrl: projectForm.githubUrl.trim() || undefined,
      liveUrl: projectForm.liveUrl.trim() || undefined,
      status: projectForm.status,
      visibility: projectForm.visibility,
      ownerStudentId: currentUserId,
      ownerName: currentUserName,
      verified: projectForm.status === 'completed' && Boolean(projectForm.githubUrl.trim()),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPublishedProjects((prev) => [newProject, ...prev]);

    // Reset Form & Close Modal
    setProjectForm({
      title: '',
      summary: '',
      description: '',
      category: 'ai_ml',
      technologies: '',
      skillsDemonstrated: '',
      githubUrl: '',
      liveUrl: '',
      status: 'completed',
      visibility: 'college_visible',
    });
    setFormErrors({});
    setIsPublishModalOpen(false);

    showToast(
      'success',
      'Project Published',
      `"${newProject.title}" is now published and discoverable to campus students!`
    );
  };

  // Delete / Unpublish Project (Owner only)
  const handleDeleteProject = (projectId: string, projectTitle: string) => {
    if (window.confirm(`Are you sure you want to unpublish and delete "${projectTitle}"?`)) {
      setPublishedProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (selectedProjectForDetail?.id === projectId) {
        setSelectedProjectForDetail(null);
      }
      showToast('info', 'Project Unpublished', `"${projectTitle}" has been removed from public discovery.`);
    }
  };

  // Handle Project Likes & Hearts (Any student can like any project/idea)
  const handleToggleLike = (projectOrId: string | StudentProject, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const projectId = typeof projectOrId === 'string' ? projectOrId : projectOrId.id;

    setPublishedProjects((prev) => {
      const exists = prev.some((p) => p.id === projectId);
      let updatedList = [...prev];

      if (!exists && typeof projectOrId !== 'string') {
        updatedList = [projectOrId, ...updatedList];
      }

      return updatedList.map((proj) => {
        if (proj.id === projectId) {
          const likedBy = proj.likedBy || [];
          const isLiked = likedBy.includes(currentUserId);
          const newLikedBy = isLiked
            ? likedBy.filter((id) => id !== currentUserId)
            : [...likedBy, currentUserId];
          const newLikes = Math.max(0, (proj.likes ?? 0) + (isLiked ? -1 : 1));

          if (!isLiked) {
            showToast('success', 'Project Liked! ❤️', `You gave a like to "${proj.title}"!`);
          } else {
            showToast('info', 'Like Removed', `Removed your like from "${proj.title}".`);
          }

          const updated = {
            ...proj,
            likes: newLikes,
            likedBy: newLikedBy,
          };

          if (selectedProjectForDetail?.id === projectId) {
            setSelectedProjectForDetail(updated);
          }

          return updated;
        }
        return proj;
      });
    });
  };

  // Helper to get all projects for a selected student profile with live likes & status
  const getStudentProjects = (profile: TalentProfile): StudentProject[] => {
    const publishedForStudent = publishedProjects.filter(
      (p) =>
        p.ownerStudentId === profile.studentId ||
        (p.ownerName && p.ownerName.toLowerCase() === profile.studentName.toLowerCase())
    );
    if (publishedForStudent.length > 0) {
      return publishedForStudent;
    }
    // Fallback: adapt profile.projects into StudentProject with likes
    return profile.projects.map((p, pIdx) => ({
      ...p,
      id: p.id || `proj-${profile.studentId}-${pIdx}`,
      ownerStudentId: profile.studentId,
      ownerName: profile.studentName,
      likes: typeof p.likes === 'number' ? p.likes : (12 + pIdx * 9),
      likedBy: Array.isArray(p.likedBy) ? p.likedBy : [],
      status: p.status || 'completed',
      visibility: p.visibility || 'college_visible',
      createdAt: p.completionDate || '2026-09-15',
    }));
  };

  // Filtered Projects for Discovery Feed
  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return publishedProjects.filter((proj) => {
      // Visibility rule: must be college_visible OR owned by current user
      const isVisible =
        proj.visibility === 'college_visible' || proj.ownerStudentId === currentUserId;
      if (!isVisible) return false;

      // Status Filter
      if (projectStatusFilter !== 'all' && proj.status !== projectStatusFilter) {
        return false;
      }

      // Category Filter
      if (projectCategoryFilter !== 'all' && proj.category !== projectCategoryFilter) {
        return false;
      }

      // Search Query
      if (!q) return true;

      const matchesTitle = proj.title.toLowerCase().includes(q);
      const matchesSummary = (proj.summary || '').toLowerCase().includes(q);
      const matchesDescription = proj.description.toLowerCase().includes(q);
      const matchesOwner = (proj.ownerName || '').toLowerCase().includes(q);
      const matchesTech = proj.technologies.some((t) => t.toLowerCase().includes(q));
      const matchesSkills = (proj.skillsDemonstrated || []).some((s) => s.toLowerCase().includes(q));

      return (
        matchesTitle ||
        matchesSummary ||
        matchesDescription ||
        matchesOwner ||
        matchesTech ||
        matchesSkills
      );
    });
  }, [publishedProjects, search, projectStatusFilter, projectCategoryFilter, currentUserId]);

  // Filtered Students for Student Discovery
  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return talentProfiles.filter((profile) => {
      // Year filter
      if (yearFilter !== 'all' && profile.year !== yearFilter) return false;

      // Domain filter
      if (skillFilter !== 'all' && !profile.primarySkills.some((s) => s.category === skillFilter)) {
        return false;
      }

      // Search query
      if (!q) return true;

      const matchesName = profile.studentName.toLowerCase().includes(q);
      const matchesId = profile.studentId.toLowerCase().includes(q);
      const matchesCourse = profile.course.toLowerCase().includes(q);
      const matchesBio = (profile.bio || '').toLowerCase().includes(q);
      const matchesSkills = profile.primarySkills.some((s) => s.name.toLowerCase().includes(q));
      
      const allStudentProjects = getStudentProjects(profile);
      const matchesProjects = allStudentProjects.some(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.summary || '').toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
      );

      return matchesName || matchesId || matchesCourse || matchesBio || matchesSkills || matchesProjects;
    });
  }, [talentProfiles, publishedProjects, search, yearFilter, skillFilter]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* 1. Header Bar with Search & Publish Trigger */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono mb-2 border border-cyan-500/30">
              <Compass className="w-3.5 h-3.5" />
              <span>TALENT RADAR • CAMPUS TALENT & PROJECT DISCOVERY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Talent Radar & Project Discovery
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore open-source repositories, engineering projects, and research ideas published by students across all 4 years. Search by name, programming language, or tech stack.
            </p>
          </div>

          {/* Quick Publish Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Project or Idea</span>
            </button>
          </div>
        </div>

        {/* Global Talent Radar Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search students, projects, skills, or technologies... (e.g. Alex, Python, React, Machine Learning)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl pl-11 pr-10 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner font-medium transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real-time Search Match Indicator */}
        {search.trim() && (
          <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-slate-200">
                Found <strong className="text-cyan-300 font-mono">{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''} and{' '}
                <strong className="text-cyan-300 font-mono">{filteredProjects.length}</strong> project{filteredProjects.length !== 1 ? 's' : ''} matching "{search}"
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={() => setActiveTab('discover_students')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'discover_students'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                View Students ({filteredStudents.length})
              </button>
              <button
                onClick={() => setActiveTab('discover_projects')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  activeTab === 'discover_projects'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                View Projects ({filteredProjects.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Navigation Tabs: Discover Projects vs Discover Students vs My Portfolio */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-2 sm:space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('discover_projects')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'discover_projects'
              ? 'border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_10px_rgba(0,229,255,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span>Explore Projects & Ideas ({filteredProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discover_students')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'discover_students'
              ? 'border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_10px_rgba(0,229,255,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-wildfire-blue" />
          <span>Student Talent Discovery ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_portfolio')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'my_portfolio'
              ? 'border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_10px_rgba(0,229,255,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>My Developer Portfolio & Management</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: EXPLORE PROJECTS & IDEAS (SHARED DISCOVERY FEED)       */}
      {/* ============================================================ */}
      {activeTab === 'discover_projects' && (
        <div className="space-y-6">
          {/* Filters Bar for Projects */}
          <GlassCard className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setProjectStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    projectStatusFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Statuses
                </button>
                <button
                  onClick={() => setProjectStatusFilter('idea')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                    projectStatusFilter === 'idea'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 text-amber-400" />
                  <span>Ideas</span>
                </button>
                <button
                  onClick={() => setProjectStatusFilter('in_progress')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    projectStatusFilter === 'in_progress'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setProjectStatusFilter('completed')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1 ${
                    projectStatusFilter === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Completed</span>
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-mono text-[11px]">Category:</span>
                <select
                  value={projectCategoryFilter}
                  onChange={(e) => setProjectCategoryFilter(e.target.value)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-slate-900">All Categories</option>
                  <option value="ai_ml" className="bg-slate-900">AI & Machine Learning</option>
                  <option value="web_mobile" className="bg-slate-900">Full Stack & Web</option>
                  <option value="systems" className="bg-slate-900">Systems & Infrastructure</option>
                  <option value="iot" className="bg-slate-900">IoT & Robotics</option>
                  <option value="cybersecurity" className="bg-slate-900">Cybersecurity</option>
                </select>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredProjects.length} published project{filteredProjects.length !== 1 ? 's' : ''}
            </span>
          </GlassCard>

          {/* Projects Discovery Grid */}
          {filteredProjects.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-3">
              <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Published Projects Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {search
                  ? `No published projects match your search for "${search}". Try searching for another keyword or language.`
                  : 'Be the first student to publish an engineering project or research idea!'}
              </p>
              {search ? (
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors"
                >
                  Clear Search Filter
                </button>
              ) : (
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
                >
                  Publish First Project
                </button>
              )}
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isOwner = project.ownerStudentId === currentUserId;

                return (
                  <GlassCard
                    key={project.id || project.title}
                    glow="blue"
                    className="p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all cursor-pointer group"
                    onClick={() => setSelectedProjectForDetail(project)}
                  >
                    <div className="space-y-3">
                      {/* Top Badges & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {project.status === 'idea' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              <span>Idea</span>
                            </span>
                          ) : project.status === 'in_progress' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-mono font-bold">
                              <span>⚡ In Progress</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Completed</span>
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                            {project.category?.replace(/_/g, ' ') || 'Software'}
                          </span>
                        </div>

                        {/* Visibility indicator */}
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                          {project.visibility === 'private' ? (
                            <span className="flex items-center gap-0.5 text-amber-400">
                              <Lock className="w-3 h-3" /> Private
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-slate-400">
                              <Globe className="w-3 h-3 text-cyan-400" /> College
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {project.summary || project.description}
                      </p>

                      {/* Technologies Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-cyan-300 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Metadata & Owner */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs gap-2">
                      {/* Owner Info */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 flex-shrink-0">
                          {(project.ownerName || 'Student').slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-300 font-medium truncate">
                          {project.ownerName || 'Verified Student'}
                        </span>
                      </div>

                      {/* Actions: Likes & External Links */}
                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        {/* Interactive Like Button for this project */}
                        <button
                          onClick={(e) => handleToggleLike(project, e)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            (project.likedBy || []).includes(currentUserId)
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                          }`}
                          title={(project.likedBy || []).includes(currentUserId) ? 'Unlike this project' : 'Like this project'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition-transform ${
                              (project.likedBy || []).includes(currentUserId)
                                ? 'fill-rose-400 text-rose-400 scale-110'
                                : 'text-slate-400 group-hover:text-rose-400'
                            }`}
                          />
                          <span>{project.likes ?? 0}</span>
                        </button>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                            title="Open GitHub Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                            title="Open Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteProject(project.id!, project.title)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:text-red-300 hover:border-red-500/40 transition-colors"
                            title="Unpublish / Delete My Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: STUDENT TALENT DISCOVERY (STUDENT DIRECTORY & SKILLS)  */}
      {/* ============================================================ */}
      {activeTab === 'discover_students' && (
        <div className="space-y-6">
          {/* Year & Skill Filter Bar */}
          <GlassCard className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Select */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <span className="text-slate-400 font-mono text-[11px]">Academic Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-slate-900">All 4 Years</option>
                  <option value="1" className="bg-slate-900">Year 1 (Freshmen)</option>
                  <option value="2" className="bg-slate-900">Year 2 (Rising Stars)</option>
                  <option value="3" className="bg-slate-900">Year 3 (Internship Ready)</option>
                  <option value="4" className="bg-slate-900">Year 4 (Placement Ready)</option>
                </select>
              </div>

              {/* Domain Select */}
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-mono text-[11px]">Domain:</span>
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value as any)}
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="all" className="bg-slate-900">All Technical Domains</option>
                  <option value="ai_ml" className="bg-slate-900">AI & Machine Learning</option>
                  <option value="dsa" className="bg-slate-900">Data Structures & Algorithms</option>
                  <option value="languages" className="bg-slate-900">Programming Languages</option>
                  <option value="web_mobile" className="bg-slate-900">Full Stack & Mobile</option>
                  <option value="cloud_devops" className="bg-slate-900">Cloud & DevOps</option>
                </select>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Showing {filteredStudents.length} student profile{filteredStudents.length !== 1 ? 's' : ''}
            </span>
          </GlassCard>

          {/* Students Grid */}
          {filteredStudents.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-3">
              <User className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Students Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No students match your search criteria. Try clearing search keywords or filters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setYearFilter('all');
                  setSkillFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors"
              >
                Reset All Filters
              </button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map((profile) => (
                <GlassCard
                  key={profile.studentId}
                  className="p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all cursor-pointer"
                  onClick={() => setSelectedStudentForProfile(profile)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-wildfire-blue p-[1px]">
                          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-bold text-xs text-cyan-300 font-mono">
                            {profile.studentName.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{profile.studentName}</span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                              Y{profile.year}
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-400">{profile.course} • Sem {profile.semester}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {getStudentProjects(profile).length} Project{getStudentProjects(profile).length !== 1 ? 's' : ''}
                        </span>
                        <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 fill-rose-400" />
                          <span>{getStudentProjects(profile).reduce((acc, p) => acc + (p.likes || 0), 0)}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 italic">
                      "{profile.bio}"
                    </p>

                    {/* Problem Solving Stat */}
                    {profile.problemSolvingStats && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-300">{profile.problemSolvingStats.platform}:</span>
                        <span className="text-emerald-400 font-bold">{profile.problemSolvingStats.problemsSolved} Solved</span>
                        <span className="text-slate-500">• {profile.problemSolvingStats.rating}</span>
                      </div>
                    )}

                    {/* Demonstrated Skills Tags */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        Demonstrated Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.primarySkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                          >
                            {sk.verificationStatus !== 'student_reported' && (
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            )}
                            <span>{sk.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action: View Public Portfolio */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      @{profile.githubUsername || 'student'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudentForProfile(profile);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>View Public Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: MY PORTFOLIO & PROJECTS (STUDENT'S MANAGEMENT HUB)    */}
      {/* ============================================================ */}
      {activeTab === 'my_portfolio' && (
        <StudentPortfolioEditor onProfileUpdate={handleMyProfileUpdate} />
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD PROJECT / PUBLISH IDEA                           */}
      {/* ============================================================ */}
      {isPublishModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPublishModalOpen(false)}
          title="Publish Project or Idea"
          subtitle="Share your open-source project, prototype, or research idea with campus peers and recruiters."
          maxWidth="lg"
        >
          <form onSubmit={handlePublishProject} className="space-y-4 text-xs font-sans">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Consensus Engine"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {formErrors.title && <p className="text-[11px] text-red-400 mt-1">{formErrors.title}</p>}
            </div>

            {/* Short Summary */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Short Summary (1-2 sentences) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. High-performance Raft algorithm prototype implemented in Go."
                value={projectForm.summary}
                onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {formErrors.summary && <p className="text-[11px] text-red-400 mt-1">{formErrors.summary}</p>}
            </div>

            {/* Detailed Description / Problem Statement */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Detailed Problem Statement & Solution
              </label>
              <textarea
                rows={3}
                placeholder="Explain the background problem, architectural design decisions, and what was achieved..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Status & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Status</label>
                <select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="completed">Completed (Working Demo/Code)</option>
                  <option value="in_progress">In Progress (Active Development)</option>
                  <option value="idea">Early Idea / Research Proposal (No Code Yet)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="ai_ml">AI & Machine Learning</option>
                  <option value="web_mobile">Full Stack & Web</option>
                  <option value="systems">Systems & Cloud Infrastructure</option>
                  <option value="iot">IoT & Embedded Robotics</option>
                  <option value="cybersecurity">Cybersecurity & Cryptography</option>
                  <option value="general">General Engineering</option>
                </select>
              </div>
            </div>

            {/* Technologies & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, Docker"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Skills Demonstrated (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deep Learning, API Design"
                  value={projectForm.skillsDemonstrated}
                  onChange={(e) => setProjectForm({ ...projectForm, skillsDemonstrated: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* URLs (Optional for ideas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  GitHub Repository URL {projectForm.status === 'idea' ? '(Optional)' : ''}
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/user/project"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {formErrors.githubUrl && <p className="text-[11px] text-red-400 mt-1">{formErrors.githubUrl}</p>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live Demo / Deployed URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://myproject.demo.app"
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {formErrors.liveUrl && <p className="text-[11px] text-red-400 mt-1">{formErrors.liveUrl}</p>}
              </div>
            </div>

            {/* Visibility Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Publication Visibility</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="college_visible"
                    checked={projectForm.visibility === 'college_visible'}
                    onChange={() => setProjectForm({ ...projectForm, visibility: 'college_visible' })}
                    className="text-cyan-400"
                  />
                  <span>College-Visible (Discoverable by other students)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={projectForm.visibility === 'private'}
                    onChange={() => setProjectForm({ ...projectForm, visibility: 'private' })}
                    className="text-cyan-400"
                  />
                  <span>Private (Only visible to me)</span>
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-wildfire-blue hover:from-cyan-400 hover:to-wildfire-blue-hover text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
              >
                Publish Project
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: PROJECT DETAIL VIEW                                 */}
      {/* ============================================================ */}
      {selectedProjectForDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProjectForDetail(null)}
          title={selectedProjectForDetail.title}
          subtitle={`Published by ${selectedProjectForDetail.ownerName} • ${selectedProjectForDetail.category?.replace(/_/g, ' ').toUpperCase()}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs font-sans">
            {/* Status & Date */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                {selectedProjectForDetail.status === 'idea' ? (
                  <span className="flex items-center gap-1 text-amber-300 font-mono font-bold">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> Early Idea / Proposal
                  </span>
                ) : selectedProjectForDetail.status === 'in_progress' ? (
                  <span className="text-sky-300 font-mono font-bold">⚡ Active In-Progress Development</span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-300 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed Project
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-500">
                Published: {selectedProjectForDetail.createdAt || 'Recent'}
              </span>
            </div>

            {/* Problem Statement & Description */}
            <div>
              <h4 className="text-slate-300 font-bold mb-1.5 uppercase font-mono text-[11px] tracking-wider">
                Overview & Problem Statement
              </h4>
              <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
                {selectedProjectForDetail.description}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-slate-300 font-bold mb-1.5 uppercase font-mono text-[11px] tracking-wider">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProjectForDetail.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Demonstrated */}
            {selectedProjectForDetail.skillsDemonstrated && selectedProjectForDetail.skillsDemonstrated.length > 0 && (
              <div>
                <h4 className="text-slate-300 font-bold mb-1.5 uppercase font-mono text-[11px] tracking-wider">
                  Demonstrated Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProjectForDetail.skillsDemonstrated.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links & Like Action */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
              {/* Prominent Like / Heart Button */}
              <button
                onClick={() => handleToggleLike(selectedProjectForDetail)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  (selectedProjectForDetail.likedBy || []).includes(currentUserId)
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/40'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    (selectedProjectForDetail.likedBy || []).includes(currentUserId)
                      ? 'fill-rose-400 text-rose-400 scale-110'
                      : 'text-slate-400'
                  }`}
                />
                <span>
                  {(selectedProjectForDetail.likedBy || []).includes(currentUserId) ? 'Liked' : 'Like'} (
                  {selectedProjectForDetail.likes ?? 0})
                </span>
              </button>

              {selectedProjectForDetail.githubUrl && (
                <a
                  href={selectedProjectForDetail.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-xs border border-slate-800 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Open GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              )}

              {selectedProjectForDetail.liveUrl && (
                <a
                  href={selectedProjectForDetail.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Live Demo</span>
                </a>
              )}

              {selectedProjectForDetail.ownerStudentId === currentUserId && (
                <button
                  onClick={() => handleDeleteProject(selectedProjectForDetail.id!, selectedProjectForDetail.title)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/30 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Unpublish Project</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: PUBLIC STUDENT TALENT PROFILE MODAL                 */}
      {/* ============================================================ */}
      {selectedStudentForProfile && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudentForProfile(null)}
          title={`${selectedStudentForProfile.studentName}'s Public Talent Profile`}
          subtitle={`Year ${selectedStudentForProfile.year} • ${selectedStudentForProfile.course}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs font-sans">
            {/* Bio & Intro */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="text-slate-200 leading-relaxed italic">
                "{selectedStudentForProfile.bio}"
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
                <span>Semester {selectedStudentForProfile.semester}</span>
                <span>•</span>
                <span>GitHub: @{selectedStudentForProfile.githubUsername || 'student'}</span>
              </div>
            </div>

            {/* Demonstrated Skills */}
            <div>
              <h4 className="text-slate-300 font-bold mb-2 uppercase font-mono text-[11px] tracking-wider">
                Technical Skills & Proficiency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStudentForProfile.primarySkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-white">{sk.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 capitalize">
                      {sk.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {selectedStudentForProfile.certifications.length > 0 && (
              <div>
                <h4 className="text-slate-300 font-bold mb-2 uppercase font-mono text-[11px] tracking-wider">
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStudentForProfile.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cert}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects List with Interactive Likes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-slate-300 font-bold uppercase font-mono text-[11px] tracking-wider">
                  Published Projects & Ideas ({getStudentProjects(selectedStudentForProfile).length})
                </h4>
                <span className="text-[11px] font-mono text-cyan-400">
                  Total Likes: {getStudentProjects(selectedStudentForProfile).reduce((acc, p) => acc + (p.likes || 0), 0)} ❤️
                </span>
              </div>

              <div className="space-y-2.5">
                {getStudentProjects(selectedStudentForProfile).map((proj) => {
                  const isLiked = (proj.likedBy || []).includes(currentUserId);
                  return (
                    <div
                      key={proj.id || proj.title}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-bold text-white text-xs">{proj.title}</h5>
                          {proj.status === 'idea' ? (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                              Idea
                            </span>
                          ) : proj.status === 'in_progress' ? (
                            <span className="px-1.5 py-0.2 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-mono">
                              In Progress
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{proj.summary || proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {proj.technologies.slice(0, 3).map((t, tidx) => (
                            <span key={tidx} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 text-[10px] font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                        {/* Interactive Like Button for this student's project */}
                        <button
                          onClick={() => handleToggleLike(proj)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            isLiked
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40'
                          }`}
                          title={isLiked ? 'Unlike this project' : 'Like this project'}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isLiked ? 'fill-rose-400 text-rose-400 scale-110' : 'text-slate-400'
                            }`}
                          />
                          <span>{proj.likes ?? 0}</span>
                        </button>

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="View GitHub Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => setSelectedProjectForDetail(proj)}
                          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors text-xs cursor-pointer"
                          title="View project details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note on Privacy */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>
                Educational Privacy: Academic marks, exam grades, and fee records are protected and never shown in public talent discovery.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
