import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  Users,
  UserCheck,
  Plus,
  Loader2,
} from "lucide-react";

import api from "../services/api";

function MainContent() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_jobs: 0,
    total_resumes: 0,
    total_candidates: 0,
    shortlisted: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, jobsResponse] = await Promise.all([
        api.get("/jobs/stats"),
        api.get("/jobs"),
      ]);

      setStats(statsResponse.data);

      const jobs = jobsResponse.data || [];

      const sortedJobs = [...jobs]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

      setRecentJobs(sortedJobs);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setError(
        error.response?.data?.detail || "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.total_jobs,
      icon: BriefcaseBusiness,
    },
    {
      title: "Total Resumes",
      value: stats.total_resumes,
      icon: FileText,
    },
    {
      title: "Candidates",
      value: stats.total_candidates,
      icon: Users,
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: UserCheck,
    },
  ];

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Here is what's happening with your recruitment.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobs/create")}
            className="flex items-center  justify-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
            <Plus size={18} />
            Create Job
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Jobs */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Jobs</h2>

              <p className="mt-1 text-xs text-slate-500">
                Recently created recruitment positions
              </p>
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="p-8 text-center">
              <BriefcaseBusiness size={30} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No jobs created yet.
              </p>

              <button
                onClick={() => navigate("/jobs/create")}
                className="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                Create your first job
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900">{job.title}</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Created {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="cursor-pointer w-fit text-sm font-medium text-blue-600 hover:text-blue-700">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default MainContent;
