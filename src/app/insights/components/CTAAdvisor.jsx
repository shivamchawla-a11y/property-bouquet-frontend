"use client";

import Link from "next/link";

export default function CTAAdvisor(){

    return(

        <div
className="
rounded-xl
bg-[#0d3d2e]
p-8
text-white
overflow-hidden
relative
"
>

<h3
className="text-[34px] leading-[42px]"
style={{fontFamily:"Georgia"}}
>

Get Expert Advice for
Your Next Property Move

</h3>

<p className="mt-5 leading-8 text-gray-300">

Our property experts are here to
help you make the right investment.

</p>

<button
className="
mt-8
bg-[#d3a45c]
text-black
font-semibold
rounded-lg
px-8
py-4
"
>

TALK TO AN ADVISOR

</button>

<div
className="
absolute
bottom-0
right-0
opacity-20
text-[160px]
leading-none
"
>

🏙️

</div>

</div>

    )

}