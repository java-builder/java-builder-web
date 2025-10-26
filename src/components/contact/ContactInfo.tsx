'use client';

export default function ContactInfo() {
    const contactMethods = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Điện thoại',
            details: ['0368103455'],
            description: 'Gọi cho chúng tôi từ 8:00 - 17:00 (T2-T6)',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email',
            details: ['lekhanhduc212003@gmail.com'],
            description: 'Gửi email cho chúng tôi bất cứ lúc nào',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Địa chỉ',
            details: ['123 Đường ABC, Quận XYZ', 'TP. Hồ Chí Minh, Việt Nam'],
            description: 'Đến thăm văn phòng của chúng tôi',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Giờ làm việc',
            details: ['Thứ 2 - Thứ 6: 8:00 - 17:00', 'Thứ 7: 8:00 - 12:00'],
            description: 'Chủ nhật nghỉ',
            color: 'bg-orange-100 text-orange-600'
        }
    ];

    const socialLinks = [
        {
            name: 'Facebook',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            url: 'https://www.facebook.com/le.khanh.uc.10632',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            name: 'YouTube',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
            url: 'https://www.youtube.com/@lekhanhduc-212',
            color: 'bg-red-600 hover:bg-red-700'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Thông tin liên hệ
                </h3>
                <p className="text-gray-600">
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều kênh khác nhau
                </p>
            </div>

            <div className="space-y-6">
                {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${method.color} flex-shrink-0`}>
                            {method.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                                {method.title}
                            </h4>
                            <div className="space-y-1">
                                {method.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-700 text-sm">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                            <p className="text-gray-500 text-xs mt-1">
                                {method.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                    Theo dõi chúng tôi
                </h4>
                <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            className={`p-3 rounded-lg text-white transition-colors duration-200 ${social.color}`}
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>

            {/* Quick Contact */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                    Liên hệ nhanh
                </h4>
                <div className="space-y-3">
                    <a
                        href="tel:0368103455"
                        className="flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">Gọi ngay: 0368103455</span>
                    </a>

                    <a
                        href="mailto:lekhanhduc212003@gmail.com"
                        className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Email: lekhanhduc212003@gmail.com</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
