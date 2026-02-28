"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Điều khoản sử dụng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* 1. Chấp nhận điều khoản */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Chấp nhận điều khoản
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chào mừng bạn đến với <strong>JavaBuilder</strong> (javabuilder.online). Bằng việc truy cập và sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            {/* 2. Định nghĩa */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Định nghĩa
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>&ldquo;Nền tảng&rdquo;</strong> hoặc <strong>&ldquo;Dịch vụ&rdquo;</strong>: Website javabuilder.online và tất cả các dịch vụ liên quan</li>
                <li><strong>&ldquo;Người dùng&rdquo;</strong> hoặc <strong>&ldquo;Bạn&rdquo;</strong>: Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi</li>
                <li><strong>&ldquo;Nội dung&rdquo;</strong>: Khóa học, bài viết, tài liệu, video, bình luận và mọi thông tin trên nền tảng</li>
                <li><strong>&ldquo;Tài khoản&rdquo;</strong>: Tài khoản người dùng được đăng ký trên JavaBuilder</li>
                <li><strong>&ldquo;Premium&rdquo;</strong>: Gói subscription trả phí để truy cập nội dung cao cấp</li>
              </ul>
            </section>

            {/* 3. Đăng ký tài khoản */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Đăng ký và quản lý tài khoản
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                3.1. Yêu cầu đăng ký
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Bạn phải từ 13 tuổi trở lên để đăng ký tài khoản</li>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                <li>Chỉ tạo một tài khoản cho mỗi cá nhân</li>
                <li>Không được mạo danh người khác hoặc tổ chức</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                3.2. Bảo mật tài khoản
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Bạn chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình</li>
                <li>Không chia sẻ tài khoản với người khác</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</li>
                <li>Khuyến khích sử dụng xác thực 2 yếu tố (2FA) để tăng cường bảo mật</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                3.3. Đăng nhập qua OAuth
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Khi đăng nhập qua Google, GitHub hoặc LinkedIn, bạn cho phép chúng tôi truy cập thông tin cơ bản (email, tên, ảnh đại diện) theo chính sách của nhà cung cấp đó.
              </p>
            </section>

            {/* 4. Sử dụng dịch vụ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Sử dụng dịch vụ
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                4.1. Quyền sử dụng
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chúng tôi cấp cho bạn quyền sử dụng cá nhân, không độc quyền, không thể chuyển nhượng để:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Truy cập và học tập từ các khóa học đã đăng ký</li>
                <li>Đọc bài viết (blogs) và tài liệu (documents/ebooks) trên nền tảng</li>
                <li>Ôn tập câu hỏi phỏng vấn (interview questions) và đóng góp câu hỏi mới</li>
                <li>Tham gia thảo luận trong diễn đàn Q&A và bình luận</li>
                <li>Lưu nội dung yêu thích (favorites) để truy cập nhanh</li>
                <li>Xem và tải xuống tài liệu được phép (nếu có)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                4.2. Hành vi bị cấm
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bạn KHÔNG được:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Sao chép, phân phối, hoặc bán lại nội dung khóa học</li>
                <li>Chia sẻ tài khoản hoặc thông tin đăng nhập</li>
                <li>Tải lên nội dung vi phạm pháp luật, xúc phạm, hoặc spam</li>
                <li>Sử dụng bot, script hoặc công cụ tự động để truy cập dịch vụ</li>
                <li>Cố gắng hack, phá hoại hệ thống hoặc truy cập trái phép</li>
                <li>Thu thập thông tin người dùng khác mà không có sự đồng ý</li>
                <li>Đăng tải virus, malware hoặc mã độc hại</li>
                <li>Mạo danh JavaBuilder hoặc nhân viên của chúng tôi</li>
              </ul>
            </section>

            {/* 5. Nội dung người dùng */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Nội dung người dùng
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                5.1. Quyền sở hữu
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bạn giữ quyền sở hữu đối với nội dung mà bạn tạo ra (bình luận, câu hỏi, đánh giá, ghi chú). Tuy nhiên, bằng việc đăng tải, bạn cấp cho JavaBuilder quyền sử dụng, hiển thị, và phân phối nội dung đó trên nền tảng.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                5.2. Trách nhiệm
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bạn chịu trách nhiệm về nội dung mình đăng tải. Chúng tôi có quyền xóa nội dung vi phạm mà không cần thông báo trước.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                5.3. Đóng góp câu hỏi phỏng vấn
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Khi đóng góp câu hỏi phỏng vấn, bạn đồng ý rằng nội dung đó có thể được kiểm duyệt, chỉnh sửa và xuất bản bởi admin. Bạn sẽ được ghi nhận là người đóng góp.
              </p>
            </section>

            {/* 6. Thanh toán và hoàn tiền */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Thanh toán và hoàn tiền
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                6.1. Giá cả
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Giá khóa học và gói Premium được hiển thị rõ ràng bằng VNĐ</li>
                <li>Chúng tôi có quyền thay đổi giá bất kỳ lúc nào</li>
                <li>Giá đã thanh toán sẽ không bị ảnh hưởng bởi thay đổi giá sau đó</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                6.2. Phương thức thanh toán
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chúng tôi chấp nhận thanh toán qua:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>PayOS:</strong> Thanh toán nội địa qua QR Code, chuyển khoản ngân hàng</li>
                <li><strong>PayPal:</strong> Thanh toán quốc tế qua thẻ tín dụng/debit, tài khoản PayPal</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Thông tin thanh toán được xử lý an toàn và chúng tôi không lưu trữ thông tin thẻ tín dụng.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                6.3. Gói Premium Subscription
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Gói Premium được tính theo tháng/năm</li>
                <li>Tự động gia hạn trừ khi bạn hủy trước ngày hết hạn</li>
                <li>Bạn có thể hủy bất kỳ lúc nào từ trang quản lý subscription</li>
                <li>Khi hủy, bạn vẫn có quyền truy cập đến hết thời hạn đã thanh toán</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                6.4. Chính sách hoàn tiền
              </h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Khóa học:</strong> Hoàn tiền 100% trong vòng 7 ngày nếu chưa hoàn thành quá 20% khóa học</li>
                <li><strong>Gói Premium:</strong> Hoàn tiền theo tỷ lệ thời gian chưa sử dụng (trừ phí xử lý 10%)</li>
                <li><strong>Lỗi kỹ thuật:</strong> Hoàn tiền 100% nếu lỗi từ phía chúng tôi</li>
                <li>Yêu cầu hoàn tiền phải được gửi qua email: contact@javabuilder.online</li>
                <li>Thời gian xử lý: 7-14 ngày làm việc</li>
              </ul>
            </section>

            {/* 7. Sở hữu trí tuệ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Quyền sở hữu trí tuệ
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Tất cả nội dung trên JavaBuilder (khóa học, bài viết, video, tài liệu, logo, thiết kế) thuộc quyền sở hữu của JavaBuilder hoặc các bên cấp phép. Được bảo vệ bởi luật bản quyền Việt Nam và quốc tế.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Bạn không được sao chép, sửa đổi, phân phối, hoặc tạo sản phẩm phái sinh từ nội dung của chúng tôi mà không có sự cho phép bằng văn bản.
              </p>
            </section>

            {/* 8. Giới hạn trách nhiệm */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Giới hạn trách nhiệm
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Dịch vụ được cung cấp &ldquo;nguyên trạng&rdquo; và &ldquo;sẵn có&rdquo;</li>
                <li>Chúng tôi không đảm bảo dịch vụ luôn hoạt động liên tục, không lỗi</li>
                <li>Không chịu trách nhiệm về thiệt hại gián tiếp, ngẫu nhiên, hoặc hậu quả</li>
                <li>Trách nhiệm tối đa của chúng tôi giới hạn ở số tiền bạn đã thanh toán trong 12 tháng gần nhất</li>
                <li>Không đảm bảo kết quả học tập hoặc việc làm sau khi hoàn thành khóa học</li>
              </ul>
            </section>

            {/* 9. Chấm dứt */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Chấm dứt tài khoản
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                9.1. Bởi người dùng
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bạn có thể xóa tài khoản bất kỳ lúc nào qua trang cài đặt hoặc liên hệ support. Dữ liệu sẽ được xóa theo chính sách bảo mật.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                9.2. Bởi JavaBuilder
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Vi phạm điều khoản sử dụng</li>
                <li>Hoạt động gian lận hoặc lạm dụng</li>
                <li>Không thanh toán đúng hạn</li>
                <li>Yêu cầu từ cơ quan có thẩm quyền</li>
              </ul>
            </section>

            {/* 10. Thay đổi điều khoản */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Thay đổi điều khoản
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên website ít nhất 30 ngày trước khi có hiệu lực. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận điều khoản mới.
              </p>
            </section>

            {/* 11. Luật áp dụng */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Luật áp dụng và giải quyết tranh chấp
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Điều khoản này được điều chỉnh bởi luật pháp Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            {/* 12. Liên hệ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Thông tin liên hệ
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Nếu bạn có câu hỏi về điều khoản sử dụng này, vui lòng liên hệ:
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> contact@javabuilder.online</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Website:</strong> <a href="https://javabuilder.online" className="text-accent hover:underline">https://javabuilder.online</a></p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8">
              <div className="bg-accent/10 border-l-4 border-accent p-4 rounded">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Lưu ý:</strong> Bằng việc sử dụng JavaBuilder, bạn xác nhận rằng đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện được nêu trong tài liệu này.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-accent hover:text-accent-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại trang chủ
            </Link>
            <Link
              href="/privacy-policy"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
            >
              Xem Chính sách bảo mật
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
