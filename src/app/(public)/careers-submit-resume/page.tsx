"use client";
import React, { useState, useRef } from "react";
import { ArrowRight, FileText } from "lucide-react";
import ResumeSubmitted from "../components/sections/ResumeSubmitted";

const SubmitResume = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
  });

  const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

  const formFields = [
    { label: "First Name", type: "text", placeholder: "John", name: "firstName" },
    { label: "Last Name", type: "text", placeholder: "Doe", name: "lastName" },
    { label: "Email Address", type: "email", placeholder: "johndoe@mail.com", name: "email" },
    { label: "Telephone", type: "tel", placeholder: "+92 xxx xxxxxxx", name: "telephone" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, resume: "File size must be less than 4MB" }));
        e.target.value = "";
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: "Only PDF, DOC, or DOCX files are allowed" }));
        e.target.value = "";
        return;
      }

      setResumeFile(file);
      setFileName(file.name);
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors(prev => ({ ...prev, resume: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Telephone number is required";
    }
    if (!resumeFile) {
      newErrors.resume = "Please upload your resume";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("firstName", formData.firstName);
      submitFormData.append("lastName", formData.lastName);
      submitFormData.append("email", formData.email);
      submitFormData.append("telephone", formData.telephone);
      submitFormData.append("experienceLevel", ""); // Optional field
      submitFormData.append("resume", resumeFile as File);

      const response = await fetch("/api/career", {
        method: "POST",
        body: submitFormData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form
        setFormData({ firstName: "", lastName: "", email: "", telephone: "",});
        setResumeFile(null);
        setFileName("");
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        setShowSubmitted(true);
        
        // Scroll to top of submitted section
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      } else {
        setErrors({ submit: result.message || "Error submitting application. Please try again." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset and show form again
  const handleSubmitAnother = () => {
    setShowSubmitted(false);
    setFormData({ firstName: "", lastName: "", email: "", telephone: "", });
    setResumeFile(null);
    setFileName("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="font-dm-sans relative w-full max-w-7xl mx-auto px-6 md:px-16 bg-[#F9F9F9] ">
        {/* Upload Resume Section - Only show if not submitted */}
        {!showSubmitted && (
          <div className="py-8 lg:py-16">
            <div className="flex items-center gap-2 text-slate-gray text-[11px] xs:text-sm lg:text-base 2xl:text-xl 4xl:text-2xl">
              <span>Careers</span>
              <ArrowRight size={16} />
              <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent font-medium">
                Send your resume
              </span>
              <ArrowRight size={16} />
              <span>Submitted</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8 lg:mt-20">
              <div className="lg:col-span-2 max-w-md">
                <h2 className="text-xl lg:text-3xl 2xl:text-4xl 4xl:text-[44px] lg:leading-11 2xl:leading-13 4xl:leading-16 font-medium text-dark-gray , max-w-60 lg:max-w-80 2xl:max-w-md 4xl:max-w-full">
                  Invest in your Career, Grow with Hexa Ai
                </h2>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-3">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  {/* Display submit error if any */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 text-danger-soft px-4 py-3 rounded-lg text-sm">
                      {errors.submit}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                      <div key={index}>
                        <label className="block text-xs 2xl:text-sm font-medium text-dark-gray mb-1.5">
                          {field.label} <span className="text-danger-soft">*</span>
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          disabled={isSubmitting}
                          className={`w-full text-slate-gray text-xs 2xl:text-sm bg-white border ${
                            errors[field.name] ? 'border-danger-soft' : 'border-none'
                          } outline-none shadow-md shadow-blue-100 px-4 py-2.5 2xl:py-3 rounded-lg disabled:opacity-50`}
                          required
                        />
                        {errors[field.name] && (
                          <p className="text-danger-soft text-xs mt-1">{errors[field.name]}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Resume Upload Section */}
                  <div>
                    <div className="flex items-center gap-4">
                      {!fileName && (
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          disabled={isSubmitting}
                          className="block text-xs 2xl:text-sm font-medium hover:underline text-cyan-blue cursor-pointer bg-transparent p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Upload Resume
                        </button>
                      )}
                      <FileText className="text-slate-gray" size={20} />
                      {fileName && (
                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={isSubmitting}
                          className="block text-xs 2xl:text-sm font-medium text-success hover:underline cursor-pointer bg-transparent p-0 disabled:opacity-50"
                        >
                          Resume uploaded
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                    />
                    <p className="text-slate-gray text-[10px] 2xl:text-xs mt-1">
                      Only PDF or Word files are allowed (Max size: 4MB)
                    </p>
                    {errors.resume && (
                      <p className="text-danger-soft text-xs mt-1">{errors.resume}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-dark-gray text-white px-4 py-3.5 rounded-lg font-medium text-sm 2xl:text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#444444] transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showSubmitted && (
          <ResumeSubmitted/>
        )}

      </div>
    </>
  );
};

export default SubmitResume;