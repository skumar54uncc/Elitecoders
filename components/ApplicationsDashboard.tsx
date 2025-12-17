"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  X,
  Clock, 
  Download,
  Eye,
  Loader2,
  Briefcase,
  Award,
  Search,
  Filter,
  Users,
  Edit3,
  ArrowUpDown,
  RotateCcw
} from "lucide-react";

interface JobApplication {
  id: string;
  careerPostId: string | null;
  positionTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string | null;
  experience: string | null;
  certifications: string | null;
  status: string;
  notes: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  careerPost: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

interface JobPosting {
  id: string;
  title: string;
  _count: {
    applications: number;
  };
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export default function ApplicationsDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (jobFilter !== "all") params.append("jobId", jobFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortOrder);
      
      const url = `/api/admin/applications?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);
      setJobPostings(data.jobPostings || []);
    } catch (error) {
      setError("Failed to load applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, jobFilter, searchQuery, sortOrder, router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchApplications]);

  const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      setSuccess("Application updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
      // Refresh applications
      fetchApplications();
      setSelectedApplication(null);
      setEditMode(false);
    } catch (error) {
      setError("Failed to update application status");
      setTimeout(() => setError(""), 3000);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const openEditMode = (application: JobApplication) => {
    setEditMode(true);
    setEditStatus(application.status);
    setEditNotes(application.notes || "");
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setJobFilter("all");
    setSearchQuery("");
    setSortOrder("desc");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      accepted: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };

    const icons = {
      pending: <Clock className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {icons[status as keyof typeof icons] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Job Filter */}
          <div className="w-full lg:w-64">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Positions</option>
              {jobPostings.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job._count.applications})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title={sortOrder === "desc" ? "Newest first" : "Oldest first"}
          >
            <ArrowUpDown className="h-5 w-5" />
            {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
          {error}
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          {success}
          <button onClick={() => setSuccess("")} className="text-green-500 hover:text-green-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Applications Table */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "all" || jobFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "No job applications have been submitted yet."}
          </p>
          {(searchQuery || statusFilter !== "all" || jobFilter !== "all") && (
            <button
              onClick={resetFilters}
              className="mt-4 text-primary hover:text-primary-dark font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.firstName} {application.lastName}
                      </div>
                      {application.experience && (
                        <div className="text-sm text-gray-500">{application.experience}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.positionTitle}</div>
                      {application.careerPost && (
                        <div className="text-xs text-gray-500">
                          via {application.careerPost.title}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setEditMode(false);
                          }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Download resume"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Results count */}
          <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
            Showing {applications.length} application{applications.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-primary">
                Application Details
              </h2>
              <div className="flex items-center gap-2">
                {!editMode && (
                  <button
                    onClick={() => openEditMode(selectedApplication)}
                    className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Edit application"
                  >
                    <Edit3 className="h-5 w-5" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    setEditMode(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Current Status:</span>
                {getStatusBadge(selectedApplication.status)}
                {selectedApplication.reviewedAt && (
                  <span className="text-sm text-gray-400">
                    (Reviewed {new Date(selectedApplication.reviewedAt).toLocaleDateString()})
                  </span>
                )}
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Applicant Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Name</div>
                      <div className="text-gray-900 font-medium">
                        {selectedApplication.firstName} {selectedApplication.lastName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <a 
                        href={`mailto:${selectedApplication.email}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        {selectedApplication.email}
                      </a>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <a 
                        href={`tel:${selectedApplication.phone}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        {selectedApplication.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Position Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Position</div>
                      <div className="text-gray-900 font-medium">{selectedApplication.positionTitle}</div>
                    </div>
                    {selectedApplication.experience && (
                      <div>
                        <div className="text-sm font-medium text-gray-500">Experience</div>
                        <div className="text-gray-900">{selectedApplication.experience}</div>
                      </div>
                    )}
                    {selectedApplication.certifications && (
                      <div>
                        <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Certifications
                        </div>
                        <div className="text-gray-900">{selectedApplication.certifications}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied On
                      </div>
                      <div className="text-gray-900">
                        {new Date(selectedApplication.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter / Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApplication.notes && !editMode && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Notes</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap border border-yellow-200">
                    {selectedApplication.notes}
                  </div>
                </div>
              )}

              {/* Resume */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume</h3>
                <div className="flex gap-4">
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    <Download className="h-5 w-5" />
                    Download Resume
                  </a>
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                    View in New Tab
                  </a>
                </div>
              </div>

              {/* Edit Mode */}
              {editMode && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Application</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-3">
                      {["pending", "accepted", "rejected"].map((status) => (
                        <button
                          key={status}
                          onClick={() => setEditStatus(status)}
                          className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                            editStatus === status
                              ? status === "accepted"
                                ? "bg-green-600 text-white"
                                : status === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={4}
                      placeholder="Add notes about this application..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, editStatus, editNotes || undefined)}
                      disabled={updating}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      disabled={updating}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions (when not in edit mode) */}
              {!editMode && selectedApplication.status === "pending" && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, "accepted")}
                      disabled={updating}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                      disabled={updating}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Or click &quot;Edit&quot; to add notes before updating status
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
