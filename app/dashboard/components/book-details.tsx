"use client"
import { useEffect, useRef, useState } from "react";

import { useUser } from "~/app/context/AuthContext";

import Rating from '@mui/material/Rating';
import Header from "./header";
import Link from "next/link";

const BookPage = ({book}: any) => {
  const {user, loading} = useUser();
 
    const element1Ref = useRef<HTMLDivElement | null>(null);
    const [element2Height, setElement2Height] = useState('auto');

  useEffect(() => {
    const updateHeight = () => {
      const screenWidth = window.innerWidth;

      
      if (screenWidth > 640) {
        if (element1Ref.current) {
          setElement2Height(`${element1Ref.current.offsetHeight}px`);
        }
      } else {
        
        setElement2Height('auto');
      }
    };

    
    updateHeight();

    
    window.addEventListener('resize', updateHeight);

    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleAddToCurrentlyReading = async () => {
    
    const token = localStorage.getItem('token');
    if (token && book) {
      try {
        const res = await fetch('/api/add-donated-books-to-currently-reading', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            book: {
              title: book.title,
              pdf: book.pdf, 
              author: book.author, 
              coverImage: book.coverImage, 
              pageCount: book.pageCount, 
              donatedBy: book.donatedBy, 
            },
          }),
        });
        window.location.href = book.pdf;
        if (res.ok) {
          console.log('sucess');
        } else {
          const errorData = await res.json();
          alert(errorData.error || 'An error occurred');
        }
      } catch (error) {
        console.error('Error adding book to currently reading:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };
  const [error, setError] = useState(false);
  const [about, setAbout] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const toggleAboutPopup = () => {


    if (!about) {
      setAbout(true);
      setIsAboutVisible(true);
    } else {
      setIsAboutVisible(false);
      setTimeout(() => setAbout(false), 500);
  
    }
    
  };
  const handleClickOutside = (event:any) => {
    if (aboutRef.current && !aboutRef.current.contains(event.target)) {
      setIsAboutVisible(false);
      setTimeout(() => setAbout(false), 500);
      setTimeout(() =>  window.location.reload(), 400);
     
    }
    
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleAddToWantToRead = async () => {
    const token = localStorage.getItem('token');
    if (token && book) {
      try {
        const res = await fetch('/api/want-to-read-donated-books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            book: {
              title: book.title,
              pdf: book.pdf, 
              author: book.author, 
              coverImage: book.coverImage, 
              pageCount: book.pageCount, 
              donatedBy: book.donatedBy,},
          }),
        });
  
        if (res.ok) {
        setError(false);
        toggleAboutPopup();

        
        } else {
          const errorData = await res.json();
          alert(errorData.error || 'An error occurred');
        }
      } catch (error) {
        console.error('Error adding book to want to read:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };
  const genres = [
    { key: 'mystery', label: 'Mystery' },
    { key: 'inspirational', label: 'Inspirational' },
    { key: 'sciFi', label: 'Scientific Fiction/ Fantasy' },
    { key: 'romance', label: 'Romance' },
    { key: 'tradegy', label: 'Tradegy' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'horror', label: 'Horror' },
    { key: 'youngAdult', label: 'Young-adult' },
    { key: 'biography', label: 'Biography' },
  ];
    if (!book) {
      return <h1>Book not found</h1>;
    }

    return (
    <section className="flex items-start    gap-10  py-20  xl:px-10 lg:px-4 lg:gap-10  sm:flex-col sm:pt-20 sm:pb-10  relative  h-screen  overflow-auto  justify-center lg:gap-20 md:gap-10  sm:h-auto">
      <div className="fixed   top-0 w-[calc(100vw-275px)]  xl:w-full   z-[100] sm:left-0 ">
      <Header/>
      </div>
      <div className="  py-0 shrink-0 sm:w-full  sm:py-2 " style={{ height: element2Height}} >
        <div className="flex flex-col items-center  gap-6  sticky  top-10  sm:flex-row sm:items-end sm:justify-center  lg:gap-3">
  <img src={book?.coverImage} alt=""   className="rounded-md shadow-2xl w-[250px]  lg:w-[200px]  sm:w-[150px] "  />

<div className="flex flex-col  items-center gap-4">
<div className="flex flex-col gap-3">
  
  {loading? ( <button className="bg-black  text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] sm:h-[36px] sm:w-[130px] lg:w-[200px] sm:text-sm" >
  <img src='/assets/images/doubleWhite.gif' alt="" className="w-8 mx-auto"/>
  </button>): (<>
  {user?.currentlyReading.some((readingBook: any) => readingBook?.coverImage === book.coverImage) ? (
  <button className="bg-red text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] xs:h-[36px] xs:w-[130px] lg:w-[150px] opacity-[0.4] cursor-default xs:text-sm">
    Already reading
  </button>
) : (
  <button className="bg-black text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] sm:h-[36px] sm:w-[130px] lg:w-[200px] sm:text-sm  transition duration-300 ease-out  hover:bg-red" onClick={handleAddToCurrentlyReading}>
    Read
  </button>
)}</>)}
{loading? null:(<>{user?.currentlyReading.some((readingBook: any) => readingBook?.coverImage === book.coverImage) ? (
null
) : (
<button className={`  text-center text-base font-semibold text-black w-[300px]  rounded-[150px] h-[45px] sm:h-[36px] sm:w-[130px] border border-black border-2 lg:w-full sm:text-sm sm:text-sm duration-300 ease-out   ${user?.toRead.some((readingBook: any) => readingBook?.coverImage === book.coverImage) ? ' opacity-[0.4]    ' : ' hover:bg-lightPink hover:text-red hover:border-red'}`}disabled={user?.toRead.some((readingBook: any) => readingBook?.coverImage === book.coverImage)} onClick={handleAddToWantToRead} >
{user?.toRead.some((readingBook: any) => readingBook?.coverImage === book.coverImage)? 'In wishlist': 'Add to wishlist'}
</button>
)}</>)}


</div>
<div className="flex flex-col gap-1">
  <div className="sm:hidden">
      <Rating name="size-large" defaultValue={0} size="large"  />
      </div>
      <div className="hidden  sm:flex">
      <Rating name="size-large" defaultValue={0} size="medium"  />
      </div>
      <h1 className="text-sm text-center  sm:text-xs">Rate this book</h1>
      </div>
      </div>
      </div>
      </div>
      <div className="flex flex-col gap-4  divide-y divide-lightGrey  w-[60%] sm:w-full" ref={element1Ref}>
        <div className="flex flex-col gap-2 items-start py-4 lg:gap-0">
        <h1 className="font-medium  text-[36px] lg:text-2xl  sm:text-xl" >{book?.title}</h1>
        <div className="flex items-center gap-1">
        <h1 className="font-  text-[20px] lg:text-base">{book?.author}</h1>
        <img src={'/assets/images/brand.png'} alt="" className="w-6"/>
        </div>
  <div className="flex items-center gap-2  xs:flex-wrap">
      <Rating name="size-large" defaultValue={0} size="small" readOnly />
      <h1 className="font-medium text-[26px]  lg:text-sm">4.32</h1>
      <h1 className="text-grey  text-sm font-semibold   xs:text-xs">124, 567 ratings</h1>
      <span>.</span>
      <h1 className="text-grey  text-sm font-semibold  xs:text-xs">4,000 reviews</h1>
      </div>
        </div>
<div className="flex flex-col gap-5  py-4 lg:gap-3">

<p className="text-base  font-semibold   2xl:w-full lg:text-sm">
{book?.description}
</p>
<p className="text-base  font-semibold w-[80%] 2xl:w-full lg:text-sm">{book?.more}</p>
<div className=" flex gap-1 items-start flex-col xs:gap-0">
<h1 className="text-sm font-semibold  text-grey">Genres:</h1>
<div className="flex gap-x-3  flex-wrap gap-y-1">
{book?.genres?   (
<>
{genres.map(
  genre =>
    book.genres[genre.key] && (
      <h1 key={genre.key} className="font-semibold  xs:text-xs leading-none text-sm">
        {genre.label}
      </h1>
    )
)}
   </>
) : (
  <p className="text-sm font-semibold  ">No genres available</p>
)}
</div>
</div>
<p className="text-grey text-sm font-semibold ">pages: {book?.pageCount}</p>
</div>
<div className=" flex flex-col gap-3 items-start w-full   py-4">

<div className="flex gap-2  items-center">
  <img className="w-16  h-16  rounded-full lg:w-10 lg:h-10  object-cover" src={book.authorProfile ? book.authorProfile : '/assets/images/user.jpg' }  alt="" />
  <div className="flex flex-col gap-0 items-start">
<h1 className="text-base font-bold">{book?.
author}</h1>
<h1 className="text-grey text-sm font-semibold  font-semibold">2 followers</h1>
  </div>
</div>
<p className="text-base font-semibold lg:text-sm">
{book?.
aboutAuthor}
</p>
</div>
      </div>
      {about && (
<>
{error ? (       <div className={`fixed bottom-[0px]  h-full w-full  z-[1000] left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8    xs:px-4  `}>
    <div className={`w-[420px]  rounded-md pop  duration-300 ease-in-out bg-white flex flex-col   overflow-hidden  items-center justify-center  px-4 py-6 gap-6 xs:w-full  ${isAboutVisible ? '' : 'pop-hidden'}`} ref={aboutRef} >
      <div className="flex flex-col items-center gap-4">
      <div className="h-20  w-20 rounded-full bg-lightPink  flex items-center justify-center">
        <img src={'/assets/icons/triangle.svg'} alt='' className="w-10"/>
</div>
<div className="flex flex-col gap-1">
<p className="text-lg  font-medium  text-center text-red ">An error occured</p>
<p className="text-sm  font-semibold text-grey text-center">Oops! Something went wrong while trying to open the book. Please try again later, or contact support if the issue persists. We{`'`}re sorry for the inconvenience.</p>
</div>
</div>
<div className="flex flex-col gap-2 w-full">
<button className="w-full  text-white text-sm bg-red  rounded-md text-center h-[45px]" onClick={handleAddToCurrentlyReading}>
Try again
</button>
<button className="w-full  text-black text-sm  rounded-md text-center h-[25px] font-semibold  cursor-default">
  <button className="cursor-pointer" onClick={toggleAboutPopup}>
Close
</button>
</button>
</div>
      </div>
      </div>): (       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8   xs:px-4`}>
    <div className={`w-[420px]  rounded-md pop  duration-300 ease-in-out bg-white flex flex-col   overflow-hidden  items-center justify-center  px-4 py-6 gap-6 xs:w-full   ${isAboutVisible ? '' : 'pop-hidden'}`} ref={aboutRef} >
      <div className="flex flex-col items-center gap-4">
      <div className="h-20  w-20 rounded-full bg-lighterGrey  flex items-center justify-center">
        <img src={'/assets/icons/circle-check.svg'} alt='' className="w-10"/>
</div>
<div className="flex flex-col gap-1">
<p className="text-lg  font-medium  text-center text-black ">Book added to wishlist</p>
<p className="text-sm  font-semibold text-grey text-center">{book.name} has been added to your <Link href={'/dashboard/to-read'} className="underline hover:text-black">{`'want-to-read'`} books</Link></p>
</div>
</div>
<div className="flex flex-col gap-2 w-full">
<Link href={'/dashboard/to-read'} className="w-full  text-white text-sm bg-black  rounded-md text-center h-[45px] items-center justify-center flex" >
<span>
Go to library
</span>
</Link>
<button className="w-full  text-black text-sm  rounded-md text-center h-[25px] font-semibold  cursor-default">
  <button className="cursor-pointer" onClick={toggleAboutPopup}>
Close
</button>
</button>
</div>
      </div>
      </div>)}
</>

   
      )}
    </section>  );
}
 
export default BookPage;