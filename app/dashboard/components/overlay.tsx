"use client"
import { usePathname } from 'next/navigation';
import SideBar from './sidebar';

const Overlay = () => {
  const linkname =usePathname();
  return (
    <div className={`hidden  fixed  z-40 top-0 left-0             flex-col gap-16 justify-end  fade ease-out duration-[0.5s]    overflow-hidden  h-full  backdrop-blur-sm  ${linkname ? 'xl:flex': 'lg:flex'}`}  id="myOverlay">
        <div className={`absolute   xs:w-full   ${(linkname ==='/' || linkname.startsWith('/books')) ? 'top-[60px]  md:top-[48px]  xs:top-[40px]': ' top-[60px]   sm:top-[50px]'}`}>
<SideBar/>
</div>
    </div>
  );
};

export default Overlay;
