"use client";

import { useState } from "react";
import { FlutedGlass } from "@paper-design/shaders-react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

export default function AuthSectionThree() {
  return (
    <section className="min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] bg-[#050505] text-white">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Left: signup form */}
        <div className="flex min-h-[760px] items-center justify-center rounded-md border border-black/10 bg-white px-6 py-12 border-white/5 bg-[#0a0a0c] lg:min-h-0 lg:px-14 lg:py-20 xl:px-20">
          <div className="mx-auto w-full max-w-[460px]">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Create an account
            </h1>

            <form
              action="/user/createUser"
              method="POST"
              className="mt-8 space-y-4"
            >
              <InputField
                label="Full name"
                name="name"
                placeholder="Enter your full name"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="email@example.com"
              />
              <InputField
                label="Contact number"
                name="contact"
                type="tel"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Create a password"
                minLength={6}
              />

              <button
                type="submit"
                className="mt-8 flex h-11 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 border-white/40 bg-white text-black hover:bg-white/85"
              >
                Sign up
              </button>

              <p className="pt-2 text-center text-sm text-black/50 text-white/50">
                Already have an account?{" "}
                <a
                  href="/amazon-clone/login"
                  className="font-medium text-black underline underline-offset-2 text-white"
                >
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right: shader + testimonial */}
        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-md bg-linear-to-b from-black to-white p-8 text-white to-[#050505] sm:p-12 lg:min-h-0 lg:p-16">
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
              colorHighlight="#FFFFFF"
              colorShadow="#000000"
              className="h-full w-full bg-transparent"
            />
          </div>

          <div className="relative z-10 h-full w-full">
            <div className="max-w-[460px] lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4"
              >
                <img
                  src="https://res.cloudinary.com/harshitproject/image/upload/v1746774430/member-five.png"
                  alt="Charlotte"
                  className="size-10 shrink-0 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <div className="font-semibold leading-tight">Charlotte</div>
                  <div className="mt-0.5 text-xs text-white/60">
                    Happy customer
                  </div>
                </div>
              </motion.div>

              <motion.blockquote
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 text-2xl font-light leading-tight tracking-[-0.035em] text-white/90 sm:text-3xl lg:text-[34px]"
              >
                “Everything I needed, delivered fast. Shopping on Node is a
                joy.”
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
      <label
        htmlFor={name}
        className="text-xs font-semibold text-black/60 text-white/60"
      >
        {label}
      </label>
      <div className="relative flex h-11 items-center rounded-lg border border-black/15 bg-white px-3.5 border-white/10 bg-white/5">
        <input
          id={name}
          name={name}
          required
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30 text-white placeholder:text-white/30"
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 cursor-pointer text-black/40 hover:text-black text-white/40 hover:text-white"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}