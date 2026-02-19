"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaShieldAlt, FaLock, FaKey, FaUserShield } from "react-icons/fa";

const securityTopics = [
  {
    icon: FaLock,
    title: "Authentication",
    description: "Xác thực người dùng",
    items: ["Form Login", "HTTP Basic", "JWT Token", "OAuth2 & OpenID Connect"]
  },
  {
    icon: FaUserShield,
    title: "Authorization",
    description: "Phân quyền truy cập",
    items: ["Role-Based Access Control", "Method Security", "@PreAuthorize", "Permission-Based"]
  },
  {
    icon: FaKey,
    title: "Security Features",
    description: "Tính năng bảo mật",
    items: ["Password Encoding", "CORS Configuration", "CSRF Protection", "Session Management"]
  },
  {
    icon: FaShieldAlt,
    title: "Advanced Topics",
    description: "Chủ đề nâng cao",
    items: ["Custom Filters", "Security Context", "Remember Me", "Two-Factor Authentication"]
  }
];

const implementations = [
  {
    title: "JWT Authentication",
    description: "Xây dựng hệ thống xác thực với JWT Token",
    features: ["Login/Register", "Token Generation", "Token Validation", "Refresh Token"]
  },
  {
    title: "OAuth2 Integration",
    description: "Tích hợp đăng nhập với Google, Facebook, GitHub",
    features: ["OAuth2 Client", "Social Login", "User Info Extraction", "Account Linking"]
  },
  {
    title: "Role-Based System",
    description: "Hệ thống phân quyền theo vai trò",
    features: ["User Roles", "Permissions", "Method Security", "Dynamic Authorization"]
  }
];

export default function SpringSecuritySection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <FaShieldAlt className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Security</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Spring Security
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Framework bảo mật mạnh mẽ cho ứng dụng Spring, cung cấp authentication và authorization toàn diện
            </p>
          </div>
        </MotionWrapper>

        {/* Security Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityTopics.map((topic, index) => (
            <MotionWrapper key={index} animation="fadeInUp" delay={index * 0.1} duration={0.6}>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <topic.icon className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {topic.description}
                </p>
                <ul className="space-y-1">
                  {topic.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Implementation Examples */}
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Triển khai thực tế
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {implementations.map((impl, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h4 className="text-xl font-bold mb-2">{impl.title}</h4>
                  <p className="text-blue-100 text-sm mb-4">{impl.description}</p>
                  <ul className="space-y-2">
                    {impl.features.map((feature, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <FaShieldAlt className="text-blue-200 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-blue-100 mb-4">
                Sau khi hoàn thành, bạn sẽ có thể xây dựng hệ thống bảo mật hoàn chỉnh cho ứng dụng của mình
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">JWT</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">OAuth2</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">RBAC</span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm">2FA</span>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
