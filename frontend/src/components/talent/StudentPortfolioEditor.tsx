import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  TalentProfile, 
  StudentProject, 
  StudentSkill, 
  SkillCategory, 
  VerificationStatus 
} from '../../types';
import { Modal } from '../common/Modal';
import {
  Github,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  Star,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Sparkles,
  Calendar,
  Layers,
  Award,
  Globe,
  Briefcase,
  Code,
  GraduationCap,
  Save,
  Check
} from 'lucide-react';

interface StudentPortfolioEditorProps {
  onProfileUpdate?: (profile: TalentProfile) => void;
}

export const StudentPortfolioEditor: React.FC<StudentPortfolioEditorProps> = ({ onProfileUpdate }) => {
  const { user, userProfile } = useAuth();
  const { showToast } = useApp();

  const storageKey = `student_analytics_portfolio_${user?.id || 'default'}`;

  // Initialize or recover persistent profile keyed by user.id
  const [profile, setProfile] = useState<TalentProfile>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    const defaultName = userProfile?.fullName || 'Alex Rivera';
    return {
      studentId: user?.id?.slice(0, 8).toUpperCase() || 'STU-2026',
      studentName: defaultName,
      course: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      specialization: 'Artificial Intelligence & Cloud Architecture',
      bio: 'Junior Software Engineer & AI Researcher passionate about distributed telemetry engines, high-performance computing, and resilient cloud systems.',
      careerInterests: 'Full-Stack Distributed Systems, Machine Learning Engineering, Cloud Infrastructure',
      githubUsername: defaultName.toLowerCase().replace(/\s+/g, '-') + '-dev',
      githubProfileUrl: `https://github.com/${defaultName.toLowerCase().replace(/\s+/g, '-')}-dev`,
      portfolioUrl: 'https://alexrivera.dev',
      linkedinUrl: 'https://linkedin.com/in/alexrivera-dev',
      recruiterVisible: true,
      preferredRoles: ['Full-Stack Cloud Engineer', 'AI/ML Systems Engineer', 'Backend Platform Developer'],
      primarySkills: [
        {
          name: 'Python',
          category: 'languages',
          proficiency: 'advanced',
          verificationStatus: 'faculty_verified',
          verifiedBy: 'Dept. Lab Evaluation',
        },
        {
          name: 'Java',
          category: 'languages',
          proficiency: 'advanced',
          verificationStatus: 'independently_verified',
          verifiedBy: 'Oracle Certified Associate',
        },
        {
          name: 'C++',
          category: 'languages',
          proficiency: 'intermediate',
          verificationStatus: 'faculty_verified',
          verifiedBy: 'Algorithms Course Exam',
        },
        {
          name: 'TypeScript & React',
          category: 'web_mobile',
          proficiency: 'advanced',
          verificationStatus: 'independently_verified',
          verifiedBy: 'GitHub Verified Commits',
        },
        {
          name: 'Machine Learning (PyTorch)',
          category: 'ai_ml',
          proficiency: 'intermediate',
          verificationStatus: 'student_reported',
        },
        {
          name: 'PostgreSQL & Redis',
          category: 'cloud_devops',
          proficiency: 'advanced',
          verificationStatus: 'faculty_verified',
          verifiedBy: 'Database Lab Practical',
        },
        {
          name: 'Docker & Kubernetes',
          category: 'cloud_devops',
          proficiency: 'intermediate',
          verificationStatus: 'student_reported',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'Distributed Stream Analytics Engine',
          description: 'Scalable event-driven telemetry stream engine processing over 50k transactions/sec with Redis caching, Kafka message queue, and PostgreSQL persistence.',
          technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
          githubUrl: 'https://github.com/example/distributed-stream-analytics',
          liveUrl: 'https://telemetry-stream.demo.com',
          completionDate: '2026-08-15',
          verified: true,
          featured: true,
        },
        {
          id: 'proj-2',
          title: 'NeuroPath AI Academic Success Predictor',
          description: 'Multi-layer perceptron neural network evaluating longitudinal student risk factors and synthesizing evidence-grounded intervention roadmaps.',
          technologies: ['Python', 'PyTorch', 'FastAPI', 'scikit-learn'],
          githubUrl: 'https://github.com/example/neuropath-ai',
          liveUrl: 'https://neuropath.demo.ai',
          completionDate: '2026-09-20',
          verified: true,
          featured: true,
        },
        {
          id: 'proj-3',
          title: 'Decentralized Academic Credential Verifier',
          description: 'Zero-knowledge proof verification contract for tamper-resistant academic degree certificates and university transcripts.',
          technologies: ['Solidity', 'Ethereum', 'React', 'Ethers.js'],
          githubUrl: 'https://github.com/example/academic-cred-verifier',
          completionDate: '2026-05-10',
          verified: false,
          featured: false,
        },
      ],
      certifications: [
        'AWS Certified Solutions Architect – Associate',
        'DeepLearning.AI Machine Learning Specialization',
        'Meta Front-End Developer Professional Certificate',
      ],
      achievements: [
        '1st Place Winner – National Collegiate AI & Cloud Hackathon 2026',
        'Dean\'s Honor List for Academic Excellence (Consecutive 4 Semesters)',
        '350+ Problems Solved on LeetCode (Knight Badge, Top 5%)',
      ],
      problemSolvingStats: {
        platform: 'LeetCode',
        problemsSolved: 354,
        rating: 'Rating: 1940 (Knight)',
      },
    };
  });

  // Sync to localStorage and notify parent
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(profile));
    } catch {
      // ignore
    }
    if (onProfileUpdate) {
      onProfileUpdate(profile);
    }
  }, [profile, storageKey]);

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<StudentProject | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    studentName: profile.studentName,
    course: profile.course,
    year: profile.year,
    semester: profile.semester,
    specialization: profile.specialization || '',
    bio: profile.bio || '',
    careerInterests: profile.careerInterests || '',
    githubUsername: profile.githubUsername || '',
    githubProfileUrl: profile.githubProfileUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    preferredRoles: profile.preferredRoles.join(', '),
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    completionDate: new Date().toISOString().slice(0, 10),
    featured: true,
  });

  // Skill Form State
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'languages' as SkillCategory,
    proficiency: 'intermediate' as 'beginner' | 'intermediate' | 'advanced' | 'expert',
  });

  // Cert Form State
  const [certInput, setCertInput] = useState('');
  const [certType, setCertType] = useState<'cert' | 'achievement'>('cert');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      studentName: profileForm.studentName.trim() || prev.studentName,
      course: profileForm.course.trim() || prev.course,
      year: Number(profileForm.year) || 1,
      semester: Number(profileForm.semester) || 1,
      specialization: profileForm.specialization.trim(),
      bio: profileForm.bio.trim(),
      careerInterests: profileForm.careerInterests.trim(),
      githubUsername: profileForm.githubUsername.trim(),
      githubProfileUrl: profileForm.githubProfileUrl.trim(),
      portfolioUrl: profileForm.portfolioUrl.trim(),
      linkedinUrl: profileForm.linkedinUrl.trim(),
      preferredRoles: profileForm.preferredRoles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
    }));
    setIsEditProfileOpen(false);
    showToast('success', 'Profile Saved', 'Your developer portfolio metadata was successfully updated.');
  };

  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      completionDate: new Date().toISOString().slice(0, 10),
      featured: false,
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: StudentProject) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies.join(', '),
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      completionDate: proj.completionDate || new Date().toISOString().slice(0, 10),
      featured: !!proj.featured,
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const techs = projectForm.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      // Update existing
      setProfile((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === editingProject.id
            ? {
                ...p,
                title: projectForm.title.trim(),
                description: projectForm.description.trim(),
                technologies: techs.length > 0 ? techs : ['Software'],
                githubUrl: projectForm.githubUrl.trim() || undefined,
                liveUrl: projectForm.liveUrl.trim() || undefined,
                completionDate: projectForm.completionDate,
                featured: projectForm.featured,
              }
            : p
        ),
      }));
      showToast('success', 'Project Updated', `Updated "${projectForm.title}" in your portfolio.`);
    } else {
      // Add new
      const newProj: StudentProject = {
        id: `proj-${Date.now()}`,
        title: projectForm.title.trim(),
        summary: projectForm.description.trim().slice(0, 120),
        description: projectForm.description.trim(),
        technologies: techs.length > 0 ? techs : ['Software'],
        githubUrl: projectForm.githubUrl.trim() || undefined,
        liveUrl: projectForm.liveUrl.trim() || undefined,
        completionDate: projectForm.completionDate,
        status: 'completed',
        visibility: 'college_visible',
        ownerStudentId: profile.studentId,
        ownerName: profile.studentName,
        likes: 0,
        likedBy: [],
        verified: false,
        featured: projectForm.featured,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProfile((prev) => ({
        ...prev,
        projects: [newProj, ...prev.projects],
      }));

      // Sync to shared campus discovery feed
      try {
        const sharedKey = 'student_analytics_published_projects';
        const existingStr = localStorage.getItem(sharedKey);
        const existing: StudentProject[] = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem(sharedKey, JSON.stringify([newProj, ...existing]));
      } catch (err) {
        console.warn('Failed to sync to shared projects:', err);
      }

      showToast('success', 'Project Published', `Added "${newProj.title}" and published to campus project discovery.`);
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (projId?: string) => {
    if (!projId) return;
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projId),
    }));

    try {
      const sharedKey = 'student_analytics_published_projects';
      const existingStr = localStorage.getItem(sharedKey);
      if (existingStr) {
        const existing: StudentProject[] = JSON.parse(existingStr);
        localStorage.setItem(sharedKey, JSON.stringify(existing.filter((p) => p.id !== projId)));
      }
    } catch {
      // ignore
    }

    showToast('info', 'Project Removed', 'The repository project was removed from your portfolio.');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    const newSkill: StudentSkill = {
      name: skillForm.name.trim(),
      category: skillForm.category,
      proficiency: skillForm.proficiency,
      verificationStatus: 'student_reported',
    };

    setProfile((prev) => ({
      ...prev,
      primarySkills: [...prev.primarySkills, newSkill],
    }));

    showToast('success', 'Skill Added', `"${newSkill.name}" recorded as Student-Reported competency.`);
    setSkillForm({ name: '', category: 'languages', proficiency: 'intermediate' });
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (skillName: string) => {
    setProfile((prev) => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((s) => s.name !== skillName),
    }));
    showToast('info', 'Skill Removed', `"${skillName}" was removed from your skill matrix.`);
  };

  const handleAddCertOrAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    if (certType === 'cert') {
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      showToast('success', 'Certification Added', `Recorded "${certInput.trim()}".`);
    } else {
      setProfile((prev) => ({
        ...prev,
        achievements: [...(prev.achievements || []), certInput.trim()],
      }));
      showToast('success', 'Achievement Added', `Recorded "${certInput.trim()}".`);
    }
    setCertInput('');
    setIsCertModalOpen(false);
  };

  const handleDeleteCert = (certName: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certName),
    }));
  };

  const handleDeleteAchievement = (ach: string) => {
    setProfile((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a !== ach),
    }));
  };

  const toggleRecruiterVisibility = () => {
    setProfile((prev) => {
      const next = !prev.recruiterVisible;
      showToast(
        'success',
        'Placement Visibility Updated',
        `Recruiter profile visibility is now ${next ? 'PUBLIC TO CAMPUS RECRUITERS' : 'PRIVATE'}.`
      );
      return { ...prev, recruiterVisible: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <GlassCard glow="blue" className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left Avatar & Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-wildfire-blue to-violet-600 p-[2px] shadow-[0_0_25px_rgba(0,229,255,0.35)] flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-cyan-400">
                  {profile.studentName.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-white tracking-tight">{profile.studentName}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                  Year {profile.year} • Sem {profile.semester}
                </span>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {profile.studentId}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium">
                <span>{profile.course}</span>
                {profile.specialization && (
                  <span className="text-cyan-400"> • {profile.specialization}</span>
                )}
              </div>

              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed italic">
                "{profile.bio}"
              </p>

              {/* Social / External Links Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {profile.githubProfileUrl && (
                  <a
                    href={profile.githubProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 text-white" />
                    <span>@{profile.githubUsername || 'github'}</span>
                  </a>
                )}

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}

                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
            {/* Recruiter Visibility Toggle */}
            <button
              onClick={toggleRecruiterVisibility}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all ${
                profile.recruiterVisible
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {profile.recruiterVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
              <span>{profile.recruiterVisible ? 'Placement Radar: Visible' : 'Placement Radar: Hidden'}</span>
            </button>

            <button
              onClick={() => {
                setProfileForm({
                  studentName: profile.studentName,
                  course: profile.course,
                  year: profile.year,
                  semester: profile.semester,
                  specialization: profile.specialization || '',
                  bio: profile.bio || '',
                  careerInterests: profile.careerInterests || '',
                  githubUsername: profile.githubUsername || '',
                  githubProfileUrl: profile.githubProfileUrl || '',
                  portfolioUrl: profile.portfolioUrl || '',
                  linkedinUrl: profile.linkedinUrl || '',
                  preferredRoles: profile.preferredRoles.join(', '),
                });
                setIsEditProfileOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Developer Profile</span>
            </button>
          </div>
        </div>

        {/* Preferred Placement Roles Banner */}
        {profile.preferredRoles.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Career Roles:</span>
            </span>
            {profile.preferredRoles.map((role, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-semibold"
              >
                {role}
              </span>
            ))}
          </div>
        )}
      </GlassCard>

      {/* GitHub-Style Projects & Repositories Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-cyan-400" />
              <span>GitHub Repositories & Portfolio Projects ({profile.projects.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showcase verified code repositories, live production URLs, architecture specs, and technologies.
            </p>
          </div>

          <button
            onClick={handleOpenAddProject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-wildfire-blue hover:bg-wildfire-blue-hover text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project / Repository</span>
          </button>
        </div>

        {profile.projects.length === 0 ? (
          <GlassCard className="p-8 text-center text-slate-400 space-y-2">
            <Code className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Projects Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your coding projects, GitHub repos, or deployed applications to highlight your technical abilities to recruiters.
            </p>
            <button
              onClick={handleOpenAddProject}
              className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold"
            >
              Add First Project
            </button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.projects.map((proj) => (
              <GlassCard
                key={proj.id || proj.title}
                className="p-5 flex flex-col justify-between space-y-4 border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Title & Star */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {proj.title}
                        </h4>
                        {proj.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Star className="w-3 h-3 fill-amber-300" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      {proj.completionDate && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>Completed {proj.completionDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Links & Verification */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-white font-mono text-[11px]"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  {proj.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Code</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">
                      Self-Reported
                    </span>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Technical Skills & Certifications/Awards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Skills Matrix */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Technical Skills Matrix ({profile.primarySkills.length})</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Programming languages, frameworks, cloud, and AI competencies.
              </p>
            </div>

            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 text-xs font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="space-y-2">
            {profile.primarySkills.map((sk, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-white">{sk.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-300 uppercase">
                    {sk.proficiency}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      sk.verificationStatus === 'faculty_verified'
                        ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                        : sk.verificationStatus === 'independently_verified'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {sk.verificationStatus === 'faculty_verified'
                      ? '✓ Faculty Verified'
                      : sk.verificationStatus === 'independently_verified'
                      ? '★ Verified Test'
                      : 'Self-Reported'}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteSkill(sk.name)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  title="Remove skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Certifications & Achievements */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certifications & Hackathon Awards</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Industry credentials, hackathon victories, and academic honors.
              </p>
            </div>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 text-xs font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Credential</span>
            </button>
          </div>

          {/* Certifications list */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
              Professional Certifications ({profile.certifications.length})
            </span>
            {profile.certifications.map((c, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-200 font-medium">{c}</span>
                </div>
                <button
                  onClick={() => handleDeleteCert(c)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Achievements list */}
            {profile.achievements && profile.achievements.length > 0 && (
              <>
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block pt-3">
                  Hackathons & Honors ({profile.achievements.length})
                </span>
                {profile.achievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-amber-200 font-medium">{ach}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteAchievement(ach)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditProfileOpen(false)}
          title="Edit Developer Portfolio Profile"
          subtitle="Update personal info, links, career goals, and placement preferences"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Display Name:</label>
                <input
                  type="text"
                  required
                  value={profileForm.studentName}
                  onChange={(e) => setProfileForm({ ...profileForm, studentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department / Course:</label>
                <input
                  type="text"
                  required
                  value={profileForm.course}
                  onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Academic Year:</label>
                <select
                  value={profileForm.year}
                  onChange={(e) => setProfileForm({ ...profileForm, year: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value={1}>Year 1 (Freshman)</option>
                  <option value={2}>Year 2 (Sophomore)</option>
                  <option value={3}>Year 3 (Junior)</option>
                  <option value={4}>Year 4 (Senior / Placement)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Semester:</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={profileForm.semester}
                  onChange={(e) => setProfileForm({ ...profileForm, semester: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Technical Specialization:</label>
              <input
                type="text"
                placeholder="e.g. Distributed Systems, Artificial Intelligence, Cybersecurity"
                value={profileForm.specialization}
                onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Short Biography:</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub Username:</label>
                <input
                  type="text"
                  placeholder="e.g. octocat"
                  value={profileForm.githubUsername}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUsername: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub Profile URL:</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={profileForm.githubProfileUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubProfileUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile URL:</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={profileForm.linkedinUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Personal Portfolio / Website URL:</label>
              <input
                type="url"
                placeholder="https://yourname.dev"
                value={profileForm.portfolioUrl}
                onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Placement Roles (comma-separated):</label>
              <input
                type="text"
                placeholder="Full-Stack Engineer, AI/ML Researcher, Cloud Architect"
                value={profileForm.preferredRoles}
                onChange={(e) => setProfileForm({ ...profileForm, preferredRoles: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
              >
                Save Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add / Edit Project Modal */}
      {isProjectModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsProjectModalOpen(false)}
          title={editingProject ? 'Edit Portfolio Project' : 'Add Project / GitHub Repository'}
          subtitle="Showcase technical depth, source code repositories, and deployed demos"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Real-Time Telemetry Processing Engine"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description:</label>
              <textarea
                rows={3}
                required
                placeholder="Describe the system architecture, business impact, algorithms, and technical challenges solved..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">GitHub Repository URL:</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Live Demo / Deployed URL:</label>
                <input
                  type="url"
                  placeholder="https://myproject.demo.app"
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Technologies Used (comma-separated):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, PyTorch, React, Docker, PostgreSQL"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Completion Date:</label>
                <input
                  type="date"
                  value={projectForm.completionDate}
                  onChange={(e) => setProjectForm({ ...projectForm, completionDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                className="rounded border-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-slate-300 font-semibold">
                Feature as Standout Project on Top of Portfolio
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
              >
                {editingProject ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Skill Modal */}
      {isSkillModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsSkillModalOpen(false)}
          title="Add Technical Skill"
          subtitle="Document programming languages, tools, frameworks, and proficiencies"
          maxWidth="md"
        >
          <form onSubmit={handleAddSkill} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Skill Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. C++, Java, Rust, PyTorch, GraphQL"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category:</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as SkillCategory })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="languages">Programming Languages</option>
                  <option value="ai_ml">AI & Machine Learning</option>
                  <option value="web_mobile">Web & Mobile</option>
                  <option value="cloud_devops">Cloud & DevOps</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="dsa">Algorithms & DSA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proficiency:</label>
                <select
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
              >
                Save Skill
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Credential Modal */}
      {isCertModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCertModalOpen(false)}
          title="Add Certification or Award"
          subtitle="Document verified achievements, hackathons, and certifications"
          maxWidth="md"
        >
          <form onSubmit={handleAddCertOrAward} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Type:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCertType('cert')}
                  className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all ${
                    certType === 'cert'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Certification
                </button>
                <button
                  type="button"
                  onClick={() => setCertType('achievement')}
                  className={`py-2 px-3 rounded-xl border font-semibold text-xs transition-all ${
                    certType === 'achievement'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Hackathon / Award
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {certType === 'cert' ? 'Certification Title & Issuer:' : 'Hackathon / Competition Award Name:'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  certType === 'cert'
                    ? 'e.g. AWS Certified Solutions Architect Associate (Amazon Web Services)'
                    : 'e.g. 1st Place Winner – Global Collegiate AI Hackathon 2026'
                }
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
