"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Brand, Button, Icon } from "@/components/ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [notice, setNotice] = useState("");
  const isRegister = mode === "register";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Đây là bản dùng thử giao diện. Tài khoản chưa được tạo hoặc xác thực.");
  }

  return <main className="auth-page">
    <aside className="auth-aside"><Link href="/"><Brand /></Link><div className="auth-aside-content"><span className="eyebrow"><span className="eyebrow-dot"/>StudioFlow cho công việc mỗi ngày</span><h1>Kết quả tốt bắt đầu từ một prompt rõ ràng.</h1><p>Tối ưu prompt theo lĩnh vực. Sao chép để dùng ở AI bạn quen thuộc, rồi mang kết quả trở lại để cải thiện prompt.</p><div className="auth-aside-quote">Từ lập trình đến giáo dục, bán hàng và sáng tạo: làm rõ yêu cầu và giữ lại các phiên bản hữu ích.</div></div><span className="muted" style={{ fontSize: 10 }}>© 2026 StudioFlow</span></aside>
    <section className="auth-main"><div className="auth-box"><Link href="/" style={{ display: "inline-flex", marginBottom: 29 }}><Brand /></Link><h2>{isRegister ? "Tạo tài khoản" : "Chào mừng bạn trở lại"}</h2><p className="auth-subtitle">{isRegister ? "Bắt đầu tối ưu và lưu các phiên bản prompt của bạn." : "Đăng nhập để tiếp tục công việc của bạn."}</p><form onSubmit={submit}><div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" placeholder="ban@email.com" required /></div><div className="field"><label htmlFor="password">Mật khẩu</label><input className="input" id="password" name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Tối thiểu 8 ký tự" minLength={8} required /></div>{isRegister ? <div className="field"><label htmlFor="name">Tên của bạn</label><input className="input" id="name" name="name" autoComplete="name" placeholder="Nguyễn An" required /></div> : <div style={{ display: "flex", justifyContent: "flex-end", margin: "-3px 0 15px" }}><button type="button" className="button button-quiet button-small" onClick={() => setNotice("Tính năng khôi phục mật khẩu sẽ có khi tích hợp đăng nhập thật.")}>Quên mật khẩu?</button></div>}<Button className="auth-submit" type="submit">{isRegister ? "Tạo tài khoản miễn phí" : "Đăng nhập"}<Icon name="right" /></Button></form><div className="auth-divider">hoặc</div><Button variant="secondary" className="auth-submit" onClick={() => setNotice("Đăng nhập Google chưa được bật trong bản prototype.")}><span style={{ fontWeight: 750 }}>G</span> Tiếp tục với Google</Button>{notice ? <div className="auth-notice" role="status">{notice}</div> : null}<div className="auth-switch">{isRegister ? <>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></> : <>Chưa có tài khoản? <Link href="/register">Tạo tài khoản miễn phí</Link></>}</div><p className="field-help" style={{ marginTop: 18, textAlign: "center", lineHeight: 1.7 }}>Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật.</p></div></section>
  </main>;
}
