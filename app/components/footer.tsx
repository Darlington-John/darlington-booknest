'use client'
import { usePathname } from "next/navigation";

const Footer = () => {
    const linkname = usePathname();
    return (  <section className={`bg-red  h-[300px]  w-full flex items-center justify-center  ${linkname === '/login' || linkname === '/signup'  ? ' hidden': 'flex'}`}>
<h1 className="text-4xl text-white font-bold"> Footer duh...</h1>
    </section>);
}
 
export default Footer;