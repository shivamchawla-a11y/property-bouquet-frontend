"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/home/Navbar";
import {
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

export default function LuxuryAuthPage() {
  const [activeTab, setActiveTab] =
    useState("login");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

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
  <img
    src="/auth-bg.png"
    alt=""
    className="
      absolute
      inset-0
      w-full
      h-full
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
                onClick={() =>
                  setActiveTab("login")
                }
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

${
activeTab==="login"

?

"bg-[#D9B061] text-black shadow-[0_10px_35px_rgba(217,176,97,0.4)]"

:

"text-white/70 hover:text-white"

}
`}
              >
                Sign In
              </button>

              <button
                onClick={() =>
                  setActiveTab("signup")
                }
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

${
activeTab==="signup"

?

"bg-[#D9B061] text-black shadow-[0_10px_35px_rgba(217,176,97,0.4)]"

:

"text-white/70 hover:text-white"

}
`}
              >
                Create Account
              </button>
            </div>

            {/* FORM AREA */}
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.div
                  key="login"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
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

                  <form className="space-y-7">

                    <div className="relative mb-10">

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
Access Private Portal
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
              ) : (
                <motion.div
                  key="signup"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <h3
className="
text-white
text-[40px]
font-light
tracking-[-0.03em]
leading-none
"
>
Become a Private Member
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
Join India's most exclusive luxury real estate network and unlock privileged investment opportunities.
</p>

                  <form className="space-y-7">

                    {/* NAME */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Full Name
</label>

<input
placeholder="Enter your full name"
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
text-white
placeholder:text-white/25
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:ring-4
focus:ring-[#D9B061]/10
"
/>

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
placeholder="Enter your email"
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
text-white
placeholder:text-white/25
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:ring-4
focus:ring-[#D9B061]/10
"
/>

</div>

                    {/* PHONE */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Mobile Number
</label>

<input
placeholder="+91 98765 43210"
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
text-white
placeholder:text-white/25
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:ring-4
focus:ring-[#D9B061]/10
"
/>

</div>

                    {/* INVESTOR TYPE */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Investor Type
</label>

<div className="relative">

<select
className="
w-full
h-[54px]
rounded-xl
border
border-white/10
bg-white/[0.03]
px-5
text-white
appearance-none
outline-none
transition-all
duration-300
focus:border-[#D9B061]
focus:ring-4
focus:ring-[#D9B061]/10
"
>

<option className="bg-black">
Individual Investor
</option>

<option className="bg-black">
NRI
</option>

<option className="bg-black">
Family Office
</option>

<option className="bg-black">
Channel Partner
</option>

<option className="bg-black">
Developer
</option>

</select>

<ChevronDown
size={18}
className="
absolute
right-6
top-1/2
-translate-y-1/2
text-white/40
pointer-events-none
"
/>

</div>

</div>

                    {/* PASSWORD */}
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



                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-3">

<label
className="
text-[12px]
uppercase
tracking-[0.28em]
text-white/45
"
>
Confirm Password
</label>

<div className="relative">

<input
type={showPassword ? "text" : "password"}
placeholder="••••••••••••"
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

                    {/* MEMBER BENEFITS */}
                    <div
className="
rounded-3xl
border
border-[#D9B061]/15
bg-[#D9B061]/5
p-6
mt-4
"
>

<h4
className="
text-[#D9B061]
text-lg
font-medium
mb-5
"
>
Membership Includes
</h4>

<div className="space-y-4">

{[
"Early Access to Luxury Launches",
"Exclusive Off-Market Properties",
"Private Investment Reports",
"Dedicated Relationship Manager",
].map((item)=>(
<div
key={item}
className="flex items-center gap-4"
>

<div
className="
w-8
h-8
rounded-full
bg-[#D9B061]/10
border
border-[#D9B061]/20
flex
items-center
justify-center
text-[#D9B061]
"
>
✓
</div>

<span
className="
text-white/80
text-[13px]
"
>
{item}
</span>

</div>
))}

</div>

</div>

                    {/* TERMS */}
                    <label
className="
flex
items-start
gap-4
text-white/60
text-sm
leading-7
"
>

<input
type="checkbox"
className="
mt-1
accent-[#D9B061]
"
/>

<span>
I agree to the Terms & Conditions,
Privacy Policy and consent to receive
exclusive property updates from Property Bouquet.
</span>

</label>

                    {/* SIGNUP BUTTON */}
                    <button
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
Join Private Network
</span>

</button>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

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
