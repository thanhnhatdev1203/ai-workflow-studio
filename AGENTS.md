<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Workflow Studio: hướng dẫn dành cho tác nhân lập trình

Khối tiếng Anh ở trên do Next.js tự quản lý và phải được giữ nguyên. Nội dung của khối đó yêu cầu đọc hướng dẫn tương ứng trong `node_modules/next/dist/docs/` trước khi viết mã, vì phiên bản này có thể khác các phiên bản đã biết. Không xóa khối này vì `next dev` sẽ tự tạo lại.

## Sản phẩm và phạm vi

AI Workflow Studio (giao diện mang tên StudioFlow) lấy **Prompt Optimizer** làm sản phẩm cốt lõi giai đoạn 1. Hỗ trợ nhiều lĩnh vực, gồm marketing, thương mại điện tử, affiliate, lập trình, giáo dục, sales, hỗ trợ khách hàng, SEO, văn phòng, HR, social và yêu cầu khác. Xây dựng sản phẩm quanh quy trình:

Nhập prompt → Chọn loại/lĩnh vực/mục đích → Chẩn đoán và chấm điểm → Tối ưu → So sánh trước/sau → **Sao chép** → Chạy thử tùy chọn → Dán output và phản hồi → Chẩn đoán lỗi → Sửa prompt → Phiên bản mới → Sao chép/chạy lại → Lưu prompt.

**Prompt Repair Loop** là điểm khác biệt cốt lõi: sửa prompt từ output chưa đạt của AI bên ngoài hoặc runner, giữ lịch sử phiên bản. Workflow Automation không còn là core giai đoạn 1. Chạy thử là tiện ích trả phí tùy chọn, về sau dùng Generate credit; không tự chạy sau tối ưu. Brand Context là tính năng hỗ trợ, chỉ áp dụng khi người dùng chọn và ngữ cảnh phù hợp.

Đặc tả trong [PRODUCT.md](docs/PRODUCT.md) phân biệt core, hỗ trợ và phần triển khai sau. Bản bàn giao ngày 2026-10-07 mới có UI/UX, mock, research và tài liệu; chưa tích hợp backend, xác thực, thanh toán hay AI thật. Giới hạn chỉ làm mock là phạm vi nhiệm vụ chuyển hướng đã hoàn thành, không phải lệnh cấm triển khai logic trong mọi phiên sau; chỉ triển khai phần mới khi yêu cầu của người dùng cho phép. Năm loại prompt gồm text, coding, image, video và data; image/video chỉ tối ưu **văn bản prompt**, không tạo ảnh/video. Giữ theme hiện tại, dùng form động theo loại/lĩnh vực/mục đích và mở dần tùy chọn nâng cao.

Không đưa tạo ảnh, tải PDF, RAG, nghiên cứu web, chợ mua bán, API công khai, tiện ích trình duyệt, ứng dụng di động riêng, điều phối tác nhân phức tạp hoặc giao diện chọn nhiều mô hình vào các yêu cầu bắt buộc của MVP. Không thiết kế quá phức tạp hoặc thêm hạ tầng/thư viện khi chưa có nhu cầu cụ thể.

## Quy tắc kiến trúc

- Dùng nền tảng Next.js/React/TypeScript/Tailwind hiện có. Các dịch vụ dự kiến: Supabase/PostgreSQL/Auth, Google OAuth, SePay/VietQR, Resend khi cần và Vercel.
- Mọi thao tác AI chạy phía máy chủ: giao diện → API → bộ định tuyến AI → lớp trừu tượng nhà cung cấp → API bên ngoài. Giao diện tuyệt đối không gọi SDK của nhà cung cấp hoặc chứa thông tin bí mật của họ.
- Người dùng không được chọn mô hình hoặc thấy các lựa chọn GPT, Claude, Gemini hay mô hình OpenRouter. Dùng bí danh nội bộ `cheap`, `standard`, `premium`; đặt tên mô hình cụ thể trong cấu hình nhà cung cấp/định tuyến, tách khỏi logic nghiệp vụ.
- Khi triển khai thật, tính Prompt Score bằng quy tắc xác định trong TypeScript, thang 0–100, kết hợp tiêu chí chung và theo ngữ cảnh, không dùng AI. Hiện điểm mock 42 → 91 và điểm sửa 94 chỉ minh họa; không coi là thuật toán đã chốt.
- Mỗi lần gọi AI phải ghi người dùng, lượt chạy prompt nếu có, nhà cung cấp/mô hình, số token, hành động, chi phí USD, thời gian phản hồi, trạng thái thành công và thời điểm. Hạn mức hiển thị cho người dùng không thay thế việc hạch toán chi phí nội bộ.
- Kiểm soát hạn mức, quyền sở hữu, dữ liệu đầu vào và quyền lợi trả phí phía máy chủ. Dùng Supabase RLS, webhook thanh toán an toàn và có tính lũy đẳng (xử lý lặp không tạo thêm tác động), giới hạn tần suất, thông báo lỗi an toàn và giới hạn độ dài đầu vào/đầu ra.
- Chỉ backend mới được kích hoạt gói trả phí sau khi xác minh thanh toán. Giao diện tuyệt đối không được tự kích hoạt gói.
- Giữ mô hình dữ liệu tối giản. Chỉ thêm Redis hoặc R2 khi có lý do cụ thể. Tuân theo [ARCHITECTURE.md](docs/ARCHITECTURE.md) và các [quyết định đã chấp nhận](docs/DECISIONS.md).

## Bắt đầu phiên làm việc

1. Đọc `AGENTS.md`, sau đó lần lượt đọc `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` và `docs/CURRENT_STATE.md`.
2. Kiểm tra trạng thái/nhánh Git, mã nguồn, các thư viện và hướng dẫn Next.js cục bộ liên quan trước khi viết mã. Giữ nguyên khối Next.js tự quản lý ở trên.
3. GitHub là nguồn thông tin chuẩn dùng chung của dự án; tài liệu trong kho mã là bộ nhớ lâu dài giữa các máy tính. Bằng chứng trong kho mã quyết định tính năng nào đã được triển khai. Không suy ra rằng công việc đã hoàn thành chỉ từ kế hoạch hoặc cuộc trò chuyện trước.
4. Tôn trọng các thay đổi hiện có của người dùng. Tự giải quyết các lựa chọn thông thường trong phạm vi được giao; nêu rõ giá chưa được kiểm chứng và chính sách chưa được chốt.
5. Khi làm UI/UX hoặc logic optimizer/repair, đọc `docs/UI_UX_SPEC.md` và `docs/research/PROMPTIFY_RESEARCH.md`. Tìm trước khi tạo tài liệu research để tránh trùng. Research Promptify dùng Chrome DevTools MCP chỉ đọc giao diện cần thiết trong phiên người dùng đã đăng nhập; không submit tác vụ có tác động, đọc bí mật hoặc thay đổi tài khoản/thanh toán. Phân biệt logic tự thiết kế cho StudioFlow với tính năng thực sự đã quan sát của Promptify.
6. Khi chuyển máy, dùng [README.md](README.md) để lấy nhánh `phase1/mvp`, cài bằng `npm ci`, sinh route types và mở preview. Browser localStorage/phiên đăng nhập/cấu hình MCP không được đồng bộ qua Git. Nhiệm vụ tiếp theo trong CURRENT_STATE là đề xuất, yêu cầu mới của người dùng quyết định công việc được giao; không tự triển khai thêm backend từ một bản bàn giao.

## Kết thúc phiên làm việc

1. Chạy `npm run lint`. Chạy kiểm tra kiểu dữ liệu/build khi phù hợp; báo cáo kết quả thực tế và trở ngại. Với bản mã mới lấy về, tạo kiểu dữ liệu tuyến đường của Next.js trước khi kiểm tra kiểu (xem `docs/CURRENT_STATE.md`).
2. Cập nhật `docs/CURRENT_STATE.md` sau công việc đáng kể, ghi phần hoàn thành đã xác minh, vấn đề còn lại, kết quả kiểm tra và một nhiệm vụ tiếp theo cụ thể.
3. Chỉ cập nhật nội dung quyết định trong `docs/DECISIONS.md` khi quyết định sản phẩm hoặc kiến trúc thực sự thay đổi; đồng bộ tài liệu liên quan. Có thể dịch hoặc chỉnh cách diễn đạt mà không thay đổi quyết định.
4. Báo cáo công việc hoàn thành, file thay đổi, vấn đề chưa giải quyết và nhiệm vụ tiếp theo cụ thể.
5. Không tự động commit hoặc push. Chỉ thực hiện khi được yêu cầu rõ ràng.
