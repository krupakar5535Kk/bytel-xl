import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Student, AIRecommendation, AITutorMessage, AITutorConversation } from '../../types';
import { wildfireApi } from '../../services/api';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  Check,
  Copy,
  Plus,
  Trash2,
  MessageSquare,
  History,
  ChevronLeft,
  ChevronRight,
  Code2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { AIImprovementPlanCard } from '../profile/AIImprovementPlanCard';

interface AITutorChatProps {
  student: Student;
  initialPlan?: AIRecommendation | null;
  isLiveMode?: boolean;
  onApproveAndSavePlan?: (plan: AIRecommendation) => void;
  showToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

const UNIVERSAL_SUGGESTED_PROMPTS = [
  'What is frontend and backend?',
  'Explain an API with a real example.',
  'Teach me Python from the beginning.',
  'Explain machine learning in simple language.',
  'Help me debug this code error.',
  'Which subjects should I focus on?',
  'Create a study plan for my upcoming exams.',
  'How can I improve my attendance?',
  'Naku Python nerpandi (Telugu/Tanglish)',
];

export const AITutorChat: React.FC<AITutorChatProps> = ({
  student,
  initialPlan,
  isLiveMode = false,
  onApproveAndSavePlan,
  showToast,
}) => {
  const storageKey = `student_analytics_tutor_chats_${student.id || 'default'}`;

  // Helper to create an initial welcome message
  const createWelcomeMessage = (plan?: AIRecommendation | null): AITutorMessage => ({
    id: `msg-welcome-${Date.now()}`,
    sender: 'tutor',
    text: plan
      ? `### 📋 Welcome ${student.name}! I have generated your Personalized Academic Ground Plan.\n\n${plan.summary}\n\nYou can inspect the full schedule above or ask me any questions about your studies, code, or technical topics!`
      : `### 🎓 Hello ${student.name}! I am your Universal AI Academic & Software Engineering Tutor.\n\nI can answer **open-ended questions on any subject** — including:\n- **Full-Stack Web & Software**: Frontend vs Backend, REST APIs, HTTP, Databases\n- **Programming**: Python, Java, C, C++, JavaScript, TypeScript, React\n- **AI & Systems**: Machine Learning, Neural Networks, PyTorch, Cloud Architecture\n- **Academic Telemetry**: Personalized exam study plans, subject focus, attendance recovery\n- **Language Support**: English and Telugu / Tanglish\n\nWhat would you like to learn or work on today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    groundPlan: plan || undefined,
    suggestedPrompts: UNIVERSAL_SUGGESTED_PROMPTS.slice(0, 4),
    evidenceUsed: [
      `Average Score: ${student.averageScore.toFixed(1)}%`,
      `Attendance: ${student.attendanceRate.toFixed(1)}%`,
      `Semester ${student.semester} (${student.course})`,
      `Trend: ${student.trend.toUpperCase()}`,
    ],
  });

  // State: Conversation History List
  const [conversations, setConversations] = useState<AITutorConversation[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: AITutorConversation[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    const firstChat: AITutorConversation = {
      id: `chat-init-${Date.now()}`,
      title: initialPlan ? 'Academic Ground Plan' : 'General AI Learning Session',
      studentId: student.id,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [createWelcomeMessage(initialPlan)],
    };
    return [firstChat];
  });

  const [activeChatId, setActiveChatId] = useState<string>(conversations[0]?.id || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];
  const messages = activeChat?.messages || [];

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeGroundPlan, setActiveGroundPlan] = useState<AIRecommendation | null>(initialPlan || null);
  const [showPlanCard, setShowPlanCard] = useState<boolean>(!!initialPlan);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }, [conversations, storageKey]);

  // If initialPlan changes or arrives, preload it into active chat
  useEffect(() => {
    if (initialPlan) {
      setActiveGroundPlan(initialPlan);
      setShowPlanCard(true);
    }
  }, [initialPlan]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle starting a new conversation
  const handleStartNewChat = () => {
    const newChat: AITutorConversation = {
      id: `chat-${Date.now()}`,
      title: 'New Tutoring Session',
      studentId: student.id,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [createWelcomeMessage(null)],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveGroundPlan(null);
    setShowPlanCard(false);
    showToast?.('info', 'New Chat Started', 'Started a fresh AI conversation session.');
  };

  // Handle deleting a conversation
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (conversations.length <= 1) {
      // Don't leave empty: reset to one blank chat
      const freshChat: AITutorConversation = {
        id: `chat-${Date.now()}`,
        title: 'General AI Learning Session',
        studentId: student.id,
        createdAt: new Date().toLocaleDateString(),
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [createWelcomeMessage(null)],
      };
      setConversations([freshChat]);
      setActiveChatId(freshChat.id);
      showToast?.('info', 'Chat Cleared', 'Conversation history reset.');
      return;
    }

    const remaining = conversations.filter((c) => c.id !== chatId);
    setConversations(remaining);
    if (activeChatId === chatId) {
      setActiveChatId(remaining[0].id);
    }
    showToast?.('info', 'Chat Deleted', 'The conversation was removed from history.');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: AITutorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Auto-update conversation title if it's currently generic
    const isFirstQuestion = messages.length <= 1 || activeChat.title === 'New Tutoring Session';
    const updatedTitle = isFirstQuestion
      ? query.slice(0, 36) + (query.length > 36 ? '...' : '')
      : activeChat.title;

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              title: updatedTitle,
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    setInputValue('');
    setIsLoading(true);

    try {
      const response = await wildfireApi.askAITutor(
        student.id,
        query,
        student,
        [...messages, userMsg].map((m) => ({ sender: m.sender, text: m.text })),
        isLiveMode
      );

      if (response.groundPlan) {
        setActiveGroundPlan(response.groundPlan);
        setShowPlanCard(true);
      }

      const botMsg: AITutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: response.suggestedPrompts,
        evidenceUsed: response.evidenceUsed,
        groundPlan: response.groundPlan,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                messages: [...c.messages, botMsg],
              }
            : c
        )
      );
    } catch (err: any) {
      const errorMsg: AITutorMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: `⚠️ **Unable to complete request**: ${err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                messages: [...c.messages, errorMsg],
              }
            : c
        )
      );
      showToast?.('error', 'AI Tutor Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
    showToast?.('success', 'Copied to Clipboard', 'Text copied successfully.');
  };

  // Helper to render markdown text with formatted code blocks, bold, lists, and schedules
  const renderMessageContent = (msgId: string, text: string) => {
    // Check if message has fenced code blocks
    if (text.includes('```')) {
      const parts = text.split(/(```[\s\S]*?```)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = part.slice(3, firstLineEnd).trim() || 'code';
          const code = part.slice(firstLineEnd + 1, -3);

          return (
            <div key={pIdx} className="my-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{lang}</span>
                </span>
                <button
                  onClick={() => handleCopyText(`${msgId}-code-${pIdx}`, code)}
                  className="flex items-center gap-1 text-[10px] hover:text-white transition-colors"
                >
                  {copiedMessageId === `${msgId}-code-${pIdx}` ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedMessageId === `${msgId}-code-${pIdx}` ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return renderFormattedLines(part, `${pIdx}`);
      });
    }

    return renderFormattedLines(text, 'main');
  };

  const renderFormattedLines = (text: string, prefix: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const key = `${prefix}-${idx}`;
      if (line.startsWith('### ')) {
        return (
          <h4 key={key} className="text-sm font-bold text-cyan-300 mt-2.5 mb-1 font-mono tracking-tight">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={key} className="text-xs font-bold text-violet-300 mt-2 mb-0.5">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={key} className="ml-4 list-disc text-slate-200 text-xs leading-relaxed">
            {renderInlineMarkdown(line.replace('- ', ''))}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={key} className="ml-4 list-decimal text-slate-200 text-xs leading-relaxed">
            {renderInlineMarkdown(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <div key={key} className="p-2.5 my-1.5 rounded-xl bg-violet-950/30 border-l-2 border-violet-400 text-[11px] text-violet-200 italic">
            {renderInlineMarkdown(line.replace('> ', ''))}
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={key} className="h-1.5" />;
      }
      return (
        <p key={key} className="text-xs leading-relaxed text-slate-200">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (content: string) => {
    // Quick bold parser
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-[11px]">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Top Header Bar */}
      <GlassCard glow="violet" className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Universal AI Tutor & Engineering Mentor</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                GPT-4o Mini • Live Pedagogical Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized for <strong>{student.name}</strong> • {student.course} (Sem {student.semester}) • Ask coding, academics, or open questions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeGroundPlan && (
            <button
              onClick={() => setShowPlanCard(!showPlanCard)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/50 hover:bg-violet-900/50 text-violet-300 border border-violet-500/40 text-xs font-mono font-medium transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showPlanCard ? 'Hide Ground Plan' : 'View Ground Plan'}</span>
            </button>
          )}

          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </GlassCard>

      {/* Embedded Ground Plan Card if active */}
      {showPlanCard && activeGroundPlan && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Active Synthesized Ground Plan for {student.name}</span>
            </span>
            <button
              onClick={() => setShowPlanCard(false)}
              className="text-[11px] text-slate-400 hover:text-white font-mono"
            >
              Collapse ✕
            </button>
          </div>
          <AIImprovementPlanCard
            recommendation={activeGroundPlan}
            onRequestGenerate={() => handleSendMessage('Generate my full Ground Plan')}
            onApproveAndSave={onApproveAndSavePlan}
          />
        </div>
      )}

      {/* Main Container: Chat History Sidebar + Conversation Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chat History Sidebar */}
        <div className={`lg:block ${isSidebarOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <GlassCard className="p-3.5 h-[580px] flex flex-col justify-between space-y-3 bg-slate-950/90 border-slate-800">
            <div className="space-y-2.5 overflow-hidden flex flex-col flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chat History ({conversations.length})</span>
                </span>
                <button
                  onClick={handleStartNewChat}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Start new conversation"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 cursor-pointer transition-all group ${
                      chat.id === activeChat.id
                        ? 'bg-violet-950/40 text-cyan-300 border border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                        : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-2 overflow-hidden flex-1">
                      <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                      <div className="overflow-hidden">
                        <span className="font-semibold block truncate leading-tight">
                          {chat.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {chat.updatedAt} • {chat.messages.length} msgs
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Saved locally</span>
              <span>User-Isolated</span>
            </div>
          </GlassCard>
        </div>

        {/* Conversation Stream Window */}
        <div className={isSidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'}>
          <GlassCard className="p-0 overflow-hidden flex flex-col h-[580px] bg-slate-950/90 border-slate-800/80">
            {/* Top Toolbar inside Chat Window */}
            <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                  title="Toggle Chat History Sidebar"
                >
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{isSidebarOpen ? 'Hide History' : 'Show History'}</span>
                </button>
                <span className="text-slate-600">|</span>
                <span className="font-bold text-slate-200 truncate max-w-[200px] sm:max-w-md">
                  {activeChat.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText('full-chat', activeChat.messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n'))}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white"
                  title="Copy full transcript"
                >
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">Copy Transcript</span>
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'student'
                        ? 'bg-wildfire-blue/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    }`}
                  >
                    {msg.sender === 'student' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs space-y-2 shadow-lg ${
                      msg.sender === 'student'
                        ? 'bg-wildfire-blue/15 text-white border border-cyan-500/30 rounded-tr-none'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 border-b border-slate-800/60">
                      <span>{msg.sender === 'student' ? student.name : 'AI Academic Tutor'}</span>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'tutor' && (
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="hover:text-white transition-colors"
                            title="Copy reply text"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Formatted Content */}
                    <div className="space-y-1">
                      {renderMessageContent(msg.id, msg.text)}
                    </div>

                    {/* Ground Plan Preview Trigger if attached */}
                    {msg.groundPlan && !showPlanCard && (
                      <div className="pt-2">
                        <button
                          onClick={() => setShowPlanCard(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] shadow-[0_0_12px_rgba(139,92,246,0.3)] transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Open Full Ground Plan & Weekly Timetable</span>
                        </button>
                      </div>
                    )}

                    {/* Evidence Indicators for bot */}
                    {msg.evidenceUsed && msg.evidenceUsed.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
                        <span className="text-slate-500">Verified Evidence:</span>
                        {msg.evidenceUsed.map((ev, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400/90 border border-slate-800">
                            {ev}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested Prompts Pills */}
                    {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                      <div className="pt-3 space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 block">Suggested Follow-Up:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedPrompts.map((prompt, i) => (
                            <button
                              key={i}
                              onClick={() => handleSendMessage(prompt)}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-violet-950/40 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-violet-500/40 text-[11px] text-left transition-all cursor-pointer"
                            >
                              → {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/40 flex items-center justify-center animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <span className="animate-pulse">Reasoning and synthesizing pedagogical response...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/80 space-y-2">
              {/* Quick Prompt Carousel */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <span className="text-slate-500 font-mono text-[10px] flex-shrink-0">Universal Prompts:</span>
                {UNIVERSAL_SUGGESTED_PROMPTS.slice(0, 5).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask any question about programming, APIs, ML, debugging, or study plans..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>

              {/* Privacy badge & shortcuts */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Data Minimization • Press Enter to Send</span>
                </span>
                <span>Open-Ended Universal Tutor</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
