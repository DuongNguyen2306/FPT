import { Check, CreditCard, Pencil } from "lucide-react";

const STEPS = [
  { id: 1, label: "Thông tin đăng ký", Icon: Pencil },
  { id: 2, label: "Thanh toán", Icon: CreditCard },
  { id: 3, label: "Hoàn tất đơn hàng", Icon: Check },
];

/**
 * @param {{ currentStep: 1 | 2 | 3 }} props
 */
export default function RegistrationStepper({ currentStep }) {
  return (
    <nav
      className="mx-auto flex max-w-3xl items-start justify-center gap-0 px-2"
      aria-label="Tiến trình đăng ký"
    >
      {STEPS.map((step, index) => {
        const active = currentStep === step.id;
        const done = currentStep > step.id;
        const Icon = step.Icon;
        return (
          <div key={step.id} className="flex flex-1 items-start">
            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors sm:h-12 sm:w-12 ${
                  active
                    ? "border-[#0066b3] bg-[#0066b3] text-white"
                    : done
                      ? "border-[#0066b3] bg-white text-[#0066b3]"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} />
              </span>
              <p
                className={`mt-2 max-w-[7rem] text-xs font-medium leading-tight sm:max-w-none sm:text-sm ${
                  active ? "text-[#0066b3]" : done ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={`mt-5 h-0.5 min-w-[1.5rem] flex-1 sm:min-w-[2.5rem] ${
                  done || currentStep > step.id ? "bg-[#0066b3]" : "bg-slate-200"
                }`}
                aria-hidden
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
