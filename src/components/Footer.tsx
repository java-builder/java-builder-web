"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 border-t border-accent mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2.5 mb-4">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/logos/java-logo.png"
                  alt="Learning Platform"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="text-[0.7rem] font-semibold text-gray-400 tracking-wider uppercase leading-tight">
                Learning Platform
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md mb-6">
              Nền tảng học tập trực tuyến hàng đầu Việt Nam, giúp bạn phát triển
              kỹ năng và thăng tiến trong sự nghiệp.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/le.khanh.uc.10632"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="Facebook"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center transition-all duration-300 group-hover:from-[#1877F2] group-hover:to-[#0C63D4] group-hover:shadow-lg group-hover:shadow-blue-500/50 group-hover:-translate-y-1">
                  <svg
                    className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@lekhanhduc-212"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="YouTube"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center transition-all duration-300 group-hover:from-[#FF0000] group-hover:to-[#CC0000] group-hover:shadow-lg group-hover:shadow-red-500/50 group-hover:-translate-y-1">
                  <svg
                    className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/lekhanhduc212003/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="LinkedIn"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center transition-all duration-300 group-hover:from-[#0A66C2] group-hover:to-[#004182] group-hover:shadow-lg group-hover:shadow-blue-400/50 group-hover:-translate-y-1">
                  <svg
                    className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Khóa học
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Bài viết
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Hỗ trợ
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-accent text-sm transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Learning Platform. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Được phát triển với</span>
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-300 text-sm font-medium">
                tại Việt Nam
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
