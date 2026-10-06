"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Brand, Icon } from "@/components/ui";
import { getDomain } from "@/lib/prompt-catalog";
import { seedPrompts, mockRepair } from "@/lib/prompt-model";
import styles from "@/app/landing.module.css";

const links = [
  ["#how-it-works", "Cách hoạt động"],
  ["#features", "Tính năng"],
  ["#templates", "Mẫu Prompt"],
  ["#pricing", "Bảng giá"],
];

export function LandingNavigation() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return <>
    <a href="#main-content" className={styles.skipLink}>Đến nội dung chính</a>
    <header className={styles.nav} ref={headerRef}>
      <div className={styles.navInner}>
        <Link href="/" aria-label="StudioFlow trang chủ"><Brand /></Link>
        <nav className={styles.desktopNav} aria-label="Điều hướng trang chủ">{links.map(([href, title]) => <a key={href} href={href}>{title}</a>)}</nav>
        <div className={styles.navActions}><Link href="/login" className={styles.loginLink}>Đăng nhập</Link><Link href="/register" className={styles.navCta}>Bắt đầu miễn phí <Icon name="arrow" /></Link><button className={styles.menuToggle} ref={toggleRef} type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="landing-mobile-menu" onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button></div>
      </div>
      <nav id="landing-mobile-menu" className={styles.mobileNav} aria-label="Điều hướng trên điện thoại" hidden={!open}>{links.map(([href, title]) => <a key={href} href={href} onClick={() => setOpen(false)}>{title}<Icon name="arrow" /></a>)}<Link href="/login" onClick={() => setOpen(false)}>Đăng nhập <Icon name="right" /></Link></nav>
      <div className={styles.scrollProgress} aria-hidden="true"><div data-scroll-progress /></div>
    </header>
  </>;
}

export function LandingMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = root.querySelector<HTMLElement>("[data-hero]");
    const orbit = root.querySelector<HTMLElement>("[data-parallax]");
    const progress = root.querySelector<HTMLElement>("[data-scroll-progress]");
    const reveals = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    // Only transforms are updated; the browser keeps native scrolling and layout.
    const update = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty("transform", `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`);
      if (!preference.matches && orbit && hero) {
        const bounds = hero.getBoundingClientRect();
        root.dataset.heroActive = String(bounds.bottom > 0);
        if (bounds.bottom > 0) {
          orbit.style.setProperty("--scroll-shift", `${Math.min(window.scrollY, 900) * 0.13}px`);
          orbit.style.setProperty("--pointer-x", `${pointerX}px`);
          orbit.style.setProperty("--pointer-y", `${pointerY}px`);
        }
      }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const pointerMove = (event: PointerEvent) => {
      if (preference.matches || event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth - 0.5) * 24;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 18;
      schedule();
    };
    const pointerLeave = () => { pointerX = 0; pointerY = 0; schedule(); };
    const configure = () => {
      observer?.disconnect();
      root.dataset.motion = String(!preference.matches);
      if (preference.matches || !("IntersectionObserver" in window)) {
        reveals.forEach(element => { element.dataset.visible = "true"; });
        orbit?.style.removeProperty("--scroll-shift");
        orbit?.style.removeProperty("--pointer-x");
        orbit?.style.removeProperty("--pointer-y");
        return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: "0px 0px -12px 0px" });
      reveals.forEach(element => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) element.dataset.visible = "true";
        else if (!element.dataset.visible) observer?.observe(element);
      });
      schedule();
    };
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    hero?.addEventListener("pointermove", pointerMove, { passive: true });
    hero?.addEventListener("pointerleave", pointerLeave);
    preference.addEventListener("change", configure);
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      hero?.removeEventListener("pointermove", pointerMove);
      hero?.removeEventListener("pointerleave", pointerLeave);
      preference.removeEventListener("change", configure);
    };
  }, []);

  return <div className={styles.page} ref={rootRef}>{children}</div>;
}

const examples = seedPrompts.filter(item => ["marketing", "coding", "education"].includes(item.domainId));

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const [repaired, setRepaired] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const example = examples[active];
  const domain = getDomain(example.domainId);
  const optimized = example.versions[1];
  const current = repaired ? mockRepair(optimized, "Output trả về là một đoạn văn dài, không có các phần rõ ràng.", ["format"], "Trình bày bằng các phần có tiêu đề và checklist dễ đối chiếu.", "external", 3) : optimized;
  const select = (index: number) => { setActive(index); setRepaired(false); setCopyMessage(""); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(current.text); setCopyMessage(`Đã sao chép prompt V${current.number}`); }
    catch { setCopyMessage("Chưa sao chép được. Chọn văn bản prompt để sao chép thủ công."); }
  };
  return <div className={styles.productDemo}>
    <div className={styles.browserBar}><span className={styles.browserDots} aria-hidden="true"><i /><i /><i /></span><span className={styles.browserAddress}><Icon name="lock" /> StudioFlow / Prompt Optimizer</span><span className={styles.demoBadge}><span /> Bản minh họa</span></div>
    <div className={styles.demoHeader}><div><span className={styles.overline}>TỐI ƯU · SAO CHÉP · CẢI THIỆN</span><h2>Thấy rõ prompt tốt hơn ở đâu.</h2></div><span className={styles.demoHint}><Icon name="sparkle" /> Chọn lĩnh vực để thử</span></div>
    <div className={styles.demoTabs} role="tablist" aria-label="Chọn ví dụ prompt">{examples.map((item, index) => <button key={item.id} type="button" role="tab" id={`example-tab-${item.domainId}`} aria-selected={active === index} aria-controls="example-panel" tabIndex={active === index ? 0 : -1} className={active === index ? styles.activeTab : ""} ref={element => { tabs.current[index] = element; }} onClick={() => select(index)} onKeyDown={event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % examples.length;
      else if (event.key === "ArrowLeft") next = (index + examples.length - 1) % examples.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = examples.length - 1;
      else return;
      event.preventDefault(); select(next); tabs.current[next]?.focus();
    }}><Icon name={getDomain(item.domainId).icon} />{item.domainId === "marketing" ? "Marketing" : getDomain(item.domainId).label}</button>)}</div>
    <div className={styles.demoPanel} role="tabpanel" id="example-panel" aria-labelledby={`example-tab-${example.domainId}`} tabIndex={0}>
      <div className={styles.demoInput}>
        <div className={styles.demoColumnLabel}><span>01</span> PROMPT BAN ĐẦU · V1</div>
        <div className={styles.ideaBox} key={example.id}><Icon name="edit" /><p>{example.input}</p><span>Yêu cầu còn thiếu bối cảnh và định dạng.</span></div>
        <div className={styles.contextTitle}>Bổ sung thông tin theo lĩnh vực</div>
        <div className={styles.contextChips}>{Object.entries(example.context).slice(0, 3).map(([key, value]) => <span key={key}><Icon name="check" />{value}</span>)}</div>
        <div className={styles.demoScoreCard}><div className={styles.demoScoreRing}><strong>{current.score}</strong><span>/100</span></div><div><strong>42 → {current.score} · Điểm prompt mẫu</strong><p>Tiêu chí chung + thông tin lĩnh vực.</p><span>Không phải điểm thuật toán thực tế</span></div><Icon name="sparkle" /></div>
        <details className={styles.optimizedPrompt}><summary>Prompt Repair hoạt động thế nào? <Icon name="chevron" /></summary><p>Dán output chưa đúng ý → chọn vấn đề → chẩn đoán → sửa prompt thành V3. Bạn vẫn giữ V2 để so sánh, sao chép hoặc chủ động chạy thử.</p></details>
        <div className={styles.demoInputFooter}><span><Icon name="layers" /> Tối ưu → Sao chép → Dùng ở AI của bạn</span><Icon name="right" /></div>
      </div>
      <div className={styles.demoOutput}>
        <div className={styles.demoColumnLabel}><span>02</span> PROMPT {repaired ? "ĐÃ SỬA · V3" : "ĐÃ TỐI ƯU · V2"}<span className={styles.resultReady}><Icon name="check" /> Có thể sao chép</span></div>
        <div className={styles.outputPaper}>
          <div className={styles.outputBrand}><span className={styles.outputAvatar}><Icon name={domain.icon} /></span><div><strong>{domain.label}</strong><span>{repaired ? "Thêm yêu cầu sửa định dạng" : "Rõ mục tiêu, bối cảnh và giới hạn"}</span></div><Icon name="layers" /></div>
          <div className={`${styles.outputContent} ${styles.promptPreview}`} key={`${example.id}-${repaired}`}><h3>{example.name}</h3><pre>{current.text}</pre></div>
          <div className={styles.outputMeta}><span><span />{repaired ? "V3 được tạo từ V2 · Mẫu Repair" : "V2 được tạo từ V1 · Mẫu tối ưu"}</span><Icon name="check" /></div>
        </div>
        <div className={styles.quickEdit}><span>Khám phá</span><div><button type="button" aria-pressed={repaired} onClick={() => { setRepaired(!repaired); setCopyMessage(""); }}><Icon name="edit" />{repaired ? "Xem lại V2" : "Thử Prompt Repair"}</button><button type="button" onClick={copy}><Icon name={copyMessage.startsWith("Đã") ? "check" : "copy"} />Sao chép prompt</button></div></div>
        <span className={styles.copyStatus} role="status">{copyMessage}</span>
      </div>
    </div>
    <div className={styles.demoBottom}><span>Ví dụ soạn sẵn. Chạy thử là tùy chọn, không tự động tạo output.</span><Link href="/app/optimize">Tối ưu prompt của bạn <Icon name="arrow" /></Link></div>
  </div>;
}
