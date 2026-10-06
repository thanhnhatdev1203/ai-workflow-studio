# AI Workflow Studio — trạng thái hiện tại

- **Cập nhật:** 2026-10-07, Asia/Ho_Chi_Minh.
- **Nhánh đã kiểm tra:** `phase1/mvp`.
- **Commit nền trước khi đóng gói bàn giao:** `7a53ebc` — `docs: add Vietnamese product and agent documentation`. Commit chứa bản bàn giao này được xác định bằng `git log -1` sau khi lấy nhánh, không hardcode hash của chính commit vào file của nó.
- **Origin:** `https://github.com/thanhnhatdev1203/ai-workflow-studio.git`.
- **Bản bàn giao:** người dùng đã yêu cầu commit/push toàn bộ prototype và tài liệu lên `origin/phase1/mvp` ngày 2026-10-07. GitHub trên nhánh này là nguồn lấy code cho máy công ty; trạng thái đồng bộ kiểm tra bằng Git, không suy ra từ lịch sử trò chuyện. Chưa xác minh website được deploy.

## Tiếp nhận trên máy công ty ngày 08/10/2026

1. Lấy đúng nhánh `phase1/mvp` theo [README.md](../README.md); với checkout hiện có, kiểm tra thay đổi local trước khi `git pull --ff-only`. Không reset/ghi đè công việc trên máy đó.
2. Đọc AGENTS → PRODUCT → ARCHITECTURE → DECISIONS → file này; khi làm UI/logic đọc thêm UI_UX_SPEC và [research Promptify](research/PROMPTIFY_RESEARCH.md). Yêu cầu mới của người dùng xác định việc được giao, không tự triển khai backend chỉ từ nội dung bàn giao.
3. Chạy `npm ci`, đọc guide Next.js trong `node_modules/next/dist/docs/`, dùng `npm run dev -- --webpack` để mở `/app/optimize`. Prototype không cần `.env`, API key hoặc auth thật. Nếu chạy TypeScript riêng, `npm exec -- next typegen` trước.
4. LocalStorage, phiên Promptify và cấu hình MCP không nằm trong Git; browser máy công ty có dữ liệu mẫu ban đầu. Research đã ghi vào Markdown, không cần phiên cũ để hiểu code. Máy mới muốn khảo sát lại cần cấu hình Chrome DevTools MCP và để người dùng đăng nhập thủ công.

Môi trường kiểm tra bàn giao: Node 25.8.1, npm 11.11.0; Next đã cài yêu cầu Node >=20.9.0. Repository chưa pin Node; chưa biết hệ điều hành/phiên bản Node hoặc khả năng chạy Turbopack trên máy công ty. Không tự nâng Next/dependencies khi tiếp nhận.

## Định hướng sản phẩm hiện tại

**Prompt Optimizer là core giai đoạn 1; Prompt Repair Loop là điểm khác biệt.** Workflow Studio/Workflow Automation không còn là core. Copy là hành động chính; Run tùy chọn, không tự chạy sau Optimize/Repair. Người dùng dán output từ AI bên ngoài hoặc dùng output runner để sửa prompt và tạo phiên bản mới.

Luồng: Prompt → Type/Domain/Task → Diagnosis/Score → Optimize → Before/After → Copy → Optional Run → Output + vấn đề + feedback → Diagnose Failure → Repair → New Version → Copy/Run lại → Save.

Toàn bộ thao tác AI, score, runner và repair hiện là **UI/mock**. Không triển khai backend, database/migration, Supabase, AI API, SePay, Resend hoặc xác thực thật. Type image/video chỉ tối ưu văn bản prompt, không tạo media. Task SEO/research chỉ cấu trúc yêu cầu, không tìm web. Không có model selector.

## Bằng chứng triển khai

| Phần | Trạng thái hiện tại |
| --- | --- |
| Prompt Optimizer | Textarea, chọn 5 loại/12 lĩnh vực/135 mục đích; ví dụ; form động; advanced options đóng mặc định; Brand Context tùy chọn |
| Diagnosis/Score | 7 tiêu chí chung và fields chuyên ngành; kiểm tra hiện diện dữ liệu; điểm cố định 42 → 91, repaired 94, chung /60 + ngữ cảnh /40, ghi rõ mock |
| Before/After | Hai cột desktop/tablet đủ rộng, xếp chồng điện thoại; highlights; chọn version; copy thật qua Clipboard API |
| Optional Runner | Chỉ click Chạy thử mới thấy output soạn sẵn gắn version; không gọi AI/trừ credit; image/video không chạy |
| Prompt Repair | Paste external output hoặc runner output; 12 vấn đề; feedback; diagnosis minh họa; append V3/V4... có parent/source/output/feedback; không tự chạy |
| Prompt của tôi | Name/domain/task/version/score/updated/favorite/copy/edit/repair/view versions; localStorage |
| History/Favorites | Dùng cùng prompt records; history liệt kê các phiên bản đã lưu, favorite đồng bộ các màn hình |
| Templates | 27 mẫu, 12 domain, 5 type; search/filter; chọn mẫu điền form, không tự optimize/run |
| Brand Context | 8 fields và lựa chọn dùng brand lưu trong browser; Marketing/Ecommerce/Affiliate/Sales/Social, không bắt buộc Coding/Education |
| Landing page | Giữ theme xanh/mint; hero nền chuyển động, capsule nav, reveal theo cuộn native; demo Marketing/Coding/Education và V3 repair; bento, mẫu đa ngành, giá tham khảo, FAQ, CTA |
| Supporting screens | Login/register/settings/billing vẫn là demo; không auth/thanh toán/kích hoạt gói thật |

Đổi domain/type khởi tạo ngữ cảnh mới. Thay đổi input/context/options khi đã có kết quả bật thông báo cần tối ưu lại và khóa copy/run/repair/save kết quả cũ. Optimize lại thêm cặp phiên bản gốc/tối ưu; Repair thêm một phiên bản, không ghi đè version nguồn. Edit hiện mở form để đổi đầu vào rồi tối ưu lại, chưa có editor trực tiếp text của version.

## Routes và file đã đổi

Routes chính: `/app/optimize`, `/app/prompts`, `/app/history`, `/app/templates`, `/app/favorites`. Supporting: `/app/brand`, `/app/billing`, `/app/settings`, `/login`, `/register`. `/app` redirect optimizer; `/app/new` giữ query template khi redirect; `/app/workflows` redirect Prompt của tôi.

- Catalog/model: `src/lib/prompt-catalog.ts`, `src/lib/prompt-model.ts`; `prototype-data.ts` chỉ giữ giá/hạn mức tham khảo, bỏ workflow/recentRuns cũ không còn dùng.
- Core UI: `src/components/prompt-optimizer.tsx`, `prompt-optimizer.module.css`, `prompt-library.tsx`, `prompt-library.module.css`, `template-browser.tsx`, `prototype-provider.tsx`, `app-shell.tsx`.
- Landing/shared: `src/app/page.tsx`, `landing.module.css`, `globals.css`, `layout.tsx`, `src/components/landing-experience.tsx`, nội dung auth và các route trong `src/app/app/`.
- Loại bỏ các component cũ không được import: `workflow-card.tsx`, `favorite-button.tsx`, adapter `content-studio.tsx`; đây là file prototype chưa được Git theo dõi trước phiên này.
- Cập nhật `README.md`, `AGENTS.md`, `docs/PRODUCT.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `UI_UX_SPEC.md`, file này và research duy nhất `docs/research/PROMPTIFY_RESEARCH.md`. `CLAUDE.md` tiếp tục trỏ tới `AGENTS.md`.

Khối Next.js tiếng Anh tự quản lý trong AGENTS được giữ nguyên. Không thêm dependency, API, migration hoặc secrets.

## Research đã sử dụng

Đã tìm toàn repository theo tên và nội dung; chưa có file research Promptify trước nhiệm vụ. Tổng hợp quan sát bằng Chrome DevTools MCP trong [PROMPTIFY_RESEARCH.md](research/PROMPTIFY_RESEARCH.md): trang chủ, optimize sau login, domain/options/suggestions, templates, history và favorites. Không submit tác vụ bên Promptify, đọc bí mật hay thay đổi tài khoản/thanh toán.

Các pattern ảnh hưởng: hero/demo trước đăng ký; chọn domain rồi đổi options; prompt-only tách khỏi generate; navigation thư viện/history/favorite; chuyển động có tiết chế. **Chưa quan sát repair/version V1/V2/V3 ở Promptify**; đó là yêu cầu riêng của StudioFlow. Không sao chép branding, source hoặc assets. Research phân biệt quan sát, suy luận và chưa xác định.

Trước khi commit, đã đọc thêm billing bằng Chrome DevTools MCP, không tạo QR/thanh toán: Free 20 optimize, Pro 299.000đ với 500 optimize/120 optimize+văn bản/20 optimize+ảnh, Business 999.000đ với 2.500/700/70 theo UI tháng. Bảng research giữ giá/quota, mức chưa xác minh và ánh xạ sang logic riêng của mình. Không sao chép quota/giá hoặc chức năng tạo ảnh sang StudioFlow.

ARCHITECTURE bổ sung điểm thay `mockOptimize`, `mockRepair`, `mockOutput`, cách tách diagnosis/score, input/output trách nhiệm dịch vụ và giới hạn context/version/ID hiện tại. Đây là định hướng cho nhiệm vụ logic sau, không phải backend đã triển khai. Các chính sách chưa chốt giữ nguyên.

## Dữ liệu prototype

`studioflow-prompts-v1` lưu schema 1 gồm prompt records + một Brand Context. Bốn prompt mẫu ban đầu có V1/V2; dữ liệu người dùng ghi vào browser cùng origin. Favorites, prompt versions và brand được chia sẻ giữa các màn hình/tab. Validate kiểu/schema cơ bản trước khi đọc; dữ liệu sai quay về mẫu. Nếu storage bị chặn/đầy, giữ bộ nhớ phiên và thông báo không lưu bền vững.

Key cũ `studioflow-saved-workflows` giữ nguyên, chưa migrate. Không đồng bộ cloud; đổi browser/origin/port không tự có dữ liệu. Các bản kiểm thử mới được tạo trong Chrome context riêng, không ghi đè thư viện của người dùng. Lịch sử chỉ chứa prompt/versions đã lưu; chưa có timestamp riêng cho version hoặc autosave thao tác.

## Kết quả kiểm tra

Phiên chuẩn bị commit chạy lại lint và Webpack build: cả hai đạt mã thoát 0. Không đổi code UI trong phiên đóng gói. Kết quả Chrome/Lighthouse bên dưới là bằng chứng từ nhiệm vụ UI cùng ngày, không phải khảo sát mới hoặc kiểm thử người dùng thật.

- **`npm run lint`: đạt**, mã thoát 0, không warning sau khi sửa ref cleanup của drawer.
- **`npm run build`: đã chạy**, Turbopack lỗi khi CSS worker tạo process/bind cổng: `Operation not permitted`. Cùng loại lỗi môi trường đã tồn tại ở phiên trước; không đổi build script để che kết quả.
- **`npm run build -- --webpack`: đạt**, mã thoát 0 sau sửa cuối, gồm TypeScript, page generation và route validation.
- **Chrome DevTools MCP:** kiểm tra dev Webpack ở port 3000 và production Webpack ở port 3001. Landing, optimizer có 4 versions, Prompt của tôi và Templates đều đo ở **375, 390, 768, 1280, 1440px**: `document.scrollWidth === innerWidth`; comparison một cột ở 375/390, hai cột từ 768; sidebar đóng/inert trên mobile/tablet. Có xem screenshot desktop optimizer, landing và repair mobile.
- **Core flow:** blank input khóa Optimize; Optimize tạo V1/V2, chưa có output; Copy chuyển đúng text đang chọn vào Clipboard API và báo thành công; external Repair tạo V3, giữ V2; chỉ click Run mới có output; runner Repair tạo V4, giữ source=runner; V4 chưa có output tự sinh. “Khác” khóa diagnosis khi thiếu feedback. Đổi input khóa copy/run/repair/save.
- **Lưu/tái sử dụng:** lưu đủ V1–V4, tên và favorite; mở lại/reload giữ dữ liệu; library có 4 version links và repair link đúng query; favorite toggle cập nhật danh sách; history có đủ 4 versions/links của prompt kiểm thử.
- **Brand Context:** chọn brand đưa context vào prompt tối ưu và lưu `brandUsed`; mở lại khôi phục checkbox. Chuyển sang Coding không kế thừa chỉ dẫn CTA bị ẩn từ lĩnh vực trước.
- **Form động:** kiểm tra Debug, Education lesson/quiz, Shopee/compare, Affiliate review; fields thay đúng theo task, Brand không bị bắt buộc Coding/Education. Image/video có fields riêng, tối ưu chỉ viết text và khóa runner; data có dataset/question/metrics/limits. Advanced fields và 12 domain/5 type có mặt.
- **Templates:** đủ 27 mẫu/12 filter; lọc Coding đúng 2 mẫu, tìm “giáo án” đúng mẫu, từ khóa không khớp có EmptyState. Homepage tab Coding và demo Repair đổi từ V2 sang V3 có chỉ dẫn sửa.
- **Điều hướng:** GET routes supporting/auth trả 200; `/app`, `/app/new?template=shopee`, `/app/workflows` theo redirect đúng đích. Drawer focus trap, Escape, trả focus và khóa scroll/background đã kiểm tra.
- **Lighthouse:** landing (mobile navigation) đạt **100 Accessibility / 100 Best Practices / 100 SEO / 100 Agentic Browsing**. Optimizer/repair (mobile snapshot sau sửa tương phản và nhãn avatar) đạt cả bốn mục **100**. Audit này **không đo Performance** và không chứng minh mọi trạng thái đều đạt accessibility.
- Không có bộ test framework trong repository; đây là kiểm tra tương tác/DOM/screenshot qua trình duyệt. Reduced-motion có CSS/matchMedia trong mã, chưa emulation hệ điều hành riêng. Chưa đo conversion/usability với người dùng thật.
- Console ghi nhận warning CSS preload chưa được dùng; không ghi nhận lỗi runtime JavaScript trong các màn đã kiểm tra. Lighthouse không báo lỗi best practices ở hai trạng thái được audit.

Với checkout mới: `npm ci`, `npm exec -- next typegen`, rồi `npm exec -- tsc --noEmit --incremental false` nếu kiểm tra kiểu riêng. Next sinh route types/next-env; không coi file sinh sẵn ở máy này là có trên máy khác. Preview local: `npm run dev -- --webpack`; địa chỉ core `http://127.0.0.1:3000/app/optimize`.

## Vấn đề còn lại và chính sách chưa chốt

- Turbopack mặc định bị hạn chế process/bind cổng ở môi trường hiện tại; Webpack build hoạt động.
- Diagnosis/score/optimize/runner/repair đều mock; điểm cao không chứng minh prompt/output tốt, runner không phản ánh yêu cầu thực bằng AI.
- Chưa có auth, ownership, database, AI services, cost logging, quota enforcement, billing hoặc cloud sync. Các yêu cầu server/RLS/idempotency trong ARCHITECTURE vẫn là kiến trúc dự kiến.
- 135 task được chọn nhưng nhiều task dùng fields chung theo domain; chưa có form và ví dụ chuyên biệt cho mọi task.
- LocalStorage chưa migrate workflow cũ, chưa import/export, chưa autosave hoặc timestamp riêng từng version. Repair lặp nhiều lần nối thêm output/text có thể làm prompt dài; chưa có chiến lược nén/ngân sách đầu ra thật.
- Giá/quota, Generate dùng thử miễn phí, tính lượt Repair, trọng số Score, reset/refund/retry, thứ tự ưu tiên context và xác thực email chưa chốt. Chưa xác minh provider/model/deployment.
- Hiệu quả đăng ký, retention, chất lượng prompt và nhu cầu trả phí chưa được kiểm chứng bằng nghiên cứu người dùng.

## Đúng một nhiệm vụ tiếp theo được đề xuất

**Kiểm thử usability luồng Optimize → Copy → Repair với 3 người thuộc Marketing, Coding và Education, ghi các điểm họ không hiểu hoặc không hoàn tất được.** Chưa thực hiện nhiệm vụ này. Đây là đề xuất để người dùng xem xét; một yêu cầu mới có thể xác định nhiệm vụ khác, không tự chạy theo đề xuất khi vừa mở repo.
