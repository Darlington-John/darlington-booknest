"use client"
import Link from "next/link";
import Header from "../components/header";
import { useUser } from "~/app/context/AuthContext";
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {  addShelf } from "~/app/store/slices/shelvesSlice";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Cards from "~/app/components/cards";
import NewArrivals from "~/app/components/sections/home/new-arrivals";
import BestSellers from "~/app/components/sections/home/best-sellers";
import { useBooks } from "~/app/context/BookContext";
const Reading = () => {
    const {user, loading} = useUser();
    const {books} = useBooks()
    const dispatch = useDispatch();



  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shelfPopup, setShelfPopup] = useState(false);
  const [isShelfPopupVisible, setIsShelfPopupVisible] = useState(false);
  const ShelfPopupRef = useRef<HTMLDivElement>(null);
  const [stackPopup, setStackPopup] = useState(false);
  const [isStackPopupVisible, setIsStackPopupVisible] = useState(false);
  const StackPopupRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSucessful, setIsSucessful]=useState(false);
  const toggleShelfPopup = () => {
    if (!shelfPopup) {
      setShelfPopup(true);
      setIsShelfPopupVisible(true);
    } else {
      setIsShelfPopupVisible(false);
      setTimeout(() => setShelfPopup(false), 500);
    }
    
  };
  const handleClickOutside = (event:any) => {
    if (ShelfPopupRef.current && !ShelfPopupRef.current.contains(event.target)) {
      setIsShelfPopupVisible(false);
      setTimeout(() => setShelfPopup(false), 500);
    }
    
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleStackPopup = () => {
    if (!stackPopup) {
      setStackPopup(true);
      setIsStackPopupVisible(true);
    } else {
      setIsStackPopupVisible(false);
      setTimeout(() => setStackPopup(false), 500);
    }
    
  };
  const handleClickOutsideStack = (event:any) => {
    if (StackPopupRef.current && !StackPopupRef.current.contains(event.target)) {
      setIsStackPopupVisible(false);
      setTimeout(() => setStackPopup(false), 500);
    }
    
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideStack);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideStack);
    };
  }, []);
  const [submitting, setSubmitting] = useState(false); 

const handleCreateShelf = async () => {
  const token = localStorage.getItem('token');
  if (name && description) {
    setSubmitting(true); 
    try {
      const response = await fetch('/api/add-shelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        dispatch(addShelf({ name, description }));
        window.location.reload(); 
      } else {
        console.error('Failed to add shelf:', await response.json());
      }
    } catch (error) {
      console.error('Error adding shelf:', error);
    } finally {
      setSubmitting(false); 
    }
  } else {
    console.error('Both name and description are required');
  }
};
  
  interface Book {
    url: string;
}
  const bookLibrary =[...newBooks, ...bestSellers];

  const handleDeleteShelf = async (shelfId: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/delete-shelf', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ shelfId }),
      });
  
      if (response.ok) {
        setIsDeleting(false);
        setIsSucessful(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        alert(`Error deleting shelf: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting shelf:', error);
      alert('An error occurred while deleting the shelf.');
    } 
  };
  const nested =(books?.length > 0 
    ? 'justify-start xs:justify-center items-start' 
    : 'justify-center items-center  ');
    return ( 
    <div className="flex  flex-col w-full h-full   overflow-auto ">
        <Header/>
        {loading? <div className="w-full h-full flex items-center justify-center">
<img src="/assets/images/double.gif" alt="" className="w-32 xs:w-20"/>
        </div>:( 
          <section className={`flex flex-col gap-12  py-10  xs:py-10 xs:gap-4 w-full px-4 h-full     xs:justify-center    xs:py-4  ${loading ? 'justify-center':'justify-start xs:h-auto'}  `}>
        <div className="flex  justify-between flex-wrap items-center w-full  xs:gap-2  4xl:pr-8 ">
        <div className="flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
           
        <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Your shelf</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">
    Your personalized collection of books
</p>
</div>
<button className="bg-red text-white  rounded-md py-3 w-[90px] text-sm font-semibold flex gap-2 items-center justify-center duration-300 hover:bg-black  sm:py-2   sm:w-[70px]  sm:text-xs" onClick={toggleShelfPopup}>

    <span>
New
</span>
<img src={'/assets/icons/plus.svg'} alt="" className="w-3"/>
</button>
        </div>

      {user?.shelves.length === 0 ? (
        <div className="flex flex-col items-center w-[600px]  bg-lightPink  mx-auto  py-6 gap-5 px-4 sm:w-full  xs:gap-3 xs:px-2 4xl:w-[700px] 4xl:py-8 4xl:gap-8">
        <div className="flex flex-col gap-2 items-center xs:gap-1">
    <img src={'/assets/images/empty-shelf.jpg'} className="w-40 xs:w-28" alt=""/>
    <h1 className="text-2xl font-medium text-center  text-red xs:text-xl 4xl:text-3xl">
        Your shelf is empty
    </h1>
    </div>
    <div className="w-full px-2  xs:px-0 ">
    <p className="text-sm font-semibold text-grey text-center  xs:text-xs 4xl:text-base">
    Your reading list is looking a bit bare right now. No worries—this is the perfect opportunity to fill it up! Explore my vast collection of books across different genres, discover stories that capture your imagination, and hit the  <span className="mx-1"><span className="text-base font-bold text-black xs:text-sm ">&#x22EE;</span></span> icon to choose what shelf to add the book to. Your next favorite book is just waiting to be found!
    </p>
    </div>

    <button className="rounded-md bg-red py-3 w-full text-center text-white font-semibold text-sm transition duration-300 hover:bg-black  ease-out xs:py-2 xs:text-xs 4xl:text-base " onClick={toggleShelfPopup}>Add a stack  to your shelf</button>
    </div>
      ) : (
        <div className="flex   flex-wrap items-start gap-5 ">
          { user?.shelves.map((shelf : any, index:any) => {
           const matchingBooks = shelf.books
           .map((userBook: any) => {
             return bookLibrary.find((book: Book) => book.url === userBook.url);
           })
           .filter((book: Book | undefined): book is Book => book !== undefined);
         
         
         const nonMatchingBooksWithCover = shelf.books
           .filter((userBook: any) => 
             !bookLibrary.some((book: Book) => book.url === userBook.url) && userBook.coverImage
           );
         
         
         const allBooks = [...matchingBooks, ...nonMatchingBooksWithCover];
            
            return(
          <div key={index + 1} className="bg-lightPink p-2   rounded-lg  w-[350px] h-[200px] flex-row flex gap-2  4xl:w-[450px 4xl:h-[22opx] ">
            <Link  href={`/dashboard/shelf/${shelf._id}`}  className={`h-full w-[120px] shrink-0 rounded-md overflow-hidden  grid    items-start justify-start  relative ${allBooks.length === 1 &&('grid-cols-1  grid-rows-1')}  ${allBooks.length === 2 &&('grid-cols-2  grid-rows-2')} ${allBooks.length === 3 &&('grid-cols-2  grid-rows-1')} ${allBooks.length  >= 4 &&('grid-cols-2  grid-rows-2')}`}>
              <img src={'/assets/images/shelfTrans.png'} alt="" className="absolute w-full h-full top-0 left-0 z-10 "/>
            {allBooks.length > 0 ? (
  allBooks.slice(0, 4).map((matchedBook: any, index: any) => (
      <img 
      src={matchedBook.book ? matchedBook.book : matchedBook.coverImage} 
        alt={matchedBook.name} 
        className="w-full   h-full   object-cover  relative z-20" 
       key={index + 1}/>

  ))
) : (
  <img src={'/assets/images/empty-shelf.jpg'} className="w-full h-full   " alt=""/>
)}
              {/* <img src={matchingBooks.book} className=" w-[50%] h-[50%]  object-cover"  alt=""/> */}
              
            </Link>
            <div className="h-full flex flex-col items-start justify-between">
              <div className="flex flex-col">
              <Link  href={`/dashboard/shelf/${shelf._id}`}  className="font-medium text-lg  text-red  leading-none line-clamp-2 xs:text-base xs:leading-none">{shelf.name}</Link>

              <div className="flex gap-2 items-center">
<Link  href={`/dashboard/shelf/${shelf._id}`}  className="text-xs  text-grey">
  {shelf.books.length === 0 ? 'no books': (<>{shelf.books.length} {shelf.books.length >1 ?'books': 'book'}</>)}
   </Link>
              </div>
              </div>
        <div className="flex flex-col gap-1 items-start gap-3">
            <Link  href={`/dashboard/shelf/${shelf._id}`}  className="text-sm  font-semibold text-grey  line-clamp-5  xs:text-xs leading-tight ">{shelf.description}</Link>
            <button className="bg-red  rounded-md text-white text-xs font-semibold  py-1 px-3" onClick={toggleStackPopup}>
Delete stack
            </button>
            </div>
            </div>
            {stackPopup && (   <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-[0.8]  px-8    xs:px-4  ">
        <div className={`pop w-[400px]  bg-white rounded-2xl  flex flex-col   gap-4 py-6 px-4 shrink-none xs:gap-2   ${isStackPopupVisible ? '' : 'pop-hidden'}`}  ref={StackPopupRef}>
          <div className="flex flex-col  w-full items-center justify-center  gap-2">
            <div className="bg-pink h-12  w-12  rounded-full flex  items-center  justify-center xs:h-10 xs:w-10">
<img src={'/assets/icons/trash.svg'} alt="" className="w-6 xs:w-5" />
            </div>
          <h1 className="text-center text-2xl text-red font-medium xs:text-xl">Delete stack</h1>
          </div>
          <p className="text-sm text-grey font-semibold text-center">
            This will delete the stack from your shelf<br/>
            Are you sure?
          </p>
          <div className="flex gap-5 items-center w-full justify-end  ">
<button className="text-sm font-semibold text-black" onClick={toggleStackPopup}>
Cancel
</button>
<button className="text-sm font-semibold text-white py-3 px-6 bg-red rounded-md hover bg-black transition duration-15o ease-out xs:py-2 xs:px-4" onClick={() => handleDeleteShelf(shelf._id)}>

{isDeleting ? (<img src={'/assets/images/doubleWhite.gif'} alt="" className="w-6  mx-auto"/>): (<>{isSucessful ? (<img src={'/assets/icons/check-White.svg'} alt="" className="w-4  mx-auto"/>) : 'Delete'}</>)}
</button>
          </div>
        </div>
      </div>)}
          </div>
          
        )})}
        </div>
      )}
    {books?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Books donated by the community</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">
Acess all books donated  by the community </p>
      </div>)}
     
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: nested
}`}  >
  
{books?.length > 0 ? (
      books.slice().reverse().map((book: any, index : any)=> (
        <Cards key={index + 1} donatedBook  book={book} {...book}/>
      ))
    ) : (
  
  <div className="flex flex-col gap-1 items-center">
      <p className="    text-2xl text-center  font-medium  text-red  md:text-lg">There are no books donated by the community<br/> <Link href='/dashboard/donate-book' className="underline  hover:text-red font-semibold text-grey text-lg  md:text-xs">Donate a book today!</Link></p>
      </div>
    )}
      </div>
      

            </section>)}
{ shelfPopup && (   <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8    xs:px-4  ">
        <div className={`pop w-[400px]  bg-white rounded-2xl  flex flex-col   gap-4 py-6 px-4 shrink-none 4xl:w-[500px]  4xl:py-8   ${isShelfPopupVisible ? '' : 'pop-hidden'}`}  ref={ShelfPopupRef}>
          <h1 className="text-center text-2xl text-red font-medium 4xl:text-3xl">Create a New Stack</h1>
<form className="flex flex-col gap-2">
  <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  4xl:text-base">Stack name</label>
          <input
            type="text"
            placeholder="My best sci-fi books"
            value={name}
            className="text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full border border-lightGrey 4xl:text-base "
            onChange={(e) => setName(e.target.value)}
          />
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm 4xl:text-base ">Description</label>
          <textarea

      placeholder="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    className="text-sm font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full border border-lightGrey 4xl:text-base "
          />
          </div>
      <div className="flex items-center justify-between w-full pt-4">
          <button type="button" onClick={handleCreateShelf} className="bg-red text-white py-3 w-[100px] hover:bg-red transition duration-300 text-sm font-semibold rounded-lg 4xl:text-base 4xl:w-[120px]"  disabled={submitting}>  {submitting ? 'Creating...' : 'Create Stack'}</button>
          <button type='button' className="text-sm  hover:text-red  fot-semibold 4xl:text-base" onClick={toggleShelfPopup}>Cancel</button>
          </div>
          </form>
        </div>
      </div>)}


    </div>);
}
 
export default Reading;


  