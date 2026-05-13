import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SpeedXCard from "./SpeedXCard.jsx";

export default function SpeedXSection({ packages, onRegister }) {
  const scroller = useRef(null);

  const scrollBy = (delta) => {
    scroller.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative mb-14 sm:mb-16">
      <div className="mb-8 text-center px-2">
        <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl lg:text-[1.65rem]">
          SpeedX — Gói cước Wi-Fi 7 siêu tốc độ trên hạ tầng XGS-PON
        </h2>
        <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
          Thẻ sản phẩm minh họa theo layout FPT: nền cam, ảnh người dùng & thiết bị, giá và nút hành động màu xanh.
        </p>
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-340)}
        className="absolute left-0 top-[58%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:border-blue-200 hover:text-blue-600 lg:flex"
        style={{ marginLeft: "-0.25rem" }}
        aria-label="Cuộn trái"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(340)}
        className="absolute right-0 top-[58%] z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:border-blue-200 hover:text-blue-600 lg:flex"
        style={{ marginRight: "-0.25rem" }}
        aria-label="Cuộn phải"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={scroller}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 pl-1 pr-1 pt-1 sm:gap-6 lg:px-2"
      >
        {packages.map((item) => (
          <SpeedXCard key={item.id} item={item} onRegister={onRegister} />
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => scrollBy(-280)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-blue-600"
          aria-label="Cuộn trái"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(280)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-blue-600"
          aria-label="Cuộn phải"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
