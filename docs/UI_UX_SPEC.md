# StudioFlow — đặc tả UI/UX

Cập nhật **2026-10-07**. Core mới là Prompt Optimizer với Prompt Repair Loop, theo [PRODUCT.md](PRODUCT.md). Tham khảo các pattern đã ghi trong [Promptify research](research/PROMPTIFY_RESEARCH.md), giữ visual xanh/mint hiện tại và nội dung/asset riêng của StudioFlow. Đây là prototype UI/mock, không phải sản phẩm AI hoặc xác thực thật.

## Điều hướng và phân cấp

Core navigation: **Tối ưu Prompt → Prompt của tôi → Lịch sử → Mẫu Prompt → Yêu thích**. Supporting navigation: **Brand Context → Nâng cấp → Cài đặt**. `/app` mở optimizer; `/app/new` và `/app/workflows` giữ khả năng truy cập bằng redirect. Không hiển thị model selector hoặc workflow automation như chức năng chính.

Desktop dùng sidebar; ở 900px trở xuống dùng header/drawer. Drawer hỗ trợ backdrop, Escape, giữ focus trong menu và trả focus về nút mở; sidebar đóng không nhận focus trên mobile. Nội dung chính không nhận tương tác khi drawer mở.

## Landing page

Hero giữa với tiêu đề lớn, nền mint chuyển động nhẹ, mesh/orbit và thẻ nổi viết riêng, CTA đăng ký miễn phí và xem demo. Navigation capsule, scroll reveal, các nhóm tính năng, templates đa ngành, hướng dẫn core, giá tham khảo, FAQ native và CTA cuối trang. Hiệu ứng dùng CSS/SVG và transform theo cuộn native; không dùng thư viện scroll thay thế.

Demo tương tác chọn Marketing/Coding/Education, so sánh V1/V2, xem V3 repair minh họa và sao chép văn bản đang xem. Các ví dụ giúp hiểu giá trị trước khi đăng ký; không gọi AI. Motion giảm/tắt theo `prefers-reduced-motion`; animation hero dừng khi ngoài viewport. Giá và form đăng ký được ghi rõ là minh họa.

## Form tối ưu

1. **Prompt chính:** textarea có nhãn, giới hạn 12.000 ký tự, tối thiểu 8 ký tự sau trim; có Dùng ví dụ và ⌘/Ctrl+Enter.
2. **Loại prompt:** text, coding, image, video, data. Type image/video có lời giải thích chỉ tối ưu văn bản, không sinh media.
3. **Lĩnh vực:** 12 nhóm từ catalog. Đổi lĩnh vực chọn task đầu tiên; Coding chọn type coding, rời Coding đưa type coding về text. Type image/video/data có fields riêng.
4. **Mục đích cụ thể:** danh sách chỉ thuộc domain đang chọn; không đưa mọi ngôn ngữ lập trình vào form chính.
5. **Thông tin chuyên ngành:** native details mặc định đóng, mở để điền ngữ cảnh liên quan.
6. **Tùy chỉnh nâng cao:** native details gồm language, tone, audience, length, output format, style, detail, constraints, avoid, examples, CTA nếu phù hợp và context bổ sung.
7. **Brand Context:** checkbox tùy chọn ở Marketing/Ecommerce/Affiliate/Sales/Social, có link sửa hồ sơ; không xuất hiện bắt buộc ở Coding/Education.

Nút Phân tích & tối ưu tạo prompt mock, không chạy prompt. Form không yêu cầu điền mọi advanced field. Đổi input/options sau khi có kết quả hiển thị trạng thái cần tối ưu lại; vô hiệu hóa copy/run/repair/save của kết quả cũ đến khi có phiên bản mới. Đổi domain/type bắt đầu ngữ cảnh mới, không sửa prompt đã lưu trước đó.

## Form động và diagnosis

| Ví dụ | Fields và tiêu chí ngữ cảnh |
| --- | --- |
| Coding → Debug | language/framework, code/error, expected behavior, actual behavior, constraints |
| Education → Giáo án | subject, level, topic, duration, learning objective, difficulty |
| Ecommerce → Shopee | product, USP/features, buyer, price positioning, tone, keywords, platform |
| Affiliate → Review | product, audience, angle, pros/cons, CTA, platform, disclosure/neutrality |

Type image/video/data ưu tiên fields theo type. Coding ngoài Debug ẩn actual behavior; Education ngoài giáo án ẩn duration; Ecommerce compare thay tone/keywords bằng tiêu chí so sánh. Các task khác dùng form domain chung; chưa có form riêng cho từng task.

Diagnosis gồm tiêu chí chung (objective, context, audience, output format, tone, constraints, success criteria) và phần chuyên ngành. UI chỉ kiểm tra hiện diện thông tin trong mock, không tự hiểu ý nghĩa code hoặc output. Điểm **42 → 91**, repaired **94**, chia chung /60 + ngữ cảnh /40 được ghi là **điểm mẫu**; không coi điểm cao là thông tin đã đầy đủ.

## Before/After và hành động

Desktop hai cột: prompt nguồn bên trái, phiên bản đang chọn bên phải, điểm và nhãn version. Mobile xếp chồng; văn bản xuống dòng, vùng dài có cuộn riêng. Các highlights minh họa Audience/Context/Format/Constraints/Domain; repaired hiển thị chỉ dẫn sửa và output tham chiếu. Không khẳng định AI đã xác minh chất lượng các phần đó.

**Sao chép prompt** là primary CTA dùng Clipboard API thật. **Chạy thử** là secondary CTA; chỉ click mới hiển thị output mẫu gắn đúng version, không trừ Generate credit. Type image/video vô hiệu runner và giải thích lý do. Khi clipboard bị chặn, thông báo cho người dùng chọn văn bản thủ công.

Các nút version có trạng thái chọn, nhãn V1/V2/V3 và nguồn; chọn phiên bản khác không tự chạy, đóng repair hiện tại để tránh dùng output sai nguồn. Input, tên prompt, favorite và Save ở cùng workspace; save local gồm toàn bộ versions.

## Prompt Repair Loop

Bắt đầu từ Sửa prompt từ output hoặc Dùng output này để sửa prompt. Luôn cho thấy version nguồn.

- Chọn nguồn **Dán từ AI bên ngoài** hoặc **Output chạy thử của version hiện tại**. Nguồn runner chỉ bật khi version đó đã có output.
- Textarea output tối đa 20.000 ký tự; tối thiểu 10 ký tự để chẩn đoán. Không gửi dữ liệu ra ngoài trong prototype.
- Chọn vấn đề bằng các nút multi-select có `aria-pressed`: dài/ngắn/chung chung/thiếu chi tiết/sai tone/sai format/hiểu sai/thiếu CTA/lặp ý/chưa sâu/sai đối tượng/khác.
- Feedback tối đa 4.000 ký tự. “Khác” yêu cầu mô tả ít nhất 5 ký tự.
- **Chẩn đoán vấn đề** hiển thị chỉ dẫn sửa mock. Đổi output/problem/feedback làm mất hiệu lực chẩn đoán cũ.
- **Sửa prompt & tạo Vn** thêm version mới, liên kết version nguồn và giữ feedback/output. Quay về before/after để Copy hoặc chủ động Run lại; không tự chạy.

Có thể lặp repair và sửa từ version cũ. Prototype bổ sung chỉ dẫn vào văn bản, không có AI failure diagnosis/repair thực tế, không có thuật toán đánh giá output.

## Thư viện, mẫu và supporting screens

`Prompt của tôi` hiển thị name/domain/task/version/mock score/updated/favorite. Copy, Edit, Repair, View versions đều dùng cùng prompt record. Edit mở optimizer để chỉnh đầu vào và tối ưu lại; chưa có editor trực tiếp văn bản phiên bản. Favorites dùng cùng cờ yêu thích. History chỉ thể hiện phiên bản của các prompt đã lưu, không ghi mọi thao tác chưa lưu.

Templates có search và filter 12 domain, 27 mẫu thuộc 5 type. Chọn mẫu chỉ điền form; không chạy hoặc tạo phiên bản trước khi click Optimize. Library rỗng/bộ lọc không khớp có EmptyState; URL prompt không tồn tại có đường dẫn quay lại.

Brand Context 8 fields lưu local; chưa có nhiều hồ sơ. Billing hiển thị bốn gói/giá tham khảo chưa chốt, không kích hoạt quyền lợi. Login/register/settings vẫn là form demo; settings không lưu hồ sơ tài khoản thật. Không diễn giải toast local thành xác thực/thanh toán thành công.

## Responsive và trợ năng

| Chiều rộng kiểm tra | Bố cục mục tiêu |
| --- | --- |
| 375 / 390 | Header/drawer; form và library một cột; input 16px; before/after xếp chồng; CTA/problem/version xuống dòng; hero decor giữ khoảng đọc |
| 768 | Header/drawer; input và diagnosis xếp dọc; comparison hai cột khi đủ chỗ; templates/library lưới gọn |
| 1280 / 1440 | Sidebar desktop; input và diagnosis song song; comparison hai cột; nội dung giới hạn chiều rộng |

Dùng `minmax(0, ...)`, wrap từ dài, textarea max-width và lưới linh hoạt để không tràn trang theo chiều ngang. Native labels/select/details/fieldset phục vụ bàn phím. Demo tabs hỗ trợ Arrow/Home/End, trạng thái chọn và panel liên kết. Thông báo dùng status; form có disabled/required phù hợp. Scroll tới kết quả/repair dùng native scroll và xét reduced-motion. Kết quả kiểm tra thực tế, lỗi và giới hạn nằm ở CURRENT_STATE.

## Component và ranh giới

Dùng chung Button/Icon/Brand/PageHeading/EmptyState/AppShell, thêm PromptOptimizer/PromptLibrary/TemplateBrowser/PrototypeProvider và CSS Modules tương ứng. Catalog/model chứa mock dùng chung; giá tham khảo ở prototype-data. Không thêm dependencies, API hoặc dịch vụ backend cho nhiệm vụ này. Dữ liệu localStorage không phải bảo mật/đồng bộ người dùng; key workflow cũ chưa migrate.

## Bàn giao UI sang logic

Giữ các hành vi đã kiểm tra khi thay mock: Optimize/Repair không tự Run; Copy lấy đúng version đang chọn; feedback sửa đổi làm mất hiệu lực diagnosis cũ; output runner phải thuộc version nguồn; dữ liệu input thay đổi khóa thao tác trên kết quả cũ. Backend hoặc trạng thái async mới cần loading/error/retry rõ ràng và chỉ công bố version thành công; hiện chưa có các trạng thái network đó. Bản đồ thay các hàm mock nằm trong [ARCHITECTURE.md](ARCHITECTURE.md), nguồn quan sát và khoảng trống nghiên cứu trong [PROMPTIFY_RESEARCH.md](research/PROMPTIFY_RESEARCH.md), cách chạy trên máy khác trong [README.md](../README.md).
