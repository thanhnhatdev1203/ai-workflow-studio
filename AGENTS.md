<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Workflow Studio: hướng dẫn dành cho tác nhân lập trình

Khối tiếng Anh ở trên do Next.js tự quản lý và phải được giữ nguyên. Nội dung của khối đó yêu cầu đọc hướng dẫn tương ứng trong `node_modules/next/dist/docs/` trước khi viết mã, vì phiên bản này có thể khác các phiên bản đã biết. Không xóa khối này vì `next dev` sẽ tự tạo lại.

## Sản phẩm và phạm vi

AI Workflow Studio giúp người sáng tạo nội dung, người bán hàng trực tuyến và người làm việc tự do tại Việt Nam hoàn thành các công việc thực tế bằng văn bản. Nhóm marketing nhỏ là đối tượng ở giai đoạn sau. Xây dựng sản phẩm quanh quy trình:

Chọn công việc → Nhập yêu cầu → Chấm điểm prompt → Tối ưu prompt → Tạo nội dung hoàn chỉnh → Chỉnh sửa nhanh → Lưu quy trình → Tái sử dụng.

Giai đoạn 1 kiểm chứng việc người dùng hiểu sản phẩm, sử dụng lại quy trình và sẵn sàng trả tiền cho kết quả. Phạm vi là MVP chỉ xử lý văn bản trong [PRODUCT.md](docs/PRODUCT.md), gồm xác thực, quy trình làm việc, hồ sơ thương hiệu, hạn mức, thanh toán, theo dõi chi phí và báo cáo quản trị tối thiểu.

Không đưa tạo ảnh, tải PDF, RAG, nghiên cứu web, chợ mua bán, API công khai, tiện ích trình duyệt, ứng dụng di động riêng, điều phối tác nhân phức tạp hoặc giao diện chọn nhiều mô hình vào các yêu cầu bắt buộc của MVP. Không thiết kế quá phức tạp hoặc thêm hạ tầng/thư viện khi chưa có nhu cầu cụ thể.

## Quy tắc kiến trúc

- Dùng nền tảng Next.js/React/TypeScript/Tailwind hiện có. Các dịch vụ dự kiến: Supabase/PostgreSQL/Auth, Google OAuth, SePay/VietQR, Resend khi cần và Vercel.
- Mọi thao tác AI chạy phía máy chủ: giao diện → API → bộ định tuyến AI → lớp trừu tượng nhà cung cấp → API bên ngoài. Giao diện tuyệt đối không gọi SDK của nhà cung cấp hoặc chứa thông tin bí mật của họ.
- Người dùng không được chọn mô hình hoặc thấy các lựa chọn GPT, Claude, Gemini hay mô hình OpenRouter. Dùng bí danh nội bộ `cheap`, `standard`, `premium`; đặt tên mô hình cụ thể trong cấu hình nhà cung cấp/định tuyến, tách khỏi logic nghiệp vụ.
- Tính Prompt Score (điểm chất lượng prompt) bằng quy tắc xác định trong TypeScript, theo thang 0–100, không dùng AI.
- Mỗi lần gọi AI phải ghi người dùng, lượt chạy prompt nếu có, nhà cung cấp/mô hình, số token, hành động, chi phí USD, thời gian phản hồi, trạng thái thành công và thời điểm. Hạn mức hiển thị cho người dùng không thay thế việc hạch toán chi phí nội bộ.
- Kiểm soát hạn mức, quyền sở hữu, dữ liệu đầu vào và quyền lợi trả phí phía máy chủ. Dùng Supabase RLS, webhook thanh toán an toàn và có tính lũy đẳng (xử lý lặp không tạo thêm tác động), giới hạn tần suất, thông báo lỗi an toàn và giới hạn độ dài đầu vào/đầu ra.
- Chỉ backend mới được kích hoạt gói trả phí sau khi xác minh thanh toán. Giao diện tuyệt đối không được tự kích hoạt gói.
- Giữ mô hình dữ liệu tối giản. Chỉ thêm Redis hoặc R2 khi có lý do cụ thể. Tuân theo [ARCHITECTURE.md](docs/ARCHITECTURE.md) và các [quyết định đã chấp nhận](docs/DECISIONS.md).

## Bắt đầu phiên làm việc

1. Đọc `AGENTS.md`, sau đó lần lượt đọc `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` và `docs/CURRENT_STATE.md`.
2. Kiểm tra trạng thái/nhánh Git, mã nguồn, các thư viện và hướng dẫn Next.js cục bộ liên quan trước khi viết mã. Giữ nguyên khối Next.js tự quản lý ở trên.
3. GitHub là nguồn thông tin chuẩn dùng chung của dự án; tài liệu trong kho mã là bộ nhớ lâu dài giữa các máy tính. Bằng chứng trong kho mã quyết định tính năng nào đã được triển khai. Không suy ra rằng công việc đã hoàn thành chỉ từ kế hoạch hoặc cuộc trò chuyện trước.
4. Tôn trọng các thay đổi hiện có của người dùng. Tự giải quyết các lựa chọn thông thường trong phạm vi được giao; nêu rõ giá chưa được kiểm chứng và chính sách chưa được chốt.

## Kết thúc phiên làm việc

1. Chạy `npm run lint`. Chạy kiểm tra kiểu dữ liệu/build khi phù hợp; báo cáo kết quả thực tế và trở ngại. Với bản mã mới lấy về, tạo kiểu dữ liệu tuyến đường của Next.js trước khi kiểm tra kiểu (xem `docs/CURRENT_STATE.md`).
2. Cập nhật `docs/CURRENT_STATE.md` sau công việc đáng kể, ghi phần hoàn thành đã xác minh, vấn đề còn lại, kết quả kiểm tra và một nhiệm vụ tiếp theo cụ thể.
3. Chỉ cập nhật nội dung quyết định trong `docs/DECISIONS.md` khi quyết định sản phẩm hoặc kiến trúc thực sự thay đổi; đồng bộ tài liệu liên quan. Có thể dịch hoặc chỉnh cách diễn đạt mà không thay đổi quyết định.
4. Báo cáo công việc hoàn thành, file thay đổi, vấn đề chưa giải quyết và nhiệm vụ tiếp theo cụ thể.
5. Không tự động commit hoặc push. Chỉ thực hiện khi được yêu cầu rõ ràng.
