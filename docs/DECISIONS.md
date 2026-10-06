# AI Workflow Studio — các quyết định

Các quyết định này ghi nhận yêu cầu sản phẩm đã chấp nhận vào ngày 2026-10-06. Việc chấp nhận xác định định hướng, không có nghĩa đã triển khai xong. Chỉ thay đổi nội dung quyết định khi quyết định sản phẩm hoặc kiến trúc thực sự thay đổi; ghi rõ các thay đổi sau này. Việc dịch tài liệu không tạo ra quyết định mới. Giá, trọng số chấm điểm và các chính sách chưa chốt không phải quyết định triển khai đã chấp nhận.

ADR là bản ghi quyết định kiến trúc. Trạng thái `Accepted` có nghĩa là **Đã chấp nhận**; giữ tên trạng thái này để tiện đối chiếu giữa các phiên làm việc.

## ADR-001 — Người dùng không được chọn mô hình AI

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Đặt việc chọn nhà cung cấp/mô hình trong định tuyến backend. Giao diện người dùng cuối không được đưa ra lựa chọn GPT, Claude, Gemini hoặc mô hình OpenRouter.
- **Lý do:** Người dùng cần kết quả công việc hữu ích mà không phải chọn mô hình theo kiến thức kỹ thuật.
- **Hệ quả:** Dùng bí danh nội bộ `cheap`, `standard`, `premium` và cấu hình định tuyến tập trung. Nhật ký nội bộ giữ thông tin nhà cung cấp/mô hình thực tế.

## ADR-002 — Chấm điểm prompt không dùng AI

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Tính điểm hướng dẫn từ 0–100 bằng quy tắc xác định trong TypeScript.
- **Lý do:** Phản hồi nhanh, nhất quán không nên phát sinh chi phí AI.
- **Hệ quả:** Định nghĩa và kiểm chứng bộ tiêu chí dùng chung; dùng cùng bộ tiêu chí trước và sau tối ưu. Điểm ví dụ không phải yêu cầu đầu ra chính xác của thuật toán hoặc phép đo khoa học.

## ADR-003 — Giai đoạn 1 chỉ xử lý văn bản

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Kiểm chứng mức độ hiểu, sử dụng lặp lại quy trình và trả tiền cho kết quả bằng MVP chỉ xử lý văn bản.
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
- **Hệ quả:** Ghi cả lần thất bại/thử lại và phân biệt ước tính với thực tế. Hỗ trợ báo cáo chi phí theo thời gian, người dùng, gói và quy trình, các người dùng/quy trình tốn kém và tỷ lệ Chi phí AI / Doanh thu bên cạnh hạn mức hiển thị.

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

## ADR-009 — MVP ưu tiên trải nghiệm công việc/quy trình hơn kỹ thuật viết prompt

- **Trạng thái:** Accepted — Đã chấp nhận
- **Quyết định:** Tổ chức sản phẩm quanh công việc của người dùng Việt Nam: yêu cầu, điểm, tối ưu, nội dung hoàn chỉnh, chỉnh sửa nhanh, lưu và tái sử dụng.
- **Lý do:** Sản phẩm phải giúp hoàn thành công việc thực tế, vượt ra ngoài việc cải thiện prompt.
- **Hệ quả:** Đặt tên mẫu theo công việc, ưu tiên kết quả và bối cảnh thương hiệu tái sử dụng, hiển thị đơn vị Tối ưu/Tạo nội dung thay vì token hoặc lựa chọn mô hình.
