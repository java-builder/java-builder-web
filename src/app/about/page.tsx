"use client";

import { useState, useCallback } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaCoffee,
  FaHeart,
  FaLaptopCode,
  FaServer,
  FaCloud,
  FaDocker,
} from "react-icons/fa";
import MotionWrapper from "@/components/MotionWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("about");
  const handleContactSubmit = useCallback(async (data: unknown) => {
    // simple submission handler: replace with real API
    console.log("About page contact submit", data);

    alert("Tin nhắn của bạn đã được gửi. Cảm ơn!");
  }, []);

  // Tech stack - các công nghệ chính tôi sử dụng
  const techStack = [
    { icon: FaCode, name: "Java", description: "Ngôn ngữ lập trình chính" },
    {
      icon: FaServer,
      name: "Spring Boot",
      description: "Framework phát triển ứng dụng",
    },
    {
      icon: FaLaptopCode,
      name: "Microservice",
      description: "Kiến trúc phân tán",
    },
    { icon: FaCloud, name: "AWS", description: "Dịch vụ điện toán đám mây" },
    { icon: FaDocker, name: "Docker", description: "Container hóa ứng dụng" },
    { icon: FaServer, name: "CI/CD", description: "Tự động hóa triển khai" },
  ];

  const tabButtons = [
    { id: "about", label: "Giới thiệu", icon: FaHeart },
    { id: "contact", label: "Liên hệ", icon: FaEnvelope },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-white to-blue-50 text-gray-900 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          {/* Code snippets overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 text-blue-400 font-mono text-xs">
              <div>const about = {`{`}</div>
              <div>&nbsp;&nbsp;name: &quot;Lê Khánh Đức&quot;,</div>
              <div>&nbsp;&nbsp;role: &quot;Java Developer&quot;</div>
              <div>{`}`};</div>
            </div>
            <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
              <div>function teach() {`{`}</div>
              <div>&nbsp;&nbsp;return &quot;knowledge&quot;;</div>
              <div>{`}`}</div>
            </div>
            <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
              <div>if (passion) {`{`}</div>
              <div>&nbsp;&nbsp;share();</div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              <div className="lg:col-span-7 text-gray-900">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
                  Lê Khánh Đức
                </h1>
                <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
                  Java Developer & Founder of F Learning
                </p>
                <p className="text-sm sm:text-base text-gray-700 max-w-2xl">
                  Tôi là một Java Developer đam mê chia sẻ kiến thức, xây dựng
                  khóa học thực tế và giúp cộng đồng phát triển.
                </p>
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="#tech"
                    className="inline-flex items-center justify-center px-5 py-3 bg-accent hover:bg-accent-600 text-white rounded-md font-medium shadow text-sm sm:text-base"
                  >
                    Xem Tech Stack
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Liên hệ
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full border-4 border-accent/20 bg-accent/10 flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <FaGraduationCap className="text-5xl sm:text-6xl text-accent" />
                </div>
              </div>
            </div>
          </MotionWrapper>

          {/* Tech Stack */}
          <MotionWrapper
            animation="fadeInUp"
            duration={1.0}
            delay={0.2}
            mode="mount"
          >
            <div className="mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                Tech Stack
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer group">
                      <tech.icon className="text-xl sm:text-2xl md:text-3xl mx-auto mb-2 md:mb-3 text-accent group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 text-gray-900">
                        {tech.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 hidden sm:block">
                        {tech.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "text-accent border-accent bg-blue-50"
                    : "text-gray-600 border-transparent hover:text-accent hover:bg-gray-50"
                }`}
              >
                <tab.icon className="text-base sm:text-lg" />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* About Tab */}
        {activeTab === "about" && (
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Câu chuyện của tôi
                </h2>
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Xin chào! Tôi là <strong>Lê Khánh Đức</strong>, một Java
                    Developer đam mê với việc học hỏi và chia sẻ kiến thức công
                    nghệ.
                  </p>
                  <p>
                    Xuất phát từ niềm yêu thích lập trình và mong muốn giúp đỡ
                    cộng đồng, tôi đã tạo ra
                    <strong> F Learning</strong> - một nền tảng học tập trực
                    tuyến để chia sẻ những kiến thức và kinh nghiệm mà tôi đã
                    tích lũy được trong quá trình học tập và làm việc.
                  </p>
                  <p>
                    Tôi tin rằng việc học lập trình không chỉ là học syntax mà
                    còn là học cách tư duy logic, giải quyết vấn đề và xây dựng
                    những sản phẩm có ý nghĩa. Hãy cùng nhau khám phá thế giới
                    công nghệ thú vị này!
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Tại sao chọn F Learning?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Khóa học thực tế, dựa trên dự án thực tế",
                      "Hỗ trợ học viên 24/7 qua các kênh liên lạc",
                      "Cộng đồng học viên năng động và tích cực",
                      "Cập nhật liên tục với công nghệ mới nhất",
                      "Lộ trình học tập rõ ràng từ cơ bản đến nâng cao",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <FaHeart className="text-accent flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Thông tin cá nhân
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FaMapMarkerAlt className="text-accent text-lg" />
                      <span className="text-gray-600">Đà Nẵng, Việt Nam</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaBriefcase className="text-accent text-lg" />
                      <span className="text-gray-600">Java Developer</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaCoffee className="text-accent text-lg" />
                      <span className="text-gray-600">
                        Coffee Lover & Tech Enthusiast
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaGraduationCap className="text-accent text-lg" />
                      <span className="text-gray-600">
                        Founder of F Learning Platform
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-accent to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4">
                    Triết lý giảng dạy
                  </h3>
                  <blockquote className="italic">
                    &quot;Học lập trình không chỉ là học code, mà là học cách tư
                    duy logic, giải quyết vấn đề và không ngừng học hỏi. Mỗi
                    dòng code bạn viết đều là một bước tiến về phía trước.&quot;
                  </blockquote>
                </div>
              </div>
            </div>
          </MotionWrapper>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">
                Liên hệ với tôi
              </h2>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* Left: Contact info (reuse component) */}
                <div>
                  <ContactInfo />
                </div>

                {/* Right: Contact form (reuse component) */}
                <div>
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                      Gửi tin nhắn cho tôi
                    </h3>
                    <ContactForm
                      onSubmit={handleContactSubmit}
                      isSubmitting={false}
                      submitStatus="idle"
                    />
                  </div>

                  <div className="mt-4 sm:mt-6 bg-gradient-to-r from-accent to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white text-center">
                    <FaHeart className="text-xl sm:text-2xl mx-auto mb-2 sm:mb-3" />
                    <h3 className="text-base sm:text-lg font-semibold mb-1">
                      Hỗ trợ học viên 24/7
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Tôi luôn sẵn sàng hỗ trợ và giải đáp thắc mắc của các bạn
                      học viên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        )}
      </div>

      <Footer />
    </div>
  );
}
