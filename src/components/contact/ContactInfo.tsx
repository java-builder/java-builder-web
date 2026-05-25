"use client";

import { FaFacebookF, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiZalo } from "react-icons/si";

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: <FaPhoneAlt className="w-5 h-5" />,
      title: "Điện thoại",
      details: ["0368103455"],
      description: "Gọi cho chúng tôi từ 8:00 - 22:00 (Hàng ngày)",
      color: "text-blue-600",
    },
    {
      icon: <MdEmail className="w-6 h-6" />,
      title: "Email",
      details: ["lekhanhduc212003@gmail.com"],
      description: "Gửi email cho chúng tôi bất cứ lúc nào",
      color: "text-green-600",
    },
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Địa chỉ",
      details: ["Đà Nẵng, Việt Nam"],
      description: "",
      color: "text-accent",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF className="w-5 h-5" />,
      url: "https://www.facebook.com/le.khanh.uc.10632",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "Zalo",
      icon: <SiZalo className="w-5 h-5" />,
      url: "https://zalo.me/0368103455",
      color: "text-blue-500 hover:text-blue-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thông tin liên hệ
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Bạn có thể kết nối với mình qua email, Zalo hoặc Facebook
        </p>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => (
          <div key={index} className="flex items-start space-x-4">
            {method.icon && (
              <span
                className={`w-7 h-7 inline-flex items-center justify-center flex-shrink-0 ${method.color}`}
              >
                {method.icon}
              </span>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {method.title}
              </h4>
              <div className="space-y-1">
                {method.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 dark:text-gray-300 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
              {method.description && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{method.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Contact */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Liên hệ nhanh</h4>
        <div className="space-y-3">
          <a
            href="tel:0368103455"
            className="flex items-center space-x-3 p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors duration-200"
          >
            <FaPhoneAlt className="w-5 h-5 text-accent" />
            <span className="font-medium text-gray-900 dark:text-white">
              Gọi ngay: 0368103455
            </span>
          </a>

          <a
            href="https://zalo.me/0368103455"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <SiZalo className="w-6 h-6" />
            <span className="font-medium text-gray-900 dark:text-white">
              Chat Zalo: 0368103455
            </span>
          </a>

          <a
            href="mailto:lekhanhduc212003@gmail.com"
            className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
          >
            <MdEmail className="w-6 h-6" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              lekhanhduc212003@gmail.com
            </span>
          </a>

          <a
            href="https://www.facebook.com/le.khanh.uc.10632"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <FaFacebookF className="w-6 h-6" />
            <span className="font-medium text-gray-900 dark:text-white">
              Facebook
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
