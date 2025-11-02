'use client';

import { useState } from 'react';
import {
  FaFacebook,
  FaYoutube,
  FaPhone,
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
  FaDocker
} from 'react-icons/fa';
import MotionWrapper from '@/components/MotionWrapper';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('about');

  // Tech stack - các công nghệ chính tôi sử dụng
  const techStack = [
    { icon: FaCode, name: 'Java', description: 'Ngôn ngữ lập trình chính' },
    { icon: FaServer, name: 'Spring Boot', description: 'Framework phát triển ứng dụng' },
    { icon: FaLaptopCode, name: 'Microservice', description: 'Kiến trúc phân tán' },
    { icon: FaCloud, name: 'AWS', description: 'Dịch vụ điện toán đám mây' },
    { icon: FaDocker, name: 'Docker', description: 'Container hóa ứng dụng' },
    { icon: FaServer, name: 'CI/CD', description: 'Tự động hóa triển khai' },
  ];

  const tabButtons = [
    { id: 'about', label: 'Giới thiệu', icon: FaHeart },
    { id: 'contact', label: 'Liên hệ', icon: FaEnvelope },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Section */}
      <div className="relative bg-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          {/* Code snippets overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 text-orange-400 font-mono text-xs">
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-orange-500/20 bg-orange-500/10 flex items-center justify-center backdrop-blur-sm">
                <FaGraduationCap className="text-6xl text-orange-400" />
              </div>
              <h1 className="text-5xl font-bold mb-4">Lê Khánh Đức</h1>
              <p className="text-xl text-orange-300 mb-6">Java Developer & Founder of F Learning</p>
            </div>
          </MotionWrapper>

          {/* Tech Stack */}
          <MotionWrapper animation="fadeInUp" duration={1.0} delay={0.2} mode="mount">
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6 text-orange-300">Tech Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-4 md:p-6 hover:bg-orange-500/30 transition-all duration-300 cursor-pointer group">
                      <tech.icon className="text-2xl md:text-3xl mx-auto mb-2 md:mb-3 text-orange-300 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-lg md:text-xl font-bold mb-1 text-white">{tech.name}</div>
                      <div className="text-xs md:text-sm text-orange-200">{tech.description}</div>
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
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'text-orange-600 border-orange-600 bg-orange-50'
                  : 'text-gray-600 border-transparent hover:text-orange-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="text-lg" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* About Tab */}
        {activeTab === 'about' && (
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Câu chuyện của tôi</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Xin chào! Tôi là <strong>Lê Khánh Đức</strong>, một Java Developer đam mê với việc học hỏi
                    và chia sẻ kiến thức công nghệ.
                  </p>
                  <p>
                    Xuất phát từ niềm yêu thích lập trình và mong muốn giúp đỡ cộng đồng, tôi đã tạo ra
                    <strong> F Learning</strong> - một nền tảng học tập trực tuyến để chia sẻ những kiến thức
                    và kinh nghiệm mà tôi đã tích lũy được trong quá trình học tập và làm việc.
                  </p>
                  <p>
                    Tôi tin rằng việc học lập trình không chỉ là học syntax mà còn là học cách tư duy logic,
                    giải quyết vấn đề và xây dựng những sản phẩm có ý nghĩa. Hãy cùng nhau khám phá
                    thế giới công nghệ thú vị này!
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tại sao chọn F Learning?</h3>
                  <ul className="space-y-3">
                    {[
                      'Khóa học thực tế, dựa trên dự án thực tế',
                      'Hỗ trợ học viên 24/7 qua các kênh liên lạc',
                      'Cộng đồng học viên năng động và tích cực',
                      'Cập nhật liên tục với công nghệ mới nhất',
                      'Lộ trình học tập rõ ràng từ cơ bản đến nâng cao'
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <FaHeart className="text-orange-600 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FaMapMarkerAlt className="text-orange-600 text-lg" />
                      <span className="text-gray-600">Hà Nội, Việt Nam</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaBriefcase className="text-orange-600 text-lg" />
                      <span className="text-gray-600">Java Developer</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaCoffee className="text-orange-600 text-lg" />
                      <span className="text-gray-600">Coffee Lover & Tech Enthusiast</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaGraduationCap className="text-orange-600 text-lg" />
                      <span className="text-gray-600">Founder of F Learning Platform</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4">Triết lý giảng dạy</h3>
                  <blockquote className="italic">
                    &quot;Học lập trình không chỉ là học code, mà là học cách tư duy logic,
                    giải quyết vấn đề và không ngừng học hỏi. Mỗi dòng code bạn viết
                    đều là một bước tiến về phía trước.&quot;
                  </blockquote>
                </div>
              </div>
            </div>
          </MotionWrapper>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Liên hệ với tôi</h2>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div>
                  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin liên hệ</h3>
                    <div className="space-y-6">
                      <a
                        href="tel:0368103455"
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-orange-50 transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                          <FaPhone className="text-orange-600 text-lg" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Điện thoại / Zalo</p>
                          <p className="text-lg font-medium text-gray-800">0368 103 455</p>
                        </div>
                      </a>

                      <a
                        href="mailto:lekhanhduc@flearning.com"
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-orange-50 transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-300">
                          <FaEnvelope className="text-orange-600 text-lg" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-medium text-gray-800">lekhanhduc@flearning.com</p>
                        </div>
                      </a>

                      <div className="flex items-center gap-4 p-4 rounded-lg">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FaMapMarkerAlt className="text-orange-600 text-lg" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p className="text-lg font-medium text-gray-800">Hà Nội, Việt Nam</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Kết nối với tôi</h3>
                    <div className="space-y-4">
                      <a
                        href="https://www.facebook.com/le.khanh.uc.10632"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                          <FaFacebook className="text-blue-600 text-xl" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800">Facebook</p>
                          <p className="text-sm text-gray-500">Theo dõi để cập nhật thông tin mới nhất</p>
                        </div>
                      </a>

                      <a
                        href="https://www.youtube.com/@lekhanhduc-212"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-red-50 transition-colors duration-300 group"
                      >
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                          <FaYoutube className="text-red-600 text-xl" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800">YouTube Channel</p>
                          <p className="text-sm text-gray-500">Java Developer - Kênh chia sẻ kiến thức lập trình</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Gửi tin nhắn cho tôi</h3>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                          placeholder="Nhập email của bạn"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                          placeholder="Nhập số điện thoại của bạn"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tin nhắn</label>
                        <textarea
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300"
                          placeholder="Nhập tin nhắn của bạn..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        Gửi tin nhắn
                      </button>
                    </form>
                  </div>

                  <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white text-center">
                    <FaHeart className="text-3xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Hỗ trợ học viên 24/7</h3>
                    <p className="text-orange-100">
                      Tôi luôn sẵn sàng hỗ trợ và giải đáp thắc mắc của các bạn học viên.
                      Đừng ngại liên hệ với tôi qua bất kỳ kênh nào bạn thấy thuận tiện!
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