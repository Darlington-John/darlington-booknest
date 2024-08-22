"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";

const Header = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

  
    const user = useUser();
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
  
    const elementStyle = {
      transition: 'all 0.5s',
      opacity: isVisible ? 1 : 0,
      transform:  isVisible ? 'translateY(0)' : 'translateY(-50px)'
    };
    const linkname = usePathname();
    return (<nav className={`flex items-center justify-between     px-4   top-0 w-full text-white   md:py-1 xs:px-2 z-40   transition duration-300  xs:py-0  z-50  ${isScrolled &&'bg-red'}  ${linkname === '/' ? ' fixed  ' : ' sticky bg-red'}   ${linkname === '/login' || linkname === '/signup'  ? ' hidden': 'flex'}`}>
<Link href="/" className="flex  items-center text-3xl font-[800] md:text-xl  2xs:shrink-0">
<img
      src="/assets/icons/bird.svg"
  className="w-12  md:w-8  " alt="library"
    />
    <h1 className="text-white  xs:hidden">BookNest</h1>
</Link>

<div className="flex gap-2 items-center xs:gap-1">
<form className="flex gap-2 items-center hidden" style={elementStyle}>
    <input className="w-[400px]  bg-[#ffffffee]  rounded-md  h-10   px-2  text-black md:w-[300px] md:h-10 2xs:w-[200px]  md:text-sm" placeholder="search here for books  "/>
    <button className="h-10 px-4 rounded-md bg-black  md:h-10 xs:px-3" type="button">
<img     src="/assets/icons/search.svg"
  className="w-4 md:w-4" alt="library"/>
  </button>
  </form>
  <div className="flex items-center gap-3 xs:gap-1">
  {user?(  <Link href="/profile">
  <button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-auto text-white xs:w-auto  xs:text-sm  xs:h-8  font-[800]" type="button">
{user.firstName}  {user.lastName}
  </button>
  </Link>) : (<>    <Link href='/login'>
  <button className="h-12 px-4 rounded-full   md:h-10 xs:px-3  w-[100px]  xs:w-[80px] xs:text-sm  xs:h-8     border border-pink bg-pink text-red" type="button">
Login
  </button>
  </Link>
  <Link href="/signup">
  <button className="h-12 px-4 rounded-full bg-black  md:h-10 xs:px-3  w-[100px] text-white xs:w-[80px] xs:text-sm  xs:h-8  " type="button">
Sign up
  </button>
  </Link></>)}

  </div>
</div>
    </nav>  );
}
 
export default Header;