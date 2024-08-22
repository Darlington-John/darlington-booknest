
"use client"

import { useRef } from "react";
import { useInView } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
const Cards = (props: any) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once:false });
    const float= {
            transform: isInView ? "none" : "translateY(200px)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s"
    }
    return (  
        <>
        {props.features && (
            <div className=" h-[230px]  w-[320px] bg-white shadow-xl  flex flex-col items-start justify-center gap-4 px-6 py-2  2xs:w-full xs:h-[180px]  xs:gap-3" ref={ref} style={float}>
<div className="bg-pink h-[70px] w-[70px]  rounded-full flex items-center justify-center  xs:h-[50px]  xs:w-[50px]">
<img src={props.img} alt="" className="w-8 xs:w-6"/>
</div>
<div className="">
<h1 className="text-2xl  font-[500]  uppercase xs:text-xl">{props.feature}</h1>
<h1 className="text-base text-grey font-semibold xs:text-sm">{props.content}</h1>
</div>
            </div>
        )}
        {props.bookNew && (
            <Link href={`/books/${props.url}`} className="flex flex-col gap-2 items-start    w-[200px]  h-[360px]  shadow-lg hover:shadow-2xl ease-in  transition duration 300   overflow-hidden  relative  shrink-0  md:shadow-none md:hover:shadow-none  md:border border-lightGrey"
            //    
               >
                {props.hot && (

<img src='/assets/images/tag.png' className="w-8 absolute -top-1 right-0" alt=""/>

                )}
<img src={props.book} className="object-cover  w-[200px]  h-[280px]  shrink-0  object-top" alt=""/>
<div className="flex flex-col gap-2 w-full ">
    <div>
    <h1 className="text-xl  font-bold  text-center leading-none  line-clamp-1">{props.name}</h1>
    <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>
    </div>


<h1 className="text-base  font-bold text-center  text-red ">{props.price}</h1>
</div>
            </Link>
        )}
        </>
    );
}
 
export default Cards;