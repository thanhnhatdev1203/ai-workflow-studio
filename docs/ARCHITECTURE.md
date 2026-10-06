# AI Workflow Studio — tài liệu kiến trúc

Đây là kiến trúc MVP dự kiến, không khẳng định các dịch vụ, tuyến đường hay bảng dữ liệu đã tồn tại. [CURRENT_STATE.md](CURRENT_STATE.md) ghi nhận bằng chứng triển khai; [PRODUCT.md](PRODUCT.md) xác định phạm vi sản phẩm.

## Công nghệ và phạm vi triển khai

| Lớp | Định hướng | Trạng thái hiện tại |
| --- | --- | --- |
| Ứng dụng | Next.js App Router, React, TypeScript, Tailwind CSS | Đã có bộ khung: Next.js 16.3.8, React 19.2.8, Tailwind 4; đã cấu hình TypeScript ở chế độ nghiêm ngặt |
| Thư viện giao diện | shadcn/ui khi phù hợp, biểu tượng lucide-react | Dự kiến; chưa cài đặt |
| Backend | Khả năng API/xử lý phía máy chủ của Next.js | Nền tảng có sẵn; chưa triển khai API nghiệp vụ |
| Cơ sở dữ liệu/xác thực | Supabase PostgreSQL, Supabase Auth, Google OAuth | Dự kiến; chưa tích hợp trong kho mã |
| Thanh toán | SePay / VietQR | Dự kiến |
| Email | Resend khi cần | Dự kiến; chưa thêm khi chưa cần |
| Triển khai | Vercel | Nền tảng ưu tiên; chưa xác minh việc triển khai |
| Hạ tầng tùy chọn | Redis; Cloudflare R2 | Hoãn đến khi có nhu cầu cụ thể |

Ban đầu giữ một ứng dụng duy nhất. Đọc hướng dẫn đã cài trong `node_modules/next/dist/docs/` trước khi triển khai các hành vi phụ thuộc Next.js. Không mặc định rằng quy ước của phiên bản cũ vẫn áp dụng.

## Sơ đồ kiến trúc tổng thể

```text
Trình duyệt (giao diện theo công việc; không có SDK nhà cung cấp hay lựa chọn mô hình)
  ↓
Ứng dụng Next.js
  ↓
Lớp API / xử lý phía máy chủ
  ├── Xác thực ─────────────────── Supabase Auth / Google OAuth
  ├── Dịch vụ quy trình ────────┐
  ├── Chấm điểm prompt          │
  │   (TypeScript cục bộ)       │
  ├── Bộ định tuyến AI          │
  │     ↓                      │
  │   Lớp trừu tượng            │
  │   nhà cung cấp AI           │
  │     ↓                      │
  │   API AI bên ngoài          │
  ├── Dịch vụ sử dụng/chi phí ──┤
  └── Thanh toán ───────────────┤
        ↕                      ↓
      SePay              PostgreSQL / Supabase

Email phía máy chủ khi cần → Resend
Webhook SePay → máy chủ xác minh → cập nhật thanh toán + thuê bao
```

Đây là cách phân chia trách nhiệm trong ứng dụng, không phải các dịch vụ được triển khai độc lập hay một hệ thống tác nhân phức tạp.

## Trách nhiệm của giao diện

Hiển thị mẫu công việc tiếng Việt, biểu mẫu có cấu trúc, hướng dẫn chấm điểm theo quy tắc, so sánh trước/sau, nội dung, chỉnh sửa nhanh, lịch sử, mục yêu thích, quy trình đã lưu, hồ sơ thương hiệu và hạn mức dễ hiểu. Hiển thị trạng thái thanh toán do backend trả về và mã QR/mã tham chiếu khi tạo thanh toán thành công.

Giao diện tuyệt đối không gọi SDK nhà cung cấp AI, lộ thông tin bí mật, chọn nhà cung cấp/mô hình, đóng vai trò quyết định quyền lợi trả phí hoặc kích hoạt thuê bao. Có thể xem trước điểm prompt bằng xử lý cục bộ; backend phải tính lại mọi điểm được lưu hoặc dùng làm căn cứ xử lý.

## Trách nhiệm của backend/API

Xác minh danh tính đã đăng nhập, cấu trúc yêu cầu, giới hạn đầu vào/đầu ra, quyền sở hữu, quyền lợi theo gói, hạn mức và tần suất sử dụng. Kết hợp yêu cầu công việc với bối cảnh thương hiệu phù hợp. Thực hiện chấm điểm theo quy tắc, tối ưu, tạo nội dung và chỉnh sửa nhanh qua các dịch vụ tương ứng. Lưu lượt chạy/quy trình, hạch toán sử dụng và chi phí, xử lý thanh toán đã xác minh, hạn chế quyền truy cập báo cáo quản trị.

Giữ logic nghiệp vụ có thể tái sử dụng phía sau Next.js Route Handlers hoặc các khả năng xử lý máy chủ phù hợp. Cấu hình nhà cung cấp AI và quyền truy cập đặc biệt vào Supabase/thanh toán chỉ nằm phía máy chủ. Không thêm backend riêng hoặc hàng đợi khi chưa có bằng chứng cần thiết.

## Xác thực

Dùng Supabase Auth cho xác thực email và Google OAuth. Liên kết `profiles` của ứng dụng với người dùng Supabase đã xác thực. Kiểm tra phiên đăng nhập phía máy chủ cho mọi thao tác được bảo vệ và kiểm tra quyền sở hữu ngay cả khi người dùng truy cập qua giao diện đã đăng nhập. Bảo vệ thao tác quản trị bằng phân quyền đã xác minh phía máy chủ.

Chưa quyết định dùng email/mật khẩu hay liên kết đăng nhập qua email. Khi triển khai, xử lý chuyển hướng OAuth và phiên đăng nhập phải theo hướng dẫn của nền tảng đã cài và tài liệu nhà cung cấp. Chi tiết phân quyền quản trị chưa được chốt; thấy liên kết quản trị không có nghĩa là được cấp quyền.

## Trách nhiệm cơ sở dữ liệu và các thực thể MVP dự kiến

PostgreSQL/Supabase lưu dữ liệu ứng dụng, bộ đếm hạn mức, hạch toán AI và trạng thái thanh toán. Dùng Row Level Security (RLS — bảo mật theo từng dòng dữ liệu) và ràng buộc quyền sở hữu. Dùng giao dịch/cập nhật nguyên tử để kiểm soát hạn mức và thay đổi quyền lợi thanh toán. Khóa có quyền service-role chỉ nằm phía máy chủ; mã dùng quyền đặc biệt vẫn phải kiểm tra phân quyền.

Hiện chỉ tài liệu hóa các thực thể sau. **Không tạo migration (tệp thay đổi cấu trúc cơ sở dữ liệu) trong nhiệm vụ tài liệu này.** Trường dữ liệu, chỉ mục và cấu trúc đầy đủ sẽ được thiết kế lúc triển khai.

| Thực thể | Trách nhiệm và quan hệ dự kiến |
| --- | --- |
| `profiles` | Danh tính trong ứng dụng của người dùng Supabase Auth; hồ sơ tối thiểu và liên kết vai trò/gói khi cần |
| `templates` | Định nghĩa mẫu theo công việc và hướng dẫn nhập yêu cầu |
| `prompt_runs` | Đầu vào, prompt gốc/đã tối ưu, điểm, kết quả và trạng thái lượt chạy thuộc người dùng; có thể liên kết mẫu, quy trình đã lưu và hồ sơ thương hiệu |
| `workflows` | Cấu hình/bối cảnh công việc tái sử dụng thuộc người dùng; có thể tạo nhiều lượt chạy |
| `brand_profiles` | Bối cảnh thương hiệu tái sử dụng thuộc người dùng; số lượng được phép tùy gói |
| `usage_monthly` | Hạch toán lượt Tối ưu/Tạo nội dung theo người dùng và kỳ tháng xác định |
| `ai_usage` | Một bản ghi cho mỗi lần gọi/thử gọi AI, thuộc một người dùng và có thể liên kết lượt chạy prompt |
| `subscriptions` | Thuê bao của người dùng, gói, kỳ hiệu lực và trạng thái quyền lợi |
| `payments` | Thanh toán của người dùng, số tiền/mã tham chiếu dự kiến, mã giao dịch nhà cung cấp và trạng thái xác minh |

Một người dùng có nhiều lượt chạy prompt, quy trình, hồ sơ thương hiệu được phép, bản ghi sử dụng tháng, lần gọi AI và bản ghi thanh toán. Giữ tính năng yêu thích tối giản, ví dụ dùng cờ đánh dấu trên thực thể thuộc người dùng sau khi chốt loại đối tượng được đánh dấu. Không mặc định thêm cấu trúc chợ mua bán, kho tài liệu hoặc không gian làm việc nhóm.

## Lớp trừu tượng nhà cung cấp và định tuyến AI

Luồng xử lý là giao diện → API → bộ định tuyến AI → lớp nhà cung cấp AI → API AI bên ngoài. Hỗ trợ Gemini, OpenAI, Anthropic và OpenRouter thông qua bộ chuyển đổi khi cần; không triển khai tất cả chỉ để đủ một danh sách lý thuyết.

Hợp đồng minh họa, chưa phải API đã triển khai:

```ts
interface AIProvider {
  generateText(request: TextRequest): Promise<TextResult>;
}
```

Thiết kế hợp đồng sau này cần nhận thông điệp đã chuẩn hóa, giới hạn đầu ra và thông tin mô hình từ cấu hình; trả về văn bản, số token đã chuẩn hóa, thông tin nhà cung cấp/mô hình và dữ liệu hạch toán. `TextRequest` và `TextResult` ở trên là kiểu dữ liệu minh họa. Chi tiết SDK riêng của nhà cung cấp nằm trong bộ chuyển đổi. Chừa khả năng hỗ trợ truyền kết quả từng phần (streaming) trong tương lai, không bắt buộc ở lần triển khai đầu.

Dịch vụ nghiệp vụ yêu cầu các bí danh nội bộ `cheap`, `standard` hoặc `premium`. Cấu hình tập trung phía máy chủ ánh xạ bí danh sang nhà cung cấp/mô hình cụ thể. Không rải tên mô hình trong logic nghiệp vụ. Hạch toán nội bộ phải giữ nhà cung cấp/mô hình thực tế đã dùng.

| Công việc | Định tuyến thông thường |
| --- | --- |
| Tối ưu prompt, viết lại đơn giản, rút ngắn, đổi giọng điệu/CTA, tạo tiêu đề, biến đổi nhẹ | `cheap` |
| Tạo nội dung hoàn chỉnh thông thường | `standard` |
| Công việc thực sự phức tạp, suy luận khó, trường hợp đặc biệt | `premium` khi có lý do phù hợp |

Backend tự cân bằng chất lượng và chi phí. Người dùng không kiểm soát định tuyến. Phải giới hạn và hạch toán việc chuyển sang phương án dự phòng/thử lại; thử lại tự động không được tạo chi phí nhà cung cấp không được ghi nhận. Nhà cung cấp, mô hình, ngưỡng chuyển lên mô hình mạnh hơn và chính sách thử lại cụ thể chưa được chốt.

## Theo dõi chi phí

Mọi lần gọi AI về sau phải ghi các trường này, gồm cả lần thất bại và từng lần thử lại với nhà cung cấp:

| Trường | Ý nghĩa |
| --- | --- |
| `user_id` | Người dùng chịu trách nhiệm cho lần gọi |
| `prompt_run_id` | Lượt chạy prompt liên quan, nếu có |
| `provider` | Nhà cung cấp thực tế đã dùng |
| `model` | Mô hình thực tế đã dùng |
| `input_tokens` | Số token đầu vào được báo cáo hoặc ước tính |
| `output_tokens` | Số token đầu ra được báo cáo hoặc ước tính |
| `cached_tokens` | Số token dùng bộ nhớ đệm khi có dữ liệu |
| `action_type` | Tối ưu, tạo nội dung hoặc phép biến đổi cụ thể |
| `cost_usd` | Chi phí lần gọi bằng USD, ước tính hoặc thực tế |
| `latency_ms` | Thời gian thực hiện lần gọi |
| `success` | Lần gọi có thành công hay không |
| `created_at` | Thời điểm ghi nhận |

Phân biệt giá trị thực tế với ước tính; dữ liệu sử dụng không có không được âm thầm coi là chi phí bằng 0 đã xác minh. Dữ liệu giá nằm trong cấu hình tập trung phía máy chủ và phải được kiểm chứng khi tích hợp nhà cung cấp. Giữ đủ thông tin liên hệ gói/quy trình để báo cáo chi phí lịch sử ngay cả khi người dùng đổi gói. Cách lưu thông tin liên hệ cụ thể chưa được quyết định.

Hỗ trợ báo cáo chi phí AI hôm nay/tháng này, theo người dùng/gói/quy trình, người dùng/quy trình tốn kém nhất và tỷ lệ Chi phí AI / Doanh thu. Quy đổi doanh thu VND và chi phí USD về cùng tiền tệ và kỳ báo cáo trước khi tính tỷ lệ. Nguồn tỷ giá và chính sách báo cáo chưa được chốt. Không hiển thị token nội bộ hoặc thông tin nhà cung cấp dưới dạng lựa chọn mô hình trong giao diện người dùng cuối.

## Kiểm soát hạn mức

Hạn mức Tối ưu/Tạo nội dung theo tháng hiển thị cho người dùng tách biệt với chi phí AI nội bộ. Giới hạn quy trình, hồ sơ thương hiệu và thành viên là giới hạn số lượng. Backend kiểm tra quyền lợi và giữ trước/cập nhật lượt sử dụng một cách nguyên tử quanh các hành động tính lượt, để các yêu cầu đồng thời không vượt hạn mức. Chốt hoặc trả lại lượt giữ trước theo chính sách xử lý thất bại sẽ được quyết định. Ghi chi phí của từng lần thử lại độc lập với hạn mức hiển thị.

Ưu tiên hạch toán bằng cơ sở dữ liệu; không cần Redis chỉ để kiểm soát hạn mức. Trước khi triển khai, chốt thời điểm/múi giờ đặt lại, tháng dương lịch hay chu kỳ thuê bao, thử lại/thất bại, cách tính lượt chỉnh sửa nhanh và hạn dùng/thứ tự trừ gói mua thêm. Khi chưa chốt, không trình bày những điểm này như hành vi sản phẩm đã xác định.

## Kiến trúc thanh toán

Tạo thanh toán → Hiển thị QR / mã tham chiếu → Người dùng chuyển tiền → Webhook SePay → Backend xác minh webhook → Kiểm tra số tiền/mã tham chiếu → Đánh dấu đã thanh toán → Kích hoạt thuê bao.

Máy chủ tạo giá/gói/số tiền/mã tham chiếu dự kiến từ cấu hình đáng tin cậy. Khi triển khai, xác minh tính xác thực webhook bằng cơ chế SePay hỗ trợ; hiện không giả định định dạng chữ ký cụ thể. Đối chiếu thanh toán dự kiến, số tiền và mã tham chiếu trước khi cấp quyền lợi.

Bảo đảm tính lũy đẳng (xử lý lặp không tạo thêm tác động) bằng mã giao dịch/thanh toán nhà cung cấp duy nhất và thay đổi trạng thái trong giao dịch cơ sở dữ liệu. Thông báo trùng không được gia hạn hoặc kích hoạt quyền lợi nhiều lần. Sự kiện không hợp lệ/không khớp không được cấp quyền. Chuyển hướng trình duyệt, kiểm tra trạng thái định kỳ và thông tin do phía khách gửi chỉ được dùng để đọc trạng thái thanh toán phía máy chủ; giao diện tuyệt đối không tự kích hoạt gói trả phí. Chính sách gia hạn, hết hạn và thanh toán không khớp chưa được chốt.

## Nguyên tắc bảo mật

- Supabase Row Level Security và kiểm tra quyền sở hữu rõ ràng với dữ liệu người dùng.
- Khóa AI, thanh toán, email và quyền cơ sở dữ liệu đặc biệt chỉ nằm phía máy chủ.
- Kiểm tra dữ liệu yêu cầu, xác thực, phân quyền, giới hạn tần suất và độ dài đầu vào/đầu ra trước công việc tốn chi phí.
- Xác minh webhook an toàn, xử lý lũy đẳng và cập nhật quyền lợi trong giao dịch cơ sở dữ liệu.
- Thông báo lỗi an toàn cho phía khách, không lộ bí mật hoặc phản hồi nội bộ của nhà cung cấp.
- Hạn chế truy cập dữ liệu chi phí/quản trị đặc quyền; không tin ID, giá, hạn mức hoặc thông tin gói do người dùng tự gửi.

## Các tuyến đường dự kiến

Các đường dẫn này là định hướng tạm thời, chưa được triển khai và không mở rộng phạm vi. `/` hiện là trang mặc định của bộ khung.

| Tuyến đường | Mục đích |
| --- | --- |
| `/` | Trang giới thiệu |
| `/login`, `/signup`, `/auth/callback` | Điểm vào đăng nhập/đăng ký và xử lý kết quả xác thực |
| `/dashboard` | Bắt đầu công việc và xem tổng quan |
| `/templates`, `/templates/[id]` | Danh mục công việc và nhập yêu cầu |
| `/runs/[id]` | So sánh trước/sau, kết quả và chỉnh sửa nhanh |
| `/history`, `/favorites` | Công việc trước đây và mục đã đánh dấu |
| `/workflows`, `/workflows/[id]` | Quy trình đã lưu và tái sử dụng |
| `/brand-profiles` | Bối cảnh thương hiệu tái sử dụng |
| `/billing` | Gói, hạn mức, tạo/xem trạng thái thanh toán |
| `/admin` | Báo cáo tối thiểu có giới hạn quyền truy cập |

## Định hướng API dự kiến

Dùng `src/app/api/**/route.ts` làm điểm xử lý HTTP khi cần. Các khả năng xử lý máy chủ có thể dùng chung dịch vụ; tránh tạo điểm truy cập công khai trùng lặp. Hợp đồng dữ liệu cụ thể chưa được chốt.

| Điểm xử lý tạm đề xuất | Trách nhiệm |
| --- | --- |
| `GET /api/templates` | Danh mục mẫu công việc |
| `POST /api/prompt-score` | Chấm điểm theo quy tắc nếu cần truy cập máy chủ; một hàm cục bộ dùng chung có thể đã đủ |
| `POST /api/runs/optimize` | Tối ưu có xác minh yêu cầu, lưu lượt chạy và hạch toán hạn mức/chi phí |
| `POST /api/runs/[id]/generate` | Tạo nội dung hoàn chỉnh |
| `POST /api/runs/[id]/edit` | Chỉnh sửa nhanh qua định tuyến chi phí thấp |
| `/api/runs`, `/api/workflows`, `/api/brand-profiles` | Đọc/ghi lịch sử và tài nguyên thuộc người dùng khi cần |
| `GET /api/usage` | Tóm tắt hạn mức và giới hạn số lượng cho người dùng |
| `POST /api/payments`, `GET /api/payments/[id]` | Tạo yêu cầu thanh toán đáng tin cậy và đọc trạng thái thuộc người dùng |
| `POST /api/webhooks/sepay` | Xác minh sự kiện nhà cung cấp đã xác thực và cập nhật quyền lợi lũy đẳng |
| `GET /api/admin/metrics` | Báo cáo nội bộ người dùng/doanh thu/chi phí/sử dụng có phân quyền |

Đây là các điểm truy cập của ứng dụng, không phải sản phẩm API công khai để bán. Tính năng yêu thích nên cập nhật tối thiểu trên tài nguyên thuộc người dùng đã chọn, thay vì thêm dịch vụ không cần thiết.

## Công việc xử lý cục bộ/theo quy tắc xác định

Dùng logic TypeScript/cơ sở dữ liệu thông thường cho chấm điểm prompt, định nghĩa mẫu, kiểm tra biểu mẫu, tính hạn mức, quyền lợi theo gói, tra giá, tính chi phí, đối chiếu thanh toán/xử lý lũy đẳng, quyền sở hữu và báo cáo. AI dùng cho tối ưu prompt, tạo nội dung hoàn chỉnh và các biến đổi văn bản được hỗ trợ. Không gọi AI cho hạch toán, kiểm soát truy cập hoặc quyết định thanh toán.
