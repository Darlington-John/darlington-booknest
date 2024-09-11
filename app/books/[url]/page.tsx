"use client"
import { useParams } from "next/navigation";
import Rating from '@mui/material/Rating';
import { newBooks } from "~/app/data/new-arrivals";
import { useEffect, useRef, useState } from "react";
import { bestSellers } from "~/app/data/best-sellers";
import { useUser } from "~/app/context/AuthContext";
import Link from "next/link";



const BookPage = () => {
  const {user, loading} = useUser();
  const [error, setError] = useState(false);
    const params = useParams();
    const { url } = params;
const bookLibrary=[...newBooks, ...bestSellers]
    const book = bookLibrary.find(book => book?.url === url);
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
        const res = await fetch('/api/add-to-currently-reading', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            book: {
              name: book.name,
              url: book.url,
              pdf: book.pdf, 
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
  const handleAddToWantToRead = async () => {
    const token = localStorage.getItem('token');
    if (token && book) {
      try {
        const res = await fetch('/api/want-to-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            book: {
              url: book.url
              
            },
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

  const [about, setAbout] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const toggleAboutPopup = () => {

    setTimeout(() =>  window.location.reload(), 1500);
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
    if (!book) {
      return <h1>Book not found</h1>;
    }

    return (<section className="flex items-start px-40   gap-20  py-10  xl:px-10 lg:px-4 lg:gap-10  sm:flex-col sm:py-4">
      <div className="  py-10 shrink-0 sm:w-full  sm:py-2 " style={{ height: element2Height}} >
        <div className="flex flex-col items-center  gap-6  sticky  top-28 sm:flex-row sm:items-end sm:justify-center">
  <img src={book?.book} alt=""   className="rounded-md shadow-2xl w-[250px]  lg:w-[200px]  xs:w-[150px]"  />

<div className="flex flex-col  items-center gap-4">
<div className="flex flex-col gap-3">
  {loading? ( <button className="bg-black  text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] xs:h-[36px] xs:w-[130px] lg:w-[150px] xs:text-sm" >
  <img src='/assets/images/doubleWhite.gif' alt="" className="w-8 mx-auto"/>
  </button>): (<>
  {user?.currentlyReading.some((readingBook: any) => readingBook?.url === book.url) ? (
  <button className="bg-red text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] xs:h-[36px] xs:w-[130px] lg:w-[150px] opacity-[0.4] cursor-default xs:text-sm">
    Already reading
  </button>
) : (
  <button className="bg-black text-center text-base font-semibold text-white w-[300px] rounded-full h-[45px] xs:h-[36px] xs:w-[130px] lg:w-[150px] xs:text-sm  transition duration-300 ease-out  hover:bg-red" onClick={handleAddToCurrentlyReading}>
    Read
  </button>
)}</>)}
{loading? null:(<>{user?.currentlyReading.some((readingBook: any) => readingBook?.url === book.url) ? (
null
) : (
<button className={`  text-center text-base font-semibold text-black w-[300px]  rounded-[150px] h-[45px] xs:h-[36px] xs:w-[130px] border border-black border-2 lg:w-full xs:text-sm xs:text-sm duration-300 ease-out   ${user?.toRead.some((readingBook: any) => readingBook?.url === book.url) ? ' opacity-[0.4]    ' : ' hover:bg-lightPink hover:text-red hover:border-red'}`}disabled={user?.toRead.some((readingBook: any) => readingBook?.url === book.url)}  onClick={handleAddToWantToRead} >
{user?.toRead.some((readingBook: any) => readingBook?.url === book.url)? 'In wishlist': 'Add to wishlist'}
</button>
)}</>)}


</div>
<div className="flex flex-col gap-1">
  
      <Rating name="size-large" defaultValue={0} size="large" />
      <h1 className="text-base text-center  xs:text-sm">Rate this book</h1>
      </div>
      </div>
      </div>
      </div>
      <div className="flex flex-col gap-4  divide-y divide-lightGrey  " ref={element1Ref}>
        <div className="flex flex-col gap-2 items-start py-4 lg:gap-0">
        <h1 className="font-medium  text-[36px] lg:text-2xl" >{book?.name}</h1>
        <div className="flex items-center gap-1">
        <h1 className="font-  text-[20px] lg:text-base">{book?.author}</h1>
        <img src={'/assets/images/brand.png'} alt="" className="w-6"/>
        </div>
  <div className="flex items-center gap-2  xs:flex-wrap">
      <Rating name="size-large" defaultValue={0} size="small" readOnly />
      <h1 className="font-medium text-[26px]  lg:text-base">4.32</h1>
      <h1 className="text-grey  text-sm font-semibold  ">124, 567 ratings</h1>
      <span>.</span>
      <h1 className="text-grey  text-sm font-semibold ">4,000 reviews</h1>
      </div>
        </div>
<div className="flex flex-col gap-5  py-4 lg:gap-3">

<p className="text-base  font-semibold w-[80%]  2xl:w-full lg:text-sm">
{book?.about}
</p>
<p className="text-base  font-semibold w-[80%] 2xl:w-full lg:text-sm">{book?.more}</p>
<div className=" flex gap-2 items-center xs:flex-col">
<h1 className="text-sm font-semibold  text-grey">Genres</h1>
<div className="flex gap-4 xs:flex-wrap">
{book?.genres?.length > 0 ? (
  book.genres.map((genre) => (
    <h1 key={genre.type} className="font-semibold lg:text-sm">{genre.type}</h1>
  ))
) : (
  <p className="text-sm font-semibold  ">No genres available</p>
)}
</div>
</div>
<p className="text-grey text-sm font-semibold ">pages: {book?.pages}</p>
</div>
<div className=" flex flex-col gap-3 items-start w-full   py-4">

<div className="flex gap-2  items-center">
  <img className="w-16  h-16  rounded-full lg:w-10 lg:h-10" src={book.authorProfile ? book.authorProfile : '/assets/images/user.jpg' }  alt="" />
  <div className="flex flex-col gap-0 items-start">
<h1 className="text-base font-bold">{book?.author}</h1>
<h1 className="text-grey text-sm font-semibold  font-semibold">2 followers</h1>
  </div>
</div>
<p className="text-base font-semibold lg:text-sm">
{book?.authorBio}
</p>
</div>
      </div>
      {about && (
<>
{error ? (       <div className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8    xs:px-4  `}>
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