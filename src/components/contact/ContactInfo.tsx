"use client";

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Điện thoại",
      details: ["0368103455"],
      description: "Gọi cho chúng tôi từ 8:00 - 22:00 (Hàng ngày)",
      color: "text-blue-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      details: ["lekhanhduc212003@gmail.com"],
      description: "Gửi email cho chúng tôi bất cứ lúc nào",
      color: "text-green-600",
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Địa chỉ",
      details: ["Đà Nẵng, Việt Nam"],
      description: "",
      color: "text-accent",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      url: "https://www.facebook.com/le.khanh.uc.10632",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "Zalo",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652L4.008 24l4.096-2.652C9.38 21.76 10.668 22 12 22c6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm.5 15h-1v-1h1v1zm0-2h-1V7h1v6z" />
        </svg>
      ),
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
          Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều kênh khác nhau
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

      {/* Social Media */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Kết nối với chúng tôi</h4>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-200 hover:scale-110`}
              aria-label={social.name}
            >
              <span className="text-white">
                {social.icon}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Contact */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Liên hệ nhanh</h4>
        <div className="space-y-3">
          <a
            href="tel:0368103455"
            className="flex items-center space-x-3 p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
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
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652L4.008 24l4.096-2.652C9.38 21.76 10.668 22 12 22c6.627 0 12-4.975 12-11.111C24 4.975 18.627 0 12 0zm.5 15h-1v-1h1v1zm0-2h-1V7h1v6z" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white">
              Chat Zalo: 0368103455
            </span>
          </a>

          <a
            href="mailto:lekhanhduc212003@gmail.com"
            className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              lekhanhduc212003@gmail.com
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
