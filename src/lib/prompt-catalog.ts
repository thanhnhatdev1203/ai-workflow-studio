export const promptTypes = [
  { id: "text", label: "Văn bản / Tổng quát" },
  { id: "coding", label: "Lập trình" },
  { id: "image", label: "Prompt hình ảnh" },
  { id: "video", label: "Prompt video" },
  { id: "data", label: "Dữ liệu / Phân tích" },
] as const;
export type PromptType = (typeof promptTypes)[number]["id"];
export type Task = { id: string; label: string };
export type Domain = { id: string; label: string; icon: string; tone: string; tasks: Task[]; brand: boolean };
function domain(id: string, label: string, icon: string, tone: string, tasks: string, brand = false): Domain {
  return { id, label, icon, tone, brand, tasks: tasks.split("|").map(item => { const [id, label] = item.split(":"); return { id, label }; }) };
}
export const domains: Domain[] = [
  domain("marketing", "Marketing & Content", "sparkle", "green", "facebook:Viết bài Facebook|caption:Viết caption|ads:Viết quảng cáo|landing:Viết landing page|email:Email marketing|plan:Kế hoạch content|ideas:Ý tưởng content|hook:Viết hook|cta:Viết CTA|intro:Giới thiệu sản phẩm|short-video:Kịch bản video ngắn|brand:Nội dung thương hiệu", true),
  domain("ecommerce", "E-commerce", "bag", "amber", "shopee:Mô tả sản phẩm Shopee|tiktok-shop:TikTok Shop listing|title:Tiêu đề sản phẩm|bullets:Điểm nổi bật sản phẩm|seo:SEO mô tả sản phẩm|compare:So sánh sản phẩm|faq:FAQ sản phẩm|review:Trả lời review|questions:Trả lời khách hỏi sản phẩm|upsell:Upsell / Cross-sell|sale:Nội dung flash sale|live:Kịch bản livestream", true),
  domain("affiliate", "Affiliate / MMO", "arrow", "rose", "review:Đánh giá sản phẩm|compare:Bài so sánh|top-list:Bài danh sách lựa chọn|blog:Affiliate blog|seo-outline:Dàn ý SEO|social-review:Kịch bản review mạng xã hội|tiktok:Kịch bản TikTok Affiliate|youtube:Dàn ý YouTube review|landing:Landing page|email:Email giới thiệu|pros-cons:Ưu / nhược điểm|buyer-guide:Hướng dẫn mua hàng|cta:CTA chuyển đổi|angles:Góc tiếp cận nội dung", true),
  domain("coding", "Lập trình", "book", "blue", "debug:Debug|write:Viết code|explain:Giải thích code|refactor:Refactor|review:Code review|performance:Tối ưu hiệu năng|tests:Viết unit test|sql:Viết SQL|api:Thiết kế API|database:Thiết kế database|system:System design|docs:Tạo tài liệu kỹ thuật|convert:Chuyển ngôn ngữ / framework|security:Security review|regex:Tạo regex|cli:Shell / CLI|rpg:IBM i / RPG|java:Java|javascript:JavaScript / TypeScript|python:Python"),
  domain("education", "Giáo dục", "light", "amber", "lesson:Soạn giáo án|explain:Giải thích khái niệm|exercise:Tạo bài tập|quiz:Tạo trắc nghiệm|answers:Tạo đáp án|exam:Soạn đề kiểm tra|rubric:Rubric chấm điểm|feedback:Nhận xét cho học sinh|summary:Tóm tắt bài học|slides:Dàn ý slide|activities:Hoạt động lớp học|differentiate:Phân hóa bài học|solve:Giải bài từng bước|age:Giải thích theo độ tuổi"),
  domain("sales", "Sales", "mail", "blue", "cold-email:Cold email|follow-up:Follow-up|script:Kịch bản bán hàng|discovery:Câu hỏi khám phá nhu cầu|objections:Xử lý phản đối|proposal:Đề xuất bán hàng|pitch:Giới thiệu giải pháp|call:Dàn ý cuộc gọi|linkedin:LinkedIn outreach|closing:CTA chốt bán hàng", true),
  domain("support", "Chăm sóc khách hàng", "headset", "green", "complaint:Trả lời khiếu nại|price:Trả lời khách hỏi giá|returns:Chính sách đổi trả|review:Trả lời review xấu|faq:Trả lời FAQ|chat:Chat support|email:Email support|polite:Phản hồi lịch sự|de-escalation:Xoa dịu tình huống"),
  domain("seo", "SEO", "search", "blue", "outline:Dàn ý SEO|intent:Search intent|keyword:Prompt nghiên cứu từ khóa|article:Bài viết SEO|meta-title:Meta title|meta-description:Meta description|faq:FAQ|links:Gợi ý liên kết nội bộ|cluster:Content cluster|competitor:Prompt phân tích đối thủ|ideas:Ý tưởng chủ đề"),
  domain("business", "Văn phòng / Business", "store", "green", "email:Viết email|meeting-summary:Tóm tắt cuộc họp|agenda:Agenda cuộc họp|report:Báo cáo|proposal:Đề xuất công việc|plan:Kế hoạch kinh doanh|swot:Prompt SWOT|decision:Phân tích quyết định|brainstorm:Brainstorming|project:Kế hoạch dự án|sop:SOP|checklist:Checklist"),
  domain("hr", "HR / Tuyển dụng", "layers", "rose", "job-description:Mô tả công việc|interview:Câu hỏi phỏng vấn|evaluation:Đánh giá ứng viên|post:Bài tuyển dụng|onboarding:Kế hoạch onboarding|performance:Đánh giá hiệu suất|announcement:Thông báo nội bộ|training:Kế hoạch đào tạo"),
  domain("social", "Social Media", "message", "rose", "facebook:Facebook post|tiktok:Kịch bản TikTok|reel:Kịch bản Reel|shorts:YouTube Shorts|youtube:Dàn ý YouTube video|instagram:Instagram caption|threads:Threads post|calendar:Lịch nội dung mạng xã hội|hook:Viral hook|reply:Comment / Reply", true),
  domain("other", "Khác", "edit", "green", "general:Yêu cầu tổng quát|analysis:Phân tích thông tin|rewrite:Viết lại văn bản"),
];
export type DynamicField = { id: string; label: string; placeholder: string; multiline?: boolean; options?: string[] };
const field = (id: string, label: string, placeholder: string, multiline = false, options?: string[]): DynamicField => ({ id, label, placeholder, multiline, options });
const dynamicFields: Record<string, DynamicField[]> = {
  marketing: [field("product", "Sản phẩm / Chủ đề", "Áo linen Mộc Studio"), field("features", "Lợi ích / Thông điệp chính", "Thoáng nhẹ, dễ phối đồ", true), field("audience", "Đối tượng", "Người yêu phong cách tối giản")],
  ecommerce: [field("product", "Sản phẩm", "Bình giữ nhiệt 500ml"), field("features", "Tính năng / USP", "Ruột inox 304, nắp vặn", true), field("buyer", "Khách hàng mục tiêu", "Người làm việc văn phòng"), field("price", "Định vị giá", "Tầm trung; không tự thêm giảm giá"), field("tone", "Giọng điệu", "Rõ ràng, gần gũi"), field("keywords", "Từ khóa", "bình giữ nhiệt, 500ml"), field("platform", "Nền tảng bán hàng", "Shopee / TikTok Shop")],
  affiliate: [field("product", "Sản phẩm", "Tai nghe không dây"), field("audience", "Đối tượng", "Người nghe podcast khi di chuyển"), field("angle", "Góc review", "So sánh theo nhu cầu, đánh giá cân bằng"), field("pros", "Ưu điểm có bằng chứng", "Gọn nhẹ, điều khiển thuận tiện", true), field("cons", "Nhược điểm / Giới hạn", "Nêu những điểm chưa kiểm chứng", true), field("cta", "Lời mời hành động", "Đọc thông số trước khi quyết định"), field("platform", "Nền tảng", "Blog / TikTok / YouTube"), field("disclosure", "Quan hệ affiliate / Tính trung lập", "Nêu quan hệ tiếp thị liên kết nếu có; đánh giá cân bằng")],
  coding: [field("language", "Ngôn ngữ / Framework", "Chọn ngôn ngữ", false, ["JavaScript / TypeScript", "Python", "Java", "IBM i / RPG", "SQL", "Shell", "Khác"]), field("code", "Code / Lỗi gặp phải", "Dán đoạn code, thông báo lỗi hoặc stack trace", true), field("expected", "Hành vi mong đợi", "Hàm trả về danh sách đã lọc"), field("actual", "Hành vi thực tế", "Hàm trả về undefined hoặc báo lỗi"), field("constraints", "Ràng buộc kỹ thuật", "Giữ API hiện tại, không thêm thư viện", true)],
  education: [field("subject", "Môn học", "Toán"), field("grade", "Cấp học / Trình độ", "Lớp 6"), field("topic", "Chủ đề", "Phân số"), field("duration", "Thời lượng", "45 phút"), field("objective", "Mục tiêu học tập", "So sánh được hai phân số", true), field("difficulty", "Độ khó", "Chọn độ khó", false, ["Cơ bản", "Trung bình", "Nâng cao"])],
  sales: [field("offer", "Sản phẩm / Giải pháp", "Dịch vụ thiết kế website"), field("audience", "Người nhận / Nhu cầu", "Chủ cửa hàng muốn bán online"), field("value", "Giá trị cụ thể", "Quản lý đơn hàng dễ hơn"), field("cta", "Hành động tiếp theo", "Đặt lịch trao đổi 15 phút")],
  support: [field("situation", "Tình huống của khách", "Đơn hàng giao chậm", true), field("policy", "Chính sách đã xác nhận", "Chỉ dùng chính sách được cung cấp", true), field("goal", "Kết quả mong muốn", "Giải thích rõ và đưa bước tiếp theo")],
  seo: [field("topic", "Chủ đề / Từ khóa", "Cách chọn áo linen"), field("intent", "Ý định tìm kiếm", "Tìm hiểu trước khi mua"), field("sources", "Thông tin / Nguồn do bạn cung cấp", "Dán thông tin đã kiểm chứng; không tìm web", true)],
  business: [field("context", "Bối cảnh công việc", "Chuẩn bị cuộc họp ra mắt sản phẩm", true), field("audience", "Người đọc", "Nhóm dự án"), field("goal", "Mục tiêu / Quyết định cần đạt", "Chốt trách nhiệm và thời hạn")],
  hr: [field("role", "Vị trí / Đối tượng", "Lập trình viên frontend"), field("level", "Cấp độ / Kinh nghiệm", "Junior"), field("criteria", "Tiêu chí liên quan công việc", "React, kỹ năng phối hợp, tư duy giải quyết vấn đề", true)],
  social: [field("topic", "Chủ đề", "3 cách phối áo linen"), field("audience", "Người xem", "Người trẻ thích thời trang tối giản"), field("platform", "Kênh / Thời lượng", "TikTok, 30 giây"), field("hook", "Ý tưởng mở đầu", "Một chiếc áo, ba cách mặc")],
  other: [field("context", "Bối cảnh", "Thông tin cần để AI hiểu yêu cầu", true), field("goal", "Mục tiêu", "Bạn muốn nhận được điều gì?")],
};
export function getDynamicFields(domainId: string, taskId: string, type: PromptType): DynamicField[] {
  if (type === "image") return [field("subject", "Chủ thể", "Một góc làm việc bên cửa sổ"), field("style", "Phong cách hình ảnh", "Ảnh chụp tự nhiên, tông ấm"), field("composition", "Bố cục / Tỷ lệ", "Góc rộng, tỷ lệ 16:9"), field("lighting", "Ánh sáng", "Nắng buổi sáng"), field("avoid", "Chi tiết cần tránh", "Chữ, watermark, logo")];
  if (type === "video") return [field("scene", "Bối cảnh / Chủ thể", "Một quán cà phê buổi sáng"), field("duration", "Thời lượng", "8 giây"), field("camera", "Góc máy / Chuyển động", "Máy quay tiến chậm"), field("action", "Hành động trong cảnh", "Hơi nước bốc lên từ tách cà phê"), field("avoid", "Chi tiết cần tránh", "Chữ và logo")];
  if (type === "data") return [field("dataset", "Dữ liệu được cung cấp", "Dán mẫu dữ liệu và ý nghĩa các cột", true), field("question", "Câu hỏi phân tích", "Sản phẩm nào có doanh thu cao nhất?"), field("metrics", "Chỉ số / Cách tính", "Doanh thu = số lượng × đơn giá"), field("limits", "Giới hạn / Thiếu dữ liệu", "Không suy diễn quan hệ nhân quả")];
  if (type === "coding") return taskId === "debug" ? dynamicFields.coding : dynamicFields.coding.filter(item => item.id !== "actual");
  const fields = dynamicFields[domainId] ?? dynamicFields.other;
  if (domainId === "education" && taskId !== "lesson") return fields.filter(item => item.id !== "duration");
  if (domainId === "coding" && taskId !== "debug") return fields.filter(item => item.id !== "actual");
  if (domainId === "ecommerce" && taskId === "compare") return [...fields.filter(item => !["tone", "keywords"].includes(item.id)), field("criteria", "Tiêu chí so sánh", "Chất liệu, dung tích, cách sử dụng")];
  return fields;
}
export function getDomain(id: string) { return domains.find(item => item.id === id) ?? domains[0]; }

const examples: Record<string, { prompt: string; context: Record<string, string> }> = {
  marketing: { prompt: "Viết bài Facebook giới thiệu bộ sưu tập áo linen mới.", context: { product: "Áo linen Mộc Studio", features: "Thoáng nhẹ, thiết kế tối giản", audience: "Người trẻ yêu phong cách tối giản" } },
  ecommerce: { prompt: "Viết mô tả Shopee cho bình giữ nhiệt 500ml.", context: { product: "Bình giữ nhiệt 500ml", features: "Ruột inox 304, nắp vặn", buyer: "Người làm việc văn phòng", price: "Tầm trung", tone: "Rõ ràng, thân thiện", keywords: "bình giữ nhiệt, 500ml", platform: "Shopee" } },
  affiliate: { prompt: "Viết review tai nghe không dây giúp người đọc chọn đúng nhu cầu.", context: { product: "Tai nghe không dây", audience: "Người thường nghe podcast", angle: "Đánh giá cân bằng dựa trên thông số được cung cấp", pros: "Thiết kế gọn", cons: "Chưa kiểm chứng thời lượng pin", cta: "Xem thông số và cân nhắc trước khi mua", platform: "Blog", disclosure: "Nêu quan hệ tiếp thị liên kết nếu có; không viết review giả" } },
  coding: { prompt: "Giúp tôi debug hàm lọc danh sách trong TypeScript.", context: { language: "JavaScript / TypeScript", code: "const active = users.filter(user => { user.active });", expected: "Lấy các phần tử có active = true", actual: "Danh sách luôn rỗng", constraints: "Giữ filter, giải thích nguyên nhân, thêm test" } },
  education: { prompt: "Soạn giáo án về so sánh phân số.", context: { subject: "Toán", grade: "Lớp 6", topic: "So sánh phân số", duration: "45 phút", objective: "So sánh được hai phân số và giải thích cách làm", difficulty: "Cơ bản" } },
  sales: { prompt: "Viết email giới thiệu dịch vụ thiết kế website.", context: { offer: "Website cho cửa hàng nhỏ", audience: "Chủ cửa hàng mới bán online", value: "Trang sản phẩm rõ ràng và quản lý đơn hàng", cta: "Hẹn trao đổi 15 phút" } },
  support: { prompt: "Soạn phản hồi lịch sự cho khách có đơn hàng giao chậm.", context: { situation: "Khách hỏi vì đơn hàng chưa đến", policy: "Kiểm tra mã vận đơn trước khi hẹn ngày giao", goal: "Xin lỗi, giải thích, xin mã đơn để kiểm tra" } },
  seo: { prompt: "Tạo dàn ý SEO về cách chọn áo linen.", context: { topic: "cách chọn áo linen", intent: "Tìm hiểu trước khi mua", sources: "Chất liệu, phom dáng, cách bảo quản do cửa hàng cung cấp" } },
  business: { prompt: "Viết email chuẩn bị cuộc họp ra mắt sản phẩm.", context: { context: "Họp nhóm dự án tuần tới", audience: "Nhóm marketing và sản phẩm", goal: "Chốt agenda và phân công chuẩn bị" } },
  hr: { prompt: "Viết mô tả công việc lập trình viên frontend junior.", context: { role: "Frontend developer", level: "Junior", criteria: "HTML/CSS, TypeScript, React; học hỏi và phối hợp nhóm" } },
  social: { prompt: "Viết bài mạng xã hội về 3 cách phối áo linen.", context: { topic: "3 cách phối áo linen", audience: "Người trẻ thích phong cách tối giản", platform: "Facebook", hook: "Một chiếc áo, ba cách mặc" } },
  other: { prompt: "Giúp tôi làm rõ yêu cầu trước khi gửi cho AI.", context: { context: "Tôi có một ghi chú ý tưởng còn chung chung", goal: "Nhận một prompt rõ mục tiêu và định dạng" } },
};
export type PromptTemplate = { id: string; title: string; description: string; domainId: string; taskId: string; type: PromptType; prompt: string; context: Record<string, string> };
export const promptTemplates: PromptTemplate[] = domains.flatMap(item => item.tasks.slice(0, 2).map((task, index) => ({
  id: `${item.id}-${task.id}`, title: task.label, description: `Làm rõ bối cảnh, yêu cầu và tiêu chí cho ${task.label.toLocaleLowerCase("vi")}.`, domainId: item.id, taskId: task.id, type: item.id === "coding" ? "coding" as const : "text" as const,
  prompt: index === 0 ? examples[item.id].prompt : `${task.label} dựa trên thông tin tôi cung cấp.`, context: { ...examples[item.id].context },
})));
promptTemplates.push(
  { id: "other-image", title: "Mô tả hình ảnh", description: "Làm rõ chủ thể, bố cục và phong cách. Chỉ tối ưu prompt, không tạo ảnh.", domainId: "other", taskId: "general", type: "image", prompt: "Viết prompt hình ảnh về một góc làm việc bên cửa sổ.", context: { subject: "Bàn gỗ và chậu cây", style: "Ảnh tự nhiên", composition: "16:9", lighting: "Nắng buổi sáng", avoid: "Chữ và logo" } },
  { id: "other-video", title: "Cảnh video ngắn", description: "Làm rõ cảnh, thời lượng và chuyển động. Chỉ tối ưu prompt, không tạo video.", domainId: "other", taskId: "general", type: "video", prompt: "Viết prompt video về tách cà phê vào buổi sáng.", context: { scene: "Quán cà phê yên tĩnh", duration: "8 giây", camera: "Tiến chậm", action: "Hơi nước bốc lên", avoid: "Chữ và logo" } },
  { id: "business-data", title: "Phân tích dữ liệu bán hàng", description: "Làm rõ dữ liệu đầu vào, chỉ số và giới hạn phân tích.", domainId: "business", taskId: "report", type: "data", prompt: "Phân tích doanh thu theo sản phẩm từ bảng dữ liệu tôi cung cấp.", context: { dataset: "Sản phẩm A, số lượng 2, giá 100000", question: "Tính doanh thu theo sản phẩm", metrics: "Số lượng × giá", limits: "Chưa đủ dữ liệu xác định xu hướng" } },
);
const legacyTemplates: Record<string, string> = { facebook: "marketing-facebook", shopee: "ecommerce-shopee", tiktok: "social-tiktok", ads: "marketing-facebook", email: "sales-cold-email", support: "support-complaint", caption: "marketing-caption", ideas: "marketing-caption" };
export function getTemplate(id?: string) { return promptTemplates.find(item => item.id === (legacyTemplates[id ?? ""] ?? id)); }
export const repairProblems = [
  { id: "long", label: "Quá dài", instruction: "Giới hạn câu trả lời ở độ dài cần thiết; loại phần rườm rà." },
  { id: "short", label: "Quá ngắn", instruction: "Phát triển đủ các ý chính, giải thích và ví dụ liên quan." },
  { id: "generic", label: "Quá chung chung", instruction: "Gắn từng ý với bối cảnh được cung cấp; tránh lời khuyên chung chung." },
  { id: "details", label: "Thiếu chi tiết", instruction: "Bổ sung các bước và chi tiết có căn cứ; không tự bịa thông tin." },
  { id: "tone", label: "Sai tone", instruction: "Bám sát giọng điệu đã yêu cầu trong toàn bộ câu trả lời." },
  { id: "format", label: "Sai format", instruction: "Tuân thủ đúng cấu trúc đầu ra, tiêu đề và định dạng đã yêu cầu." },
  { id: "misunderstood", label: "AI hiểu sai yêu cầu", instruction: "Nhắc lại mục tiêu chính, phân biệt dữ kiện với giả định; hỏi lại nếu thiếu thông tin." },
  { id: "cta", label: "Thiếu CTA", instruction: "Kết bằng một lời mời hành động cụ thể, phù hợp với bối cảnh." },
  { id: "repetitive", label: "Kết quả lặp ý", instruction: "Mỗi phần phải đóng góp một ý mới; loại các câu trùng nghĩa." },
  { id: "depth", label: "Chưa đủ chuyên sâu", instruction: "Giải thích cơ chế, đánh đổi và trường hợp ngoại lệ; nêu giới hạn bằng chứng." },
  { id: "audience", label: "Không đúng đối tượng", instruction: "Điều chỉnh từ vựng, ví dụ và độ sâu theo đúng người đọc mục tiêu." },
  { id: "other", label: "Khác", instruction: "Áp dụng phản hồi cụ thể do người dùng cung cấp." },
];
