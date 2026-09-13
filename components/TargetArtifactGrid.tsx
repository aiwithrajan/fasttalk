'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Mail,
  CheckSquare,
  Terminal,
  FileText,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { TargetArtifacts, TargetTab, Tone, Verbosity } from '@/lib/types';

interface TargetArtifactGridProps {
  artifacts: TargetArtifacts | null;
  tone: Tone;
  onToneChange: (t: Tone) => void;
  verbosity: Verbosity;
  onVerbosityChange: (v: Verbosity) => void;
  isLoading?: boolean;
}

export const TargetArtifactGrid: React.FC<TargetArtifactGridProps> = ({
  artifacts,
  tone,
  onToneChange,
  verbosity,
  onVerbosityChange,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<TargetTab>('slack');
  const [copied, setCopied] = useState(false);

  const tabs: { id: TargetTab; label: string; icon: React.ReactNode }[] = [
    { id: 'slack', label: 'Slack / Discord', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'email', label: 'Executive Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'jira', label: 'Linear / Jira', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'cli', label: 'CLI / Shell', icon: <Terminal className="w-4 h-4" /> },
    { id: 'doc', label: 'Markdown Spec', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleCopy = () => {
    if (!artifacts) return;
    let contentToCopy = '';

    switch (activeTab) {
      case 'slack':
        contentToCopy = artifacts.slack.formattedText;
        break;
      case 'email':
        contentToCopy = `Subject: ${artifacts.email.subject}\n\n${artifacts.email.greeting}\n\n${artifacts.email.body.join('\n\n')}\n\n${artifacts.email.signoff}`;
        break;
      case 'jira':
        contentToCopy = `[${artifacts.jira.type}] ${artifacts.jira.title}\nPriority: ${artifacts.jira.priority}\n\n${artifacts.jira.description}\n\nAcceptance Criteria:\n${artifacts.jira.acceptanceCriteria.map(a => `- ${a}`).join('\n')}`;
        break;
      case 'cli':
        contentToCopy = artifacts.cli.commands.join('\n');
        break;
      case 'doc':
        contentToCopy = artifacts.doc.markdownContent;
        break;
    }

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!artifacts && !isLoading) {
    return (
      <div className="h-[520px] rounded-3xl border border-dashed border-white/10 bg-zinc-950/60 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Multi-Target Output Matrix
        </h3>
        <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed">
          Speak your voice shorthand or select a scenario preset above. FastTalk will simultaneously generate 5 production-ready artifacts in parallel.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      
      {/* Top Controls Bar */}
      <div className="border-b border-white/10 bg-black/70 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Navigation Tabs with larger font */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tone Selector & Copy Button */}
        <div className="flex items-center gap-2.5 ml-auto">
          
          <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-xl p-1 text-xs sm:text-sm text-zinc-400">
            {(['engineering', 'executive', 'casual'] as Tone[]).map(t => (
              <button
                key={t}
                onClick={() => onToneChange(t)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  tone === t ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            disabled={!artifacts || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 text-zinc-100">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-3 border-white border-t-transparent animate-spin" />
            <p className="text-base text-zinc-300 font-medium animate-pulse">
              Synthesizing 5 target artifacts in parallel...
            </p>
          </div>
        ) : artifacts ? (
          <div className="w-full">
            
            {/* 1. SLACK TAB */}
            {activeTab === 'slack' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm px-3 py-1 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 font-bold">
                      {artifacts.slack.channel}
                    </span>
                    <span className="text-sm text-zinc-400">Team Standup & Incident Channel</span>
                  </div>
                  <div className="flex gap-2">
                    {artifacts.slack.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-white/10 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 font-mono text-sm sm:text-base whitespace-pre-wrap leading-relaxed text-zinc-200">
                  {artifacts.slack.formattedText}
                </div>

                {artifacts.slack.actionItems.length > 0 && (
                  <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                      Extracted Action Items
                    </h4>
                    <ul className="space-y-2.5 text-sm sm:text-base text-zinc-300">
                      {artifacts.slack.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-cyan-400 font-black">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 2. EMAIL TAB */}
            {activeTab === 'email' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2.5 text-sm sm:text-base">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-semibold w-20">Subject:</span>
                    <span className="font-bold text-white text-base">{artifacts.email.subject}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-semibold w-20">Recipient:</span>
                    <span className="text-indigo-400 font-medium">{artifacts.email.recipientRole}</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 text-sm sm:text-base leading-relaxed space-y-4 text-zinc-200">
                  <p className="font-semibold text-white">{artifacts.email.greeting}</p>
                  {artifacts.email.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <div className="pt-3 border-t border-white/10 text-zinc-300 font-semibold">
                    {artifacts.email.callToAction}
                  </div>
                  <p className="whitespace-pre-line text-zinc-400 pt-3">
                    {artifacts.email.signoff}
                  </p>
                </div>
              </div>
            )}

            {/* 3. JIRA TAB */}
            {activeTab === 'jira' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
                      {artifacts.jira.priority}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300">
                      {artifacts.jira.type}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-zinc-400">{artifacts.jira.component}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {artifacts.jira.title}
                </h3>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 text-sm sm:text-base text-zinc-200 leading-relaxed">
                  <div className="font-bold text-zinc-400 mb-1.5 text-xs uppercase tracking-wider">Issue Description</div>
                  {artifacts.jira.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 text-sm sm:text-base">
                    <div className="font-bold text-zinc-400 mb-3 text-xs uppercase tracking-wider">Acceptance Criteria</div>
                    <ul className="space-y-2 text-zinc-300">
                      {artifacts.jira.acceptanceCriteria.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/10 text-sm sm:text-base">
                    <div className="font-bold text-zinc-400 mb-3 text-xs uppercase tracking-wider">Implementation Steps</div>
                    <ol className="space-y-2 text-zinc-300 list-decimal list-inside">
                      {artifacts.jira.stepsToReproduceOrImplement.map((step, idx) => (
                        <li key={idx}>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CLI TAB */}
            {activeTab === 'cli' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm sm:text-base font-bold text-white">{artifacts.cli.title}</span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm px-3 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-bold">
                    {artifacts.cli.environment}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-black border border-white/10 font-mono text-sm sm:text-base text-cyan-300 leading-loose overflow-x-auto">
                  {artifacts.cli.commands.map((cmd, i) => (
                    <div key={i} className={cmd.startsWith('#') ? 'text-zinc-500 italic' : ''}>
                      {cmd}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/10 text-sm text-zinc-400">
                  <span className="font-bold text-zinc-200">Execution Safety Note: </span>
                  {artifacts.cli.explanation}
                </div>
              </div>
            )}

            {/* 5. DOC TAB */}
            {activeTab === 'doc' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{artifacts.doc.title}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
                    {artifacts.doc.category}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 font-mono text-sm sm:text-base leading-relaxed text-zinc-200 whitespace-pre-wrap">
                  {artifacts.doc.markdownContent}
                </div>
              </div>
            )}

          </div>
        ) : null}
      </div>

    </div>
  );
};
