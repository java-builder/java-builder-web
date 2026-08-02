export const motivationalQuotes = [
  {
    quote: "Muốn có những gì mình chưa từng có, thì phải làm những việc mình chưa từng làm.",
    author: "Thomas Jefferson"
  },
  {
    quote: "Nỗ lực hôm nay là nền tảng cho thành công ngày mai.",
    author: "Khuyết danh"
  },
  {
    quote: "Học tập không phải là chuẩn bị cho cuộc sống, học tập chính là cuộc sống.",
    author: "John Dewey"
  },
  {
    quote: "Thành công là tổng của những nỗ lực nhỏ bé được lặp đi lặp lại mỗi ngày.",
    author: "Robert Collier"
  },
  {
    quote: "Điều duy nhất cản trở bạn đạt được ước mơ chính là bản thân bạn.",
    author: "Tom Bradley"
  },
  {
    quote: "Đừng xem đồng hồ, hãy làm những gì nó làm. Cứ tiếp tục.",
    author: "Sam Levenson"
  },
  {
    quote: "Cách tốt nhất để dự đoán tương lai là tạo ra nó.",
    author: "Peter Drucker"
  },
  {
    quote: "Kiến thức là sức mạnh. Thông tin là giải phóng. Giáo dục là tiền đề của tiến bộ.",
    author: "Kofi Annan"
  },
  {
    quote: "Học hỏi là kho báu sẽ theo chủ nhân của nó đi khắp mọi nơi.",
    author: "Tục ngữ Trung Quốc"
  },
  {
    quote: "Bạn không cần phải giỏi để bắt đầu, nhưng bạn phải bắt đầu để trở nên giỏi.",
    author: "Zig Ziglar"
  },
  {
    quote: "Thất bại là gia vị làm cho thành công có vị ngọt ngào.",
    author: "Truman Capote"
  },
  {
    quote: "Hãy học từ hôm qua, sống cho hôm nay, hy vọng cho ngày mai.",
    author: "Albert Einstein"
  },
  {
    quote: "Giáo dục là vũ khí mạnh nhất mà bạn có thể dùng để thay đổi thế giới.",
    author: "Nelson Mandela"
  },
  {
    quote: "Mỗi chuyên gia đều từng là người mới bắt đầu.",
    author: "Robin Sharma"
  },
  {
    quote: "Đầu tư vào kiến thức luôn mang lại lợi nhuận tốt nhất.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Không có thang máy dẫn đến thành công. Bạn phải đi cầu thang.",
    author: "Zig Ziglar"
  },
  {
    quote: "Hành trình ngàn dặm bắt đầu bằng một bước chân.",
    author: "Lão Tử"
  },
  {
    quote: "Sự khác biệt giữa người thành công và người khác không phải là thiếu sức mạnh, không phải là thiếu kiến thức, mà là thiếu ý chí.",
    author: "Vince Lombardi"
  },
  {
    quote: "Code hôm nay, debug ngày mai, nhưng đừng bao giờ bỏ cuộc.",
    author: "Khuyết danh"
  },
  {
    quote: "Lập trình không chỉ là viết code, mà là giải quyết vấn đề.",
    author: "Khuyết danh"
  },
  {
    quote: "Mỗi dòng code bạn viết là một bước tiến trong hành trình trở thành developer.",
    author: "Khuyết danh"
  },
  {
    quote: "Bug không phải là kẻ thù, mà là cơ hội để bạn học hỏi và trưởng thành.",
    author: "Khuyết danh"
  },
  {
    quote: "Đừng so sánh tiến độ của bạn với người khác. Hãy so sánh với chính bạn ngày hôm qua.",
    author: "Khuyết danh"
  },
  {
    quote: "Học lập trình giống như tập gym cho não bộ. Càng luyện tập, càng mạnh mẽ.",
    author: "Khuyết danh"
  },
  {
    quote: "Sai lầm là bằng chứng cho thấy bạn đang cố gắng.",
    author: "Khuyết danh"
  }
];

export function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}
