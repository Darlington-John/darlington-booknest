"use client"
import { motion } from "framer-motion";
import Image from "next/image";

const Loader = () => {
    return (  <motion.div className="fixed max-h-[100vh]  w-full   bg-red    bottom-0  z-[1000]  overflow-hidden h-full  "       initial={{ top: '0%' }}
        animate={{ top: '-100%',  }}
        transition={{ ease: "easeInOut", duration: 0.3}}

 
        >
      
    <Image src='/assets/images/library.jpg'  fill alt="" />
    </motion.div>);
}
 
export default Loader;