"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* 1. Giới thiệu */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Giới thiệu
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chào mừng bạn đến với <strong>JavaBuilder</strong> (javabuilder.online). Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng nền tảng học lập trình của chúng tôi.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bằng việc sử dụng JavaBuilder, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
              </p>
            </section>

            {/* 2. Thông tin chúng tôi thu thập */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Thông tin chúng tôi thu thập
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2.1. Thông tin cá nhân
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Thông tin đăng ký:</strong> Email, tên đầy đủ, mật khẩu (được mã hóa)</li>
                <li><strong>Thông tin profile:</strong> Ảnh đại diện, bio, số điện thoại (tùy chọn)</li>
                <li><strong>Thông tin OAuth:</strong> Khi đăng nhập qua Google, GitHub, LinkedIn, chúng tôi thu thập email, tên và ảnh đại diện từ nhà cung cấp</li>
                <li><strong>Thông tin xác thực 2 yếu tố (2FA):</strong> Secret key được mã hóa để bảo vệ tài khoản</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2.2. Thông tin thanh toán
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Giao dịch:</strong> Mã đơn hàng, số tiền, trạng thái thanh toán, thời gian giao dịch</li>
                <li><strong>Subscription:</strong> Thông tin gói Premium, ngày bắt đầu, ngày hết hạn</li>
                <li><strong>Lưu ý:</strong> Chúng tôi KHÔNG lưu trữ thông tin thẻ tín dụng. Tất cả thanh toán được xử lý qua cổng thanh toán bên thứ ba (PayOS, PayPal)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2.3. Thông tin học tập
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Khóa học đã đăng ký và tiến độ học tập</li>
                <li>Bài học đã hoàn thành và thời gian học</li>
                <li>Ghi chú cá nhân trong bài học</li>
                <li>Đánh giá và nhận xét về khóa học</li>
                <li>Bài viết (blogs) đã đọc và tương tác (comment)</li>
                <li>Tài liệu (documents/ebooks) đã xem và tải xuống</li>
                <li>Câu hỏi phỏng vấn (interview questions) đã ôn tập và đóng góp</li>
                <li>Câu hỏi và bình luận trong diễn đàn Q&A</li>
                <li>Khóa học, bài viết và tài liệu yêu thích (favorites)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2.4. Thông tin kỹ thuật
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Cookies:</strong> Refresh token (HTTP-only cookie) để duy trì phiên đăng nhập</li>
                <li><strong>Session:</strong> Thông tin phiên làm việc, thiết bị, trình duyệt, địa chỉ IP</li>
                <li><strong>Logs:</strong> Nhật ký hoạt động hệ thống để bảo mật và khắc phục sự cố</li>
                <li><strong>Analytics:</strong> Dữ liệu sử dụng website (lượt xem, thời gian truy cập)</li>
              </ul>
            </section>

            {/* 3. Cách chúng tôi sử dụng thông tin */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Cách chúng tôi sử dụng thông tin
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Cung cấp và cải thiện dịch vụ học tập</li>
                <li>Xử lý đăng ký khóa học và thanh toán</li>
                <li>Quản lý tài khoản và subscription Premium</li>
                <li>Gửi thông báo về khóa học, bài viết mới, cập nhật hệ thống</li>
                <li>Hỗ trợ khách hàng và giải đáp thắc mắc</li>
                <li>Phân tích hành vi người dùng để cải thiện trải nghiệm</li>
                <li>Bảo mật tài khoản và phát hiện gian lận</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </section>

            {/* 4. Chia sẻ thông tin */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Chia sẻ thông tin với bên thứ ba
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chúng tôi KHÔNG bán hoặc cho thuê thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong các trường hợp sau:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Nhà cung cấp dịch vụ:</strong> PayOS, PayPal (thanh toán), AWS S3 (lưu trữ file), Cloudflare (CDN)</li>
                <li><strong>OAuth providers:</strong> Google, GitHub, LinkedIn (chỉ khi bạn chọn đăng nhập qua họ)</li>
                <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền</li>
                <li><strong>Bảo vệ quyền lợi:</strong> Để bảo vệ quyền lợi, tài sản và an toàn của JavaBuilder và người dùng</li>
              </ul>
            </section>

            {/* 5. Bảo mật thông tin */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Bảo mật thông tin
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Mã hóa:</strong> Mật khẩu được mã hóa bằng BCrypt, dữ liệu truyền tải qua HTTPS/TLS</li>
                <li><strong>JWT Token:</strong> Access token có thời gian sống ngắn, refresh token được lưu trong HTTP-only cookie</li>
                <li><strong>2FA:</strong> Xác thực 2 yếu tố tùy chọn để tăng cường bảo mật</li>
                <li><strong>Session Management:</strong> Theo dõi và quản lý phiên đăng nhập, có thể thu hồi từ xa</li>
                <li><strong>Rate Limiting:</strong> Giới hạn số lần request để chống tấn công brute force</li>
                <li><strong>Database Security:</strong> Dữ liệu được lưu trữ trên server bảo mật với backup định kỳ</li>
              </ul>
            </section>

            {/* 6. Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Cookies và công nghệ theo dõi
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                JavaBuilder sử dụng cookies để:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Refresh Token Cookie:</strong> HTTP-only, Secure, SameSite=Strict để duy trì phiên đăng nhập an toàn</li>
                <li><strong>Preferences:</strong> Lưu cài đặt giao diện (dark mode, ngôn ngữ)</li>
                <li><strong>Analytics:</strong> Theo dõi hành vi sử dụng để cải thiện dịch vụ</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bạn có thể quản lý cookies qua cài đặt trình duyệt, nhưng việc vô hiệu hóa có thể ảnh hưởng đến trải nghiệm sử dụng.
              </p>
            </section>

            {/* 7. Quyền của người dùng */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Quyền của bạn
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bạn có các quyền sau đối với thông tin cá nhân:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Truy cập:</strong> Xem thông tin cá nhân trong trang Profile</li>
                <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin profile, đổi mật khẩu</li>
                <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu liên quan</li>
                <li><strong>Xuất dữ liệu:</strong> Yêu cầu xuất bản sao dữ liệu cá nhân</li>
                <li><strong>Thu hồi đồng ý:</strong> Hủy đăng ký nhận email marketing</li>
                <li><strong>Quản lý session:</strong> Xem và thu hồi các phiên đăng nhập</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Để thực hiện các quyền trên, vui lòng liên hệ: <a href="mailto:contact@javabuilder.online" className="text-accent hover:underline">contact@javabuilder.online</a>
              </p>
            </section>

            {/* 8. Lưu trữ dữ liệu */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Thời gian lưu trữ
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Tài khoản hoạt động:</strong> Dữ liệu được lưu trữ trong suốt thời gian sử dụng dịch vụ</li>
                <li><strong>Tài khoản bị xóa:</strong> Dữ liệu cá nhân sẽ bị xóa trong vòng 30 ngày</li>
                <li><strong>Dữ liệu giao dịch:</strong> Lưu trữ tối thiểu 5 năm theo quy định pháp luật</li>
                <li><strong>Logs hệ thống:</strong> Lưu trữ 90 ngày cho mục đích bảo mật</li>
              </ul>
            </section>

            {/* 9. Trẻ em */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Quyền riêng tư của trẻ em
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                JavaBuilder không cố ý thu thập thông tin từ trẻ em dưới 13 tuổi. Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp thông tin cho chúng tôi, vui lòng liên hệ để chúng tôi xóa thông tin đó.
              </p>
            </section>

            {/* 10. Thay đổi chính sách */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Thay đổi chính sách bảo mật
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.
              </p>
            </section>

            {/* 11. Liên hệ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Liên hệ
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ:
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> contact@javabuilder.online</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Website:</strong> <a href="https://javabuilder.online" className="text-accent hover:underline">https://javabuilder.online</a></p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
            <Link
              href="/"
              className="inline-flex items-center text-accent hover:text-accent-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
