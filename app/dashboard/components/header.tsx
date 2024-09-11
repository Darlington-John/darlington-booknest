"use client"
import {  usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "~/app/context/AuthContext";
import Link from "next/link";

const Header = () => {
    const {isOverlayOpen, setIsOverlayOpen} = useUser();
    const linkname = usePathname();
    const BarsIcon = '/assets/icons/Bars.svg'
    const XmarkIcon = '/assets/icons/Xmark.svg'
 const [icon, setIcon] = useState(BarsIcon);
 const {user, loading} = useUser();

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
      const {isDropped, DroppedRef, toggleDroppedPopup, isPopupVisible, } = useUser();

    return (
    <div className="flex items-center justify-between  px-5  sticky top-0  z-40  bg-red  h-[60px]  shrink-0 sm:h-[50px]  sm:px-1   ">
        <button className={`  h-10 w-10  bg-[#9a9a9a66]  rounded-full   items-center justify-center hidden xs:h-8 xs:w-8 backdrop-blur-lg  ${linkname.startsWith('/dashboard/donated-books') ? 'xl:flex': 'lg:flex'}`} onClick={handleToggleOverlay}>
<img src={icon} alt="" className="w-4 xs:w-[12px]" />
</button>
    <form className="flex gap-2 items-center  " >
        <input className="w-[400px]  bg-[#ffffffee]  rounded-md  h-10   px-2  text-black md:w-[250px] md:h-10 2xs:w-[200px]  md:text-sm  border border-lightGrey  sm:h-9" placeholder="search here for books  "/>
        <button className="h-10 px-4 rounded-md bg-black  md:h-10 xs:px-3  sm:h-9" type="button">
    <img     src="/assets/icons/search.svg"
      className="w-4 md:w-4 sm:w-3" alt="library"/>
      </button>
      </form>
      {loading ?null : (
 
    <>   {user ?(  <button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-auto text-white xs:w-auto  xs:text-sm  xs:h-8  font-[800]  relative" type="button"  onMouseEnter={toggleDroppedPopup}  onMouseLeave={toggleDroppedPopup}>
      {isDropped && (
      <div  className={`rounded-xl py-[2px]  px-[0px]   backdrop-blur-lg bg-black  absolute  popup z-30 flex right-0  overflow-hidden top-[48px] w-[160px]     ${isPopupVisible ? '' : 'popup-hidden'}`} ref={DroppedRef}>
    
        <div className="flex flex-col gap-1  px-2 py-1  text-white   rounded-lg leading-none  ease-out duration-300  font-semibold w-full">
    <Link href="/profile" className="text-sm hover:bg-grey  hover:text-white  ease-out duration-300 py-2 rounded-md">
    View profile
    </Link>
    <Link href='/dashboard/trending' className="text-sm hover:bg-grey  hover:text-white  ease-out duration-300 py-2 rounded-md">
    Your library
    </Link>
    </div>
      </div>
    )}
        <span className="sm:hidden">{user?.lastName} {user?.firstName}</span>
        <span className="hidden sm:flex">{user?.lastName[0]}.{user?.firstName[0]}</span>
      </button>): (<div className="flex gap-2  shrink-0"><Link href='/login'>
      <button className="h-12 px-4 rounded-full   md:h-10 xs:px-3  w-[100px]  xs:w-[80px] xs:text-sm  xs:h-8     border border-pink bg-pink text-red" type="button">
    Login
      </button>
      </Link>
      <Link href="/signup">
      <button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-[100px] text-white xs:w-[80px] xs:text-sm  xs:h-8  " type="button">
    Sign up
      </button>
      </Link></div>)}    </>)}
      </div>  );
}
export  const toggleOverlay = () => {
    const overlayElement = document.getElementById('myOverlay');
    if (!overlayElement) {

      return;
    }
  
    if (overlayElement.style.width === '100%') {
      overlayElement.style.width = '0%';
  
    } else {
      overlayElement.style.width = '100%';
    }
      
  
    // Use useEffect to watch for changes in the pathname
  
  };
  
export default Header;