import Link from "next/link";
import { Brand, Icon } from "@/components/ui";
import { LandingMotion, LandingNavigation, ProductDemo } from "@/components/landing-experience";
import { plans } from "@/lib/prototype-data";
import { domains, promptTemplates } from "@/lib/prompt-catalog";
import styles from "./landing.module.css";

const steps = [
  { icon: "edit", title: "Nhập prompt, chọn lĩnh vực", text: "Từ code đến giáo án, bán hàng và phân tích. Bổ sung thông tin phù hợp với yêu cầu.", note: "12 lĩnh vực · 5 loại prompt" },
  { icon: "copy", title: "Tối ưu rồi sao chép", text: "Xem chẩn đoán, điểm và so sánh trước/sau. Dùng prompt ở AI bạn quen thuộc; chạy thử là tùy chọn.", note: "Không tự động chạy prompt" },
  { icon: "layers", title: "Sửa từ kết quả chưa đúng ý", text: "Dán output, chỉ ra vấn đề và tạo phiên bản prompt mới. Lưu lại cả quá trình để tiếp tục cải thiện.", note: "Prompt Repair · Version history" },
];
const questions = [
  ["Tôi có bắt buộc chạy prompt trong StudioFlow không?", "Không. Sau tối ưu, hành động chính là sao chép prompt để dùng ở AI bạn quen thuộc. Chạy thử trong hệ thống là tùy chọn; về sau dùng Generate credit."],
  ["Prompt Repair có nhận output từ AI bên ngoài không?", "Có. Bạn có thể dán kết quả, chọn vấn đề như sai định dạng, quá chung chung hoặc thiếu chi tiết, rồi thêm phản hồi. Bản UI hiện tạo một phiên bản prompt sửa bằng dữ liệu mock."],
  ["Có hỗ trợ lập trình, giáo dục và các lĩnh vực khác không?", "Có 12 lĩnh vực cùng mục đích phù hợp từng ngành. Form thay đổi theo ngữ cảnh, chẳng hạn Coding cần code/lỗi và hành vi mong đợi, Giáo dục có cấp học và mục tiêu học tập."],
  ["Prompt hình ảnh và video có tạo ra ảnh/video không?", "Không. Hai loại này chỉ tối ưu văn bản prompt để sao chép và dùng bên ngoài. Không có tạo ảnh/video trong Phase 1."],
  ["Tài khoản, AI và giá đã được kết nối chính thức chưa?", "Chưa. Đây là prototype UI/mock; tối ưu, repair và chạy thử chưa gọi AI. Prompt và phiên bản được lưu trong trình duyệt. Giá và hạn mức là giả định cần kiểm chứng."],
];

export default function Home() {
  return (
    <LandingMotion>
      <LandingNavigation />
      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title" data-hero>
          <div className={styles.heroAtmosphere} aria-hidden="true">
            <div className={styles.glowOne} /><div className={styles.glowTwo} />
            <div className={styles.orbitScene} data-parallax>
              <div className={styles.orbitRing} /><div className={styles.orbitRing} /><div className={styles.orbitRing} />
              <svg className={styles.orbitLines} viewBox="0 0 1400 850" fill="none">
                {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cx="700" cy="470" rx={410 + i * 48} ry={170 + i * 27} transform="rotate(-22 700 470)" stroke="currentColor" strokeOpacity={0.16 - i * 0.018} />)}
              </svg>
            </div>
          </div>
          <div className={styles.floatingTasks} aria-hidden="true">
            <div className={`${styles.floatingTask} ${styles.floatFacebook}`}><span className={styles.taskIcon}><Icon name="message" /></span><span>Bài Facebook<strong>Đúng chất thương hiệu</strong></span><i /></div>
            <div className={`${styles.floatingTask} ${styles.floatShopee}`}><span className={styles.taskIcon}><Icon name="bag" /></span><span>Mô tả Shopee<strong>Nổi bật từng lợi ích</strong></span></div>
            <div className={`${styles.floatingTask} ${styles.floatIdea}`}><span className={styles.taskIcon}><Icon name="light" /></span><span>Ý tưởng mới<strong>Cho mỗi ngày sáng tạo</strong></span></div>
            <div className={`${styles.floatingTask} ${styles.floatScore}`}><span className={styles.floatingScore}>91</span><span>Yêu cầu rõ hơn<strong>Sẵn sàng sao chép</strong></span><Icon name="sparkle" /></div>
          </div>
          <div className={styles.heroCopy}>
            <span className={styles.heroEyebrow}><span /> Một prompt. Rõ hơn từng phiên bản.</span>
            <h1 id="hero-title">Prompt rõ hơn.<br /><span>Kết quả đúng ý hơn.</span></h1>
            <p>Tối ưu yêu cầu theo lĩnh vực. Sao chép để dùng ở AI bạn quen thuộc.<br className={styles.desktopBreak} /> Kết quả chưa đúng ý? Mang output trở lại để sửa prompt.</p>
            <div className={styles.heroActions}>
              <Link href="/register" className={styles.primaryButton}>Bắt đầu miễn phí <span><Icon name="arrow" /></span></Link>
              <a href="#product-demo" className={styles.secondaryButton}><Icon name="play" /> Xem StudioFlow hoạt động</a>
            </div>
            <div className={styles.heroNotes}><span><Icon name="check" /> Có gói miễn phí</span><span><Icon name="check" /> Dành cho tiếng Việt</span><span><Icon name="check" /> Sửa từ output thực tế</span></div>
          </div>
          <a className={styles.scrollCue} href="#product-demo"><span>Xem prompt thay đổi như thế nào</span><Icon name="chevron" /></a>
        </section>

        <section id="product-demo" className={styles.demoSection} aria-label="Trải nghiệm ví dụ StudioFlow">
          <div className={styles.demoFrame} data-reveal><ProductDemo /></div>
          <div className={styles.audienceStrip} data-reveal><span>Một công cụ. Nhiều lĩnh vực.</span><div><span><Icon name="edit" />Lập trình & Dữ liệu</span><span><Icon name="store" />Marketing & Bán hàng</span><span><Icon name="bolt" />Giáo dục & Văn phòng</span></div></div>
        </section>

        <section id="how-it-works" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal><span className={styles.overline}>LÀM RÕ YÊU CẦU. GIỮ LẠI CÁCH SỬA.</span><h2>Tối ưu một lần.<br /><em>Cải thiện qua mỗi kết quả.</em></h2><p>Bắt đầu từ prompt bạn đang có. Làm rõ thông tin, so sánh phiên bản và sửa dựa trên phản hồi cụ thể.</p></div>
            <div className={styles.stepsGrid}>{steps.map((step, index) => <article className={styles.stepCard} key={step.title} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}><div className={styles.stepTop}><span className={styles.stepIcon}><Icon name={step.icon} /></span><span aria-hidden="true">0{index + 1}</span></div><h3>{step.title}</h3><p>{step.text}</p><span className={styles.stepNote}><span />{step.note}</span></article>)}</div>
          </div>
        </section>

        <section id="features" className={`${styles.section} ${styles.featuresSection}`}>
          <div className={styles.container}>
            <div className={styles.splitHeading} data-reveal><div><span className={styles.overline}>TỪNG BƯỚC ĐỀU CÓ GIÁ TRỊ</span><h2>Prompt chưa đúng ý?<br /><em>Có một vòng sửa rõ ràng.</em></h2></div><p>Rõ hơn khi bắt đầu.<br />Đúng ý hơn khi hoàn thành.<br />Dễ hơn trong lần tiếp theo.</p></div>
            <div className={styles.bentoGrid}>
              <article className={styles.scoreFeature} data-reveal><div className={styles.featureText}><span className={styles.featureLabel}>01 / YÊU CẦU RÕ RÀNG</span><h3>Yêu cầu tốt cần<br />đủ thông tin đúng.</h3><p>Điểm prompt chỉ ra thông tin còn thiếu. Xem sự khác biệt giữa một yêu cầu chung chung và một yêu cầu có định hướng.</p></div><div className={styles.scoreIllustration} aria-label="Ví dụ minh họa điểm prompt từ 42 lên 91"><div className={styles.beforeNote}><span>Ý TƯỞNG BAN ĐẦU</span><p>Viết bài bán áo linen</p><b>42 <small>/ 100</small></b></div><div className={styles.scoreConnector}><Icon name="right" /><span>Thêm bối cảnh</span></div><div className={styles.afterNote}><span>SAU KHI LÀM RÕ</span><div className={styles.scoreRing}><b>91</b><small>/ 100</small></div><div><span><Icon name="check" />Khách hàng</span><span><Icon name="check" />Giọng điệu</span><span><Icon name="check" />Mục tiêu</span></div></div><span className={styles.illustrationCaption}>Điểm minh họa</span></div></article>
              <article className={styles.editFeature} data-reveal><span className={styles.featureLabel}>02 / PROMPT REPAIR LOOP</span><h3>Kết quả sai format?<br />Sửa lại prompt.</h3><p>Dán output chưa đạt, chọn vấn đề và thêm phản hồi. Tạo prompt mới để dùng trong lần thử tiếp theo.</p><div className={styles.editIllustration} aria-hidden="true"><div className={styles.editPaper}><span className={styles.paperDot} /><div /><div /><div /><span className={styles.paperHighlight}>Giữ mục tiêu. Làm rõ định dạng.</span></div><span className={styles.editChip}><Icon name="sparkle" /> Output sai định dạng</span><span className={styles.editChip}>Tạo V3 từ V2 <Icon name="check" /></span></div><a href="#product-demo" className={styles.textLink}>Xem ví dụ Prompt Repair <Icon name="right" /></a></article>
              <article className={styles.saveFeature} data-reveal><div><span className={styles.featureLabel}>03 / PROMPT VERSION</span><h3>Giữ phiên bản để so sánh.</h3><p>V1 gốc, V2 tối ưu, V3 sau sửa. Chọn phiên bản, sao chép và lưu prompt để tiếp tục khi cần.</p></div><div className={styles.savedStack} aria-hidden="true"><div /><div /><div><span className={styles.savedIcon}><Icon name="layers" /></span><span>Prompt Debug TypeScript<small>V3 · Sửa từ phản hồi · Có V1 và V2</small></span><span className={styles.savedCheck}><Icon name="check" /></span></div></div></article>
            </div>
          </div>
        </section>

        <section id="templates" className={`${styles.section} ${styles.templatesSection}`}>
          <div className={styles.container}>
            <div className={styles.splitHeading} data-reveal><div><span className={styles.overline}>MẪU PROMPT CHO NHIỀU LĨNH VỰC</span><h2>Bạn muốn AI<br /><em>hiểu rõ việc gì?</em></h2></div><Link href="/register" className={styles.secondaryButton}>Bắt đầu với một mẫu <Icon name="arrow" /></Link></div>
            <div className={styles.templateGrid}>{promptTemplates.filter(item => ["marketing", "ecommerce", "affiliate", "coding", "education", "seo", "business", "hr"].includes(item.domainId) && item.taskId === domains.find(domain => domain.id === item.domainId)?.tasks[0].id).map((template, index) => { const domain = domains.find(item => item.id === template.domainId)!; return <Link href={`/app/optimize?template=${template.id}`} className={styles.templateCard} key={template.id} data-reveal style={{ "--reveal-delay": `${index % 4 * 60}ms` } as React.CSSProperties}><div><span className={styles.templateIcon} data-tone={domain.tone}><Icon name={domain.icon} /></span><span className={styles.templateArrow}><Icon name="arrow" /></span></div><span className={styles.templateCategory}>{domain.label}</span><h3>{template.title}</h3><p>{template.description}</p></Link>; })}</div>
            <div className={styles.templateFootnote}><Icon name="sparkle" /><span>12 lĩnh vực. Có mục đích phù hợp để bắt đầu.</span><a href="#product-demo">Xem các ví dụ <Icon name="right" /></a></div>
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeading} data-reveal><span className={styles.overline}>BẮT ĐẦU NHỎ. SÁNG TẠO THEO NHỊP CỦA BẠN.</span><h2>Cho prompt một bước tiến.<br /><em>Bắt đầu từ miễn phí.</em></h2><p>Khám phá cách làm phù hợp trước khi chọn gói cho nhu cầu nhiều hơn.</p><span className={styles.pricePreview}><span />Bảng giá dự kiến · Phiên bản trải nghiệm</span></div>
            <div className={styles.pricingGrid}>{plans.map((plan) => <article className={`${styles.priceCard} ${plan.name === "FREE" ? styles.freePlan : ""}`} key={plan.name} data-reveal>{plan.name === "FREE" && <span className={styles.priceFlag}>BẮT ĐẦU TẠI ĐÂY <Icon name="sparkle" /></span>}<span className={styles.planName}>{plan.name}</span><div className={styles.planPrice}>{plan.price}</div><span className={styles.planPeriod}>{plan.period}</span><p>{({ FREE: "Cho ý tưởng đầu tiên", PRO: "Cho công việc hằng ngày", CREATOR: "Cho nhịp sáng tạo đều đặn", BUSINESS: "Định hướng cho nhóm nhỏ" })[plan.name]}</p><Link href="/register" className={plan.name === "FREE" ? styles.primaryButton : styles.secondaryButton}>{plan.name === "FREE" ? "Bắt đầu miễn phí" : "Khám phá gói"}<Icon name="right" /></Link><ul>{plan.features.map(feature => <li key={feature}><Icon name="check" />{feature}</li>)}</ul></article>)}</div>
            <p className={styles.pricingNote}>Giá và hạn mức là giả định sản phẩm, chưa phải quyền lợi dịch vụ đã ra mắt.</p>
          </div>
        </section>

        <section id="faq" className={`${styles.section} ${styles.faqSection}`}><div className={`${styles.container} ${styles.faqLayout}`}><div data-reveal><span className={styles.overline}>GIẢI ĐÁP TRƯỚC KHI BẮT ĐẦU</span><h2>Bạn hỏi.<br /><em>StudioFlow trả lời.</em></h2><p>Tối ưu, sao chép và sửa từ kết quả — theo nhịp làm việc của bạn.</p><Link href="/register" className={styles.textLink}>Khám phá miễn phí <Icon name="right" /></Link></div><div className={styles.faqList} data-reveal>{questions.map(([question, answer], index) => <details key={question} className={styles.faqItem} name="landing-faq"><summary><span className={styles.faqNumber} aria-hidden="true">0{index + 1}</span><span>{question}</span><Icon name="plus" /></summary><p>{answer}</p></details>)}</div></div></section>

        <section className={styles.closingSection}><div className={`${styles.container} ${styles.closingCard}`} data-reveal><div className={styles.closingOrbits} aria-hidden="true"><div /><div /><div /></div><span className={styles.closingSparkle}><Icon name="sparkle" /></span><span className={styles.overline}>PROMPT TỐT HƠN BẮT ĐẦU TỪ YÊU CẦU RÕ HƠN</span><h2>Prompt tiếp theo,<br /><em>rõ hơn từ hôm nay.</em></h2><p>Một lần tối ưu. Một phiên bản để tiếp tục cải thiện.</p><Link href="/register" className={styles.primaryButton}>Tối ưu prompt đầu tiên <span><Icon name="arrow" /></span></Link><span className={styles.closingNote}>Bắt đầu với gói miễn phí</span></div></section>
      </main>
      <footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><Link href="/" aria-label="StudioFlow trang chủ"><Brand /></Link><p>Tối ưu prompt theo lĩnh vực.<br />Cải thiện từ phản hồi thực tế.</p><div><a href="#templates">Mẫu Prompt</a><a href="#pricing">Bảng giá</a><Link href="/login">Đăng nhập</Link></div></div><div className={styles.footerBottom}><span>© 2026 StudioFlow</span><span>Được xây dựng cho sự sáng tạo bằng tiếng Việt.</span><a href="#hero-title">Về đầu trang <Icon name="arrow" /></a></div></div></footer>
    </LandingMotion>
  );
}
