import React from 'react';
import { BarChart3, ClipboardList, FileText, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AuthorityRole } from '@/contexts/StudentContext';

const roleLabels: Record<AuthorityRole, string> = {
  counsellor: 'Counsellor',
  district: 'District Authority',
  state: 'State Authority',
  national: 'National Authority',
};

interface AuthorityPlaceholderDashboardProps {
  role: Exclude<AuthorityRole, 'counsellor'>;
}

export const AuthorityPlaceholderDashboard: React.FC<AuthorityPlaceholderDashboardProps> = ({ role }) => {
  const roleLabel = roleLabels[role];

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8 animate-fade-in">
        <div className="glass-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4">
            <ShieldCheck className="w-7 h-7 text-cyan-400" />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 mb-3">{roleLabel}</p>
          <h1 className="text-4xl font-bold text-white mb-3">Victim Wellbeing Dashboard</h1>
          <p className="text-lg text-gray-300">
            This role-scoped workspace is ready for the next implementation phase.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Overview coming soon
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Role-specific victim monitoring widgets will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-blue-400" />
                  Analytics coming soon
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Aggregated distress trends and escalation insights will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-violet-400" />
                  Reports coming soon
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Exportable authority-level reports will appear here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
