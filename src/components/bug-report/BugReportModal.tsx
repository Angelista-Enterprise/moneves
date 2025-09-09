"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  useBugReports,
  BugReportFormData,
  BugCategory,
  BugSeverity,
} from "@/lib/bug-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  X,
  Camera,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bug,
} from "lucide-react";

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<BugReportFormData>;
}

export function BugReportModal({
  isOpen,
  onClose,
  initialData,
}: BugReportModalProps) {
  const { data: session } = useSession();
  const { createReport, takeScreenshot, categoryOptions, severityOptions } =
    useBugReports();

  const [formData, setFormData] = useState<BugReportFormData>({
    title: "",
    description: "",
    category: "other",
    severity: "medium",
    steps: [""],
    expectedBehavior: "",
    actualBehavior: "",
    screenshot: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        steps: initialData.steps || [""],
      }));
    }
  }, [initialData]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        category: "other",
        severity: "medium",
        steps: [""],
        expectedBehavior: "",
        actualBehavior: "",
        screenshot: undefined,
      });
      setIsSuccess(false);
      setError("");
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof BugReportFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData((prev) => ({
      ...prev,
      steps: newSteps,
    }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const newSteps = formData.steps.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        steps: newSteps,
      }));
    }
  };

  const handleTakeScreenshot = async () => {
    try {
      const screenshot = await takeScreenshot();
      if (screenshot) {
        setFormData((prev) => ({
          ...prev,
          screenshot,
        }));
      }
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError("Please provide a title for the bug report");
        return;
      }

      if (!formData.description.trim()) {
        setError("Please provide a description of the issue");
        return;
      }

      // Filter out empty steps
      const validSteps = formData.steps.filter((step) => step.trim() !== "");

      const reportData: BugReportFormData = {
        ...formData,
        steps: validSteps,
      };

      await createReport(reportData, session?.user?.id);
      setIsSuccess(true);

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit bug report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Report a Bug
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Help us improve by reporting issues you encounter
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Bug report submitted successfully! Thank you for helping us
                  improve.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Title *
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Brief description of the issue"
                className="w-full"
                required
              />
            </div>

            {/* Category and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Category
                </Label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value as BugCategory)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Severity
                </Label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    handleInputChange("severity", e.target.value as BugSeverity)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {severityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Description *
              </Label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe the issue in detail..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                required
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Steps to Reproduce
              </Label>
              <div className="space-y-2">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <Input
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addStep}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>
            </div>

            {/* Expected vs Actual Behavior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Expected Behavior
                </Label>
                <textarea
                  value={formData.expectedBehavior}
                  onChange={(e) =>
                    handleInputChange("expectedBehavior", e.target.value)
                  }
                  placeholder="What should have happened?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Actual Behavior
                </Label>
                <textarea
                  value={formData.actualBehavior}
                  onChange={(e) =>
                    handleInputChange("actualBehavior", e.target.value)
                  }
                  placeholder="What actually happened?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Screenshot */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Screenshot (Optional)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTakeScreenshot}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Take Screenshot
                </Button>
                {formData.screenshot && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Screenshot captured
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting || isSuccess}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
