import React, { useEffect, useState } from 'react';
import { CalendarCheck, ChevronDown, ChevronUp, Clock3, MessageSquareText, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useStudent } from '@/contexts/StudentContext';

interface CheckIn {
  id: string;
  safety: number;
  note: string;
  date: string;
}

const safetyLabels = ['Not safe', 'A little safe', 'Somewhat safe', 'Mostly safe', 'Very safe'];

export const Journal: React.FC = () => {
  const { studentId } = useStudent();
  const [selectedSafety, setSelectedSafety] = useState<number | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [note, setNote] = useState('');
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  const storageKey = `checkIns_${studentId || 'demo_victim'}`;

  useEffect(() => {
    const savedCheckIns = localStorage.getItem(storageKey);
    if (!savedCheckIns) {
      setCheckIns([]);
      return;
    }

    try {
      setCheckIns(JSON.parse(savedCheckIns));
    } catch {
      setCheckIns([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkIns));
  }, [checkIns, storageKey]);

  const handleSubmit = () => {
    if (!selectedSafety) {
      toast.error('Please select how safe you feel today.');
      return;
    }

    const newCheckIn: CheckIn = {
      id: Date.now().toString(),
      safety: selectedSafety,
      note: note.trim(),
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setCheckIns((current) => [newCheckIn, ...current]);
    setSelectedSafety(null);
    setNote('');
    setIsShareOpen(false);
    toast.success('Check-in recorded. Thank you for sharing.');
  };

  const progress = Math.min(checkIns.length * 20, 100);

  return (
    <DashboardLayout userType="student">
      <div className="space-y-8 animate-fade-in">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-3">Regular wellbeing check-in</p>
          <h1 className="text-4xl font-bold text-white">Check-ins</h1>
          <p className="text-lg text-gray-300 mt-3">
            A short, private way to tell us how you are feeling today.
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-6">
          <Card className="glass-card border-cyan-400/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CalendarCheck className="w-5 h-5 text-cyan-400" />
                Today's check-in
              </CardTitle>
              <CardDescription>How safe do you feel today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isSelected = selectedSafety === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedSafety(value)}
                      aria-label={`${value} out of 5: ${safetyLabels[value - 1]}`}
                      className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                        isSelected
                          ? 'border-cyan-300 bg-cyan-400/20 text-cyan-200'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-xl font-semibold">{value}</span>
                      <span className="block text-[11px] mt-1 leading-tight">{safetyLabels[value - 1]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setIsShareOpen((open) => !open)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left text-gray-200"
                  aria-expanded={isShareOpen}
                >
                  <span>Want to share more? (optional)</span>
                  {isShareOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isShareOpen && (
                  <div className="px-4 pb-4">
                    <Textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Anything you would like your support team to know?"
                      className="min-h-28 bg-black/10 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSubmit} className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-950">
                Submit check-in
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock3 className="w-5 h-5 text-violet-300" />
                Your progress
              </CardTitle>
              <CardDescription>Keep a gentle rhythm of checking in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="h-3 bg-white/10" />
              <p className="text-sm text-gray-300">
                {checkIns.length} check-in{checkIns.length === 1 ? '' : 's'} recorded
              </p>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                Your responses are kept private and can help identify when extra support may be useful.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquareText className="w-5 h-5 text-cyan-400" />
              Previous check-ins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checkIns.length === 0 ? (
              <p className="text-sm text-gray-400">Your completed check-ins will appear here.</p>
            ) : (
              checkIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="font-medium text-white">
                      Safety: {checkIn.safety}/5 · {safetyLabels[checkIn.safety - 1]}
                    </p>
                    {checkIn.note && <p className="text-sm text-gray-400 mt-1">{checkIn.note}</p>}
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{checkIn.date}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
