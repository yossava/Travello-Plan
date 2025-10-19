'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OpenAILog {
  id: string;
  planId: string | null;
  model: string;
  status: string;
  errorMessage: string | null;
  parseError: string | null;
  wasRepaired: boolean;
  completionTokens: number | null;
  promptTokens: number | null;
  totalTokens: number | null;
  durationMs: number | null;
  createdAt: string;
  response?: string;
  prompt?: string;
}

interface LogStats {
  total: number;
  repaired: number;
  byStatus: Array<{ status: string; _count: number }>;
}

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<OpenAILog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<OpenAILog | null>(null);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? '/api/logs/openai?limit=20'
        : `/api/logs/openai?limit=20&status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewLogDetail = async (logId: string) => {
    try {
      const response = await fetch(`/api/logs/openai?logId=${logId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedLog(data.log);
      }
    } catch (error) {
      console.error('Failed to fetch log detail:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-purple-300 hover:text-white flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">OpenAI API Logs</h1>
          <p className="text-gray-300 mt-2">Monitor and debug AI generation requests</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Total Requests</div>
              <div className="text-3xl font-bold text-white mt-1">{stats.total}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Success</div>
              <div className="text-3xl font-bold text-green-400 mt-1">
                {stats.byStatus.find(s => s.status === 'success')?._count || 0}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Errors</div>
              <div className="text-3xl font-bold text-red-400 mt-1">
                {stats.byStatus.find(s => s.status === 'error')?._count || 0}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Auto-Repaired</div>
              <div className="text-3xl font-bold text-yellow-400 mt-1">{stats.repaired}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex space-x-2">
          {['all', 'success', 'error'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Logs Table */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Tokens</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Repaired</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-sm text-white">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.status === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{log.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {log.totalTokens || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {log.durationMs ? `${(log.durationMs / 1000).toFixed(2)}s` : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        {log.wasRepaired && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400">
                            Yes
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewLogDetail(log.id)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Log Detail Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">Log Details</h2>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Status</h3>
                    <span className={`px-3 py-1 rounded text-sm font-semibold ${
                      selectedLog.status === 'success'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {selectedLog.status}
                    </span>
                  </div>

                  {selectedLog.errorMessage && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Error Message</h3>
                      <pre className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-300 text-sm overflow-x-auto">
                        {selectedLog.errorMessage}
                      </pre>
                    </div>
                  )}

                  {selectedLog.parseError && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Parse Error</h3>
                      <pre className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 text-yellow-300 text-sm overflow-x-auto">
                        {selectedLog.parseError}
                      </pre>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Token Usage</h3>
                    <div className="bg-white/5 rounded p-3 text-sm text-white">
                      <div>Prompt: {selectedLog.promptTokens || 'N/A'}</div>
                      <div>Completion: {selectedLog.completionTokens || 'N/A'}</div>
                      <div>Total: {selectedLog.totalTokens || 'N/A'}</div>
                    </div>
                  </div>

                  {selectedLog.prompt && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Prompt</h3>
                      <pre className="bg-white/5 rounded p-3 text-gray-300 text-xs overflow-x-auto max-h-60">
                        {selectedLog.prompt}
                      </pre>
                    </div>
                  )}

                  {selectedLog.response && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 mb-1">Response</h3>
                      <pre className="bg-white/5 rounded p-3 text-gray-300 text-xs overflow-x-auto max-h-96">
                        {selectedLog.response}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
