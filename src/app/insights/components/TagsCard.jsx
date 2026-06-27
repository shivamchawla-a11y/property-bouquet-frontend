"use client";

export default function TagsCard({ article }){

    const tags=[

        article.category,

        "Luxury",

        "Investment",

        "Gurgaon",

        "Property"

    ];

    return(

       <div className="bg-white border rounded-xl border-[#ece7dc] p-7">

<h3
style={{fontFamily:"Georgia"}}
className="text-[28px] text-[#163629]"
>
Popular Tags
</h3>

<div className="flex flex-wrap gap-3 mt-6">

{article.tags?.map(tag=>(

<span
key={tag}
className="
px-4
py-2
rounded-md
bg-[#f3f3f3]
text-sm
"
>

{tag}

</span>

))}

</div>

</div>

    )

}