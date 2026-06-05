interface LocalizedQuote {
  quote: string;
  author: string;
}

const EN_QUOTES: Record<string, LocalizedQuote> = {
  "Muốn có những gì mình chưa từng có, thì phải làm những việc mình chưa từng làm.":
    { quote: "If you want to have what you've never had, you must do what you've never done.", author: "Thomas Jefferson" },
  "Nỗ lực hôm nay là nền tảng cho thành công ngày mai.":
    { quote: "Effort today is the foundation for success tomorrow.", author: "Anonymous" },
  "Học tập không phải là chuẩn bị cho cuộc sống, học tập chính là cuộc sống.":
    { quote: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  "Thành công là tổng của những nỗ lực nhỏ bé được lặp đi lặp lại mỗi ngày.":
    { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  "Điều duy nhất cản trở bạn đạt được ước mơ chính là bản thân bạn.":
    { quote: "The only thing standing between you and your dream is yourself.", author: "Tom Bradley" },
  "Đừng xem đồng hồ, hãy làm những gì nó làm. Cứ tiếp tục.":
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  "Cách tốt nhất để dự đoán tương lai là tạo ra nó.":
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  "Kiến thức là sức mạnh. Thông tin là giải phóng. Giáo dục là tiền đề của tiến bộ.":
    { quote: "Knowledge is power. Information is liberating. Education is the premise of progress.", author: "Kofi Annan" },
  "Học hỏi là kho báu sẽ theo chủ nhân của nó đi khắp mọi nơi.":
    { quote: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
  "Bạn không cần phải giỏi để bắt đầu, nhưng bạn phải bắt đầu để trở nên giỏi.":
    { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  "Thất bại là gia vị làm cho thành công có vị ngọt ngào.":
    { quote: "Failure is the condiment that gives success its flavor.", author: "Truman Capote" },
  "Hãy học từ hôm qua, sống cho hôm nay, hy vọng cho ngày mai.":
    { quote: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
  "Giáo dục là vũ khí mạnh nhất mà bạn có thể dùng để thay đổi thế giới.":
    { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  "Mỗi chuyên gia đều từng là người mới bắt đầu.":
    { quote: "Every expert was once a beginner.", author: "Robin Sharma" },
  "Đầu tư vào kiến thức luôn mang lại lợi nhuận tốt nhất.":
    { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  "Không có thang máy dẫn đến thành công. Bạn phải đi cầu thang.":
    { quote: "There is no elevator to success. You have to take the stairs.", author: "Zig Ziglar" },
  "Hành trình ngàn dặm bắt đầu bằng một bước chân.":
    { quote: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  "Sự khác biệt giữa người thành công và người khác không phải là thiếu sức mạnh, không phải là thiếu kiến thức, mà là thiếu ý chí.":
    { quote: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", author: "Vince Lombardi" },
  "Code hôm nay, debug ngày mai, nhưng đừng bao giờ bỏ cuộc.":
    { quote: "Code today, debug tomorrow, but never give up.", author: "Anonymous" },
  "Lập trình không chỉ là viết code, mà là giải quyết vấn đề.":
    { quote: "Programming isn't about writing code, it's about solving problems.", author: "Anonymous" },
  "Mỗi dòng code bạn viết là một bước tiến trong hành trình trở thành developer.":
    { quote: "Every line of code you write is a step forward in your journey to become a developer.", author: "Anonymous" },
  "Bug không phải là kẻ thù, mà là cơ hội để bạn học hỏi và trưởng thành.":
    { quote: "Bugs are not enemies, but opportunities for you to learn and grow.", author: "Anonymous" },
  "Đừng so sánh tiến độ của bạn với người khác. Hãy so sánh với chính bạn ngày hôm qua.":
    { quote: "Don't compare your progress with others. Compare it with yourself yesterday.", author: "Anonymous" },
  "Học lập trình giống như tập gym cho não bộ. Càng luyện tập, càng mạnh mẽ.":
    { quote: "Learning to code is like going to the gym for your brain. The more you practice, the stronger you get.", author: "Anonymous" },
  "Sai lầm là bằng chứng cho thấy bạn đang cố gắng.":
    { quote: "Mistakes are proof that you are trying.", author: "Anonymous" },
};

const JA_BY_AUTHOR: Record<string, LocalizedQuote> = {
  "Thomas Jefferson": { quote: "手に入れたことのないものを手に入れたいなら、やったことのないことをやらなければならない。", author: "トーマス・ジェファーソン" },
  "John Dewey": { quote: "学ぶことは人生の準備ではない。学ぶことこそが人生なのだ。", author: "ジョン・デューイ" },
  "Albert Einstein": { quote: "過去から学び、今日を生き、明日を希望する。", author: "アルベルト・アインシュタイン" },
  "Nelson Mandela": { quote: "教育とは、世界を変えるために用いることができる、最も強力な武器である。", author: "ネルソン・マンデラ" },
  "Lao Tzu": { quote: "千里の道も一歩から始まる。", author: "老子" },
};

const KO_BY_AUTHOR: Record<string, LocalizedQuote> = {
  "Thomas Jefferson": { quote: "한 번도 가져보지 못한 것을 가지려면, 한 번도 해보지 않은 일을 해야 한다.", author: "토머스 제퍼슨" },
  "John Dewey": { quote: "배움은 인생을 준비하는 것이 아니라 배움 그 자체가 인생이다.", author: "존 듀이" },
  "Albert Einstein": { quote: "어제로부터 배우고, 오늘을 살며, 내일을 소망하라.", author: "알베르트 아인슈타인" },
  "Nelson Mandela": { quote: "교육은 세상을 바꿀 수 있는 가장 강력한 무기다.", author: "넬슨 만델라" },
  "Lao Tzu": { quote: "천 리 길도 한 걸음부터 시작된다.", author: "노자" },
};

export function localizeQuote(
  source: LocalizedQuote,
  locale: string
): LocalizedQuote {
  if (locale === "vi") return source;

  const enMapped = EN_QUOTES[source.quote];

  if (locale === "en") return enMapped || source;

  if (locale === "ja") {
    return JA_BY_AUTHOR[source.author] || enMapped || source;
  }

  if (locale === "ko") {
    return KO_BY_AUTHOR[source.author] || enMapped || source;
  }

  return source;
}
