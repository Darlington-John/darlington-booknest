"use client"
import { useParams } from "next/navigation";
import Rating from '@mui/material/Rating';
import { newBooks } from "~/app/data/new-arrivals";
import { useEffect, useRef, useState } from "react";
import { bestSellers } from "~/app/data/best-sellers";

const BookPage = () => {
    const params = useParams();
    const { url } = params;
const bookLibrary=[...newBooks, ...bestSellers]
    const book = bookLibrary.find(book => book?.url === url);
    const element1Ref = useRef(null);
    const [element2Height, setElement2Height] = useState('auto');

  useEffect(() => {
    const updateHeight = () => {
      const screenWidth = window.innerWidth;

      // Only match heights if screen width is greater than 640px
      if (screenWidth > 640) {
        if (element1Ref.current) {
          setElement2Height(`${element1Ref.current.offsetHeight}px`);
        }
      } else {
        // Reset height to auto below 640px
        setElement2Height('auto');
      }
    };

    // Update height on initial render
    updateHeight();

    // Update height on window resize
    window.addEventListener('resize', updateHeight);

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', updateHeight);
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
<button className="bg-black  text-center text-base font-semibold text-white w-[300px]  rounded-full h-[45px] lg:w-[150px]" onClick={() => window.open(book?.pdf, '_blank')}>
  Read
</button>
<button className="  text-center text-base font-semibold text-black w-[300px]  rounded-[150px] h-[45px] border border-black border-2 lg:w-full">
Add to wishlist
</button>
</div>
<div className="flex flex-col gap-1">
  
      <Rating name="size-large" defaultValue={0} size="large" />
      <h1 className="text-base text-center">Rate this book</h1>
      </div>
      </div>
      </div>
      </div>
      <div className="flex flex-col gap-4  divide-y divide-lightGrey  " ref={element1Ref}>
        <div className="flex flex-col gap-2 items-start py-4 lg:gap-0">
        <h1 className="font-medium  text-[36px] lg:text-2xl">{book?.name}</h1>
        <div className="flex items-center gap-1">
        <h1 className="font-  text-[20px] lg:text-base">{book?.author}</h1>
        <img src={'/assets/images/brand.png'} alt="" className="w-6"/>
        </div>
  <div className="flex items-center gap-2  xs:flex-wrap">
      <Rating name="size-large" defaultValue={0} size="large" readOnly />
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
    </section>  );
}
 
export default BookPage;