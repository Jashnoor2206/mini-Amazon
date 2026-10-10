"use client";

import { useState } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

type Mode = "signup" | "login" | "address";

const quotes: Record<Mode, string> = {
  signup: "All roads lead to Node, your one stop for everything",
  login: "Welcome back. Your cart and wishlist are right where you left them.",
  address: "Tell us where to deliver and we will take it from there.",
};

export default function AuthSection({
  mode,
  error,
  userId,
}: {
  mode: Mode;
  error?: string;
  userId?: string;
}) {
  const isLogin = mode === "login";
  const isAddress = mode === "address";

  const heading = isAddress
    ? "Add your address"
    : isLogin
      ? "Welcome back"
      : "Create an account";

  const action = isAddress
    ? `/user/addressPage/${userId}`
    : isLogin
      ? "/user/login"
      : "/user/createUser";

  const buttonText = isAddress ? "Save address" : isLogin ? "Log in" : "Sign up";

  return (
    <section className="min-h-screen bg-ink p-3 text-ink antialiased [font-synthesis:none]">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left: form */}
        <div className="flex min-h-[760px] items-center justify-center rounded-md border border-ink/10 bg-cream px-6 py-12 lg:min-h-0 lg:px-14 lg:py-20 xl:px-20">
          <div className="mx-auto w-full max-w-[460px]">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              {heading}
            </h1>

            {error && (
              <p className="mt-4 rounded-lg border border-red-700/30 bg-red-600/10 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <form action={action} method="POST" className="mt-8 space-y-4">
              {isAddress ? (
                <>
                  <InputField
                    label="Address label"
                    name="label"
                    placeholder="Home, Work, etc."
                    defaultValue="Home"
                    required={false}
                  />
                  <InputField
                    label="Street"
                    name="street"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="city" placeholder="City" />
                    <InputField label="State" name="state" placeholder="State" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Postal code"
                      name="postalCode"
                      placeholder="Postal code"
                    />
                    <InputField
                      label="Country"
                      name="country"
                      placeholder="Country"
                      defaultValue="India"
                      required={false}
                    />
                  </div>
                </>
              ) : (
                <>
                  {!isLogin && (
                    <InputField
                      label="Full name"
                      name="name"
                      placeholder="Enter your full name"
                    />
                  )}
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                  />
                  {!isLogin && (
                    <InputField
                      label="Contact number"
                      name="contact"
                      type="tel"
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      maxLength={10}
                    />
                  )}
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    minLength={isLogin ? undefined : 6}
                  />
                </>
              )}

              <button
                type="submit"
                className="mt-8 flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-ink bg-ink text-sm font-medium text-cream transition-colors hover:bg-ink/85"
              >
                {buttonText}
              </button>

              {!isAddress && (
                <p className="pt-2 text-center text-sm text-ink/60">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <a
                    href={isLogin ? "/amazon-clone/signup" : "/amazon-clone/login"}
                    className="font-medium text-ink underline underline-offset-2"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right: shader + quote */}
        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-md bg-linear-to-b from-ink to-sage p-8 text-cream sm:p-12 lg:min-h-0 lg:p-16">
          <div className="pointer-events-none absolute inset-0 z-0">
            <FlutedGlass
              size={0.89}
              shape="lines"
              angle={0}
              distortionShape="prism"
              distortion={0.5}
              shift={0}
              blur={0}
              edges={0.25}
              stretch={0}
              scale={1.11}
              fit="cover"
              highlights={0.1}
              shadows={0.2}
              grainMixer={0.1}
              grainOverlay={0.1}
              colorBack="#00000000"
              colorHighlight="#E8E6E1"
              colorShadow="#232826"
              className="h-full w-full bg-transparent"
            />
          </div>

          <div className="relative z-10 h-full w-full">
            <div className="max-w-[460px] lg:pt-12">
              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 text-2xl font-light leading-tight tracking-[-0.035em] text-cream sm:text-3xl lg:text-[34px]"
              >
                “{quotes[mode]}”
              </motion.blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
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
      <label htmlFor={name} className="text-xs font-semibold text-ink/60">
        {label}
      </label>
      <div className="relative flex h-11 items-center rounded-lg border border-ink/15 bg-white/50 px-3.5 focus-within:border-sage">
        <input
          id={name}
          name={name}
          required
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 cursor-pointer text-ink/50 hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}