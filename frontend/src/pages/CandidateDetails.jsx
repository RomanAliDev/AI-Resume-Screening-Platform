import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  Brain,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";

import api from "../services/api";

function CandidateDetails() {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCandidate();
  }, [candidateId]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/candidates/${candidateId}`);

      setCandidate(response.data);
    } catch (error) {
      console.error("Failed to fetch candidate:", error);

      setError(
        error.response?.data?.detail || "Unable to load candidate details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (status) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await api.patch(`/candidates/${candidateId}/review`, {
        review_status: status,
      });

      setCandidate((previousCandidate) => ({
        ...previousCandidate,
        review_status: response.data.review_status,
      }));
    } catch (error) {
      console.error("Failed to update candidate:", error);

      setError(
        error.response?.data?.detail || "Unable to update candidate status.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "SHORTLISTED") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "REJECTED") {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-600";
  };

  const formatStatus = (status) => {
    return (status || "UNDER_REVIEW").replaceAll("_", " ");
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-500">Loading candidate...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !candidate) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => navigate("/candidates")}
            className="mb-6 cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            <ArrowLeft size={17} />
            Back to Candidates
          </button>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Back */}
        <button
          onClick={() => navigate("/candidates")}
          className="mb-6 cursor-pointer flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
          <ArrowLeft size={17} />
          Back to Candidates
        </button>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Candidate Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600">
                {candidate.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {candidate.name || "Unknown Candidate"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Candidate #{candidate.id}
                </p>
              </div>
            </div>

            {/* Review Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => updateReviewStatus("SHORTLISTED")}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 rounded-xl cursor-pointer bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                <UserCheck size={17} />
                {actionLoading ? "Updating..." : "Shortlist"}
              </button>

              <button
                onClick={() => updateReviewStatus("REJECTED")}
                disabled={actionLoading}
                className="flex items-center justify-center cursor-pointer gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                <UserX size={17} />
                {actionLoading ? "Updating..." : "Reject"}
              </button>
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <span
              className={`rounded-full px-4 py-2 text-xs font-medium ${getStatusStyle(
                candidate.review_status,
              )}`}>
              {formatStatus(candidate.review_status)}
            </span>
          </div>
        </div>

        {/* Candidate Information */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contact */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">
              Candidate Information
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-400">Email</p>

                  <p className="mt-1 text-sm text-slate-700">
                    {candidate.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 text-slate-400" />

                <div>
                  <p className="text-xs text-slate-400">Phone</p>

                  <p className="mt-1 text-sm text-slate-700">
                    {candidate.phone || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={19} className="text-blue-600" />

              <h2 className="font-semibold text-slate-900">Experience</h2>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
              {candidate.experience || "No experience information available."}
            </p>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <GraduationCap size={19} className="text-blue-600" />

              <h2 className="font-semibold text-slate-900">Education</h2>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
              {candidate.education || "No education information available."}
            </p>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <Brain size={19} className="text-blue-600" />

              <h2 className="font-semibold text-slate-900">Skills</h2>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">
              {candidate.skills || "No skills information available."}
            </p>
          </div>
        </div>

        {/* AI Matching */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Brain size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">AI Matching</h2>

                <p className="mt-1 text-xs text-slate-500">
                  AI-generated candidate matching results.
                </p>
              </div>
            </div>
          </div>

          {!candidate.matches || candidate.matches.length === 0 ? (
            <div className="p-8 text-center">
              <Brain size={30} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No AI matching results available yet.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Run AI matching for this candidate to generate results.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-600">
              {candidate.matches.map((match) => (
                <div key={match.id} className="p-5">
                  {/* Match Score */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Match Score
                      </p>

                      <p className="mt-1 text-3xl font-bold text-blue-600">
                        {match.match_score}%
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
                      AI Match
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={17} className="text-emerald-500" />

                      <h3 className="text-sm font-semibold text-slate-900">
                        Matched Skills
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {match.matched_skills || "No matched skills found."}
                    </p>
                  </div>

                  {/* Missing Skills */}
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <XCircle size={17} className="text-red-500" />

                      <h3 className="text-sm font-semibold text-slate-900">
                        Missing Skills
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {match.missing_skills || "No missing skills found."}
                    </p>
                  </div>

                  {/* AI Explanation */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      AI Explanation
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {match.explanation || "No explanation available."}
                    </p>
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

export default CandidateDetails;
