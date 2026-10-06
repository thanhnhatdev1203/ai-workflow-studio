# AI Workflow Studio — các quyết định

Các quyết định ban đầu được chấp nhận ngày 2026-10-06, cập nhật định hướng sản phẩm ngày **2026-10-07** theo yêu cầu chuyển core sang Prompt Optimizer và Prompt Repair Loop. Việc chấp nhận xác định định hướng, không có nghĩa đã triển khai xong. Giá, trọng số chấm điểm và chính sách chưa chốt không phải quyết định đã triển khai. ADR hiện có được cập nhật tại chỗ; chỉ thêm bản ghi cho quyết định chưa có.

ADR là bản ghi quyết định kiến trúc. Trạng thái `Accepted` có nghĩa là **Đã chấp nhận**; giữ tên trạng thái này để tiện đối chiếu giữa các phiên làm việc.

Bản bàn giao ngày 2026-10-07 giữ các ADR dưới đây. [Research Promptify](research/PROMPTIFY_RESEARCH.md) là nguồn quan sát tham khảo, không tự tạo quyết định hoặc thay đổi core/giá/quota. Phần ánh xạ sang logic thật trong ARCHITECTURE là hướng dẫn phân chia trách nhiệm, chưa phải dịch vụ đã triển khai hay hợp đồng API đã chốt.

## ADR-001 — Người dùng không được chọn mô hình AI

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Đặt việc chọn nhà cung cấp/mô hình trong định tuyến backend. Giao diện người dùng cuối không được đưa ra lựa chọn GPT, Claude, Gemini hoặc mô hình OpenRouter.
- **Lý do:** Người dùng cần kết quả công việc hữu ích mà không phải chọn mô hình theo kiến thức kỹ thuật.
- **Hệ quả:** Dùng bí danh nội bộ `cheap`, `standard`, `premium` và cấu hình định tuyến tập trung. Nhật ký nội bộ giữ thông tin nhà cung cấp/mô hình thực tế.

## ADR-002 — Chấm điểm prompt không dùng AI

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Tính điểm hướng dẫn từ 0–100 bằng quy tắc xác định trong TypeScript.
- **Lý do:** Phản hồi nhanh, nhất quán không nên phát sinh chi phí AI.
- **Hệ quả:** Kết hợp tiêu chí chung và theo domain/task; kiểm chứng cùng bộ tiêu chí trước/sau. Mock 42 → 91 và 94 sau repair chỉ minh họa; phân bổ chung /60, ngữ cảnh /40 chưa phải trọng số đã chốt.

## ADR-003 — Giai đoạn 1 chỉ xử lý văn bản

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Giai đoạn 1 chỉ xử lý văn bản prompt và output văn bản. Hỗ trợ type text, coding, image, video, data; image/video chỉ tối ưu văn bản mô tả để dùng ở công cụ bên ngoài.
- **Lý do:** Tập trung nguồn lực vào giá trị cốt lõi của sản phẩm.
- **Hệ quả:** Tạo ảnh, tải PDF, RAG, nghiên cứu web, chợ mua bán, API công khai, tiện ích trình duyệt, ứng dụng di động riêng, điều phối tác nhân phức tạp và giao diện chọn nhiều mô hình không phải yêu cầu bắt buộc của giai đoạn 1.

## ADR-004 — Nhà cung cấp AI phải đi qua lớp trừu tượng

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Dùng giao diện → API → bộ định tuyến AI → lớp nhà cung cấp AI → API AI bên ngoài, với hợp đồng nhà cung cấp có phương thức minh họa `generateText`.
- **Lý do:** Thay đổi định tuyến, nhà cung cấp và tối ưu chi phí không nên buộc viết lại logic nghiệp vụ.
- **Hệ quả:** SDK/bí mật nhà cung cấp nằm phía máy chủ, mô hình cụ thể nằm trong cấu hình. Triển khai bộ chuyển đổi khi cần và chừa khả năng truyền kết quả từng phần trong tương lai; không bắt buộc hỗ trợ mọi nhà cung cấp ngay.

## ADR-005 — Bắt buộc theo dõi chi phí AI

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Ghi mọi lần gọi AI với người dùng, lượt chạy prompt nếu có, nhà cung cấp/mô hình, token đầu vào/đầu ra, token bộ nhớ đệm khi có, loại hành động, chi phí USD, thời gian phản hồi, trạng thái thành công và thời điểm.
- **Lý do:** Chỉ có hạn mức hành động hiển thị là chưa đủ để đánh giá hiệu quả kinh tế bền vững.
- **Hệ quả:** Ghi cả thất bại/thử lại, optimize/repair/generate và phân biệt ước tính với thực tế. Báo cáo theo thời gian, người dùng, gói, prompt/domain/task và tỷ lệ Chi phí AI / Doanh thu; hạn mức Optimize/Generate không thay sổ chi phí. Prototype chưa gọi AI hoặc hạch toán thật.

## ADR-006 — Tài liệu trong kho GitHub là bộ nhớ/nguồn thông tin chuẩn của dự án

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Lưu sản phẩm, kiến trúc, quyết định và trạng thái phát triển đã xác minh trong tài liệu của kho mã được chia sẻ qua GitHub.
- **Lý do:** Các phiên Codex trên những máy tính khác nhau cần bối cảnh thống nhất, không phụ thuộc lịch sử trò chuyện.
- **Hệ quả:** Đọc tài liệu bắt buộc khi bắt đầu phiên và kiểm tra mã nguồn trước khi tuyên bố hoàn thành. Cập nhật trạng thái sau phiên làm việc đáng kể; chỉ thay đổi quyết định khi có thay đổi thực sự. Chỉ commit/push khi được yêu cầu rõ ràng.

## ADR-007 — Chỉ máy chủ được kích hoạt quyền lợi thanh toán

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Chỉ kích hoạt thuê bao trả phí sau khi backend xác minh sự kiện thanh toán SePay cùng số tiền/mã tham chiếu dự kiến. Việc xử lý phải có tính lũy đẳng.
- **Lý do:** Thông tin phía khách tự gửi và thông báo trùng không được cấp sai quyền truy cập trả phí.
- **Hệ quả:** Tạo dữ liệu thanh toán dự kiến phía máy chủ, xác thực webhook, loại trùng bằng mã giao dịch và cập nhật trạng thái thanh toán/thuê bao nhất quán. Giao diện chỉ đọc trạng thái và hiển thị hướng dẫn thanh toán.

## ADR-008 — Không thêm Redis/R2 trước khi cần

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Dùng bộ công nghệ tối giản đã chọn; chỉ thêm Redis khi cần và Cloudflare R2 khi phát sinh nhu cầu lưu tệp/ảnh.
- **Lý do:** Hạ tầng không cần thiết làm tăng công vận hành trước khi sản phẩm được kiểm chứng.
- **Hệ quả:** Bắt đầu bằng Next.js và Supabase/PostgreSQL. Hạ tầng mới phải có nhu cầu cụ thể và lý do được ghi lại; không xây trước hệ thống lưu trữ hoặc điều phối cho tương lai.

## ADR-009 — Prompt Optimization là core giai đoạn 1; Workflow Automation không phải core

- **Trạng thái:** Accepted — Đã chấp nhận
- **Cập nhật:** 2026-10-07; thay định hướng lấy quy trình tạo nội dung hoàn chỉnh làm trung tâm.
- **Quyết định:** Core là Prompt Optimizer: prompt → domain/task → diagnosis/score → optimize → before/after → copy → repair → version → save. Workflow Studio/Workflow Automation không phải core giai đoạn 1.
- **Lý do:** Giá trị chính là prompt rõ hơn và có thể dùng ở AI người dùng quen thuộc, bao phủ nhiều công việc.
- **Hệ quả:** Prompt của tôi thay workflow; Copy là primary CTA; runner, Brand Context, billing/settings là hỗ trợ. Không xây automation engine. Giữ tên mẫu theo mục đích thực tế.

## ADR-010 — Prompt Repair Loop là điểm khác biệt cốt lõi

- **Trạng thái:** Accepted — Đã chấp nhận, 2026-10-07
- **Quyết định:** Nhận output từ AI bên ngoài hoặc runner + vấn đề + feedback; chẩn đoán và sửa prompt thành phiên bản mới, giữ phiên bản nguồn.
- **Lý do:** Output chưa đạt cần phản hồi cụ thể để cải thiện prompt, không chỉ sửa câu trả lời một lần.
- **Hệ quả:** V1 gốc, V2 tối ưu, V3 repaired; repair lặp lại tạo version tiếp theo. Không tự chạy sau repair. Hiện chỉ mock, không khẳng định AI chẩn đoán nguyên nhân thật.

## ADR-011 — Run Prompt là tiện ích trả phí tùy chọn

- **Trạng thái:** Accepted — Đã chấp nhận, 2026-10-07
- **Quyết định:** Optimize xong ưu tiên Copy; Run là secondary CTA chủ động, về sau dùng Generate credit. Không buộc Run để repair hoặc lưu.
- **Lý do:** Người dùng đã có công cụ AI riêng; tiện ích nội bộ không nên cản luồng mặc định.
- **Hệ quả:** Tách Optimize/Generate; hỗ trợ paste output ngoài. Quyền lợi dùng thử miễn phí, tính lượt Repair, retry/refund/reset chưa chốt. Prototype không trừ credit; image/video không được sinh media.

## ADR-012 — Prompt Optimizer đa lĩnh vực

- **Trạng thái:** Accepted — Đã chấp nhận, 2026-10-07
- **Quyết định:** Dùng taxonomy type/domain/task hỗ trợ tối thiểu 12 lĩnh vực trong PRODUCT.md, không chỉ marketing.
- **Lý do:** Prompt cần ngữ cảnh chuyên ngành ở coding, giáo dục, kinh doanh và các công việc khác.
- **Hệ quả:** Catalog dùng chung cho selector/form/templates; hỗ trợ 5 loại prompt và diagnosis chuyên ngành. Brand Context tùy chọn chỉ khi phù hợp. Không mở rộng tính năng sinh media/web research theo tên task.

## ADR-013 — Form động và mở dần tùy chọn

- **Trạng thái:** Accepted — Đã chấp nhận, 2026-10-07
- **Quyết định:** Form thích ứng type/domain/task; chỉ hiển thị prompt và selector ở bước đầu, mở thêm fields chuyên ngành/advanced khi cần.
- **Lý do:** Một form marketing dài không phục vụ đúng Coding/Education và làm tăng tải nhập liệu trên điện thoại.
- **Hệ quả:** Debug, giáo án, Shopee, affiliate review có fields tương ứng; language/framework ở selector phụ. Các task khác tái sử dụng form domain trong mock. Before/after hai cột desktop, xếp chồng mobile; không đổi theme lớn.
