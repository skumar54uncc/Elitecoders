"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const serviceOptions = [
  "Surgical & office visit coding",
  "Claims management & appeals",
  "Affidavits & legal support",
  "Documentation audits & physician education",
  "Practice workflow & process support",
];

const roleOptions = [
  "Surgeon",
  "Practice Manager",
  "Hospital Admin",
  "Attorney",
  "Other",
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    servicesNeeded: [] as string[],
    message: "",
    phiAcknowledgment: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter((s) => s !== service)
        : [...prev.servicesNeeded, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    // Client-side validation
    if (!formData.name || !formData.email || !formData.organization || !formData.role || !formData.message) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.phiAcknowledgment) {
      setErrorMessage("Please acknowledge that you understand not to submit PHI via this form.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit form");
      }

      const result = await response.json();
      
      // Check if emails were sent successfully
      if (result.emailSent === false && result.emailErrors) {
        console.error("Email sending errors:", result.emailErrors);
        // Still show success for form submission, but log email errors
        setErrorMessage(
          "Form submitted successfully, but there was an issue sending confirmation emails. Please check server logs."
        );
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        organization: "",
        role: "",
        servicesNeeded: [],
        message: "",
        phiAcknowledgment: false,
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred. Please try again or call us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h3 className="mt-4 text-xl font-semibold text-green-900">Thank You!</h3>
        <p className="mt-2 text-green-700">
          We&apos;ve received your message and will get back to you within 1 business day. Check your email for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-primary">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary">
          Work Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-primary">
          Organization / Practice <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          required
          value={formData.organization}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-primary">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
        >
          <option value="">Select your role</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary">
          What do you need help with? <span className="text-red-500">*</span>
        </label>
        <div className="mt-2 space-y-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.servicesNeeded.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
              />
              <span className="ml-2 text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-primary">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-accent"
        />
      </div>

      <div>
        <label className="flex items-start">
          <input
            type="checkbox"
            name="phiAcknowledgment"
            required
            checked={formData.phiAcknowledgment}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span className="ml-2 text-sm text-gray-700">
            I understand that this form is not for submitting patient-identifying information (PHI).{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {submitStatus === "error" && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-accent px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}

