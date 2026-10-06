# AI Workflow Studio — trạng thái hiện tại

- **Cập nhật lần cuối:** 2026-10-06 (Asia/Ho_Chi_Minh).
- **Nhánh hiện tại khi kiểm tra:** `phase1/mvp`.
- **Commit nền trước khi lưu bộ tài liệu vào Git:** `af9440b` — `chore: initialize Next.js project`. Dùng `git log -1` để xem commit mới nhất sau phiên này.
- **Kho GitHub từ xa đã cấu hình:** `origin` → `https://github.com/thanhnhatdev1203/ai-workflow-studio.git`.

## Trạng thái kho mã hiện tại

Đã xác minh bằng cách kiểm tra trạng thái Git, nhánh, kho từ xa, commit mới nhất, danh sách file được theo dõi, mã nguồn, cấu hình/thư viện và hướng dẫn Next.js đã cài. Cây làm việc sạch trước nhiệm vụ tạo tài liệu ban đầu. Khi bắt đầu phiên commit, chỉ có thay đổi ở năm file tài liệu. Đã xác minh cấu hình kho GitHub từ xa; trạng thái đồng bộ sau push cần đối chiếu với kết quả Git cuối phiên. Chưa xác minh website đã triển khai.

Ứng dụng là bộ khung Next.js App Router trong `src/app`. `page.tsx` hiển thị nội dung create-next-app và các liên kết Next.js/Vercel. `layout.tsx` vẫn dùng thông tin mô tả mặc định, ngôn ngữ tài liệu tiếng Anh và phông Geist từ `next/font/google`. `globals.css` chứa Tailwind/kiểu cơ bản của bộ khung. File trong `public` là tài nguyên mặc định.

`package.json` khai báo Next.js 16.3.8, React/React DOM 19.2.8, TypeScript, Tailwind 4 và ESLint 9 với cấu hình Next.js. Đã cấu hình TypeScript ở chế độ nghiêm ngặt và bí danh `@/*` → `src/*`. `package-lock.json` của npm được theo dõi trong Git. Các lệnh được khai báo là `dev`, `build`, `start` và `lint`; chưa có lệnh riêng cho kiểm tra kiểu dữ liệu hoặc kiểm thử.

Mã nguồn đã kiểm tra chưa có tuyến API nghiệp vụ, dịch vụ, cấu trúc/migration cơ sở dữ liệu, tích hợp xác thực, nhà cung cấp AI, thanh toán hoặc giao diện sản phẩm. Supabase, SePay, Resend, shadcn/ui và lucide-react chưa nằm trong danh sách thư viện. Không tìm thấy mẫu cấu hình môi trường cho sản phẩm hoặc bộ kiểm thử trong các file được theo dõi. Chưa biết trạng thái tài khoản/dịch vụ bên ngoài; chưa tích hợp trong kho mã không đồng nghĩa chưa có tài khoản.

## Đã hoàn thành

- Khởi tạo bộ khung Next.js/React/TypeScript/Tailwind, cấu hình lint và file khóa thư viện npm.
- Khởi tạo Git với commit nêu trên và cấu hình GitHub `origin`.
- Bổ sung hướng dẫn lâu dài cho tác nhân vào `AGENTS.md`, giữ nguyên quy tắc Next.js tự quản lý. `CLAUDE.md` hiện trỏ tới `AGENTS.md`.
- Tạo đặc tả sản phẩm, kiến trúc dự kiến, chín quyết định đã chấp nhận và tài liệu bàn giao đã kiểm tra này trong `docs/`.
- Chuyển nội dung năm file tài liệu sang tiếng Việt theo yêu cầu, giữ thông số, tên kỹ thuật, đường dẫn và các quyết định. Khối Next.js tự quản lý vẫn bằng tiếng Anh; có giải thích tiếng Việt ngay bên dưới.
- Giữ phạm vi chỉ sửa tài liệu: không thay đổi hành vi ứng dụng, cài thư viện hoặc tạo migration.

Trong các phiên tạo và dịch tài liệu, thay đổi chỉ được lưu cục bộ, chưa commit/push. Người dùng đã yêu cầu rõ ràng commit bộ tài liệu và push nhánh `phase1/mvp` lên GitHub ở phiên tiếp theo này. Kết quả commit/push được xác minh bằng Git và báo cáo cuối phiên; dùng `git status`, `git log -1` và trạng thái nhánh từ xa để đối chiếu khi chuyển máy.

## Đang thực hiện

Không có tính năng sản phẩm đang được triển khai trong trạng thái kho mã này. Phiên hiện tại chỉ đưa bộ tài liệu bàn giao bằng tiếng Việt vào Git/GitHub theo yêu cầu; điều này không có nghĩa tính năng đã được triển khai.

## Chưa bắt đầu

- Trang giới thiệu sản phẩm và trải nghiệm ứng dụng tiếng Việt.
- Xác thực email, đăng nhập Google, trang tổng quan và bảo vệ quyền truy cập người dùng.
- Mẫu công việc, chấm điểm prompt theo quy tắc và so sánh trước/sau.
- Lớp trừu tượng nhà cung cấp, định tuyến tự động, tối ưu prompt, tạo nội dung hoàn chỉnh và chỉnh sửa nhanh.
- Lịch sử, mục yêu thích, lưu/tái sử dụng quy trình và hồ sơ thương hiệu.
- Cấu trúc dữ liệu Supabase, Row Level Security, kiểm soát quyền sở hữu và kiểm tra yêu cầu/tần suất/độ dài.
- Kiểm soát hạn mức tháng, theo dõi sử dụng/chi phí AI và báo cáo chi phí.
- Gói thuê bao, thanh toán SePay/VietQR, xác minh webhook/xử lý lũy đẳng và kích hoạt quyền lợi.
- Báo cáo quản trị tối thiểu về người dùng, gói, doanh thu, thanh toán, mức sử dụng và chi phí.
- Công cụ đo lường để kiểm chứng sản phẩm và triển khai đã xác minh.

## Kết quả kiểm tra

- `npm run lint` — đạt (mã thoát 0); đã chạy lại sau khi dịch tài liệu.
- `./node_modules/.bin/tsc --noEmit --incremental false` — đạt (mã thoát 0) trong phiên tạo tài liệu trước, dùng kiểu dữ liệu Next.js đã sinh trên máy lúc kiểm tra. Không cần chạy lại cho thay đổi chỉ dịch Markdown.
- Đã kiểm tra liên kết cục bộ, chín ADR, thông số và khối Next.js được giữ nguyên sau khi dịch.
- Bản build dùng để triển khai thực tế — chưa chạy; nhiệm vụ chỉ sửa Markdown. Lint/kiểm tra kiểu đạt không chứng minh ứng dụng đã sẵn sàng triển khai.

Với bản mã npm mới lấy về, dùng `npm ci`, sau đó `npm exec -- next typegen` trước `npm exec -- tsc --noEmit --incremental false`. Next.js tạo kiểu dữ liệu tuyến đường và `next-env.d.ts`; đây không phải tính năng sản phẩm. Đọc hướng dẫn đã cài trước khi triển khai. Không giả định rằng các file đã sinh trên máy này có sẵn trên máy khác.

## Vấn đề đã biết và câu hỏi chưa chốt

- Trang hiện tại, thông tin mô tả và `lang="en"` vẫn là mặc định của bộ khung, chưa phải trải nghiệm sản phẩm tiếng Việt mong muốn.
- Chưa hoàn thành tính năng sản phẩm nào; các dịch vụ và tuyến đường trong `ARCHITECTURE.md` là đề xuất.
- Giá và hạn mức là giả định cần kiểm chứng. Chưa quy định số hồ sơ thương hiệu/thành viên của FREE, số quy trình BUSINESS và số thành viên của các gói còn lại.
- Chưa chốt cách tính lượt chỉnh sửa nhanh, thời điểm/múi giờ đặt lại hạn mức tháng, xử lý thất bại/thử lại và hạn dùng/thứ tự trừ gói mua thêm.
- Chưa quyết định trọng số/quy tắc chấm điểm prompt, cách xác thực email, loại đối tượng yêu thích, thứ tự ưu tiên bối cảnh thương hiệu, phân quyền quản trị và cách gắn chi phí lịch sử với gói.
- Làm việc nhóm/không gian làm việc BUSINESS và quy trình nâng cao CREATOR là định hướng sau này, không phải lý do mở rộng ngay cấu trúc dữ liệu ban đầu.
- Chi tiết xác thực SePay phải được kiểm chứng khi tích hợp; chính sách gia hạn, hết hạn và thanh toán không khớp chưa được chốt.
- Chưa xác minh mô hình AI bên ngoài, thông tin truy cập, thiết lập dịch vụ hoặc triển khai. Trạng thái đồng bộ kho từ xa cần kiểm tra qua Git sau push.
- Báo cáo chi phí/doanh thu cần chính sách quy đổi VND/USD thống nhất; định nghĩa nhóm đo lường và ngưỡng kiểm chứng bằng số chưa được chốt.

## Nhiệm vụ tiếp theo được đề xuất

**Xây dựng một trang giới thiệu tiếng Việt tại `/`, giải thích quy trình từ công việc đến kết quả và mời đăng ký.** Thay nội dung mặc định, cập nhật thông tin mô tả sản phẩm/ngôn ngữ tài liệu. Đưa ví dụ công việc quen thuộc và ghi rõ giá hiển thị là giả định hiện tại. Kiểm tra lint và kiểu dữ liệu/build khi phù hợp, rồi cập nhật tài liệu bàn giao. Nhiệm vụ này chưa được thực hiện; không bao gồm triển khai xác thực, AI, cơ sở dữ liệu hoặc thanh toán.

## Lưu ý quan trọng cho phiên tiếp theo

1. Đọc `AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DECISIONS.md` và file này trước khi viết mã; kiểm tra lại mã nguồn và trạng thái Git thực tế.
2. GitHub là bộ nhớ dùng chung của dự án; phân biệt thay đổi cục bộ chưa commit với trạng thái đã commit/push. Không commit hoặc push khi chưa được yêu cầu rõ ràng.
3. Giữ nguyên khối hướng dẫn Next.js tự quản lý và đọc tài liệu nền tảng cục bộ liên quan. README gốc vẫn là hướng dẫn chung; mã nguồn quyết định đường dẫn đúng (`src/app`, thay vì ví dụ `app` chung trong README).
4. Giữ giai đoạn 1 chỉ xử lý văn bản và ưu tiên công việc. Không cho người dùng chọn mô hình; không dùng AI để chấm điểm prompt; mọi lần gọi AI sau này phải có theo dõi chi phí.
5. Không tạo migration hoặc triển khai nhiệm vụ tiếp theo trong phiên chỉ sửa tài liệu này.
