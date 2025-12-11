import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { X, Plus } from 'lucide-react';

interface Application {
  id: string;
  job_id: string;
  status: string;
  candidate: {
    full_name: string;
    email: string;
    phone: string | null;
  };
  job: {
    title: string;
  };
}

interface Stage {
  id: string;
  name: string;
  order_num: number;
  pass_threshold: number;
}

interface Score {
  stage_id: string;
  score: number;
  feedback: string | null;
  scored_at: string;
}

interface Note {
  id: string;
  note: string;
  created_at: string;
  recruiter: {
    full_name: string;
  };
}

interface CandidateDetailsModalProps {
  application: Application;
  onClose: () => void;
}

export default function CandidateDetailsModal({ application, onClose }: CandidateDetailsModalProps) {
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState(70);
  const [scoreFeedback, setScoreFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stagesData, scoresData, notesData] = await Promise.all([
        supabase
          .from('job_stages')
          .select('*')
          .eq('job_id', application.job_id)
          .order('order_num'),
        supabase
          .from('stage_scores')
          .select('*')
          .eq('application_id', application.id),
        supabase
          .from('recruiter_notes')
          .select(`
            id,
            note,
            created_at,
            recruiters (full_name)
          `)
          .eq('application_id', application.id)
          .order('created_at', { ascending: false }),
      ]);

      setStages(stagesData.data || []);
      setScores(scoresData.data || []);
      setNotes(
        notesData.data?.map((n: any) => ({
          id: n.id,
          note: n.note,
          created_at: n.created_at,
          recruiter: n.recruiters,
        })) || []
      );
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async () => {
    if (!selectedStage) return;

    try {
      const { error } = await supabase.from('stage_scores').upsert({
        application_id: application.id,
        stage_id: selectedStage,
        score: scoreValue,
        feedback: scoreFeedback || null,
        scored_by: user!.id,
      });

      if (error) throw error;

      await loadData();
      setSelectedStage(null);
      setScoreValue(70);
      setScoreFeedback('');
    } catch (error) {
      console.error('Error adding score:', error);
      alert('Failed to add score');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase.from('recruiter_notes').insert({
        application_id: application.id,
        recruiter_id: user!.id,
        note: newNote,
      });

      if (error) throw error;

      await loadData();
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  };

  const getScoreForStage = (stageId: string) => {
    return scores.find((s) => s.stage_id === stageId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {application.candidate.full_name}
            </h2>
            <p className="text-slate-600">{application.job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Interview Pipeline
              </h3>
              <div className="space-y-4">
                {stages.map((stage) => {
                  const score = getScoreForStage(stage.id);
                  return (
                    <div
                      key={stage.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900">
                          {stage.name}
                        </h4>
                        {score ? (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              score.score >= stage.pass_threshold
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {score.score}%
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedStage(stage.id)}
                            className="text-sm text-slate-900 hover:underline"
                          >
                            Add Score
                          </button>
                        )}
                      </div>
                      {score?.feedback && (
                        <p className="text-sm text-slate-600 mt-2">
                          {score.feedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedStage && (
                <div className="mt-4 p-4 border border-slate-300 rounded-lg bg-slate-50">
                  <h4 className="font-medium text-slate-900 mb-3">Add Score</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Score (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={scoreValue}
                        onChange={(e) => setScoreValue(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Feedback (optional)
                      </label>
                      <textarea
                        value={scoreFeedback}
                        onChange={(e) => setScoreFeedback(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        placeholder="Add your feedback..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddScore}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                      >
                        Save Score
                      </button>
                      <button
                        onClick={() => setSelectedStage(null)}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Notes
              </h3>
              <div className="space-y-3 mb-4">
                {notes.length === 0 ? (
                  <p className="text-slate-500 text-sm">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <p className="text-slate-900 mb-2">{note.note}</p>
                      <p className="text-xs text-slate-500">
                        {note.recruiter.full_name} • {formatDate(note.created_at)}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  placeholder="Add a note..."
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Note</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
