"use client"
import {  usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "~/app/context/AuthContext";
import Link from "next/link";
import { useBooks } from "~/app/context/BookContext";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Fuse from "fuse.js";

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
      interface SearchResults {
        allBookResults: Array<any>;  
        donatedBookResults: Array<any>;  
      }
      const { books} = useBooks();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({ allBookResults: [], donatedBookResults: [] });

  // Combine and deduplicate books

  const allBook = [...newBooks, ...bestSellers].reduce((acc: any, currentBook: any) => {
    if (!acc.find((book: any)=> book.url === currentBook.url)) {
      acc.push(currentBook);
    }
    return acc;
  }, []);

  // Deduplicate donated books
  const donatedBooks = [...books].reduce((acc, currentBook) => {
    if (!acc.find((book: any) => book.title === currentBook.title)) {
      acc.push(currentBook);
    }
    return acc;
  }, []);

  // Search handler
  const handleSearch = (query: any) => {
    if (!query) {
      setSearchResults({ allBookResults: [], donatedBookResults: [] } as any);
      return;
    }
    // Search allBook array
    
    const fuseAllBooks = new Fuse(allBook, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true,
    });

    // Search donatedBooks array
    const fuseDonatedBooks = new Fuse(donatedBooks, {
      keys: ['title'],
      threshold: 0.3,
      includeScore: true,
    });

    // Perform the search
    const results = fuseAllBooks.search(query);
    const donatedResults = fuseDonatedBooks.search(query);

    // Process results
    const exactMatch = results.length > 0 ? results[0].item : null;
    const fuzzyMatches = results.slice(1, 6).map((result) => result.item);
    const exactDonatedMatch = donatedResults.length > 0 ? donatedResults[0].item : null;
    const fuzzyDonatedMatches = donatedResults.slice(1, 6).map((result) => result.item);

    const finalResult = exactMatch ? [exactMatch, ...fuzzyMatches] : fuzzyMatches;
    const finalDonatedResult = exactDonatedMatch ? [exactDonatedMatch, ...fuzzyDonatedMatches] : fuzzyDonatedMatches;

    setSearchResults({ allBookResults: finalResult, donatedBookResults: finalDonatedResult } as any);
  };

  // Handle input change
  const handleChange = (event: any) => {
    const query = event.target.value;
    setSearchTerm(query);
    handleSearch(query);
  };

  // Filtered books based on search results
  const filteredBooks  = searchTerm ? searchResults.allBookResults : allBook;
  const filteredDonatedBooks = searchTerm ? searchResults.donatedBookResults : donatedBooks;
  const [searchPopup, setSearchPopup] = useState(false);

    const SearchPopupRef = useRef<HTMLDivElement>(null);
    const toggleSearchPopup = () => {

        setSearchPopup(true);

      
    };
    const handleClickOutside = (event:any) => {
      if (SearchPopupRef.current && !SearchPopupRef.current.contains(event.target)) {
setSearchPopup(false)
      }
      
    };
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    return (
    <div className="flex items-center justify-between  px-5  sticky top-0  z-40  bg-red  h-[60px]  shrink-0 sm:h-[50px]  sm:px-1   ">
        <button className={`  h-10 w-10  bg-[#9a9a9a66]  rounded-full   items-center justify-center hidden xs:h-8 xs:w-8 backdrop-blur-lg  ${linkname.startsWith('/dashboard/donated-books') ? 'xl:flex': 'lg:flex'}`} onClick={handleToggleOverlay}>
<img src={icon} alt="" className="w-4 xs:w-[12px]" />
</button>
    <form className="flex gap-2 items-center  relative" >
        <input className="w-[400px]  bg-[#ffffffee]  rounded-md  h-10   px-2  text-black md:w-[250px] md:h-10 2xs:w-[200px]  md:text-sm  border border-lightGrey  sm:h-9  " placeholder="search here for books   "   value={searchTerm}
        onChange={handleChange} onClick={toggleSearchPopup}/>
        {searchPopup && (<div className={`flex absolute  top-[45px]   left-0 bg-white    flex-col    rounded-md w-[500px]    sm:inset-x-1/2 sm:-translate-x-1/2  xs:w-[350px]  ${searchTerm !=="" &&'border border-lightGrey'}`}  ref={SearchPopupRef}>
        {searchTerm !== "" && filteredDonatedBooks.length === 0 && filteredBooks.length === 0 && (
  <p className="w-full py-2 px-1 text-sm">No results for {`'${searchTerm}'`}</p>
)}
      
        <div className="book-list">
        {searchTerm !== '' &&(<>       {filteredBooks.length > 0 ? (
          filteredBooks.slice(0, 3).map((book: any) => (
            <Link href={`/books/${book.url}`} key={book.url} className="flex  items-center justify-between p-1 border-b border-lightGrey  hover:bg-lightPink  transition duration-15o ease">
                <div className='flex gap-1'>
<img src={book.book} className='w-10 xs:w-8' alt="" />
<div className='flex flex-col gap-1'>
<h1 className='text-sm font-semibold  leading-none'>{book.name}</h1>
<h1 className='text-xs  leading-none'>by {book.author}</h1>
</div>
                </div>
              <img src={'/assets/icons/caret-down.svg'} className='w-3 rotate-[-90deg]' alt=""/>
            </Link>
          ))
        ) : (
null
        )}</>)}
 
      </div>

      {/* Display results for donated books */}
      {searchTerm !=="" && (
              <div className="book-list">

              {filteredDonatedBooks.length > 0 ? (
                filteredDonatedBooks.slice(0, 3).map((book: any) => (
      <Link href={`/dashboard/donated-books/${book._id}`} key={book.title} className="flex  items-center justify-between p-1 border-b border-lightGrey   hover:bg-lightPink  transition duration-15o ease">
                      <div className='flex gap-1'>
      <img src={book.coverImage} className='w-10 xs:w-8' alt="" />
      <div className='flex flex-col gap-1'>
      <h1 className='text-sm font-semibold  leading-none'>{book.title}</h1>
      <h1 className='text-xs  leading-none'>by {book.author}</h1>
      </div>
                      </div>
                    <img src={'/assets/icons/caret-down.svg'} className='w-3 rotate-[-90deg]' alt=""/>
                  </Link>
                ))
              ) : (
      null
              )}
            </div>
      )}
        </div>)}
        
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