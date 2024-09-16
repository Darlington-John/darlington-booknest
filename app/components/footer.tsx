'use client'
import { usePathname } from "next/navigation";

const Footer = () => {
    const linkname = usePathname();
    return (  <section className={`bg-red  h-[300px]  w-full flex items-center justify-center relative bg-fixed bg-cover  ${ linkname.startsWith('/books') ? '4xl:hidden':''}  ${linkname === '/login' || linkname === '/signup' || linkname.startsWith('/dashboard')  ? ' hidden': 'flex'}`} style={{ backgroundImage: `url(/assets/images/books.jpg)`}}>
      

    </section>);
}
 
export default Footer;