"use client"
import { useEffect, useRef, useState } from "react";

import { useUser } from "~/app/context/AuthContext";

import Rating from '@mui/material/Rating';
import Header from "./header";
import Link from "next/link";
import axios from "axios";
import { getToken } from "~/utils/get-token";
import { postWithAuth } from "~/utils/post-with-auth";

const BookPage = ({book}: any) => {
  const {user, loading} = useUser();
 
    const element1Ref = useRef<HTMLDivElement | null>(null);
    const [element2Height, setElement2Height] = useState('auto');
    const [error, setError] = useState(false);
    const [about, setAbout] = useState(false);
    const [isAboutVisible, setIsAboutVisible] = useState(false);
    const aboutRef = useRef<HTMLDivElement>(null);
    const [rating, setRating] = useState<number | null>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showButton, setShowButton] = useState(false);
    const [review, setReview] = useState('');

    const [success, setSuccess] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [starCounts, setStarCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const [totalRatings, setTotalRatings] = useState(0);
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
    const token = getToken(); // Make sure getToken() is correctly defined elsewhere
    if (!token || !book) return; // Ensure book exists before continuing
  
    // Define the book object here to avoid redeclaring
    const bookData = {
      title: book.title,
      pdf: book.pdf,
      author: book.author,
      coverImage: book.coverImage,
      pageCount: book.pageCount,
      donatedBy: book.donatedBy,
    };
  
    try {
      // Assuming postWithAuth is a correctly defined function for making POST requests with Authorization
      await postWithAuth('/api/add-donated-books-to-currently-reading', { book: bookData }, token);
      
      // Redirect to the book's PDF after successful API call
      window.location.href = book.pdf;
    } catch (error) {
      console.error('Error adding book to currently reading:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };
  
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
  useEffect(() => {
    if (book && book.ratings.length > 0) {
      
      const totalRating = book.ratings.reduce((sum: any, rating: any) => sum + rating.rating, 0);
      
      
      const avgRating = totalRating / book.ratings.length;

      
      setAverageRating(avgRating);
    }
  }, [book]);

  useEffect(() => {
    if (book && book.ratings.length > 0) {
      const counts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let total = 0;
  
      
      book.ratings.forEach((rating: any) => {
        const starRating = rating.rating as number; 
  
        if (starRating >= 1 && starRating <= 5) {
          counts[starRating] += 1; 
          total += 1;
        }
      });
  
      setStarCounts(counts as any);
      setTotalRatings(total);
    }
  }, [book]);
    const handleAddToWantToRead = async () => {
    const token = getToken(); 
    if (!token || !book) return;
    const bookData = {
      title: book.title,
      pdf: book.pdf, 
      author: book.author, 
      coverImage: book.coverImage, 
      pageCount: book.pageCount, 
      donatedBy: book.donatedBy,
    };
  
    try {

      await postWithAuth('/api/want-to-read-donated-books', { book: bookData }, token);
      setError(false);
      toggleAboutPopup();
    } catch (error) {
      console.error('Error adding book to wishlist', error);
      alert('An unexpected error occurred. Please try again later.');
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

  const handleRatingChange = (event: React.SyntheticEvent, newRating: number | null) => {
    setRating(newRating);
    setSuccessMessage(null);
    if (newRating !== null) {
      setShowButton(true); 
    }
  };
const bookId= book._id


  const submitRating = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token'); 

      const response = await axios.post(
        '/api/rate-book', 
        { bookId, rating }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Rating submitted successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const check = !(
    review
  );
  const handleSubmitReview = async () => {
    if (check) {
      alert('Please fill out the review field');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
 
      let firstName: string | undefined;
      let lastName: string | undefined;
      let profile: string | undefined;
      if (!loading  && user) {
        firstName = user.firstName;
        lastName = user.lastName;
        profile = user.profile;
      }
 await axios.post(
        '/api/book-review',
        { bookId, comment: review, firstName, lastName, profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setIsSubmittingReview(false);
      setTimeout(() =>  window.location.reload(), 1500);
      setReview('');  // Clear the review input
    } catch (err) {
      alert('Error submitting review');
      setSuccess(false);
    }
  };




  const paragraphs = book.description.split('\n');
  const bio = book.aboutAuthor.split('\n');
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

      <Rating name="book-rating" value={rating} onChange={handleRatingChange} size="large" />


     
      </div>
      <div className="hidden  sm:flex">
      <Rating name="size-large" value={rating} onChange={handleRatingChange} size="medium"  />
      </div>
 
      {showButton ? (
      <button onClick={submitRating} disabled={isSubmitting} className="bg-black text-white h-8 px-3 text-sm rounded-full hover:bg-red transition duration-300 ease xs:h-6 xs:text-xs xs:mt-2 xs:bg-red xs:rounded-md">
        {successMessage?<img src={'/assets/icons/check-white.svg'} className="w-4 mx-auto" alt=""/>: (<> {isSubmitting ?(<img src={'/assets/images/doubleWhite.gif'} className="w-5 mx-auto" alt=""/>): 'Rate'}</>)}
     
    </button>
      ):      <h1 className="text-sm text-center  sm:text-xs">Rate this book</h1>}
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
      <Rating name="size-large" value={averageRating} size="small" readOnly precision={0.5} />
      <h1 className="font-medium text-[26px]  lg:text-sm">{averageRating.toFixed(1)}</h1>
      <h1 className="text-grey  text-sm font-semibold   xs:text-xs">{book.ratings?.length === 0? 'No ratings' : <>{book.ratings.length=== 1? <>{book.ratings.length}  rating</>: <>{book.ratings?.length} ratings</>}</>}</h1>
      <span>.</span>
      <h1 className="text-grey  text-sm font-semibold  xs:text-xs">{book.reviews.length === 0? 'No reviews' : <>{book.reviews.length=== 1? <>{book.reviews.length}  review</>: <>{book.reviews.length} reviews</>}</>}</h1>
      </div>
        </div>
<div className="flex flex-col gap-5  py-4 lg:gap-3">
  <div className="flex flex-col gap-2  xs:gap-1">
  {paragraphs.map((paragraph: any, index: any) => (
      <p key={index + 1} className="text-base  font-semibold   2xl:w-full lg:text-sm  xs:text-[13px] xs:font-normal">{paragraph}</p>
    ))}

</div>

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
<h1 className="font-medium text-2xl  sm:text-xl">About the Author</h1>
<div className="flex gap-2  items-center">
  <img className="w-16  h-16  rounded-full lg:w-10 lg:h-10  object-cover" src={book.authorProfile ? book.authorProfile : '/assets/images/user.jpg' }  alt="" />
  <div className="flex flex-col gap-0 items-start">

<h1 className="text-base font-bold">{book?.
author}</h1>

  </div>
</div>
<div className="flex flex-col gap-2  xs:gap-1">
  {bio.map((paragraph: any, index: any) => (
      <p key={index + 1} className="text-base  font-semibold   2xl:w-full lg:text-sm  xs:text-[13px] xs:font-normal">{paragraph}</p>
    ))}

</div>

</div>
<div className="w-full flex flex-col gap-6  items-stretch py-4 sm:gap-3">
    <h1 className="font-medium text-2xl  sm:text-xl">Community ratings and reviews</h1>
<div className="flex flex-col gap-5 xs:gap-3">
{Object.entries(starCounts).slice().reverse().map(([star, count]) => {
  
  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

  return (
    <div key={star} className="flex items-center gap-3 xs:gap-2">
      <h1 className="shrink-none text-sm font-semibold text-nowrap xs:text-xs">{star} {star === '1'? 'star': 'stars'}</h1>

      {/* Outer container for the rating bar */}
      <div className="bg-[#F2F2F2] w-full rounded-full overflow-hidden">
        {/* Inner bar that shows the proportion of ratings */}
        <div 
          className="h-[15px] bg-[#FAAF00] transition duration-300 ease rounded-full xs:h-[10px]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {/* Show the count and percentage */}
      <h1 className="shrink-none text-xs font-semibold text-nowrap text-grey xs:text-[10px]">
        {count} ({percentage.toFixed(1)}%)
      </h1>
    </div>
  );
})}
      </div>
      </div>

      {book?.reviews.map((data: any, index: any)=>{
const date = new Date(data.date); // Convert ISO string to Date object
const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const pov = data.comment.split('\n');
        return(
        <div key={index + 1} className="w-full flex items-start  gap-5  py-8 md:py-4 md:gap-2 xs:flex-col flex-col">
          <div className="flex flex-col items-start  gap-1  shrink-0  xs:w-full">
            {data?.profile ? <img src={data.profile} alt="" className="h-12  md:h-8 xs:w-6 xs:h-6  md:w-8 xs:w-6 xs:h-6    w-12  rounded-full object-cover"/>: (<div  className="h-12  md:h-8 xs:w-6 xs:h-6  md:w-8 xs:w-6 xs:h-6   w-12 rounded-full object-cover flex items-center justify-center bg-red">
              <h1 className="text-white text-center font-medium text-lg md:text-sm xs:text-[10px]">{data?.lastName[0]}.{data?.firstName[0]}</h1>
              </div>)}
              <div className="flex-col  flex sm:leading-none w-full  xs:flex-row xs:items-center xs:justify-between">
          <h1 className="text-sm font-medium  leading-none md:text-xs">{data?.lastName} {data?.firstName} </h1>
          <h1 className="text-xs font-semibold  text-grey sm:hidden ">{formattedDate}</h1>
          <h1 className="text-xs font-semibold  text-grey sm:flex hidden sm:text-[10px] ">{formattedDate}</h1>
          </div>
          </div>
          <div className="flex flex-col gap-2  xs:gap-1 items-start w-full">
  {pov.map((paragraph: any, index: any) => (
    <h1 className="text-[15px] md:text-xs"  key={index + 1}>{paragraph}</h1>
    ))}

</div>

        </div>
       )
      })}
      <div className="flex flex-col  w-full">
            <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here"
        className="border rounded-lg p-2 w-full text-sm h-[120px]  xs:text-xs xs:h-[100px]"
      />
      <button
        onClick={handleSubmitReview}
        className="mt-4 px-4 h-[40px] bg-red  text-white rounded-lg w-[200px] hover:bg-black transition duration-300 ease text-sm xs:text-xs xs:h-[35px] xs:w-[130px]"
        disabled={isSubmittingReview}
      >
        {isSubmittingReview? <img src={'/assets/images/doubleWhite.gif'} alt="" className="w-5 mx-auto"/>:  (<>{success? <img src={'/assets/icons/check-White.svg'} alt="" className="w-4 mx-auto"/>: 'Submit Review'}</>)}
      </button>
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