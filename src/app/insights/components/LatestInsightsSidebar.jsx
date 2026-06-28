"use client";

import Link from "next/link";
import Image from "next/image";

export default function LatestInsightsSidebar({

    articles,

    currentSlug

}){

    const latest = articles
        .filter(a=>a.slug!==currentSlug)
        .slice(0,4);

    return(

        <div className="bg-white border rounded-xl border-[#ece7dc] p-7">

<h3
style={{fontFamily:"Georgia"}}
className="text-[28px] text-[#163629]"
>
Latest Insights
</h3>

<div className="mt-6 space-y-5">

{latest.map((item) => (
<Link
key={item.slug}
href={`/property-insights/${item.slug}`}
className="flex gap-4 group"
>

<Image
src={item.featuredImage}
width={95}
height={70}
alt={item.title}
className="rounded-lg object-cover w-[95px] h-[70px]"
/>

<div>

<h4 className="font-medium leading-6 group-hover:text-[#c89d58] transition">

{item.title}

</h4>

<p className="text-sm mt-2 text-gray-500">

{item.readTime} min read

</p>

</div>

</Link>
))}

</div>

<button
className="
mt-8
w-full
border
rounded-lg
h-11
font-medium
hover:bg-[#143226]
hover:text-white
transition
"
>

VIEW ALL INSIGHTS →

</button>

</div>

    )

}