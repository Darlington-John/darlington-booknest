"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";
import { toggleOverlay } from "../dashboard/components/header";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

  
    const {user, loading, isDropped, DroppedRef, toggleDroppedPopup, isPopupVisible, } = useUser();
    const handleScrollBeyond = () => {
      const scrollTop = window.scrollY;  // Get the vertical scroll position
      const scrollThreshold = 100;  // Set the height at which the logo should change
  
      if (scrollTop > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    useEffect(() => {
      window.addEventListener('scroll', handleScrollBeyond);
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScrollBeyond);
      };
    }, []);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);
  
    const linkname = usePathname();
    const {isOverlayOpen, setIsOverlayOpen} = useUser();
    const BarsIcon = '/assets/icons/Bars.svg'
    const XmarkIcon = '/assets/icons/Xmark.svg'
 const [icon, setIcon] = useState(BarsIcon);

    useEffect(() => {
      const overlayElement = document.getElementById('myOverlay');
      if (!overlayElement) {
        return;
      }
  overlayElement.style.width = '0%';
  setIsOverlayOpen(false);
  setIcon(BarsIcon);
    }, [linkname, setIsOverlayOpen]);
    const handleToggleOverlay = () => {
        toggleOverlay();
        setIsOverlayOpen(!isOverlayOpen);
        setIcon(isOverlayOpen ? BarsIcon : XmarkIcon);
      };

      const dynamicLink = linkname.startsWith('/books') ? '/dashboard/reading' : '/dashboard/trending'
    return (<nav className={`flex items-center justify-between     px-4   top-0 w-full text-white   md:py-1 xs:px-2 z-40   transition duration-300  xs:py-0  z-50  h-[60px] md:h-[50px] xs:h-[40px]  ${isScrolled &&'bg-red'}  ${linkname === '/' ? ' fixed  ' : ' sticky bg-red'}   ${linkname === '/login' || linkname === '/signup' || linkname.startsWith('/dashboard')  ? ' hidden': 'flex'}`}>
      {user && (  <button className="  h-10 w-10  bg-[#9a9a9a66]  rounded-full  lg:flex items-center justify-center hidden xs:h-8 xs:w-8 backdrop-blur-lg" onClick={handleToggleOverlay}>
<img src={icon} alt="" className="w-4 xs:w-[12px]" />
</button>)}
<Link href="/" className="flex  items-center text-3xl font-[800] md:text-xl  2xs:shrink-0 gap-1">
<img
      src="/assets/images/me.png"
  className="w-5  md:w-[15px]   " alt="library"
    />
    <h1 className="text-white  ">BookNest</h1>
</Link>

<div className="flex gap-2 items-center xs:gap-1">

  <div className="flex items-center gap-3 xs:gap-1">
    {loading ? null : (
     <> user? (<button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-auto text-white xs:w-auto  xs:text-sm  xs:h-8  font-[800] relative" 
  type="button" onMouseEnter={toggleDroppedPopup}  onMouseLeave={toggleDroppedPopup}>
  {user?.lastName} {user?.firstName}
{isDropped && (
  <div  className={`rounded-xl py-[2px]  px-[0px]   backdrop-blur-lg bg-black  absolute  popup z-30 flex right-0  overflow-hidden top-[48px] w-[160px]     ${isPopupVisible ? '' : 'popup-hidden'}`} ref={DroppedRef}>

    <div className="flex flex-col gap-1  px-2 py-1  text-white   rounded-lg leading-none  ease-out duration-300  font-semibold w-full">
<Link href="/profile" className="text-sm hover:bg-grey  hover:text-white  ease-out duration-300 py-2 rounded-md">
View profile
</Link>

<Link href={dynamicLink} className="text-sm hover:bg-grey  hover:text-white  ease-out duration-300 py-2 rounded-md">
Your library
</Link>
</div>
  </div>
)}
  </button>): (<>    <Link href='/login'>
  <button className="h-12 px-4 rounded-full   md:h-10 xs:px-3  w-[100px]  xs:w-[80px] xs:text-sm  xs:h-8     border border-pink bg-pink text-red" type="button">
Login
  </button>
  </Link>
  <Link href="/signup">
  <button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-[100px] text-white xs:w-[80px] xs:text-sm  xs:h-8  " type="button">
Sign up
  </button>
  </Link></>)</>)}


  </div>
</div>
    </nav>  );
}
 
export default Header;