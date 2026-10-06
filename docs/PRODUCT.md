# AI Workflow Studio — đặc tả sản phẩm

Tài liệu này mô tả hành vi dự kiến của sản phẩm, không phải trạng thái triển khai. Xem [CURRENT_STATE.md](CURRENT_STATE.md) để biết tiến độ đã xác minh và [DECISIONS.md](DECISIONS.md) để biết các nguyên tắc đã chấp nhận.

## Tầm nhìn và vấn đề cần giải quyết

Giúp người dùng Việt Nam biến một công việc hằng ngày thành nội dung hoàn chỉnh hữu ích và tái sử dụng quy trình đó. Người sáng tạo nội dung và người bán hàng thường bắt đầu bằng yêu cầu thiếu thông tin, phải nhập lại bối cảnh thương hiệu và mất thời gian sửa các kết quả chung chung. Tối ưu prompt là một bước để hoàn thành công việc, không phải toàn bộ sản phẩm.

Khách hàng ban đầu là người sáng tạo nội dung, người bán hàng trực tuyến và người làm việc tự do. Nhóm marketing nhỏ là đối tượng ở giai đoạn sau. Trải nghiệm ban đầu ưu tiên tiếng Việt, các kênh bán hàng phổ biến trong nước, đơn vị sử dụng dễ hiểu và phương thức thanh toán tại Việt Nam.

## Quy trình chính và điểm khác biệt

Chọn công việc → Nhập yêu cầu → Chấm điểm prompt → Tối ưu prompt → Tạo nội dung hoàn chỉnh → Chỉnh sửa nhanh → Lưu quy trình → Tái sử dụng.

Các mẫu quy trình mô tả công việc người dùng muốn hoàn thành, thay vì định dạng prompt mang tính kỹ thuật. Prompt Score hướng dẫn cách cải thiện yêu cầu; so sánh trước/sau giúp hiểu phần tối ưu; kết quả nội dung, chỉnh sửa nhanh, quy trình tái sử dụng và hồ sơ thương hiệu tạo giá trị cho những lần dùng tiếp theo.

Sản phẩm ưu tiên công việc cần làm. Người dùng cuối tuyệt đối không chọn mô hình AI. Giao diện không được đưa ra các lựa chọn GPT, Claude, Gemini hoặc tên mô hình OpenRouter. Backend tự định tuyến để cân bằng chất lượng và chi phí.

## Mục tiêu và phạm vi giai đoạn 1

Kiểm chứng xem người dùng có hiểu sản phẩm, tái sử dụng quy trình và trả tiền cho kết quả được tạo hay không. MVP (phiên bản tối thiểu để kiểm chứng sản phẩm) chỉ xử lý văn bản.

| Tính năng | Trải nghiệm dự kiến |
| --- | --- |
| Trang giới thiệu | Giải thích quy trình từ công việc đến kết quả, đưa ví dụ tiếng Việt và mời đăng ký. |
| Xác thực email và đăng nhập Google | Cho người dùng truy cập lịch sử, bối cảnh đã lưu và quyền lợi của chính họ. |
| Trang tổng quan | Cung cấp điểm bắt đầu công việc, hoạt động gần đây, quy trình đã lưu và tóm tắt hạn mức dễ hiểu. |
| Mẫu quy trình | Thu thập yêu cầu có cấu trúc cho các công việc quen thuộc của người sáng tạo, người bán hàng và người làm việc tự do. |
| Chấm điểm prompt — Prompt Score | Phản hồi về mức độ đầy đủ bằng quy tắc xác định, không cần gọi AI. |
| So sánh prompt trước/sau | Hiển thị yêu cầu ban đầu bên cạnh prompt đã tối ưu. |
| Tối ưu prompt bằng AI | Chuyển yêu cầu và bối cảnh thương hiệu phù hợp thành prompt tốt hơn. |
| Tạo nội dung hoàn chỉnh bằng AI | Tạo kết quả thực tế của công việc từ prompt đã tối ưu. |
| Chỉnh sửa nhanh — Quick Edit | Cho phép tinh chỉnh kết quả bằng các thao tác đơn giản. |
| Lịch sử | Xem lại các lượt chạy và kết quả trước đây. |
| Mục yêu thích | Đánh dấu nội dung hữu ích để tìm lại; loại đối tượng được đánh dấu chưa được chốt. |
| Quy trình đã lưu | Lưu yêu cầu và bối cảnh có thể tái sử dụng cho những lần chạy sau. |
| Hồ sơ thương hiệu — Brand Profile | Tái sử dụng thông tin nhận diện thương hiệu và phong cách viết giữa các quy trình. |
| Hạn mức sử dụng hằng tháng | Hiển thị và kiểm soát quyền lợi theo gói bằng đơn vị dễ hiểu. |
| Theo dõi sử dụng và chi phí AI | Ghi lại mọi lần gọi AI, phục vụ phân tích chi phí nội bộ. |
| Gói thuê bao và thanh toán SePay | Bán quyền lợi đã xác minh qua chuyển khoản ngân hàng/mã QR tại Việt Nam. |
| Trang quản trị tối thiểu | Theo dõi người dùng, thuê bao, doanh thu, mức sử dụng, thanh toán và chi phí AI. |

Không bắt buộc trong MVP: tạo ảnh, tải PDF, RAG, nghiên cứu web, chợ mua bán, API công khai, tiện ích trình duyệt, ứng dụng di động riêng, điều phối tác nhân phức tạp và giao diện chọn nhiều mô hình. Có thể xem xét các hạng mục này ở giai đoạn sau; lựa chọn mô hình vẫn bị cấm theo định hướng sản phẩm hiện tại.

## Các mẫu quy trình ban đầu

- Bài đăng Facebook
- Mô tả sản phẩm Shopee
- Kịch bản TikTok/Reel
- Quảng cáo Facebook
- Email bán hàng
- Trả lời hỗ trợ khách hàng
- Chú thích sản phẩm
- Gợi ý ý tưởng nội dung

Mỗi mẫu cần hỏi thông tin cần thiết để hoàn thành công việc, chẳng hạn sản phẩm, đối tượng khách hàng, kết quả mong muốn, giọng điệu và các giới hạn.

## Chấm điểm prompt — Prompt Score

Tính tổng điểm từ 0–100 bằng quy tắc xác định trong TypeScript. Các tiêu chí có thể gồm: mục tiêu rõ ràng, bối cảnh, đối tượng hướng đến, yêu cầu cụ thể, định dạng đầu ra, giọng điệu, giới hạn và tiêu chí chất lượng. Hiển thị phần thông tin còn thiếu để người dùng bổ sung. Đây là tính năng hướng dẫn, không phải phép đo khoa học hay cam kết về chất lượng đầu ra.

Ví dụ minh họa: `Viết bài Facebook bán áo nam` có thể đạt 42/100, rồi 91/100 sau tối ưu. Các con số này chỉ là ví dụ, không phải kết quả bắt buộc của thuật toán. Trọng số tiêu chí, quy tắc nhận diện tiếng Việt và cách chấm điểm cụ thể chưa được quyết định. Dùng cùng bộ tiêu chí trước và sau tối ưu; không gọi AI để tính điểm.

## Hồ sơ thương hiệu — Brand Profile

Lưu bối cảnh tái sử dụng: tên thương hiệu, mô tả thương hiệu, sản phẩm/dịch vụ, khách hàng mục tiêu, giọng điệu, từ khóa quan trọng, từ bị cấm, phong cách lời kêu gọi hành động (CTA) và ví dụ. Tự động đưa bối cảnh phù hợp vào các quy trình sau. Đây là tính năng quan trọng để giữ chân người dùng: họ không cần nhập lại thông tin thương hiệu mỗi lần.

Khả năng sử dụng và số lượng hồ sơ phụ thuộc vào gói. Trước khi triển khai, cần chốt thứ tự ưu tiên khi yêu cầu của một lượt chạy và bối cảnh thương hiệu mâu thuẫn nhau; chính sách này hiện chưa được chốt.

## Chỉnh sửa nhanh — Quick Edit

Các thao tác có thể gồm: Viết lại, Ngắn hơn, Thuyết phục hơn, Chuyên nghiệp hơn, Thân thiện hơn, Thêm CTA và Đổi giọng điệu. Thông thường dùng định tuyến AI chi phí thấp. Mọi lần chỉnh sửa có gọi AI đều phải được ghi vào chi phí nội bộ. Cách trừ hạn mức Tối ưu/Tạo nội dung cho tính năng này chưa được chốt và phải quyết định trước khi triển khai.

## Đơn vị sử dụng và giả định về giá

Người dùng thấy các đơn vị: Tối ưu (Optimize), Tạo nội dung (Generate), Quy trình đã lưu, Hồ sơ thương hiệu và Thành viên. Không hiển thị token. Ví dụ: `Tạo nội dung: 35 / 60` và `Tối ưu: 87 / 120`.

Tối ưu và Tạo nội dung là hạn mức dự kiến theo tháng. Số quy trình, hồ sơ thương hiệu và thành viên là giới hạn số lượng được lưu/có, không phải số thao tác theo tháng. Chính sách đặt lại hạn mức/chu kỳ thanh toán và xử lý thất bại/thử lại chưa được chốt.

Toàn bộ mức giá và hạn mức dưới đây là **giả định sản phẩm hiện tại, cần được kiểm chứng**, không phải quyền lợi ra mắt đã cam kết.

| Gói | VND/tháng | Tối ưu/tháng | Tạo nội dung/tháng | Quy trình đã lưu | Hồ sơ thương hiệu | Thành viên |
| --- | ---: | ---: | ---: | --- | --- | --- |
| FREE | 0 | 10 | 2 | 3 | Chưa quy định | Chưa quy định |
| PRO | 149,000 | 120 | 60 | 30 | 1 | Chưa quy định |
| CREATOR | 299,000 | 400 | 120 | 100 | 3 | Chưa quy định |
| BUSINESS | 799,000 | 1,000 | 300 | Chưa quy định | 10 | 5 |

Gói FREE có tính năng chấm điểm prompt. Đầu ra dài hơn/quy trình nâng cao của CREATOR và quy trình dùng chung/không gian làm việc của BUSINESS là khả năng ở giai đoạn sau. Giá và số thành viên BUSINESS là giả định kế hoạch; không vì vậy mà thêm ngay hạ tầng làm việc nhóm vào mô hình dữ liệu tối giản ban đầu.

Gói mua thêm có thể có: 50 lượt Tạo nội dung bổ sung với giá 79,000 VND. Việc có ra mắt hay không, thời hạn sử dụng và thứ tự trừ lượt chưa được chốt. Không tự đặt giới hạn ở những chỗ yêu cầu chưa quy định.

Những thao tác tốn kém trong tương lai, như nghiên cứu chuyên sâu, tạo ảnh hoặc tạo tài liệu dài, cần cơ chế điểm sử dụng riêng nếu được đưa vào sản phẩm. Chúng nằm ngoài MVP chỉ xử lý văn bản bắt buộc hiện tại.

## Cách tạo doanh thu và kiểm soát chi phí

Gói miễn phí cho người dùng trải nghiệm kết quả hữu ích. Các gói trả phí tăng số lượt sử dụng và khả năng lưu bối cảnh/quy trình. Gói mua thêm lượt Tạo nội dung có thể đáp ứng nhu cầu tăng thêm. Đây là các giả thuyết cần kiểm chứng qua hành vi sử dụng và thanh toán thực tế.

Hạn mức hiển thị và hạch toán chi phí nội bộ là hai yêu cầu riêng. Ghi mọi lần gọi AI với người dùng, lượt chạy prompt nếu có, nhà cung cấp/mô hình, token đầu vào/đầu ra, token bộ nhớ đệm nếu có, loại hành động, chi phí USD ước tính hoặc thực tế, thời gian phản hồi, trạng thái thành công và thời điểm. Dùng mô hình rẻ cho tối ưu và biến đổi đơn giản, mô hình tiêu chuẩn cho tạo nội dung thông thường, mô hình mạnh hơn cho trường hợp phức tạp đặc biệt.

Phân tích chi phí AI hôm nay/tháng này, theo người dùng/gói/quy trình, các người dùng/quy trình tốn kém nhất và tỷ lệ Chi phí AI / Doanh thu. Doanh thu dự kiến bằng VND còn chi phí nhà cung cấp bằng USD; tỷ lệ phải dùng quy đổi tiền tệ thống nhất và cùng kỳ báo cáo. Chưa có mục tiêu biên lợi nhuận hoặc chính sách tỷ giá.

## Phạm vi quản trị

Báo cáo tối thiểu cần có tổng người dùng, người dùng trả phí, phân bố gói, doanh thu tháng, chi phí AI, tỷ lệ Chi phí AI / Doanh thu, chi phí AI theo người dùng/quy trình, thanh toán và mức sử dụng. Giai đoạn 1 ưu tiên đúng chức năng hơn giao diện đẹp.

## Chỉ số kiểm chứng sản phẩm

Dưới đây là các định nghĩa đo lường đề xuất. Chưa có ngưỡng thành công bằng số hoặc mục tiêu lượng truy cập/doanh thu được kiểm chứng.

| Chỉ số | Cách đo đề xuất | Điều cần kiểm chứng |
| --- | --- | --- |
| Trang giới thiệu → đăng ký | Số đăng ký mới chia cho số khách truy cập trang giới thiệu trong một khoảng thời gian xác định | Mức độ hiểu và quan tâm ban đầu |
| Đăng ký → tối ưu lần đầu | Nhóm người đăng ký hoàn thành lần tối ưu thành công đầu tiên | Khả năng bắt đầu sử dụng sản phẩm |
| Tối ưu → tạo nội dung | Người đã tối ưu thành công tiếp tục tạo nội dung thành công | Giá trị của việc hoàn thành công việc |
| Tái sử dụng ngày 7 (D7) | Nhóm người đã bắt đầu dùng sản phẩm quay lại sử dụng quy trình vào ngày thứ 7 | Tính hữu ích khi sử dụng lặp lại |
| Đã bắt đầu dùng → trả phí | Nhóm người đã bắt đầu dùng có thanh toán đầu tiên được xác minh | Mức sẵn sàng trả tiền cho kết quả |

Chốt khoảng thời gian theo dõi nhóm người dùng và định nghĩa bắt đầu sử dụng trước khi thu thập số liệu. Xem việc tái sử dụng quy trình đã lưu, mức dùng hạn mức và chi phí cùng với tỷ lệ chuyển đổi; không dùng riêng số đăng ký để kết luận sản phẩm đã được kiểm chứng.
