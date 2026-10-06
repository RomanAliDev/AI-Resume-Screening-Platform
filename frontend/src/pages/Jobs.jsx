import { useEffect, useState } from "react";
import { BriefcaseBusiness, Plus, CalendarDays, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Jobs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your recruitment positions.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobs/create")}
            className="flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
            <Plus size={18} />
            Create Job
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={24} />
            </div>

            <h2 className="mt-4 font-semibold text-slate-900">No jobs found</h2>

            <p className="mt-1 text-sm text-slate-500">
              Create your first job to start screening candidates.
            </p>

            <button
              onClick={() => navigate("/jobs/create")}
              className="mt-5 rounded-xl cursor-pointer bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              Create Job
            </button>
          </div>
        ) : (
          /* Jobs */
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Job ID: #{job.id}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="mt-5">
                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {job.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={15} />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText size={15} />
                    Resumes
                  </div>
                  <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="w-fit text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Jobs;
