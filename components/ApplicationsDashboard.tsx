"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Award
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
    title: string;
    slug: string;
  } | null;
}

export default function ApplicationsDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const fetchApplications = useCallback(async () => {
    try {
      const url = filter === "all" 
        ? "/api/admin/applications" 
        : `/api/admin/applications?status=${filter}`;
      
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
    } catch (error) {
      setError("Failed to load applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusUpdate = async (id: string, status: "accepted" | "rejected", notes?: string) => {
    try {
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

      // Refresh applications
      fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      alert("Failed to update application status");
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const icons = {
      pending: <Clock className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {icons[status as keyof typeof icons] || icons.pending}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "accepted", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {filter === "all" 
              ? "No job applications have been submitted yet." 
              : `No ${filter} applications found.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{application.email}</div>
                    <div className="text-sm text-gray-500">{application.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-primary hover:text-primary-dark transition-colors mr-4"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">
                Application Details
              </h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Name</div>
                      <div className="text-gray-900">{selectedApplication.firstName} {selectedApplication.lastName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <div className="text-gray-900">{selectedApplication.email}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </div>
                      <div className="text-gray-900">{selectedApplication.phone}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Position
                      </div>
                      <div className="text-gray-900">{selectedApplication.positionTitle}</div>
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}

              {/* Resume */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume</h3>
                <a
                  href={selectedApplication.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  <Download className="h-5 w-5" />
                  Download Resume
                </a>
              </div>

              {/* Status Actions */}
              {selectedApplication.status === "pending" && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Application</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, "accepted")}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedApplication.status !== "pending" && (
                <div className="border-t pt-6">
                  <div className="text-sm text-gray-500">
                    Status: {getStatusBadge(selectedApplication.status)}
                    {selectedApplication.reviewedAt && (
                      <div className="mt-2">
                        Reviewed on: {new Date(selectedApplication.reviewedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

