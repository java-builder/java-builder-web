"use client";

import { useState } from "react";

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface ContactFormProps {
    onSubmit: (data: ContactFormData) => void;
    isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
}

export default function ContactForm({
  onSubmit,
  isSubmitting,
  submitStatus,
}: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    });

    const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
        const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactFormData> = {};

        if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
        }

        if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
        }

        if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
        }

        if (!formData.subject.trim()) {
      newErrors.subject = "Vui lòng chọn chủ đề";
        }

        if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung tin nhắn";
        } else if (formData.message.trim().length < 10) {
      newErrors.message = "Tin nhắn phải có ít nhất 10 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div>
            {/* Success/Error Messages */}
      {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
                        </svg>
                        <p className="text-green-800 font-medium">
              Cảm ơn bạn! Tin nhắn đã được gửi thành công. Chúng tôi sẽ phản hồi
              sớm nhất có thể.
                        </p>
                    </div>
                </div>
            )}

      {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
                        </svg>
                        <p className="text-red-800 font-medium">
                            Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                        </p>
                    </div>
                </div>
            )}

      <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 ${
                errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="Nhập họ và tên của bạn"
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 ${
                errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="your.email@example.com"
                            disabled={isSubmitting}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Phone and Subject Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 ${
                errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            placeholder="0123 456 789"
                            disabled={isSubmitting}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
                            Chủ đề <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 ${
                errors.subject ? "border-red-300 bg-red-50" : "border-gray-300"
                                }`}
                            disabled={isSubmitting}
                        >
                            <option value="">Chọn chủ đề</option>
                            <option value="general">Câu hỏi chung</option>
                            <option value="support">Hỗ trợ kỹ thuật</option>
                            <option value="course">Về khóa học</option>
                            <option value="blog">Về blog</option>
                            <option value="partnership">Hợp tác</option>
                            <option value="feedback">Góp ý</option>
                            <option value="other">Khác</option>
                        </select>
                        {errors.subject && (
                            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                        )}
                    </div>
                </div>

                {/* Message */}
                <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
                        Nội dung tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-150 resize-none ${
              errors.message ? "border-red-300 bg-red-50" : "border-gray-300"
                            }`}
                        placeholder="Hãy mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.message && (
                            <p className="text-sm text-red-600">{errors.message}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                            {formData.message.length}/500 ký tự
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
        <div className="flex items-center justify-end pt-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
            className="px-5 py-2 bg-gradient-to-r from-accent to-accent-600 text-white font-medium rounded-md hover:from-accent-600 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm"
                    >
            {isSubmitting ? "Đang gửi..." : "Gửi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
