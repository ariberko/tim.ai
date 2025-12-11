import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search, ExternalLink, MoreVertical } from 'lucide-react';
import JobFormModal from './JobFormModal';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  employment_type: string;
  salary_range: string | null;
  requirements: string | null;
  status: 'draft' | 'open' | 'closed';
  public_token: string;
  created_at: string;
}

const getDepartment = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('engineer') || lowerTitle.includes('developer') || lowerTitle.includes('devops') || lowerTitle.includes('qa')) {
    return 'Engineering';
  }
  if (lowerTitle.includes('marketing') || lowerTitle.includes('content')) {
    return 'Marketing';
  }
  if (lowerTitle.includes('sales') || lowerTitle.includes('sdr')) {
    return 'Sales';
  }
  if (lowerTitle.includes('designer') || lowerTitle.includes('ux') || lowerTitle.includes('ui')) {
    return 'Design';
  }
  if (lowerTitle.includes('product')) {
    return 'Product';
  }
  if (lowerTitle.includes('data') || lowerTitle.includes('analyst')) {
    return 'Data & Analytics';
  }
  if (lowerTitle.includes('hr') || lowerTitle.includes('human resources') || lowerTitle.includes('recruiter')) {
    return 'Human Resources';
  }
  if (lowerTitle.includes('customer success') || lowerTitle.includes('support')) {
    return 'Customer Success';
  }
  if (lowerTitle.includes('financial') || lowerTitle.includes('finance')) {
    return 'Finance';
  }
  return 'General';
};

export default function JobsManagement() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredJobs(
        jobs.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.location?.toLowerCase().includes(query) ||
            getDepartment(job.title).toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, jobs]);

  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);

      if (error) throw error;
      setJobs(jobs.filter((j) => j.id !== jobId));
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleCreate = () => {
    setEditingJob(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingJob(null);
    loadJobs();
  };

  const viewAsApplicant = (token: string) => {
    const url = `${window.location.origin}/jobs/${token}`;
    window.open(url, '_blank');
    setOpenMenuId(null);
  };

  const copyPublicLink = (token: string) => {
    const url = `${window.location.origin}/jobs/${token}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
    setOpenMenuId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Jobs</h1>
          <p className="text-slate-600 mt-1">Manage your job postings</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Create Job</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search jobs by title, department, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {searchQuery ? 'No jobs found' : 'No jobs yet'}
          </h3>
          <p className="text-slate-600 mb-6">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Create your first job posting to start receiving applications'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Job</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        job.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'closed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                    <span>{getDepartment(job.title)}</span>
                    <span>•</span>
                    <span>{job.location || 'Location not specified'}</span>
                  </div>

                  <p className="text-slate-700 text-sm mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  {job.status === 'open' && (
                    <button
                      onClick={() => viewAsApplicant(job.public_token)}
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View public application page</span>
                    </button>
                  )}
                </div>

                <div className="relative ml-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-600" />
                  </button>

                  {openMenuId === job.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                        <button
                          onClick={() => viewAsApplicant(job.public_token)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Preview as applicant
                        </button>
                        <button
                          onClick={() => copyPublicLink(job.public_token)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Copy public link
                        </button>
                        <button
                          onClick={() => handleEdit(job)}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Edit job
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete job
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <JobFormModal
          job={editingJob}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
