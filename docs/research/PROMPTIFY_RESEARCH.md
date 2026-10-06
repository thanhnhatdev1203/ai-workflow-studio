# Research Promptify — giao diện và luồng sử dụng

**Tổng hợp và bàn giao: 2026-10-07.** Nguồn: quan sát trực tiếp bằng Chrome DevTools MCP từ trang công khai và phiên Promptify người dùng đã đăng nhập trong cuộc trao đổi này. Khi chuẩn bị commit, đã bổ sung đọc trang billing để lưu đúng giá/quota nhìn thấy. Đã tìm toàn repository theo tên file lẫn nội dung Promptify/research/nghiên cứu; trước lần tổng hợp này không có research file trong kho mã. File này là bản tổng hợp duy nhất, không đổi tên một file đã tồn tại.

Phạm vi là giao diện nhìn thấy, selector và điều hướng đọc. Không submit optimize/generate, tạo mẫu, thanh toán, xóa dữ liệu hay sửa tài khoản; không truy xuất cookie/token/mật khẩu hoặc dữ liệu người dùng khác. Kết quả nghiên cứu không xác nhận backend hoặc chất lượng AI. Những quan sát từ trang chủ trước đó được ghi cùng các kiểm tra sau đăng nhập bổ sung; không sao chép mã, tài nguyên hoặc nội dung thương hiệu.

## Quan sát được

| Nguồn | Giao diện/luồng nhìn thấy | Giới hạn chứng cứ |
| --- | --- | --- |
| [Trang chủ](https://promptify.vn/) | Hero đặt giữa, tiêu đề lớn, nền chuyển động nhạt, các vật thể nổi/parallax, thanh điều hướng dạng capsule; ví dụ sản phẩm trước/sau; nhóm tính năng, hướng dẫn, giá và FAQ | Quan sát UI và cuộn; không có dữ liệu hiệu quả conversion hoặc công nghệ triển khai đáng tin cậy |
| [Optimize](https://promptify.vn/app/optimize) | Sidebar dẫn tới tổng quan, tối ưu, lịch sử, yêu thích, templates, billing, affiliate và account; loại text→text/text→image; chọn lĩnh vực và gợi ý ví dụ | Không gửi form nên không quan sát kết quả thực tế, thời gian AI hoặc cách trừ lượt |
| Optimize — lĩnh vực | Thấy 8 nhóm: Marketing/Content, Affiliate, hỗ trợ khách hàng, giáo dục, Ecommerce, Coding/Dev, HR và trợ lý cá nhân; ba gợi ý mẫu thay đổi theo lĩnh vực | Danh mục nhìn thấy ở thời điểm khảo sát, không suy ra mọi lĩnh vực có cùng chức năng backend |
| Optimize — tùy chọn | Coding/Education có mục tiêu, cách thể hiện/tone, độ dài; Affiliate có format, nền tảng, loại nội dung, tone, độ dài | Đã đổi selector để xem form, không submit tối ưu |
| Optimize — chế độ | Có lựa chọn prompt có thể tái sử dụng/system prompt hoặc prompt gọn dùng một lần; kết quả mong muốn có prompt-only hoặc optimize+generate | Đây là lựa chọn UI, chưa xác minh tự chạy hoặc quyền lợi mỗi chế độ |
| [Templates](https://promptify.vn/app/templates) | Tab text/image, lọc 8 lĩnh vực, thẻ prompt mẫu và thao tác copy; có phần tạo template riêng | Không tạo template. Hai khu vực hiển thị giới hạn riêng khác nhau (0/5 và 0/3); chưa xác định nguyên nhân |
| [History](https://promptify.vn/app/history) | Trang lịch sử mô tả các kết quả tối ưu gần đây | Chưa quan sát đủ item để xác nhận cấu trúc phiên bản, repair hoặc thao tác của từng kết quả |
| [Favorites](https://promptify.vn/app/favorites) | Trang yêu thích mô tả kết quả đã đánh dấu để dùng lại | Không xác nhận đồng bộ, ownership hoặc giới hạn lưu bằng quan sát UI |
| [Billing](https://promptify.vn/app/billing) — đọc lại 2026-10-07 | UI tách tối ưu, tối ưu+kết quả văn bản và tối ưu+ảnh; có lựa chọn tháng/năm, chuyển khoản VietQR và nút tạo QR | Chỉ đọc, không chọn mua/tạo QR/thanh toán; chưa xác minh cách trừ lượt, activation hoặc webhook |

Gợi ý Coding nhìn thấy gồm review Python, unit test JavaScript và phân tích stack trace. Giáo dục gồm giải thích khái niệm, tạo câu hỏi và feedback. Affiliate gồm review, video ngắn và so sánh. Không lấy các gợi ý đó làm dữ liệu mẫu nguyên văn của StudioFlow.

Trên trang chủ, hiệu ứng giúp tạo ấn tượng đầu tiên; một số vật thể gần mép màn hình hẹp và khu vực tùy chọn sau login khá dày. Đây là nhận xét thị giác trong phiên khảo sát, không phải kết quả kiểm thử usability với người dùng thực.

Giá/quota nhìn thấy ở billing ngày **2026-10-07**, theo hiển thị tháng:

| Gói Promptify | VND/tháng hiển thị | Optimize/tháng | Optimize + văn bản/tháng | Optimize + ảnh/tháng |
| --- | ---: | ---: | ---: | ---: |
| Free | 0 | 20 | Không cung cấp | Không cung cấp |
| Pro | 299.000 | 500 | 120 | 20 |
| Business | 999.000 | 2.500 | 700 | 70 |

Free cho tối ưu prompt văn bản/ảnh nhưng không tạo nội dung hoặc ảnh thật. UI còn có lựa chọn trả năm với mức giảm khoảng 17%; không đổi lựa chọn nên chưa kiểm chứng giá năm. UI mô tả kích hoạt khi nhận chuyển khoản; đó là thông báo sản phẩm, chưa kiểm chứng thanh toán thật. Chưa biết một lần optimize+generate trừ một hay nhiều bộ đếm, quota cộng thêm hay dùng chung, cách reset/refund/retry hoặc khác biệt quyền truy cập thực tế. **Không dùng giá/quota này làm chính sách StudioFlow**; ảnh generation vẫn ngoài phạm vi sản phẩm mình.

## Suy luận hợp lý

- Nhóm lĩnh vực và gợi ý đổi theo selector có thể giảm công suy nghĩ khi bắt đầu viết prompt; cần kiểm chứng với người dùng StudioFlow.
- Prompt-only và optimize+generate cho thấy có thể tách giá trị của prompt khỏi việc sinh nội dung nội bộ. StudioFlow chọn copy làm bước mặc định theo quyết định sản phẩm của mình.
- History, favorites và templates có thể phục vụ tái sử dụng. Không thể kết luận có version graph hoặc repair từ sự hiện diện của các trang này.
- Hero chuyển động nhẹ kết hợp demo cụ thể có thể giúp khách hiểu sản phẩm trước khi đăng ký; chưa có bằng chứng tăng tỷ lệ đăng ký.

## Chưa xác định

- Chưa xác minh chất lượng tối ưu, diagnosis/score, mô hình/backend, API, chi phí, hạn mức thực tế, latency, rate limit, billing hoặc bảo mật.
- Chưa quan sát một **Prompt Repair Loop** nhận output + feedback rồi tạo phiên bản mới; chưa xác nhận V1/V2/V3 ở Promptify. Repair/version của StudioFlow là yêu cầu riêng, không phải tính năng đã được chứng minh của đối thủ.
- Chưa xác nhận hành vi lưu/copy/chỉnh sửa từng item history/favorite, giới hạn template mâu thuẫn hoặc entitlement của tài khoản.
- Mục Affiliate và Tài khoản tồn tại trên sidebar nhưng chưa có kiểm tra đủ chức năng tương ứng. Không suy ra chức năng của mục Affiliate từ lĩnh vực Affiliate trong form tối ưu.
- Chưa có đo lường scroll performance, reduced-motion hoặc accessibility toàn bộ Promptify. Cảm nhận cuộn mượt không chứng minh cơ chế kỹ thuật cụ thể.

## Design patterns đáng học

1. **Cho thấy giá trị trước khi yêu cầu đăng ký:** hero có CTA rõ, demo trước/sau có nội dung đọc được. Áp dụng trên trang chủ StudioFlow bằng ví dụ prompt Marketing/Coding/Education và mô phỏng repair.
2. **Chọn lĩnh vực rồi đưa ngữ cảnh phù hợp:** áp dụng ở taxonomy và form động, thay vì một form marketing cho mọi ngành.
3. **Tách prompt khỏi kết quả được sinh:** học khả năng chọn prompt-only; StudioFlow nhấn Copy và để Run là tùy chọn.
4. **Tái sử dụng qua thư viện:** navigation history/favorite/templates giúp định hướng Prompt của tôi, phiên bản và mẫu đa lĩnh vực.
5. **Chuyển động nền có tiết chế:** dùng CSS/SVG riêng, scroll reveal và transform theo cuộn native; không suy đoán hay sao chép cách Promptify triển khai.

## Những điểm KHÔNG nên copy

- Không sao chép tên, logo, wording, tài nguyên, source code hoặc layout từng chi tiết.
- Không dùng cách gộp optimize+generate làm hành động mặc định của StudioFlow.
- Không đưa toàn bộ tùy chọn dài ra ngay lần đầu, hoặc để vật thể trang trí đè nội dung trên điện thoại.
- Không lấy giá/quota/template limit quan sát được làm chính sách sản phẩm mình; không hiển thị số demo như quyền lợi đã được kích hoạt.
- Không mở rộng tạo ảnh, affiliate account/revenue, nhiều mô hình hoặc các tính năng sau login không phục vụ core hiện tại.

## Những điểm sản phẩm mình sẽ làm khác

- Core là Prompt Optimizer; Workflow Automation không phải core giai đoạn 1.
- 5 loại prompt, 12 lĩnh vực; image/video chỉ tối ưu văn bản.
- Copy là primary CTA; Run là tiện ích tùy chọn dùng Generate credit sau này, không tự chạy.
- Prompt Repair nhận output từ AI bên ngoài hoặc runner + vấn đề + feedback, tạo phiên bản mới và giữ phiên bản nguồn.
- Diagnosis gồm tiêu chí chung và chuyên ngành; score mock phải được ghi rõ, thuật toán thật không dùng AI.
- Form mở dần; Brand Context chỉ được áp dụng tùy chọn ở lĩnh vực phù hợp.
- Prompt của tôi, history và favorites dùng cùng dữ liệu phiên bản local trong prototype, thay cho workflow/nội dung marketing cố định.

## Bảng liên hệ với logic StudioFlow về sau

Đây là hướng dẫn tự thiết kế cho sản phẩm mình từ research và yêu cầu người dùng, **không phải reverse engineering logic/API Promptify**. Chỉ triển khai khi nhiệm vụ mới cho phép.

| Quan sát hoặc giới hạn research | Hệ quả cho logic StudioFlow | Điểm vào mã hiện tại / chứng cứ cần có |
| --- | --- | --- |
| Domain đổi gợi ý và options | Type/domain/task phải có ID ổn định; schema fields theo ngữ cảnh; bỏ context không còn phù hợp khi đổi lựa chọn | `prompt-catalog.ts`: `domains`, `getDynamicFields`, `promptTemplates`; hiện nhiều task dùng schema domain chung |
| Có lựa chọn prompt-only và optimize+generate | Giữ Optimize và Run là hai hành động; trả optimized version trước, không ghép Run vào kết quả mặc định | `prompt-optimizer.tsx`: `optimize`, `run`; Copy là primary CTA theo ADR-009/011 |
| Hai dạng prompt tái sử dụng/gọn một lần | Có thể nghiên cứu nhu cầu này khi có nhiệm vụ; hiện StudioFlow chưa có selector chế độ system/reusable riêng | Không tự đưa mode này vào contract hoặc UI chỉ vì đối thủ có |
| History/favorite/templates tồn tại | Lưu prompt/version theo ownership; favorite chỉ tham chiếu cùng prompt; mẫu không tự chạy | `prompt-library.tsx`, `prototype-provider.tsx`, `template-browser.tsx`; chưa biết schema hoặc policy Promptify |
| Billing hiển thị nhiều quota | Hạn mức Optimize/Generate, ledger AI cost và payment state phải là các trách nhiệm riêng | Chưa implement; quota/repair charge/reset/refund của StudioFlow phải chốt riêng, không lấy từ UI đối thủ |
| Chưa chứng minh diagnosis/score của đối thủ | Thiết kế rule-based score TypeScript của mình, gồm chung + domain, chỉ ra thông tin thiếu | Tiêu chí hiện nằm trong component, score 42/91/94 cố định; không dùng chúng làm expected score thuật toán thật |
| Chưa thấy repair/version graph ở đối thủ | Repair nhận prompt source + output + problem IDs + feedback, tạo version mới; runner output phải gắn đúng source version | `mockRepair` và `PromptVersion.repair`; không phụ thuộc việc đã dùng runner hoặc gói Promptify |
| Chưa xác minh lỗi/async/usage backend | Cần trạng thái loading/error, giới hạn dữ liệu, chống submit trùng và hạch toán server trước khi kết nối API | Prototype đang đồng bộ/local; không có request/response API hay provider đã xác minh |
| Brand chỉ là bối cảnh hỗ trợ của mình | Áp dụng khi người dùng chọn và domain phù hợp; snapshot context cho version tương ứng | `brandUsed`, `BrandContext`, `mockOptimize`; không nhầm hồ sơ demo với dữ liệu tài khoản thật |

Để điều tra lại trên máy công ty: đọc tài liệu này trước, cấu hình Chrome DevTools MCP trên máy đó nếu cần, mở site và để người dùng đăng nhập thủ công. Phiên đăng nhập browser hiện tại không nằm trong Git. Chỉ nghiên cứu thêm câu hỏi còn thiếu của nhiệm vụ đang được giao; không cần tái khảo sát toàn bộ để tiếp nhận code.

Tài liệu sản phẩm và thiết kế liên quan: [PRODUCT.md](../PRODUCT.md), [UI_UX_SPEC.md](../UI_UX_SPEC.md), [DECISIONS.md](../DECISIONS.md). Bằng chứng triển khai và kiểm tra nằm trong [CURRENT_STATE.md](../CURRENT_STATE.md).
