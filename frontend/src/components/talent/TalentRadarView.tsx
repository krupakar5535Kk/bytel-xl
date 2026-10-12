import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { TalentProfile, SkillCategory, CareerRoadmapGoal } from '../../types';
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
  User
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StudentPortfolioEditor } from './StudentPortfolioEditor';

export const TalentRadarView: React.FC = () => {
  const { students, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'my_portfolio' | 'campus_radar'>('my_portfolio');

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

  // Synthetic or grounded talent profiles mapped to registered students
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

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState<'all' | number>('all');
  const [skillFilter, setSkillFilter] = useState<'all' | SkillCategory>('all');
  const [recruiterOnly, setRecruiterOnly] = useState(false);

  // Skill Gap Modal
  const [selectedStudentForGap, setSelectedStudentForGap] = useState<TalentProfile | null>(null);
  const [targetCareerRole, setTargetCareerRole] = useState<'ai_engineer' | 'fullstack' | 'cybersecurity'>('ai_engineer');

  // Add Skill Modal
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [selectedProfileForSkill, setSelectedProfileForSkill] = useState<TalentProfile | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('languages');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileForSkill || !newSkillName.trim()) return;

    setTalentProfiles((prev) =>
      prev.map((p) => {
        if (p.studentId !== selectedProfileForSkill.studentId) return p;
        return {
          ...p,
          primarySkills: [
            ...p.primarySkills,
            {
              name: newSkillName.trim(),
              category: newSkillCategory,
              proficiency: newSkillProficiency,
              verificationStatus: 'student_reported',
            },
          ],
        };
      })
    );

    showToast('success', 'Skill Added', `"${newSkillName}" added to profile as Student-Reported.`);
    setIsAddSkillModalOpen(false);
    setSelectedProfileForSkill(null);
    setNewSkillName('');
  };

  // Filtered talent profiles
  const filteredProfiles = talentProfiles.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId.toLowerCase().includes(search.toLowerCase()) ||
      p.primarySkills.some((s) => s.name.toLowerCase().includes(search.toLowerCase()));

    const matchesYear = yearFilter === 'all' || p.year === yearFilter;
    const matchesSkill = skillFilter === 'all' || p.primarySkills.some((s) => s.category === skillFilter);
    const matchesRecruiter = !recruiterOnly || p.recruiterVisible;

    return matchesSearch && matchesYear && matchesSkill && matchesRecruiter;
  });

  // Calculate career gap recommendations
  const getCareerRoadmap = (profile: TalentProfile): CareerRoadmapGoal => {
    if (targetCareerRole === 'ai_engineer') {
      const required = ['Python', 'Linear Algebra', 'PyTorch / TensorFlow', 'Model Evaluation', 'Docker'];
      const demonstrated = profile.primarySkills.map((s) => s.name);
      const gaps = required.filter((r) => !demonstrated.some((d) => d.toLowerCase().includes(r.toLowerCase())));
      const match = Math.round(((required.length - gaps.length) / required.length) * 100);

      return {
        roleTitle: 'Junior AI/ML Engineer',
        requiredSkills: required,
        demonstratedSkills: demonstrated,
        skillGaps: gaps,
        matchPercentage: match,
        recommendedActions: [
          {
            priority: 'high',
            action: 'Complete PyTorch Deep Learning Specialization and implement a CNN vision model.',
            resource: 'DeepLearning.AI / Fast.ai Coursework',
            estimatedWeeks: 4,
          },
          {
            priority: 'medium',
            action: 'Containerize an ML model inference API with FastAPI and Docker.',
            resource: 'Practical MLOps Guide',
            estimatedWeeks: 2,
          },
        ],
      };
    } else if (targetCareerRole === 'cybersecurity') {
      const required = ['Linux Internals', 'Network Protocols (TCP/IP)', 'Cryptography', 'SIEM & Log Analysis'];
      const demonstrated = profile.primarySkills.map((s) => s.name);
      const gaps = required.filter((r) => !demonstrated.some((d) => d.toLowerCase().includes(r.toLowerCase())));
      const match = Math.round(((required.length - gaps.length) / required.length) * 100);

      return {
        roleTitle: 'Cybersecurity Threat Analyst',
        requiredSkills: required,
        demonstratedSkills: demonstrated,
        skillGaps: gaps,
        matchPercentage: match,
        recommendedActions: [
          {
            priority: 'high',
            action: 'Complete TryHackMe / HackTheBox SOC Level 1 Pathway.',
            resource: 'Network Defense & Packet Analysis Lab',
            estimatedWeeks: 3,
          },
        ],
      };
    } else {
      const required = ['TypeScript', 'React / Next.js', 'PostgreSQL', 'REST & GraphQL APIs', 'CI/CD Pipelines'];
      const demonstrated = profile.primarySkills.map((s) => s.name);
      const gaps = required.filter((r) => !demonstrated.some((d) => d.toLowerCase().includes(r.toLowerCase())));
      const match = Math.round(((required.length - gaps.length) / required.length) * 100);

      return {
        roleTitle: 'Full-Stack Cloud Developer',
        requiredSkills: required,
        demonstratedSkills: demonstrated,
        skillGaps: gaps,
        matchPercentage: match,
        recommendedActions: [
          {
            priority: 'high',
            action: 'Build a production microservice with automated GitHub Actions CI/CD pipeline.',
            resource: 'Full-Stack Open Curriculum',
            estimatedWeeks: 3,
          },
        ],
      };
    }
  };

  const toggleRecruiterVisibility = (studentId: string) => {
    setTalentProfiles((prev) =>
      prev.map((p) => {
        if (p.studentId === studentId) {
          const nextState = !p.recruiterVisible;
          showToast(
            'success',
            'Privacy Consent Updated',
            `Recruiter profile visibility for ${p.studentName} set to ${nextState ? 'VISIBLE' : 'HIDDEN'}.`
          );
          return { ...p, recruiterVisible: nextState };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs: My Portfolio vs Campus Talent Radar */}
      <div className="flex border-b border-slate-800 text-xs font-semibold space-x-2 sm:space-x-6 overflow-x-auto">
        <button
          onClick={() => setViewMode('my_portfolio')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            viewMode === 'my_portfolio'
              ? 'border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_10px_rgba(0,229,255,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span>My Developer Portfolio & Repositories</span>
        </button>

        <button
          onClick={() => setViewMode('campus_radar')}
          className={`pb-3 px-2 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            viewMode === 'campus_radar'
              ? 'border-cyan-400 text-cyan-300 font-bold shadow-[0_2px_10px_rgba(0,229,255,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4 text-wildfire-blue" />
          <span>Campus Talent Radar & Institutional Discovery (Years 1 to 4)</span>
        </button>
      </div>

      {viewMode === 'my_portfolio' ? (
        <StudentPortfolioEditor onProfileUpdate={handleMyProfileUpdate} />
      ) : (
        <>
          {/* Header Bar */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card via-slate-900 to-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>WILD FIRE TALENT RADAR • YEARS 1 TO 4</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Talent Discovery & Skill Intelligence</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Discover student talent across all 4 engineering years based on verified technical abilities, coding portfolios, and hackathon achievements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Recruiter Privacy Protection Active</span>
        </div>
      </div>

      {/* Filters Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, skill, or language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-wildfire-blue"
            />
          </div>

          {/* Academic Year */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-slate-400 font-mono text-[11px]">Year:</span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-slate-900">All 4 Years</option>
              <option value="1" className="bg-slate-900">Year 1 (Freshmen Talent)</option>
              <option value="2" className="bg-slate-900">Year 2 (Rising Stars)</option>
              <option value="3" className="bg-slate-900">Year 3 (Internship Ready)</option>
              <option value="4" className="bg-slate-900">Year 4 (Placement Ready)</option>
            </select>
          </div>

          {/* Skill Domain */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 rounded-xl px-2.5 py-1.5">
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
              <option value="cybersecurity" className="bg-slate-900">Cybersecurity</option>
            </select>
          </div>
        </div>

        {/* Recruiter Visibility Toggle Filter */}
        <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-mono text-[11px]">
          <input
            type="checkbox"
            checked={recruiterOnly}
            onChange={(e) => setRecruiterOnly(e.target.checked)}
            className="rounded border-slate-700 text-wildfire-blue focus:ring-wildfire-blue"
          />
          <span>Consented for Recruiters Only</span>
        </label>
      </GlassCard>

      {/* Talent Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProfiles.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>No student talent profiles match the selected domain filters.</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <GlassCard key={profile.studentId} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{profile.studentName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        Year {profile.year}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">{profile.course} • Sem {profile.semester}</p>
                  </div>

                  {/* Recruiter Consent Toggle Button */}
                  <button
                    onClick={() => toggleRecruiterVisibility(profile.studentId)}
                    title={profile.recruiterVisible ? 'Profile visible to approved placement partners' : 'Profile hidden from placement partners'}
                    className={`p-1.5 rounded-lg border transition-all ${
                      profile.recruiterVisible
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {profile.recruiterVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{profile.bio}"
                </p>

                {/* Problem Solving Stat */}
                {profile.problemSolvingStats && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                    <Code className="w-4 h-4 text-wildfire-blue" />
                    <span className="text-slate-300 font-semibold">{profile.problemSolvingStats.platform}:</span>
                    <span className="text-emerald-400 font-bold">{profile.problemSolvingStats.problemsSolved} Solved</span>
                    <span className="text-slate-500">• {profile.problemSolvingStats.rating}</span>
                  </div>
                )}

                {/* Technical Skills Badges */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Demonstrated Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.primarySkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                          sk.verificationStatus === 'faculty_verified'
                            ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                            : sk.verificationStatus === 'independently_verified'
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {sk.verificationStatus !== 'student_reported' && (
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        )}
                        <span>{sk.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Project */}
                {profile.projects.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{profile.projects[0].title}</span>
                      <a
                        href={profile.projects[0].githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {profile.projects[0].description}
                    </p>
                  </div>
                )}
              </div>

              {/* Action: Skill Gap Analysis */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {profile.recruiterVisible ? '✅ Consented for Recruiters' : '🔒 Student Private'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedProfileForSkill(profile);
                      setIsAddSkillModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all"
                    title="Submit new technical skill"
                  >
                    <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Skill</span>
                  </button>
                  <button
                    onClick={() => setSelectedStudentForGap(profile)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wildfire-blue/20 text-wildfire-cyan hover:bg-wildfire-blue/30 border border-wildfire-blue/40 font-mono text-xs font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Skill Gap</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Skill Gap Analysis Modal */}
      {selectedStudentForGap && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudentForGap(null)}
          title={`Skill Gap Analysis: ${selectedStudentForGap.studentName}`}
          subtitle={`Year ${selectedStudentForGap.year} • Target Career Pathway Roadmap`}
          maxWidth="lg"
        >
          {(() => {
            const roadmap = getCareerRoadmap(selectedStudentForGap);
            return (
              <div className="space-y-5 text-xs font-sans">
                {/* Career Role Selector */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Select Target Industry Role:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetCareerRole('ai_engineer')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        targetCareerRole === 'ai_engineer'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      AI/ML Engineer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetCareerRole('fullstack')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        targetCareerRole === 'fullstack'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Full Stack Cloud
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetCareerRole('cybersecurity')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        targetCareerRole === 'cybersecurity'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Cybersecurity
                    </button>
                  </div>
                </div>

                {/* Match Score Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Target Readiness Match</span>
                    <h4 className="text-xl font-bold text-white mt-0.5">{roadmap.roleTitle}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-mono text-cyan-400">{roadmap.matchPercentage}%</span>
                    <span className="text-[10px] text-slate-500 block">Syllabus Competency Match</span>
                  </div>
                </div>

                {/* Skills Breakdown Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Skills Demonstrated</span>
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {roadmap.demonstratedSkills.slice(0, 4).map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Target Skill Gaps</span>
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {roadmap.skillGaps.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Practical Learning Roadmap */}
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-200">Recommended Milestone Action Plan:</h5>
                  <div className="space-y-2">
                    {roadmap.recommendedActions.map((act, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{act.action}</span>
                          <span className="font-mono text-[10px] text-cyan-400">~{act.estimatedWeeks} Weeks</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Resource: {act.resource}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedStudentForGap(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Close Roadmap
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Add Technical Skill Modal */}
      {isAddSkillModalOpen && selectedProfileForSkill && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsAddSkillModalOpen(false);
            setSelectedProfileForSkill(null);
          }}
          title={`Submit Technical Skill: ${selectedProfileForSkill.studentName}`}
          subtitle="Add technical competency to talent profile for faculty verification"
          maxWidth="md"
        >
          <form onSubmit={handleAddSkill} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Skill Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. PyTorch, Rust, Kubernetes, Penetration Testing"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category:</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="languages">Programming Languages</option>
                  <option value="ai_ml">AI & Machine Learning</option>
                  <option value="web_mobile">Web & Mobile</option>
                  <option value="cloud_devops">Cloud & DevOps</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="dsa">Algorithms & Data Structures</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proficiency Level:</label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="beginner">Beginner / Learner</option>
                  <option value="intermediate">Intermediate / Project-Ready</option>
                  <option value="advanced">Advanced / Production-Grade</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span>
                Skills added by students start with <strong>Student-Reported</strong> status. Faculty advisors or external proofs upgrade them to <strong>Verified</strong>.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsAddSkillModalOpen(false);
                  setSelectedProfileForSkill(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
              >
                Submit Skill
              </button>
            </div>
          </form>
        </Modal>
      )}
        </>
      )}
    </div>
  );
};
