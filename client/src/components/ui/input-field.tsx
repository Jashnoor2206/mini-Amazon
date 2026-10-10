import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function InputField({
  label,
  name,
  placeholder,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full space-y-1.5 text-left">
      <label
        htmlFor={name}
        className="text-xs font-semibold uppercase tracking-wider text-slate"
      >
        {label}
      </label>
      <div className="relative flex h-11 items-center rounded-lg border border-olive bg-white px-3.5 transition-colors focus-within:border-sage">
        <input
          id={name}
          name={name}
          required
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate/60"
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 cursor-pointer text-slate hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}