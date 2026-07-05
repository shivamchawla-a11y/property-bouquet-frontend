"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import {
  Eye,
  EyeOff,
  Quote,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Property Bouquet helped us secure a luxury residence on Golf Course Road before the public launch. The entire experience felt truly exclusive.",
    name: "Rahul Bansal",
    role: "Business Owner • Golf Course Road, Gurugram",
  },
  {
    quote:
      "Their investment advisory gave us early access to a premium project in DLF Phase 5. It turned out to be one of our best real estate decisions.",
    name: "Priya Arora",
    role: "Entrepreneur • DLF Phase 5, Gurugram",
  },
  {
    quote:
      "We were looking for long-term appreciation in New Gurgaon, and Property Bouquet identified the perfect investment opportunity before prices moved.",
    name: "Karan Mehta",
    role: "Investor • New Gurgaon (Sector 92)",
  },
  {
    quote:
      "Finding premium plotted developments around Farukhnagar was effortless with their guidance. Their market knowledge is exceptional.",
    name: "Nitin Yadav",
    role: "Land Investor • Farukhnagar",
  },
  {
    quote:
      "Their private inventory on Sohna Road offered options that weren't available through traditional channels. Highly recommended.",
    name: "Megha Khanna",
    role: "Homebuyer • Sohna Road, Gurugram",
  },
  {
    quote:
      "Property Bouquet introduced us to an outstanding investment opportunity along Dwarka Expressway well before the market caught on.",
    name: "Vikram Sethi",
    role: "NRI Investor • Sector 113, Dwarka Expressway",
  },
];

export default function LuxuryAuthPage() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);

      router.push("/admin");
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Server error");
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  const interval = setInterval(() => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);

  return (
    <>
  <Navbar />

  <main
  className="
    relative
    min-h-screen
    overflow-hidden
    bg-[#050505]
    pt-[88px]
  "
>
    <div
className="
absolute
top-[18%]
left-[12%]

w-2
h-2

rounded-full

bg-[#D9B061]

animate-pulse
"
/>

<div
className="
absolute
top-[38%]
left-[28%]

w-3
h-3

rounded-full

bg-[#D9B061]/60

animate-ping
"
/>

<div
className="
absolute
bottom-[25%]
right-[30%]

w-2
h-2

rounded-full

bg-[#D9B061]/70

animate-pulse
"
/>

      {/* BACKGROUND IMAGE */}
{/* ================= LEFT BACKGROUND ================= */}

<div
  className="
    absolute
    inset-y-0
    left-0
    w-full
    lg:w-[62%]
    overflow-hidden
  "
>

<Image
  src="/auth-bg.webp"
  alt=""
  fill
  priority
  sizes="100vw"
  className="
    absolute
    inset-0
    object-cover
    object-center
    scale-[1.08]
  "
/>


  {/* left fade */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-black/10
      via-black/30
      to-[#050505]
    "
  />

  {/* top vignette */}
  <div
    className="
      absolute
      inset-0
      bg-gradient-to-b
      from-black/40
      via-transparent
      to-black/60
    "
  />
</div>

{/* RIGHT SIDE */}

<div
  className="
    absolute
    top-0
    right-0
    h-full
    w-full
    lg:w-[42%]
    bg-[#050505]
  "
/>

<div
    className="
        absolute
        bottom-[-120px]
        left-[8%]
        w-[420px]
        h-[420px]
        rounded-full
        bg-[#D9B061]/5
        blur-[170px]
    "
/>

      {/* CONTENT */}
      <motion.div

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:0.8
}}

className="
        relative
        z-20
        min-h-screen
        max-w-[1500px]
        mx-auto
        grid
        lg:grid-cols-[1fr_500px]
        items-center
        gap-6
        px-5 lg:px-14
    "
>

        {/* LEFT SECTION */}
        <div
  className="
    hidden
lg:flex
relative
flex-col
justify-center
pb-20
max-w-[420px]
  "
>
          

          {/* HERO TEXT */}
          <div className="max-w-[480px]">

  

  <h1
    className="
        text-white
        text-[54px]
leading-[0.92]
        tracking-[-0.05em]
        font-extralight
        max-w-[600px]
    "
>
  Private

  <span className="block text-[#d9b061]">
    Investment
  </span>

  Gateway
</h1>

<p
    className="
        mt-10
        text-white/72
        text-[17px]
leading-[1.8]
max-w-[460px]
    "
>
    Unlock privileged access to luxury residences,
    off-market investment opportunities,
    private launches and bespoke advisory
    services curated exclusively for discerning
    buyers and investors.
</p>

</div>


          {/* BOTTOM */}
          <div className="mt-14 space-y-7">

{[
"Exclusive Luxury Launches",
"Private Investment Opportunities",
"Dedicated Wealth Advisor",
"Market Intelligence Reports",
].map((item)=>(
<div
key={item}
className="flex items-center gap-5"
>

<div
className="
w-9
h-9
rounded-full
border
border-[#D9B061]
bg-[#D9B061]/10
flex
items-center
justify-center
text-[#D9B061]
text-base
"
>
✓
</div>

<span
className="
text-white
text-[13px]
tracking-wide
"
>
{item}
</span>

</div>
))}

</div>

<motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.7 }}
  whileHover={{ y: -4 }}
  className="
    mt-12
    max-w-[420px]
    rounded-[24px]
    border
    border-[#D9B061]/20
    bg-[rgba(12,12,12,0.72)]
    backdrop-blur-xl
    shadow-[0_20px_60px_rgba(0,0,0,0.45)]
    overflow-hidden
    relative
  "
>
  {/* Golden Glow */}
  <div
    className="
      absolute
      -top-10
      right-0
      w-40
      h-40
      rounded-full
      bg-[#D9B061]/10
      blur-3xl
    "
  />

  <div className="relative p-6">

  {/* Quote Icon + Stars */}
  <div className="flex items-center justify-between">

    <div
      className="
      w-11
      h-11
      rounded-full
      bg-[#D9B061]/10
      border
      border-[#D9B061]/20
      flex
      items-center
      justify-center
    "
    >
      <Quote
        size={20}
        className="text-[#D9B061]"
      />
    </div>

    <div className="flex gap-1 text-[#D9B061]">
      ★★★★★
    </div>

  </div>

  <AnimatePresence mode="wait">

    <motion.div
      key={testimonialIndex}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45 }}
    >

      <p
        className="
        mt-5
        text-white/85
        italic
        leading-7
        text-[14px]
        min-h-[80px]
      "
      >
        "{testimonials[testimonialIndex].quote}"
      </p>

      <div className="mt-6">

        <p className="text-[#D9B061] font-medium text-[14px]">
          {testimonials[testimonialIndex].name}
        </p>

        <p className="text-white/45 text-[12px] mt-1">
          {testimonials[testimonialIndex].role}
        </p>

      </div>
<div className="flex gap-2 mt-6">

  {testimonials.map((_, index) => (

    <button
      key={index}
      onClick={() => setTestimonialIndex(index)}
      className={`
      h-2
      rounded-full
      transition-all
      duration-500

      ${
        testimonialIndex === index
          ? "w-8 bg-[#D9B061]"
          : "w-2 bg-white/20 hover:bg-white/40"
      }
    `}
    />

  ))}

</div>
    </motion.div>

  </AnimatePresence>

</div>
</motion.div>

        </div>

        

        {/* RIGHT SECTION */}
        <div
  className="
relative
flex
justify-end
items-center

py-16

lg:py-0
"
>

    <div
className="
absolute

right-10

w-[520px]
h-[520px]

rounded-full

bg-[#D9B061]/8

blur-[150px]

pointer-events-none
"
/>
         <motion.div

whileHover={{
y:-6,
scale:1.01
}}

transition={{
duration:0.45
}}
  className="
relative
self-center
w-full
max-w-[460px]
overflow-hidden

rounded-[28px]

border
border-white/10

bg-[rgba(12,12,12,0.78)]

backdrop-blur-[28px]

shadow-[0_35px_90px_rgba(0,0,0,0.55)]

before:absolute
before:inset-0
before:rounded-[36px]
before:border
before:border-[#D9B061]/20
before:pointer-events-none

after:absolute
after:top-0
after:left-0
after:right-0
after:h-[180px]
after:bg-[radial-gradient(circle_at_top,rgba(217,176,97,0.12),transparent_70%)]
after:pointer-events-none

p-6
lg:p-7
"
          >

            {/* TABS */}
<div
  className="
    bg-white/[0.03]
    rounded-xl
    p-1
    flex
    mb-8
  "
>
  <button
    className={`
      flex-1
      h-[48px]
      rounded-full
      text-[13px]
      font-semibold
      tracking-[0.15em]
      uppercase
      transition-all
      duration-300
      bg-[#D9B061]
      text-black
      shadow-[0_10px_35px_rgba(217,176,97,0.4)]
    `}
  >
    Sign In
  </button>
</div>

            {/* FORM AREA */}
            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25 }}
>
                  <h3
                    className="
                      text-white
                      text-3xl
                      font-semibold
                      mb-2
                    "
                  >
                    Welcome Back
                  </h3>

                  <p
                    className="
mt-4

mb-10

text-white/55

leading-8

text-[13px]
"
                  >
                    Continue your luxury investment
                    journey.
                  </p>

                 <form
  className="space-y-7"
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
>

                    <div className="relative mb-10">



</div>

<button
type="button"
className="
group

mb-10

flex

h-[54px]

w-full

items-center

justify-center

gap-4

rounded-xl

border

border-white/10

bg-white/[0.04]

transition-all

duration-300

hover:border-[#D9B061]/40

hover:bg-white/[0.06]
"
>

<img
src="/google-icon-logo.svg"
className="h-6 w-6"
/>

<span
className="
text-[13px]

font-medium

tracking-wide

text-white/90
"
>
Continue with Google
</span>

</button>

  <div className="flex items-center">

<div className="h-px flex-1 bg-white/10"/>

<div
className="
mx-6

text-[12px]

uppercase

tracking-[0.4em]

text-white/35
"
>
OR
</div>

<div className="h-px flex-1 bg-white/10"/>

</div>

                    {/* EMAIL */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Email Address
</label>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
text-[13px]
text-white
placeholder:text-white/25
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:bg-white/[0.05]
focus:ring-4
focus:ring-[#D9B061]/10
"
/>

</div>

                    {/* PASSWORD */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Password
</label>

<div className="relative">

<input
type={showPassword ? "text" : "password"}
placeholder="••••••••••••"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
pr-16
text-[13px]
text-white
placeholder:text-white/25
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:bg-white/[0.05]
focus:ring-4
focus:ring-[#D9B061]/10
"
/>

<button
type="button"
onClick={() =>
setShowPassword(!showPassword)
}
className="
absolute

right-6

top-1/2

-translate-y-1/2

text-white/40

transition

hover:text-[#D9B061]
"
>
{showPassword ? (
<EyeOff size={20} />
) : (
<Eye size={20} />
)}
</button>

</div>

</div>

                    <div
className="
flex

items-center

justify-between

mt-2

mb-8
"
>

<label
className="
flex

items-center

gap-3

text-[14px]

text-white/60
"
>

<input
type="checkbox"
className="accent-[#D9B061]"
/>

Remember me

</label>

<Link
href="/forgot-password"
className="
text-[#D9B061]

text-[14px]

hover:text-[#f2d08c]

transition
"
>
Forgot Password?
</Link>

</div>

                    {/* LOGIN BUTTON */}
<button
type="submit"
onClick={handleLogin}
disabled={loading}
className="
group
relative
overflow-hidden
w-full
h-[48px]
rounded-xl
bg-[#D9B061]
text-black
font-semibold
tracking-[0.12em]
uppercase
transition-all
duration-500
hover:scale-[1.02]
hover:shadow-[0_20px_50px_rgba(217,176,97,0.35)]
disabled:opacity-60
"
>

<div
className="
absolute

inset-0

translate-x-[-120%]

bg-gradient-to-r

from-transparent

via-white/30

to-transparent

transition-transform

duration-1000

group-hover:translate-x-[120%]
"
/>

<span className="relative z-10">
  {loading ? "Signing In..." : "Access Private Portal"}
</span>

</button>
<div
className="
mt-8

rounded-xl

border

border-[#D9B061]/20

bg-[#D9B061]/5

p-5
"
>

<div className="flex items-center gap-4">

<div
className="
flex

h-10

w-10

items-center

justify-center

rounded-full

bg-[#D9B061]/10

text-[#D9B061]
"
>
🔒
</div>

<div>

<p className="text-white text-sm font-medium">
256-bit SSL Encrypted
</p>

<p className="text-white/55 text-xs mt-1">
Your information is securely protected and encrypted.
</p>

</div>

</div>

</div>
                  </form>
                </motion.div>
            <div
className="
mt-12
mb-8

h-px

bg-gradient-to-r

from-transparent

via-[#D9B061]/30

to-transparent
"
/>

            {/* FOOTER */}
            <div
              className="
mt-12

border-t

border-white/10

pt-7

text-center
"
            >
              <p
                className="
                  text-white/50
                  text-sm
                "
              >
                Trusted by luxury homebuyers, NRIs, investors and family offices worldwide.
              </p>
            </div>

          </motion.div>
        </div>
      </motion.div>
    </main>
        </>
  );
}
