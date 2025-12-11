import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Users, UserCheck, TrendingDown, Sparkles } from 'lucide-react';
import { generateDemoData } from '../../utils/generateDemoData';

interface Analytics {
  openPositions: number;
  totalCandidates: number;
  recentHires: number;
  rejectionRate: number;
  recentApplications: Array<{
    id: string;
    candidate_name: string;
    job_title: string;
    applied_at: string;
    status: string;
  }>;
}

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics>({
    openPositions: 0,
    totalCandidates: 0,
    recentHires: 0,
    rejectionRate: 0,
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);
  const [generatingDemo, setGeneratingDemo] = useState(false);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const handleGenerateDemoData = async () => {
    if (!confirm('This will add demo jobs and candidates to your account. Continue?')) return;

    setGeneratingDemo(true);
    try {
      await generateDemoData(user!.id);
      alert('Demo data generated successfully!');
      await loadAnalytics();
    } catch (error) {
      console.error('Error generating demo data:', error);
      alert('Failed to generate demo data');
    } finally {
      setGeneratingDemo(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id, status')
        .eq('recruiter_id', user!.id);

      const openPositions = jobs?.filter((j) => j.status === 'open').length || 0;

      const { data: applications } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          candidates (full_name),
          jobs (title)
        `)
        .in('job_id', jobs?.map((j) => j.id) || [])
        .order('applied_at', { ascending: false });

      const totalCandidates = applications?.length || 0;
      const recentHires = applications?.filter((a) => a.status === 'hired').length || 0;
      const rejected = applications?.filter((a) => a.status === 'rejected').length || 0;
      const rejectionRate = totalCandidates > 0 ? Math.round((rejected / totalCandidates) * 100) : 0;

      const recentApplications = applications?.slice(0, 5).map((app: any) => ({
        id: app.id,
        candidate_name: app.candidates?.full_name || 'Unknown',
        job_title: app.jobs?.title || 'Unknown Position',
        applied_at: app.applied_at,
        status: app.status,
      })) || [];

      setAnalytics({
        openPositions,
        totalCandidates,
        recentHires,
        rejectionRate,
        recentApplications,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Open Positions',
      value: analytics.openPositions,
      icon: Briefcase,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Candidates',
      value: analytics.totalCandidates,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Recent Hires',
      value: analytics.recentHires,
      icon: UserCheck,
      color: 'bg-emerald-500',
    },
    {
      label: 'Rejection Rate',
      value: `${analytics.rejectionRate}%`,
      icon: TrendingDown,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Overview of your hiring pipeline</p>
        </div>
        {analytics.openPositions === 0 && analytics.totalCandidates === 0 && (
          <button
            onClick={handleGenerateDemoData}
            disabled={generatingDemo}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            <span>{generatingDemo ? 'Generating...' : 'Generate Demo Data'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Recent Applications
        </h2>
        {analytics.recentApplications.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No applications yet. Create a job posting to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {analytics.recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">
                    {application.candidate_name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {application.job_title}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-500">
                    {formatDate(application.applied_at)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'hired'
                        ? 'bg-green-100 text-green-700'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
