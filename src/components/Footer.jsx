import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

const COLS = [
  {
    title: "Về demo",
    links: [
      { href: "#", label: "Giới thiệu" },
      { href: "#", label: "Tin tức" },
      { href: "#", label: "Tuyển dụng" },
      { href: "#", label: "Đối tác" },
    ],
  },
  {
    title: "Khách hàng",
    links: [
      { href: "#", label: "Hướng dẫn sử dụng" },
      { href: "#", label: "Thanh toán cước" },
      { href: "#", label: "Góp ý / phản ánh" },
      { href: "#", label: "Câu hỏi thường gặp" },
    ],
  },
  {
    title: "Sản phẩm",
    links: [
      { href: "#internet", label: "Internet" },
      { href: "#truyen-hinh", label: "Truyền hình FPT Play" },
      { href: "#camera", label: "Camera an ninh" },
      { href: "#dich-vu", label: "Dịch vụ thêm" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { href: "tel:19006600", label: "Hotline 24/7" },
      { href: "#", label: "Điểm giao dịch" },
      { href: "#", label: "Bảo hành thiết bị" },
      { href: "#", label: "Điều khoản sử dụng" },
    ],
  },
];

const SOCIAL = [
  { href: "https://www.facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://www.youtube.com", label: "YouTube", Icon: Youtube },
  { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <a href="#" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fpt text-sm font-extrabold text-white shadow-sm">
                FPT
              </span>
              <span className="text-lg font-bold tracking-tight text-fpt-blue-dark">
                Telecom <span className="font-semibold text-slate-500">· Demo</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Trang landing minh họa giao diện — không phải website chính thức của FPT Telecom. Nội dung,
              giá cả và chính sách chỉ mang tính tham khảo khi xây dựng UI.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-fpt hover:text-fpt"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:min-w-[320px] lg:flex-col lg:items-stretch lg:p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tổng đài tư vấn
              </p>
              <a
                href="tel:19006600"
                className="mt-1 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-fpt-blue sm:text-3xl"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Phone className="h-5 w-5" strokeWidth={2} />
                </span>
                1900 6600
              </a>
              <p className="mt-2 text-xs text-slate-500">Số minh họa — không gọi được nếu chưa cấu hình.</p>
            </div>
            <div className="h-px w-full bg-slate-100 sm:hidden" aria-hidden />
            <div className="space-y-3 text-sm text-slate-600">
              <a
                href="mailto:contact@demo.local"
                className="flex items-start gap-3 transition hover:text-fpt"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>contact@demo.local</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span>
                  Tòa nhà minh họa, Quận Cầu Giấy, Hà Nội
                  <span className="mt-1 block text-xs text-slate-500">(Địa chỉ demo, không tra cứu thật.)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-slate-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-fpt-blue-dark">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-slate-600 transition hover:text-fpt"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-center text-xs text-slate-500">
          Đây là bản demo UI. Thông tin doanh nghiệp, giấy phép và logo thương hiệu thật không được sử dụng
          cho mục đích thương mại khi chưa được cấp phép.
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Bản demo — không liên kết với FPT Telecom.</p>
          <p className="sm:text-right">
            <a href="#" className="hover:text-fpt">
              Chính sách bảo mật
            </a>
            <span className="mx-2 text-slate-300" aria-hidden>
              |
            </span>
            <a href="#" className="hover:text-fpt">
              Điều khoản
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
