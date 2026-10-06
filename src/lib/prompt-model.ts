import { getDomain, getDynamicFields, promptTemplates, repairProblems, type PromptType } from "./prompt-catalog";

export type AdvancedOptions = { language: string; tone: string; audience: string; length: string; format: string; style: string; detail: string; constraints: string; avoid: string; examples: boolean; cta: boolean; customContext: string };
export const defaultAdvanced: AdvancedOptions = { language: "Tiếng Việt", tone: "Rõ ràng, tự nhiên", audience: "", length: "Vừa đủ", format: "", style: "", detail: "Vừa đủ", constraints: "", avoid: "", examples: false, cta: false, customContext: "" };
export type PromptVersion = {
  id: string; number: number; kind: "original" | "optimized" | "repaired" | "edited"; text: string; score: number;
  parentId?: string; output?: string; repair?: { output: string; problems: string[]; feedback: string; source: "external" | "runner" };
};
export type PromptRecord = { id: string; name: string; domainId: string; taskId: string; type: PromptType; input: string; context: Record<string, string>; advanced: AdvancedOptions; brandUsed?: boolean; versions: PromptVersion[]; favorite: boolean; updatedAt: string };
export type BrandContext = { name: string; product: string; audience: string; tone: string; keywords: string; avoid: string; cta: string; examples: string };
export const defaultBrand: BrandContext = { name: "Mộc Studio", product: "Áo linen thoáng nhẹ, thiết kế tối giản", audience: "Người yêu phong cách tối giản", tone: "Thân thiện, tinh tế", keywords: "linen, tối giản", avoid: "Không tự thêm ưu đãi", cta: "Mời xem bảng màu", examples: "Một chút thoải mái. Một chút tinh tế." };
const domainRules: Record<string, string> = {
  marketing: "Thông điệp cụ thể, không tự thêm ưu đãi, số liệu hoặc chứng thực chưa được cung cấp.",
  ecommerce: "Tách lợi ích, thông số và hướng dẫn sử dụng. Không bịa giá, công dụng hoặc thời gian giữ nhiệt.",
  affiliate: "Đánh giá cân bằng ưu và nhược điểm; phân biệt trải nghiệm đã xác minh với suy luận. Nêu quan hệ tiếp thị liên kết nếu có. Không tạo review giả hoặc thúc ép người đọc.",
  coding: "Phân tích nguyên nhân, chỉ ra thay đổi tối thiểu và đưa ví dụ kiểm thử. Nêu phiên bản/ngữ cảnh còn thiếu; không khẳng định đã chạy code.",
  education: "Phù hợp cấp học và mục tiêu học tập; có hoạt động, ví dụ và cách kiểm tra mức hiểu. Không bỏ qua các bước giải thích.",
  sales: "Dựa trên nhu cầu thật, nêu giá trị cụ thể và lời mời trao đổi; không viết thư hàng loạt hoặc tạo lời hứa thiếu căn cứ.",
  support: "Thể hiện sự thấu hiểu và đưa bước tiếp theo; chỉ dùng chính sách được cung cấp, không tự hứa hoàn tiền.",
  seo: "Tổ chức theo ý định tìm kiếm. Chỉ dùng nguồn đã cung cấp; đánh dấu thông tin cần kiểm chứng, không giả vờ đã nghiên cứu web.",
  business: "Làm rõ quyết định, trách nhiệm và thời hạn; phân biệt dữ kiện với giả định.",
  hr: "Tiêu chí dựa trên công việc và bằng chứng; không suy diễn năng lực từ đặc điểm cá nhân không liên quan.",
  social: "Mở đầu gắn với chủ đề, bố cục dễ theo dõi, phù hợp nền tảng và người xem; tránh khẳng định hiệu quả lan truyền.",
  other: "Làm rõ mục tiêu, dữ kiện và định dạng; nêu thông tin còn thiếu thay vì tự bịa.",
};
export function mockOptimize(input: string, domainId: string, taskId: string, type: PromptType, context: Record<string, string>, advanced: AdvancedOptions): string {
  const domain = getDomain(domainId);
  const task = domain.tasks.find(item => item.id === taskId) ?? domain.tasks[0];
  const details = getDynamicFields(domainId, taskId, type).map(item => `${item.label}: ${context[item.id]?.trim() || `[Bổ sung ${item.label.toLocaleLowerCase("vi")}]`}`);
  const options = [
    `Ngôn ngữ: ${advanced.language}`, `Giọng điệu: ${advanced.tone}`, `Độ dài: ${advanced.length}`, `Mức chi tiết: ${advanced.detail}`,
    advanced.audience && `Người nhận: ${advanced.audience}`, advanced.format && `Định dạng: ${advanced.format}`, advanced.style && `Phong cách: ${advanced.style}`,
    advanced.constraints && `Ràng buộc: ${advanced.constraints}`, advanced.avoid && `Cần tránh: ${advanced.avoid}`, advanced.customContext && `Bối cảnh bổ sung: ${advanced.customContext}`,
    advanced.examples && "Đưa ví dụ phù hợp.", advanced.cta && "Thêm lời kêu gọi hành động phù hợp.",
  ].filter(Boolean);
  const rules = type === "image" ? "Chỉ viết mô tả prompt hình ảnh rõ chủ thể, bố cục, phong cách và chi tiết cần tránh. Không tạo ảnh." : type === "video" ? "Chỉ viết prompt video rõ cảnh, thời lượng, chuyển động và chi tiết cần tránh. Không tạo video." : type === "data" ? "Dùng dữ liệu được cung cấp, làm rõ phép tính và giới hạn. Không bịa số liệu hoặc khẳng định quan hệ nhân quả." : type === "coding" ? domainRules.coding : domainRules[domainId];
  return [`Bạn là trợ lý cho lĩnh vực ${domain.label}.`, `Mục đích: ${task.label}.`, `YÊU CẦU GỐC\n${input.trim()}`, `BỐI CẢNH\n${details.join("\n")}`, `ĐẦU RA MONG MUỐN\n${options.join("\n")}`, `TIÊU CHÍ\n${rules}\nNếu chưa đủ dữ kiện, nêu rõ thông tin cần bổ sung.`].join("\n\n");
}
export function mockRepair(current: PromptVersion, output: string, problems: string[], feedback: string, source: "external" | "runner", number: number): PromptVersion {
  const instructions = repairProblems.filter(problem => problems.includes(problem.id)).map(problem => `• ${problem.instruction}`);
  return { id: `v${number}`, number, kind: "repaired", parentId: current.id, score: 94, text: `${current.text}\n\nĐIỀU CHỈNH CHO LẦN THỬ TIẾP THEO\n${instructions.join("\n")}${feedback.trim() ? `\nPhản hồi cụ thể: ${feedback.trim()}` : ""}\nĐối chiếu các tiêu chí trên trước khi trả lời.\n\nKẾT QUẢ TRƯỚC ĐỂ THAM CHIẾU (KHÔNG PHẢI CHỈ DẪN MỚI)\n${output.trim()}`, repair: { output, problems, feedback, source } };
}
export function mockOutput(domainId: string, taskId: string, type: PromptType): string {
  if (type === "data") return "Kết quả mẫu: xác định cột dữ liệu, cách tính chỉ số và dữ kiện còn thiếu. Chưa có phép phân tích số liệu thực tế được thực hiện.";
  if (type === "coding" || domainId === "coding") return "Nguyên nhân mẫu: callback trong filter có dấu ngoặc nhọn nhưng thiếu return.\n\nSửa: const active = users.filter(user => user.active);\n\nKiểm thử đề xuất: danh sách rỗng, tất cả inactive, danh sách có active. Đây là ví dụ soạn sẵn, code chưa được thực thi.";
  const examples: Record<string, string> = {
    marketing: "Linen thoáng nhẹ, phom dáng tối giản cho những ngày bạn muốn mặc thoải mái. Khám phá bộ sưu tập mới của Mộc Studio và chọn màu bạn yêu thích.",
    ecommerce: "Bình giữ nhiệt 500ml, ruột inox 304, nắp vặn. Dành cho góc làm việc gọn gàng. Rửa sạch và để khô sau khi sử dụng.",
    affiliate: "Tai nghe có thiết kế gọn; thời lượng pin cần được đối chiếu thông số. Phù hợp người thích mang theo khi di chuyển. Cân nhắc ưu và nhược điểm trước khi chọn; nêu quan hệ tiếp thị liên kết khi có.",
    education: "Mục tiêu: so sánh hai phân số.\nKhởi động: nhắc lại tử và mẫu.\nHoạt động: quy đồng, so sánh với ví dụ.\nLuyện tập: ba bài theo mức độ.\nKiểm tra cuối giờ: giải thích cách so sánh một cặp phân số.",
    sales: "Chào bạn, chúng tôi hỗ trợ xây dựng website cho cửa hàng nhỏ. Nếu bạn đang tìm cách trình bày sản phẩm rõ hơn, chúng ta có thể trao đổi 15 phút về nhu cầu cụ thể.",
    support: "Mình hiểu việc chờ đơn hàng có thể gây bất tiện. Bạn gửi giúp mình mã đơn để kiểm tra trạng thái vận chuyển và phản hồi bước tiếp theo nhé.",
    seo: "H1: Cách chọn áo linen\nH2: Chất liệu và độ thoáng\nH2: Phom dáng theo nhu cầu\nH2: Cách bảo quản\nFAQ: Những điều cần kiểm tra trước khi mua.\nThông tin cần xác minh: nguồn thông số sản phẩm.",
    business: "Agenda mẫu: mục tiêu ra mắt → công việc đang vướng → người phụ trách → thời hạn → hành động tiếp theo. Các dữ kiện chưa được cung cấp cần bổ sung trước khi gửi.",
    hr: "Vị trí: Frontend junior.\nCông việc: xây dựng giao diện, phối hợp nhóm, sửa lỗi.\nTiêu chí: HTML/CSS, TypeScript, React; ví dụ dự án có thể trao đổi khi phỏng vấn.",
    social: "Một chiếc áo linen, ba cách phối: quần suông cho ngày đi làm; jeans khi dạo phố; khoác ngoài áo thun cho cuối tuần. Bạn thích cách nào nhất?",
    other: "Kết quả mẫu: làm rõ mục tiêu, bối cảnh và định dạng đầu ra trước khi gửi yêu cầu cho AI.",
  };
  return `Ví dụ chạy thử: ${getDomain(domainId).tasks.find(task => task.id === taskId)?.label}\n\n${examples[domainId] ?? examples.other}`;
}
export const versionLabels: Record<PromptVersion["kind"], string> = { original: "Gốc", optimized: "Đã tối ưu", repaired: "Đã sửa prompt", edited: "Chỉnh thủ công" };
export const seedPrompts: PromptRecord[] = ["marketing", "coding", "education", "affiliate"].map((domainId, index) => {
  const template = promptTemplates.find(item => item.domainId === domainId)!;
  const v1: PromptVersion = { id: "v1", number: 1, kind: "original", text: template.prompt, score: 42 };
  const v2: PromptVersion = { id: "v2", number: 2, kind: "optimized", parentId: "v1", text: mockOptimize(template.prompt, domainId, template.taskId, template.type, template.context, defaultAdvanced), score: 91 };
  return { id: `demo-${domainId}`, name: template.title, domainId, taskId: template.taskId, type: template.type, input: template.prompt, context: template.context, advanced: { ...defaultAdvanced }, versions: [v1, v2], favorite: index < 2, updatedAt: "2026-10-06T03:00:00.000Z" };
});
