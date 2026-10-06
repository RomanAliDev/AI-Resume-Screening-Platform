import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, FileText, Users, Loader2 } from "lucide-react";

import api from "../services/api";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    loadJob();
    loadResumes();
  }, [jobId]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/jobs/${jobId}`);

      setJob(response.data);
    } catch (error) {
      console.error("Failed to load job:", error);

      setError(error.response?.data?.detail || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const response = await api.get(`/resumes/job/${jobId}`);

      setResumes(response.data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setUploadMessage("");

      const formData = new FormData();

      formData.append("job_id", jobId);
      formData.append("file", file);

      const response = await api.post("/resumes/upload", formData);

      setUploadMessage(
        response.data.message || "Resume uploaded and processed successfully.",
      );

      await loadResumes();

      event.target.value = "";
    } catch (error) {
      console.error(
        "UPLOAD VALIDATION ERROR:",
        JSON.stringify(error.response?.data, null, 2),
      );

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => `${item.loc?.join(".")}: ${item.msg}`)
            .join(", "),
        );
      } else {
        setError(detail || "Failed to upload resume.");
      }

      event.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-500">
              Loading job details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => navigate("/jobs")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
            <ArrowLeft size={18} />
            Back to Jobs
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <button
          onClick={() => navigate("/jobs")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>

          <p className="mt-2 text-sm text-slate-500">
            Created on {new Date(job.created_at).toLocaleDateString()}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {uploadMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600">
            {uploadMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Job Description
                  </h2>

                  <p className="text-xs text-slate-500">
                    Requirements for this position
                  </p>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {job.description}
              </p>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Upload size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Upload Resume
                  </h2>

                  <p className="text-xs text-slate-500">PDF or DOCX only</p>
                </div>
              </div>

              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50 ${
                  uploading ? "pointer-events-none opacity-60" : ""
                }`}>
                {uploading ? (
                  <>
                    <Loader2 size={28} className="animate-spin text-blue-600" />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      AI is processing resume...
                    </p>

                    <p className="mt-1 text-xs text-slate-500">Please wait</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-slate-400" />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      Upload a resume
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Click to select PDF or DOCX
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Candidates</p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {resumes.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Uploaded Resumes</h2>

              <p className="mt-1 text-xs text-slate-500">
                Resumes submitted for this position
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {resumes.length} resumes
            </span>
          </div>

          {resumes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <FileText size={28} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No resumes uploaded yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Upload a resume to start AI screening.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                      <FileText size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {resume.filename}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Uploaded{" "}
                        {new Date(resume.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        resume.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600"
                          : resume.status === "FAILED"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                      }`}>
                      {resume.status}
                    </span>

                    {resume.candidate_id && (
                      <button
                        onClick={() =>
                          navigate(`/candidates/${resume.candidate_id}`)
                        }
                        className="cursor-pointer rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                        View Candidate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default JobDetails;
