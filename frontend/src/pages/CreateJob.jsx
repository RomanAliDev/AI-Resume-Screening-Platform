import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please enter both job title and job description.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/jobs", {
        title: title.trim(),
        description: description.trim(),
      });

      navigate("/jobs");
    } catch (error) {
      console.error("Failed to create job:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to create job. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/jobs")}
            className="mb-5 flex items-center cursor-pointer gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            <ArrowLeft size={17} />
            Back to Jobs
          </button>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Create Job
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a job position to start screening candidates.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Job Information
                </h2>

                <p className="text-xs text-slate-500">
                  Enter the requirements for this position.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6">
            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Job Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Engineer"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Job Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter job responsibilities, required skills, experience, education and other requirements..."
                rows={10}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                This description will be used by AI for candidate matching.
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="rounded-xl border cursor-pointer border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                <Save size={17} />

                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateJob;
