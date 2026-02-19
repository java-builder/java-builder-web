"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaLeaf, FaCheckCircle, FaBook, FaCode } from "react-icons/fa";

const modules = [
  {
    title: "Spring Core & IoC",
    topics: ["Dependency Injection", "Bean Lifecycle", "ApplicationContext", "Component Scanning"]
  },
  {
    title: "Spring MVC",
    topics: ["Controllers & RequestMapping", "Request/Response Handling", "View Resolvers", "Form Validation"]
  },
  {
    title: "Spring Data JPA",
    topics: ["Repository Pattern", "Query Methods", "Custom Queries", "Pagination & Sorting"]
  },
  {
    title: "RESTful API",
    topics: ["REST Principles", "HTTP Methods", "Status Codes", "HATEOAS"]
  },
  {
    title: "Exception Handling",
    topics: ["@ControllerAdvice", "Custom Exceptions", "Error Response", "Global Exception Handler"]
  },
  {
    title: "Testing",
    topics: ["JUnit 5", "Mockito", "@SpringBootTest", "MockMvc"]
  }
];

const projects = [
  "Blog API với CRUD operations",
  "E-commerce Product Management",
  "Task Management System",
  "Social Media API"
];

export default function SpringBootSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <FaLeaf className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Spring Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Spring Boot Framework
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Framework mạnh mẽ nhất để xây dựng ứng dụng Java production-ready với cấu hình tối thiểu
            </p>
          </div>
        </MotionWrapper>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Modules */}
          <MotionWrapper animation="fadeInLeft" duration={0.6}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FaBook className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Modules chính
                </h3>
              </div>

              <div className="grid gap-4">
                {modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {module.title}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionWrapper>

          {/* Projects & Skills */}
          <MotionWrapper animation="fadeInRight" duration={0.6}>
            <div className="space-y-6">
              {/* Projects */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <FaCode className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Dự án thực hành
                  </h3>
                </div>

                <ul className="space-y-3">
                  {projects.map((project, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{project}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Skills */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Kỹ năng đạt được
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 flex-shrink-0" />
                    <span>Xây dựng RESTful API hoàn chỉnh</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 flex-shrink-0" />
                    <span>Tích hợp Database với JPA/Hibernate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 flex-shrink-0" />
                    <span>Xử lý Exception và Validation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 flex-shrink-0" />
                    <span>Viết Unit Test và Integration Test</span>
                  </li>
                </ul>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
