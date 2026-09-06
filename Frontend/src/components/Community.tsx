import React, { useState } from 'react';
import { ArrowLeft, BookOpen, HeartHandshake, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CommunityProps {
  onToggle: () => void;
}

const topics = [
  {
    id: 'court-delays',
    title: 'Coping with court delays',
    description: 'Small ways to manage uncertainty between hearings.',
    icon: BookOpen,
    accent: 'text-cyan-400',
  },
  {
    id: 'family',
    title: 'Talking to family',
    description: 'Reflections on asking for support and setting boundaries.',
    icon: HeartHandshake,
    accent: 'text-violet-400',
  },
  {
    id: 'hope',
    title: 'Staying hopeful',
    description: 'Gentle reminders for difficult days.',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
  },
] as const;

const reflections = {
  'court-delays': [
    { text: 'Taking one day at a time helped me focus on what I can control.', time: '2 days ago' },
    { text: 'Writing down questions before a hearing made the waiting feel less overwhelming.', time: '5 days ago' },
    { text: 'A short walk and a trusted support person helped me get through a difficult update.', time: '1 week ago' },
  ],
  family: [
    { text: 'I shared only what felt safe to share, and that was enough for today.', time: '1 day ago' },
    { text: 'It helped to tell my family exactly what kind of support I needed.', time: '4 days ago' },
    { text: 'A quiet conversation created more understanding than I expected.', time: '6 days ago' },
  ],
  hope: [
    { text: 'Progress can be very small and still be meaningful.', time: '3 days ago' },
    { text: 'I keep a list of people and places that help me feel grounded.', time: '1 week ago' },
    { text: 'Rest is part of moving forward, not a step away from it.', time: '2 weeks ago' },
  ],
} as const;

export const Community: React.FC<CommunityProps> = ({ onToggle }) => {
  const [selectedTopic, setSelectedTopic] = useState<(typeof topics)[number]['id']>('court-delays');
  const [reflection, setReflection] = useState('');

  const activeTopic = topics.find((topic) => topic.id === selectedTopic) || topics[0];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!reflection.trim()) {
      toast.error('Share a reflection before submitting.');
      return;
    }

    setReflection('');
    toast.success("Thanks for sharing. Your post will appear after a quick review.");
  };

  return (
    <DashboardLayout userType="student" onCommunityToggle={onToggle}>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">Private and moderated</p>
            <h1 className="text-4xl font-bold text-white">Support Space</h1>
            <p className="text-lg text-gray-300 mt-3 max-w-2xl">
              Read gentle, anonymized reflections from people navigating similar experiences.
            </p>
          </div>
          <Button variant="outline" onClick={onToggle} className="shrink-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Button>
        </div>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Choose a topic</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {topics.map((topic) => {
              const Icon = topic.icon;
              const isActive = topic.id === selectedTopic;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`text-left rounded-2xl p-5 border transition-all duration-300 ${
                    isActive
                      ? 'border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-950/30'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-4 ${topic.accent}`} />
                  <h3 className="font-semibold text-white">{topic.title}</h3>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">{topic.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">{activeTopic.title}</CardTitle>
            <CardDescription>
              Short reflections are shown without names, avatars, or identifying details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reflections[selectedTopic].map((entry) => (
              <div key={entry.text} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-gray-200 leading-relaxed">{entry.text}</p>
                <p className="text-xs text-gray-500 mt-3">{entry.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-cyan-400/20">
          <CardHeader>
            <CardTitle className="text-white">Share something (reviewed before it's visible to others)</CardTitle>
            <CardDescription>
              Your reflection will stay hidden until it has had a quick review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="Write a short reflection or encouragement..."
                aria-label="Share something (reviewed before it's visible to others)"
                className="min-h-28 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-gray-950">
                  <Send className="w-4 h-4 mr-2" />
                  Submit for review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
