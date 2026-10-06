# AI Workflow Studio — đặc tả sản phẩm

Cập nhật định hướng ngày **2026-10-07**. Tên giao diện hiện tại là **StudioFlow**. Đây là đặc tả mục tiêu; tình trạng triển khai thực tế nằm trong [CURRENT_STATE.md](CURRENT_STATE.md).

## Giá trị cốt lõi

**Prompt Optimizer** giúp người dùng diễn đạt yêu cầu rõ hơn, sao chép prompt sang AI họ đang dùng và tiếp tục cải thiện khi kết quả chưa đạt. **Prompt Repair Loop** là điểm khác biệt: người dùng đưa output cùng phản hồi trở lại để sửa nguyên nhân ở prompt, thay vì phải viết lại từ đầu.

Sản phẩm hỗ trợ người làm marketing, bán hàng, affiliate, lập trình, giáo dục, hỗ trợ khách hàng và công việc văn phòng. Không lấy Workflow Studio hoặc Workflow Automation làm core giai đoạn 1. Không buộc người dùng chạy prompt trong hệ thống để nhận giá trị.

## Luồng chính

Nhập prompt → Chọn loại/lĩnh vực/mục đích → Diagnosis → Score → Optimize → Before/After → **Copy Prompt** → Run Prompt tùy chọn → Output chưa đạt + phản hồi → Diagnose Failure → Repair → Phiên bản mới → Copy/Run lại → Save.

- Sau tối ưu, **Sao chép prompt** là hành động chính; **Chạy thử** là hành động phụ. Không tự chạy sau Optimize hoặc Repair.
- Người dùng có thể dán output từ AI bên ngoài; repair không phụ thuộc runner nội bộ.
- Lưu prompt gồm yêu cầu, ngữ cảnh, tùy chỉnh, điểm minh họa, phiên bản và yêu thích. Phiên bản cũ được giữ để so sánh và tái sử dụng.
- Prototype hiện chỉ xử lý dữ liệu trong trình duyệt; không có AI thật hay dịch vụ backend.

## Core và tính năng hỗ trợ

| Nhóm | Phạm vi |
| --- | --- |
| Core | Prompt Optimizer đa lĩnh vực; diagnosis; score; so sánh trước/sau; copy; Prompt Repair Loop; phiên bản; Prompt của tôi; lịch sử; mẫu; yêu thích |
| Hỗ trợ | Brand Context tùy chọn; Run Prompt tùy chọn; thông tin gói; cài đặt |
| Triển khai sau | Xác thực và đồng bộ dữ liệu; AI phía máy chủ; kiểm soát hạn mức/chi phí; thanh toán đã xác minh; báo cáo quản trị tối thiểu |
| Ngoài core giai đoạn 1 | Workflow Automation, điều phối tác nhân phức tạp, API công khai, marketplace, tiện ích trình duyệt, app di động riêng |

Bản chuyển hướng bàn giao ngày 2026-10-07 chỉ gồm UI/UX, mock data, tổng hợp research và tài liệu. Chưa triển khai Supabase, database/migration, AI API, tối ưu/repair thật, SePay, Resend hoặc xác thực thật; các phần backend tương ứng chỉ thực hiện khi có nhiệm vụ tiếp theo cho phép. Web search, PDF/RAG và tạo ảnh/video vẫn ngoài phạm vi core giai đoạn 1.

## Loại prompt và phân loại lĩnh vực/mục đích

Ba lựa chọn độc lập là **loại prompt → lĩnh vực → mục đích cụ thể**. Loại prompt gồm text/tổng quát, coding, image, video và data/analysis. Image/video chỉ tối ưu **văn bản prompt**, không sinh ảnh/video. Data hiện chỉ giúp cấu trúc yêu cầu phân tích; không chạy phân tích dữ liệu thật. Người dùng không chọn mô hình AI backend.

Danh mục trong `src/lib/prompt-catalog.ts` là nguồn dữ liệu chung cho selector, form và templates. Những tên như SEO keyword research, competitor analysis hoặc image/video mô tả mục đích của prompt; không có nghĩa ứng dụng tự tìm web hoặc tạo media.

| Lĩnh vực | Số mục đích | Các mục đích |
| --- | ---: | --- |
| Marketing & Content (`marketing`) | 12 | Viết bài Facebook; Viết caption; Viết quảng cáo; Viết landing page; Email marketing; Kế hoạch content; Ý tưởng content; Viết hook; Viết CTA; Giới thiệu sản phẩm; Kịch bản video ngắn; Nội dung thương hiệu |
| E-commerce (`ecommerce`) | 12 | Mô tả sản phẩm Shopee; TikTok Shop listing; Tiêu đề sản phẩm; Điểm nổi bật sản phẩm; SEO mô tả sản phẩm; So sánh sản phẩm; FAQ sản phẩm; Trả lời review; Trả lời khách hỏi sản phẩm; Upsell / Cross-sell; Nội dung flash sale; Kịch bản livestream |
| Affiliate / MMO (`affiliate`) | 14 | Đánh giá sản phẩm; Bài so sánh; Bài danh sách lựa chọn; Affiliate blog; Dàn ý SEO; Kịch bản review mạng xã hội; Kịch bản TikTok Affiliate; Dàn ý YouTube review; Landing page; Email giới thiệu; Ưu / nhược điểm; Hướng dẫn mua hàng; CTA chuyển đổi; Góc tiếp cận nội dung |
| Lập trình (`coding`) | 20 | Debug; Viết code; Giải thích code; Refactor; Code review; Tối ưu hiệu năng; Viết unit test; Viết SQL; Thiết kế API; Thiết kế database; System design; Tạo tài liệu kỹ thuật; Chuyển ngôn ngữ / framework; Security review; Tạo regex; Shell / CLI; IBM i / RPG; Java; JavaScript / TypeScript; Python |
| Giáo dục (`education`) | 14 | Soạn giáo án; Giải thích khái niệm; Tạo bài tập; Tạo trắc nghiệm; Tạo đáp án; Soạn đề kiểm tra; Rubric chấm điểm; Nhận xét cho học sinh; Tóm tắt bài học; Dàn ý slide; Hoạt động lớp học; Phân hóa bài học; Giải bài từng bước; Giải thích theo độ tuổi |
| Sales (`sales`) | 10 | Cold email; Follow-up; Kịch bản bán hàng; Câu hỏi khám phá nhu cầu; Xử lý phản đối; Đề xuất bán hàng; Giới thiệu giải pháp; Dàn ý cuộc gọi; LinkedIn outreach; CTA chốt bán hàng |
| Chăm sóc khách hàng (`support`) | 9 | Trả lời khiếu nại; Trả lời khách hỏi giá; Chính sách đổi trả; Trả lời review xấu; Trả lời FAQ; Chat support; Email support; Phản hồi lịch sự; Xoa dịu tình huống |
| SEO (`seo`) | 11 | Dàn ý SEO; Search intent; Prompt nghiên cứu từ khóa; Bài viết SEO; Meta title; Meta description; FAQ; Gợi ý liên kết nội bộ; Content cluster; Prompt phân tích đối thủ; Ý tưởng chủ đề |
| Văn phòng / Business (`business`) | 12 | Viết email; Tóm tắt cuộc họp; Agenda cuộc họp; Báo cáo; Đề xuất công việc; Kế hoạch kinh doanh; Prompt SWOT; Phân tích quyết định; Brainstorming; Kế hoạch dự án; SOP; Checklist |
| HR / Tuyển dụng (`hr`) | 8 | Mô tả công việc; Câu hỏi phỏng vấn; Đánh giá ứng viên; Bài tuyển dụng; Kế hoạch onboarding; Đánh giá hiệu suất; Thông báo nội bộ; Kế hoạch đào tạo |
| Social Media (`social`) | 10 | Facebook post; Kịch bản TikTok; Kịch bản Reel; YouTube Shorts; Dàn ý YouTube video; Instagram caption; Threads post; Lịch nội dung mạng xã hội; Viral hook; Comment / Reply |
| Khác (`other`) | 3 | Yêu cầu tổng quát; Phân tích thông tin; Viết lại văn bản |

## Nhập liệu theo ngữ cảnh

Form chính chỉ gồm prompt, loại, lĩnh vực và mục đích. Thông tin chuyên ngành và tùy chỉnh nâng cao nằm trong phần mở rộng, không bắt người mới điền mọi ô.

| Ngữ cảnh | Thông tin động |
| --- | --- |
| Coding / Debug | Ngôn ngữ/framework, code hoặc lỗi, hành vi mong đợi, hành vi thực tế, ràng buộc kỹ thuật |
| Education / Giáo án | Môn, cấp học, chủ đề, thời lượng, mục tiêu học tập, độ khó |
| Ecommerce / Shopee | Sản phẩm, USP, khách hàng, định vị giá, tone, từ khóa, nền tảng |
| Affiliate / Review | Sản phẩm, đối tượng, góc review, ưu/nhược điểm có bằng chứng, CTA, nền tảng, quan hệ affiliate/tính trung lập |
| Image | Chủ thể, phong cách, bố cục/tỷ lệ, ánh sáng, chi tiết cần tránh |
| Video | Cảnh, thời lượng, máy quay, chuyển động, chi tiết cần tránh |
| Data | Dữ liệu, câu hỏi phân tích, chỉ số, giới hạn |

Đổi task có thể đổi trường: Education ngoài giáo án không yêu cầu thời lượng; Coding ngoài Debug ẩn hành vi thực tế; so sánh Ecommerce dùng tiêu chí so sánh. Các task còn lại tái sử dụng form lĩnh vực ở prototype; chưa có form riêng cho mọi task.

Tùy chỉnh chung: ngôn ngữ, tone, đối tượng/người nhận, độ dài, định dạng đầu ra, phong cách, mức chi tiết, ràng buộc, điều cần tránh, kèm ví dụ, CTA khi phù hợp và bối cảnh bổ sung. Thông tin thiếu được để dưới dạng chỗ cần bổ sung, không tự bịa.

## Diagnosis và Prompt Score

Tiêu chí chung: mục tiêu, bối cảnh, đối tượng, định dạng, tone, ràng buộc và tiêu chí thành công. Tiêu chí ngữ cảnh lấy từ trường chuyên ngành, gồm language/error/expected behavior ở Coding, cấp học/objective/difficulty ở Education, product/USP/buyer/platform ở Ecommerce và product/angle/disclosure/CTA ở Affiliate.

Điểm dùng thang **0–100**; định hướng thuật toán thật là quy tắc xác định TypeScript, không dùng AI. Prototype minh họa **42 → 91**, repaired **94**, chia phần chung /60 và ngữ cảnh /40. Đây là dữ liệu cố định để xem UI, không chứng minh chất lượng hay thuật toán đã chốt. Chẩn đoán vẫn chỉ ra ô thiếu dù điểm mẫu cao; tiêu chí và trọng số phải được kiểm chứng riêng.

## Prompt Repair Loop và phiên bản

Người dùng chọn output ngoài hệ thống hoặc output runner của phiên bản hiện tại; chọn một hoặc nhiều vấn đề: quá dài, quá ngắn, chung chung, thiếu chi tiết, sai tone, sai format, hiểu sai, thiếu CTA, lặp ý, chưa đủ chuyên sâu, sai đối tượng hoặc vấn đề khác. Có thể bổ sung phản hồi tự do; vấn đề khác bắt buộc có mô tả.

Chẩn đoán minh họa ánh xạ vấn đề sang chỉ dẫn sửa. Repair giữ prompt đang chọn, bổ sung chỉ dẫn, phản hồi và output tham chiếu, tạo phiên bản mới có liên kết phiên bản nguồn. Luồng đầu tiên là **V1 Gốc → V2 Tối ưu → V3 Repaired**. Repair tiếp tục thêm V4...; tối ưu lại đầu vào tạo cặp gốc/tối ưu mới. Không ghi đè phiên bản trước và không tự chạy phiên bản mới.

Run là tiện ích trả phí tùy chọn, về sau tiêu thụ **Generate credit**, tách hạn mức Optimize. Số credit dùng thử miễn phí, cách tính lượt Repair, chi phí thất bại/thử lại và chính sách hạn mức chưa chốt. Bản mock không trừ credit và output chạy thử là ví dụ soạn sẵn, không được tạo từ yêu cầu bằng AI.

## Thư viện và Brand Context

Templates hỗ trợ cả 12 lĩnh vực, tìm kiếm và lọc category; hiện có 27 mẫu gợi ý được viết riêng. Chọn mẫu điền dữ liệu vào optimizer nhưng không tự tối ưu/chạy.

**Prompt của tôi** hiển thị tên, domain/task, phiên bản, điểm, lần cập nhật, favorite, copy, edit, repair và xem versions. Lịch sử hiện thể hiện phiên bản của các prompt đã lưu; không phải nhật ký mọi thao tác chưa lưu. Favorite liên kết cùng prompt trong thư viện.

Brand Context gồm brand, product, audience, tone, keywords, avoided words, CTA và examples. Chỉ thêm khi người dùng chọn ở Marketing, Ecommerce, Affiliate, Sales hoặc Social. Coding/Education không buộc dùng thương hiệu. Prototype có một hồ sơ local, chưa có nhiều hồ sơ hay đồng bộ tài khoản.

## Giá tham khảo và hạch toán dự kiến

Các giá/định mức kế thừa dưới đây là **giả định chưa được kiểm chứng**, không phải chính sách đã chốt hay gói đang bán. FREE Generate credit minh họa khả năng dùng thử tiện ích trả phí; quyền lợi thật phải được quyết định và kiểm soát phía máy chủ.

| Gói | VND/tháng | Optimize | Generate credit | Lưu prompt | Brand Context | Thành viên |
| --- | ---: | ---: | ---: | --- | --- | --- |
| FREE | 0 | 10 | 2 | 3 | Chưa chốt | Chưa chốt |
| PRO | 149.000 | 120 | 60 | 30 | 1 | Chưa chốt |
| CREATOR | 299.000 | 400 | 120 | 100 | 3 | Chưa chốt |
| BUSINESS | 799.000 | 1.000 | 300 | Chưa chốt | 10 | 5 — định hướng sau |

Chưa triển khai gói, mua thêm, tính lượt hoặc thanh toán. Mọi AI call sau này phải hạch toán người dùng, phiên bản/lượt chạy, provider/model, token, hành động, USD, độ trễ, thành công và thời gian, gồm cả thất bại/thử lại. Backend xác minh thanh toán, quyền sở hữu, hạn mức và tần suất; frontend không cấp quyền lợi. Chưa chốt mua thêm, chu kỳ reset, hoàn lượt, gia hạn, tỉ giá hoặc phân quyền nhóm.

## Kiểm chứng sản phẩm

Theo dõi người dùng hiểu hành động Copy, đưa prompt sang công cụ khác, quay lại sửa từ output, lưu/tái sử dụng prompt và sẵn sàng trả cho tối ưu/repair hoặc tiện ích Run. Đo conversion đăng ký, lần tối ưu đầu tiên, copy, repair hoàn tất, retention và chi phí/doanh thu khi có backend. Ngưỡng định lượng chưa chốt; không dùng điểm mock làm chứng cứ hiệu quả.

## Nguồn research và bàn giao

[PROMPTIFY_RESEARCH.md](research/PROMPTIFY_RESEARCH.md) lưu quan sát giao diện, flow sau login, giá/quota hiển thị và bảng liên hệ sang logic sản phẩm mình. Đây không phải bằng chứng về thuật toán, provider, cách trừ quota hoặc API Promptify. Không thay các giá giả định của StudioFlow bằng giá đối thủ. Các điểm cần chốt trước logic thật nằm trong CURRENT_STATE/ARCHITECTURE; cách tiếp nhận trên máy khác nằm trong [README.md](../README.md).
