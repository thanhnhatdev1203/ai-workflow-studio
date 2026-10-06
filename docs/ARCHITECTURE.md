# AI Workflow Studio — kiến trúc

Cập nhật **2026-10-07** theo core Prompt Optimizer và Prompt Repair Loop. Phân biệt rõ **prototype đã triển khai** với **dịch vụ dự kiến**; xem [CURRENT_STATE.md](CURRENT_STATE.md) để biết kết quả kiểm tra.

## Nền tảng hiện tại

Một ứng dụng Next.js App Router 16.3.8, React 19.2.8, TypeScript strict, Tailwind 4 và CSS/CSS Modules. SVG icons nội bộ, không thêm thư viện UI/animation. Các dịch vụ dự kiến vẫn là Supabase/PostgreSQL/Auth + Google OAuth, SePay/VietQR, Resend khi cần và Vercel. Chưa tích hợp các dịch vụ đó. Redis/R2 chỉ thêm khi có nhu cầu cụ thể.

Đọc guide tương ứng trong `node_modules/next/dist/docs/` trước khi viết mã. Server pages đọc `searchParams` bất đồng bộ và chuyển dữ liệu sang client components. `/app` và các đường dẫn cũ dùng server redirect.

## Luồng prototype trong trình duyệt

```text
Browser
  ↓
Prompt Optimizer UI
  ↓
Prompt Type / Domain / Task Selector
  ↓
Prompt Diagnosis (tiêu chí chung + chuyên ngành)
  ↓
Prompt Score (mock 0–100)
  ↓
Prompt Optimizer (ghép văn bản mock)
  ↓
Prompt Version → Before / After → Copy
  ├── Optional Runner → output mẫu
  └── Output từ AI bên ngoài + feedback
                ↓
          Diagnose Failure
                ↓
          Prompt Repair (mock)
                ↓
          Phiên bản mới → Copy / Run tùy chọn → Save
```

Không có network request AI/backend trong luồng này. Optimize tạo cặp phiên bản gốc/tối ưu; Repair thêm phiên bản liên kết `parentId`. Chỉ click Chạy thử mới hiển thị output soạn sẵn. Image/video không có runner tạo media.

| Module thực tế | Trách nhiệm |
| --- | --- |
| `src/lib/prompt-catalog.ts` | 5 loại, 12 lĩnh vực, task taxonomy, form fields, 27 templates, vấn đề repair và alias mẫu cũ |
| `src/lib/prompt-model.ts` | Kiểu prompt/phiên bản/options/brand, dữ liệu mẫu, mock optimize/repair/output |
| `src/components/prompt-optimizer.tsx` | Trạng thái form, diagnosis, before/after, copy, optional runner, output+feedback, repair, chọn/lưu phiên bản |
| `src/components/prototype-provider.tsx` | Thư viện prompt/brand dùng chung, favorite, localStorage schema, validation cơ bản, thông báo |
| `src/components/prompt-library.tsx` | Prompt của tôi, lịch sử các phiên bản đã lưu, favorites, tìm/lọc, liên kết sửa/xem phiên bản |
| `src/components/template-browser.tsx` | Tìm/lọc template đa ngành, mở optimizer bằng dữ liệu mẫu |
| `src/components/app-shell.tsx` | Navigation core/support; sidebar desktop và drawer tablet/mobile |
| `src/components/landing-experience.tsx` | Navigation trang chủ, ví dụ trước/sau+repair, chuyển động nền/reveal theo cuộn native |

## Routes

| Route | Hành vi hiện tại |
| --- | --- |
| `/` | Landing page giới thiệu core và demo mock |
| `/app/optimize` | Optimizer; query `template`, `prompt`, `mode=repair`, `version` |
| `/app/prompts` | Prompt của tôi |
| `/app/history`, `/app/favorites`, `/app/templates` | Lịch sử phiên bản đã lưu, yêu thích, thư viện mẫu |
| `/app/brand`, `/app/billing`, `/app/settings` | Tính năng hỗ trợ minh họa |
| `/login`, `/register` | Form demo; không có phiên đăng nhập thật |
| `/app` | Redirect tới `/app/optimize` |
| `/app/new` | Redirect tới optimizer và giữ query `template` |
| `/app/workflows` | Redirect tới `/app/prompts` |

## Dữ liệu mock và phiên bản

`PromptRecord` giữ id, name, type, domainId/taskId, input, context, advanced options, lựa chọn `brandUsed`, versions, favorite và updatedAt. `PromptVersion` giữ id, số phiên bản, kind, text, score, parentId tùy chọn, output tùy chọn và repair metadata (output, problem IDs, feedback, external/runner). Phiên bản gốc/tối ưu/sửa được thêm vào danh sách, không ghi đè văn bản phiên bản cũ; runner gắn output mẫu vào phiên bản đang chọn.

`studioflow-prompts-v1` lưu `{ schema: 1, prompts, brand }` trong localStorage. `useSyncExternalStore` dùng snapshot SSR ổn định, hydrate rồi đọc dữ liệu trình duyệt; thay đổi favorite/brand/prompt được chia sẻ giữa các màn hình và tab cùng origin. Dữ liệu sai schema/kiểu cơ bản quay về mẫu; nếu browser chặn storage/quota, giữ trong bộ nhớ phiên và báo đúng trạng thái. Không phải database, auth hoặc kiểm soát quyền sở hữu.

Key workflow cũ `studioflow-saved-workflows` không bị xóa và chưa được chuyển đổi. Dữ liệu khác origin (port khác cũng khác) không tự chia sẻ. Chưa có import/export, migration, đồng bộ cloud hoặc kiểm soát quota thật. Lịch sử nhóm theo lần cập nhật prompt và thứ tự phiên bản; chưa có timestamp riêng từng version.

## Kiến trúc dịch vụ sau này — chỉ tài liệu hóa

```text
Browser → Next.js API / server handlers
             ├── Prompt Diagnosis Service
             ├── Prompt Optimization Service
             ├── Prompt Repair Service
             ├── Prompt Version Service
             ├── Template Service
             ├── Optional Runner
             ├── Usage / Cost
             └── Billing
                      ↕
             Supabase / PostgreSQL

Optimization / Repair / Runner
        → AI Router → Provider abstraction → External AI API
Auth → Supabase Auth / Google OAuth
Billing → SePay / VietQR; webhook → xác minh → cập nhật quyền lợi
Email phía máy chủ khi cần → Resend
```

Đây là các trách nhiệm trong một ứng dụng, không phải microservices được triển khai hay hệ thống nhiều tác nhân. Bản chuyển hướng và bàn giao ngày 2026-10-07 **chưa tạo API, dịch vụ, database/migration hoặc kết nối AI thật**. Phần dưới định hướng cho nhiệm vụ logic được giao sau này, không tự cấp phép triển khai trong phiên bàn giao.

- **Diagnosis:** trả tiêu chí chung/ngữ cảnh, phần thiếu và gợi ý; Score dùng quy tắc TypeScript 0–100, không dùng AI. UI có thể preview nhưng máy chủ tính lại dữ liệu được lưu.
- **Optimization:** cấu trúc prompt theo domain/task/context; không tự gọi runner.
- **Repair:** nhận prompt/version, output và feedback; coi output ngoài là dữ liệu tham chiếu, không là chỉ dẫn đáng tin; tạo version mới và giữ quan hệ nguồn.
- **Version:** xác minh ownership, giữ version history và output/feedback liên quan, kiểm soát cập nhật đồng thời.
- **Template:** phục vụ taxonomy, mẫu và options; không rải danh mục giữa nhiều màn hình.
- **Runner:** thao tác riêng có quyền lợi/hạn mức Generate; chỉ chạy khi người dùng yêu cầu. Không đưa image/video generation vào phạm vi.
- **Usage/Cost:** hạn mức hiển thị Optimize/Generate và sổ chi phí nội bộ riêng. Cách tính Repair, refund/retry/reset chưa chốt.
- **Billing:** chỉ backend xác minh và kích hoạt gói; UI đọc trạng thái, không tự cấp quyền.

## Dữ liệu máy chủ dự kiến

Chỉ định nghĩa trách nhiệm, chưa chốt schema hoặc tạo bảng:

| Thực thể dự kiến | Trách nhiệm |
| --- | --- |
| `profiles` | Liên kết người dùng Supabase đã xác thực |
| `templates` | Mẫu và metadata type/domain/task |
| `prompts` | Prompt thuộc người dùng, context/options, favorite, phiên bản hiện tại |
| `prompt_versions` | Văn bản/điểm phiên bản, nguồn và feedback repair; không ghi đè lịch sử |
| `prompt_runs` | Lần chạy tùy chọn gắn version, output và trạng thái |
| `brand_profiles` | Context thương hiệu tùy chọn |
| `usage_monthly` | Hạn mức Optimize/Generate theo kỳ |
| `ai_usage` | Mỗi lần gọi/thử gọi provider |
| `subscriptions`, `payments` | Gói/kỳ hiệu lực, thanh toán dự kiến và trạng thái đã xác minh |

Không lấy bảng `workflows` hoặc automation làm thực thể core mới. Thiết kế bảng/chỉ mục cụ thể khi có nhiệm vụ backend. Quyền sở hữu, RLS, giao dịch nguyên tử, xác thực server và xử lý webhook lũy đẳng vẫn bắt buộc khi triển khai thật.

## Provider, định tuyến và chi phí

Mọi AI thao tác chạy phía máy chủ: **UI → API → AI Router → Provider abstraction → External API**. Không đưa SDK/bí mật hoặc selector GPT/Claude/Gemini/OpenRouter vào UI. Bí danh nội bộ `cheap`, `standard`, `premium` được ánh xạ sang provider/model trong cấu hình tập trung; không rải tên model vào logic nghiệp vụ. Chỉ thêm adapter cần thiết, không implement mọi provider theo danh sách lý thuyết.

Hợp đồng `generateText(request): Promise<TextResult>` là minh họa, chưa triển khai. Chuẩn hóa messages, giới hạn output, token usage và dữ liệu chi phí. Optimization/repair nhẹ có thể dùng `cheap`; runner thông thường `standard`; `premium` chỉ khi cần và có kiểm soát chi phí. Provider/model/chính sách fallback cụ thể chưa chốt. Hỗ trợ streaming khi cần, không xây trước.

Mỗi AI call, gồm thất bại/thử lại, phải ghi: `user_id`, `prompt_run_id` nếu có (và liên kết version khi phù hợp), `provider`, `model`, `input_tokens`, `output_tokens`, `cached_tokens` khi có, `action_type` (optimize/repair/generate), `cost_usd`, `latency_ms`, `success`, `created_at`. Phân biệt số liệu ước tính và thực tế; thiếu usage không được xem là chi phí 0 đã xác minh.

Giá provider cần kiểm chứng khi tích hợp. Báo cáo chi phí theo ngày/tháng, người dùng/gói/domain/task và tỷ lệ chi phí AI/doanh thu dùng cùng kỳ và tiền tệ; chưa chốt nguồn VND/USD hoặc cách giữ gói lịch sử. Không hiển thị token/model nội bộ thành lựa chọn cho người dùng cuối.

## Ranh giới bảo vệ khi triển khai thật

Máy chủ kiểm tra phiên, ownership, domain/task/type, độ dài đầu vào/đầu ra, quota, quyền lợi và rate limit; không tin dữ liệu localStorage/client. Output bên ngoài là dữ liệu không tin cậy. Bí mật/provider/service-role/payment chỉ ở server. Lỗi trả về an toàn và không chứa nội bộ nhạy cảm.

Supabase Auth + Google OAuth là định hướng, loại đăng nhập email chưa chốt. SePay webhook phải xác thực nguồn, khớp số tiền/mã tham chiếu, chống trùng bằng transaction ID và cập nhật payment/subscription nhất quán. Form demo và thông báo local hiện không đáp ứng các yêu cầu này. Không thêm luồng approval vào UI prototype như thể backend đã tồn tại.

## Điểm nối khi triển khai logic thật

Đối chiếu [research Promptify](research/PROMPTIFY_RESEARCH.md) để hiểu pattern và câu hỏi chưa có chứng cứ; không dùng giao diện đối thủ để suy ra hợp đồng API của họ. Bảng dưới mô tả trách nhiệm cho StudioFlow, chưa phải API đã chốt.

| Nghiệp vụ | Điểm mock hiện tại | Dữ liệu cần giữ khi thay bằng logic thật |
| --- | --- | --- |
| Diagnosis/Score | Mảng `criteria`, `fields` và score cố định trong `prompt-optimizer.tsx` | Nhận input/type/domain/task/context/options; trả tiêu chí có/thiếu, gợi ý và điểm chung/domain. Dùng quy tắc TypeScript, kiểm chứng trọng số riêng |
| Optimize | `mockOptimize` trong `prompt-model.ts`, action `optimize` trong UI | Nhận yêu cầu + context đã áp dụng; tạo version mới và before/after; không gọi runner. Giữ placeholder hoặc hỏi dữ kiện thiếu, không tự bịa |
| Run | `mockOutput`, action `run` | Nhận đúng version, kiểm tra entitlement/Generate quota; trả output gắn run/version; chỉ thực hiện do hành động chủ động |
| Diagnose Failure / Repair | Boolean `diagnosed`, ánh xạ `repairProblems`, `mockRepair` | Nhận version nguồn + output/source + problem IDs + feedback; trả chẩn đoán hữu ích và version mới; giữ parent, không thay văn bản cũ, không tự Run |
| Save/Versions/Favorite | `PrototypeProvider` và localStorage | Kiểm tra người dùng/ownership; lưu prompt và versions; favorite dùng cùng entity. Không giữ thông báo lưu local như thể đã đồng bộ server |
| Templates/Fields | Catalog và `getDynamicFields` | Duy trì ID ổn định và validation theo type/domain/task; đa ngành, không giới hạn về marketing; không tự chạy template |
| Brand Context | `brandUsed`, `BrandContext`, phần ghép `customContext` | Chọn dùng rõ ràng; áp dụng domain phù hợp; ghi lại context thực tế của version, không lấy profile mới sửa cho version cũ |
| Usage/Cost/Billing | Giá giả định, runner không trừ credit | Hạn mức và ledger server riêng; chốt repair/retry/refund/reset; payment state đã xác minh, không cấp gói từ client |

**Giới hạn dữ liệu hiện tại cần giải quyết lúc thiết kế phiên bản:** ID `v1`, `v2`... chỉ duy nhất trong một `PromptRecord`, không phải toàn hệ thống. `parentId` phải được hiểu cùng prompt owner/id. Type/domain/task/context/options nằm trên record, chưa snapshot độc lập ở mỗi version; metadata có thể đổi khi người dùng tối ưu lại. Mỗi version hiện chỉ giữ một output mẫu, chưa có nhiều run/timestamp. Nếu hỗ trợ chạy/sửa lại version cũ bằng backend, cần giữ context/metadata nguồn và lịch sử run tương ứng, tránh áp dụng task/brand mới vào text cũ.

**Trạng thái cần bổ sung khi có API:** request pending, thất bại an toàn, retry có kiểm soát và chống submit trùng. Chỉ công bố version/output khi thành công; giữ bản nguồn khi thất bại. Không trừ quota ở frontend hoặc tạo cost bằng 0 khi thiếu provider usage. Output ngoài hệ thống luôn là dữ liệu tham chiếu không đáng tin, không được đưa vào system instructions như một yêu cầu mới.

**Chưa chốt:** trọng số/thuật toán score, quyền ưu tiên giữa prompt và structured fields/brand, cách tính lượt Repair, policy phí thất bại/retry/refund, giới hạn prompt sau nhiều repair, auth email, provider routing thực tế và hợp đồng service. Danh sách này là các khoảng trống cần xử lý trong nhiệm vụ phù hợp, không phải một kế hoạch tự triển khai tất cả.
