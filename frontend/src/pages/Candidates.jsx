import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Eye, Loader2, UserRound } from "lucide-react";

import api from "../services/api";

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/candidates");

      setCandidates(response.data);
    } catch (error) {
      console.error("Failed to load candidates:", error);

      setError(error.response?.data?.detail || "Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() || "";
      const email = candidate.email?.toLowerCase() || "";
      const skills = candidate.skills?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        skills.includes(searchValue)
      );
    });
  }, [candidates, search]);

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
    if (!status) {
      return "UNDER REVIEW";
    }

    return status.replaceAll("_", " ");
  };

  const getMatchStyle = (score) => {
    if (score === null || score === undefined) {
      return "bg-slate-100 text-slate-500";
    }

    if (score >= 80) {
      return "bg-emerald-50 text-emerald-600";
    }

    if (score >= 60) {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-red-50 text-red-600";
  };

  const formatMatchScore = (score) => {
    if (score === null || score === undefined) {
      return "Not analyzed";
    }

    return `${Math.round(score)}%`;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <Loader2 size={30} className="mx-auto animate-spin text-blue-600" />

            <p className="mt-3 text-sm text-slate-500">Loading candidates...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage AI-screened candidates.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5">
              <Users size={18} className="text-blue-600" />

              <span className="text-sm font-medium text-blue-600">
                {candidates.length} Candidates
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidates..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Candidate List</h2>

            <p className="mt-1 text-xs text-slate-500">
              Candidates processed through the AI screening pipeline.
            </p>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="p-10 text-center">
              <UserRound size={34} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm font-medium text-slate-600">
                {search
                  ? "No candidates found."
                  : "No candidates available yet."}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {search
                  ? "Try a different search."
                  : "Upload a resume to create a candidate."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Candidate
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        AI Match
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                              {candidate.name
                                ? candidate.name
                                    .split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "NA"}
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {candidate.name || "Unknown Candidate"}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Candidate #{candidate.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {candidate.email || "Not available"}
                          </p>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <p className="truncate text-sm text-slate-600">
                            {candidate.skills || "Not available"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getMatchStyle(
                              candidate.match_score,
                            )}`}>
                            {formatMatchScore(candidate.match_score)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                              candidate.review_status,
                            )}`}>
                            {formatStatus(candidate.review_status)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(`/candidates/${candidate.id}`)
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50">
                            <Eye size={16} />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                          {candidate.name
                            ? candidate.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {candidate.name || "Unknown Candidate"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {candidate.email || "Email not available"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          candidate.review_status,
                        )}`}>
                        {formatStatus(candidate.review_status)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          AI Match
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMatchStyle(
                            candidate.match_score,
                          )}`}>
                          {formatMatchScore(candidate.match_score)}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Skills
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {candidate.skills || "Not available"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/candidates/${candidate.id}`)}
                      className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Candidates;
