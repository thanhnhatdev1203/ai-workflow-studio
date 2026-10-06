# AI Workflow Studio / StudioFlow

StudioFlow là prototype tiếng Việt cho **Prompt Optimizer** và **Prompt Repair Loop**. Luồng chính: nhập prompt → chọn loại/lĩnh vực/mục đích → diagnosis/score → tối ưu → so sánh → **sao chép** → chạy thử tùy chọn → đưa output và phản hồi trở lại → sửa prompt → lưu phiên bản.

Hiện có 5 loại prompt, 12 lĩnh vực, 135 mục đích và 27 mẫu. Diagnosis/score/optimize/runner/repair là mock; copy, tìm/lọc, favorite và lưu prompt/brand trong trình duyệt có tương tác thật. Chưa tích hợp AI, xác thực, database hoặc thanh toán. Image/video chỉ tối ưu **văn bản prompt**.

## Tiếp tục trên máy khác

Nhánh chứa bản bàn giao ngày **07/10/2026** là **`phase1/mvp`**, không mặc định dùng `main`.

Với máy chưa có repository:

```bash
git clone --branch phase1/mvp https://github.com/thanhnhatdev1203/ai-workflow-studio.git
cd ai-workflow-studio
npm ci
npm run dev -- --webpack
```

Với checkout đã có trên máy công ty, kiểm tra thay đổi local trước. Khi cây làm việc sạch:

```bash
git fetch origin
git switch phase1/mvp
git pull --ff-only origin phase1/mvp
npm ci
npm run dev -- --webpack
```

Nếu có thay đổi local hoặc pull không fast-forward được, giữ nguyên chúng và kiểm tra tình trạng Git trước khi giải quyết; không reset hoặc ghi đè để lấy bản mới.

Mở [trang chủ](http://127.0.0.1:3000/) hoặc [Prompt Optimizer](http://127.0.0.1:3000/app/optimize). Prototype không cần `.env` hay API key. Không cần đăng nhập thật để xem `/app`; `/login` và `/register` là form demo.

Next.js đã cài yêu cầu Node.js **>=20.9.0**. Máy bàn giao đã chạy với Node **25.8.1**, npm **11.11.0**; repository chưa pin phiên bản Node. Next.js **16.3.8**, React **19.2.8**, TypeScript strict, Tailwind **4**. Dùng `package-lock.json` và `npm ci`, không tự nâng dependencies khi tiếp nhận.

Dữ liệu `localStorage` và phiên Chrome đăng nhập Promptify **không đi cùng Git**. Máy khác bắt đầu với bốn prompt mẫu; dữ liệu browser ở máy cá nhân không tự xuất hiện trên máy công ty. Ghi chú research đã nằm trong repository, không phụ thuộc phiên đăng nhập cũ. Chrome DevTools MCP được cấu hình ngoài project; không nằm trong `package.json` hoặc bản bàn giao Git.

## Tài liệu cần đọc trước khi làm tiếp

Đọc theo thứ tự: [AGENTS.md](AGENTS.md) → [PRODUCT.md](docs/PRODUCT.md) → [ARCHITECTURE.md](docs/ARCHITECTURE.md) → [DECISIONS.md](docs/DECISIONS.md) → [CURRENT_STATE.md](docs/CURRENT_STATE.md).

Khi làm UI hoặc logic optimizer, đọc thêm [UI_UX_SPEC.md](docs/UI_UX_SPEC.md) và [PROMPTIFY_RESEARCH.md](docs/research/PROMPTIFY_RESEARCH.md). Research có quan sát sau đăng nhập, giá/quota nhìn thấy, giới hạn chưa xác minh và bảng ánh xạ sang logic StudioFlow; không coi đó là API/thuật toán của Promptify đã biết.

Next.js trong repository có quy tắc khác các phiên bản cũ. Sau `npm ci`, đọc guide liên quan ở `node_modules/next/dist/docs/` trước khi viết mã; các file đó không được commit.

Có thể mở repository trong Codex và dùng yêu cầu sau để tiếp nhận:

> Đọc AGENTS.md và toàn bộ tài liệu bắt buộc, sau đó đọc UI_UX_SPEC.md và docs/research/PROMPTIFY_RESEARCH.md. Kiểm tra Git trên nhánh phase1/mvp và đối chiếu CURRENT_STATE với mã nguồn. Tóm tắt phần đã triển khai, phần mock và các chính sách chưa chốt trước khi thực hiện nhiệm vụ tôi giao. Giữ core Prompt Optimizer + Prompt Repair Loop, Copy là primary CTA, Run tùy chọn và không tự chạy. Không suy ra backend đã có từ research hoặc mock.

## Kiểm tra và build

```bash
npm run lint
npm exec -- next typegen
npm exec -- tsc --noEmit --incremental false
npm run build -- --webpack
npm run start
```

`next typegen` cần thiết trước khi chạy TypeScript riêng trên checkout mới vì layout dùng route types do Next sinh. Build Webpack cũng chạy TypeScript. Mặc định `npm run build`/`npm run dev` dùng Turbopack; môi trường bàn giao gặp lỗi CSS worker/process/bind cổng `Operation not permitted`. Webpack đã build thành công; chưa có bằng chứng máy công ty sẽ gặp cùng lỗi. Không coi lỗi đó là tính năng cần đổi hoặc tự sửa build script.

Kết quả lint/build, Chrome responsive, tương tác và Lighthouse nằm trong [CURRENT_STATE.md](docs/CURRENT_STATE.md). Chưa có test framework hoặc kiểm chứng AI/usability thực.

## Bản đồ mã nguồn

| File/nhóm | Vai trò |
| --- | --- |
| `src/app/page.tsx`, `landing.module.css`, `src/components/landing-experience.tsx` | Landing, motion native scroll và demo trước/sau/repair |
| `src/app/app/*` | Các route ứng dụng; `/app` → optimizer, route workflow cũ → Prompt của tôi |
| `src/components/prompt-optimizer.tsx` | Form động, diagnosis, versions, copy, optional runner và repair |
| `src/components/prompt-library.tsx`, `template-browser.tsx` | Thư viện, history/favorites, tìm/lọc mẫu |
| `src/lib/prompt-catalog.ts` | Type/domain/task, fields, templates, repair problems |
| `src/lib/prompt-model.ts` | Kiểu dữ liệu và `mockOptimize`, `mockRepair`, `mockOutput` cần thay khi được giao triển khai logic thật |
| `src/components/prototype-provider.tsx` | LocalStorage schema 1, prompt/brand/favorite và toast |
| `src/components/app-shell.tsx`, `ui.tsx`, `src/app/globals.css` | Navigation, thành phần dùng chung và theme |

Một nhiệm vụ tiếp theo được đề xuất nằm trong CURRENT_STATE; yêu cầu mới của người dùng quyết định phạm vi phiên kế tiếp. Chỉ commit/push khi người dùng yêu cầu.
