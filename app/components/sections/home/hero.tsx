"use client"
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
    return (<motion.section className="h-screen   overflow-hidden relative  flex items-center justify-center  xs:h-[60vh] ease"   initial={{ opacity: 0,  }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
<Image
      src="/assets/images/books.jpg"
fill
priority={true}
  className="w-full h-full object-cover absolute top-0 left-0" alt="library"
    />
    <div className="flex bg-[#1414148f]  absolute top-0 left-0 h-full w-full ">

    </div>
    <div className="relative  z-20  w-[60%] gap-3 flex flex-col items-center   md:w-full  px-4">
    <h1 className="text-[#ffffffde] text-8xl  font-bold  text-center  xl:text-6xl  md:text-5xl  xs:text-4xl">
    Your personal library, redefined
    </h1>
    <p className="text-[#ffffffde] text-center w-[600px]  font-semibold text-base lg:leading-snug  sm:w-full  xs:text-sm">
    BookNest is a digital bookshelf that brings the joy of reading to your fingertips. It offers a seamless and interactive experience for book lovers who want to discover, read, and organize books effortlessly
    </p>
    <button className="bg-[#D14031] w-[180px] h-[50px]  text-white  rounded-2xl xs:text-sm xs:w-[120px]   xs:h-[40px]  hover:bg-pink  hover:text-red  transition duration-300 hover:ring-2  ring-red">
Get started
    </button>
    </div>
    </motion.section>  );
}
 
export default Hero;