
"use client"

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../context/AuthContext";
import AddPopup from "../dashboard/components/add-to-shelf-popup";
import { getToken } from "~/utils/get-token";
import { postWithAuth } from "~/utils/post-with-auth";

const Cards = (props: any) => {
  const ref = useRef(null);
  const router = useRouter();
  const { user, loading } = useUser();
  const linkname = usePathname();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDonatedComplete, setIsDonatedComplete] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isDonatedRemoved, setIsDonatedRemoved] = useState(false);
  const isInView = useInView(ref, { once: false });
  const [addPopup, setAddPopup] = useState(false);
  const [isAddPopupVisible, setIsAddPopupVisible] = useState(false);
  const AddPopupRef = useRef<HTMLDivElement>(null);

  const [loadingShelfId, setLoadingShelfId] = useState(null);
  const [successfulShelfId, setSuccessfulShelfId] = useState(null);


  const handleClick = () => {
    if (linkname === '/dashboard/reading') {

      if (props?.pdf) {
        window.location.href = props.pdf;
      }
    } else {

      router.push(`/books/${props.url}`);
    }
  }

  const handleComplete = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await postWithAuth('/api/add-to-already-read', { url: props.url }, token);
      setIsCompleted(true);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error('Error adding book to already read:', error);
    }
  };
  const handleCompleteDonated = async () => {
    const token = getToken();
    if (!token) return;
  
    const bookData = {
      name: props.name,
      url: props.url,
      pdf: props.pdf,
      title: props.title,
      author: props.author,
      donatedPdf: props.pdf,
      coverImage: props.coverImage,
      pageCount: props.pageCount,
      donatedBy: props.donatedBy,
    };
  
    try {
      await postWithAuth('/api/add-to-already-read-donated-books', bookData, token);
      setIsDonatedComplete(true);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error('Error adding donated book to already read:', error);
    }
  };

  const handleAddToCurrentlyReading = async () => {
    const token = getToken();
    if (!token || !props) return;
  
    const book = { name: props.name, url: props.url, pdf: props.pdf };
  
    try {
  await postWithAuth('/api/add-to-currently-reading', { book }, token);
      window.location.href = props.pdf;
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.');
    }
  };
  const handleAddToDonatedCurrentlyReading = async () => {
    const token = getToken();
    if (!token || !props) return;
  
    const book = {
      title: props.title,
      pdf: props.pdf,
      author: props.author,
      coverImage: props.coverImage,
      pageCount: props.pageCount,
      donatedBy: props.donatedBy,
    };
  
    try {
       await postWithAuth('/api/add-donated-books-to-currently-reading', { book }, token);
      window.location.href = props.pdf;
    } catch (error) {
      alert('An unexpected error occurred. Please try again later.');
    }
  };
  
  const handleRemoveFromWantToRead = async (bookUrl: string) => {
    const token = getToken();
    if (!token || !bookUrl) return;
  
    setIsRemoved(true);
  
    try {
      await postWithAuth('/api/remove-from-want-to-read', { url: bookUrl }, token);
      window.location.reload();
      setIsRemoved(false);
    } catch (error) {
      alert('An error occurred while removing the book.');
    }
  };

  const handleRemoveFromWantToReadDonated = async (bookImage: string) => {
    const token = getToken();
    if (!token || !bookImage) return;
  
    setIsDonatedRemoved(true);
  
    try {
      await postWithAuth('/api/remove-from-want-to-read-donated', { coverImage: bookImage }, token);
      window.location.reload();
      setIsDonatedRemoved(false);
    } catch (error) {
      alert('An error occurred while removing the donated book.');
    }
  };

  const toggleAddPopup = () => {
    if (!addPopup) {
      setAddPopup(true);
      setIsAddPopupVisible(true);
    } else {
      setIsAddPopupVisible(false);
      setTimeout(() => setAddPopup(false), 500);
    }

  };
  const handleClickOutside = (event: any) => {
    if (AddPopupRef.current && !AddPopupRef.current.contains(event.target)) {
      setIsAddPopupVisible(false);
      setTimeout(() => setAddPopup(false), 500);
    }

  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleShelfSelection = async (shelf: any) => {
    setLoadingShelfId(shelf._id);

    try {
      const response = await fetch('/api/add-to-shelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shelfId: shelf._id,
          book: {
            url: props.url,
            pdf: props.pdf,
            author: props.author,

          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Book added to shelf:', data.message);
        setSuccessfulShelfId(shelf._id);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('Failed to add book to shelf:', data.error);
      }
    } catch (error) {
      console.error('Error adding book to shelf:', error);
    }
    finally {
      setLoadingShelfId(null);
    }
  };
  const handleDonatedShelfSelection = async (shelf: any) => {
    setLoadingShelfId(shelf._id);

    try {
      const response = await fetch('/api/add-donated-to-shelf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shelfId: shelf._id,
          book: {
            title: props.title,
            pdf: props.pdf,
            author: props.author,
            coverImage: props.coverImage,
            pageCount: props.pageCount,
            donatedBy: props.donatedBy,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Book added to shelf:', data.message);
        setSuccessfulShelfId(shelf._id);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error('Failed to add book to shelf:', data.error);
      }
    } catch (error) {
      console.error('Error adding book to shelf:', error);
    }
    finally {
      setLoadingShelfId(null);
    }
  };
  const float = {
    transform: isInView ? "none" : "translateY(200px)",
    opacity: isInView ? 1 : 0,
    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s"
  }
  const fade = {
    opacity: isInView ? 1 : 0,
    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0s"
  }
  return (
    <>
      {props.features && (
        <div className=" h-[230px]  w-[320px] bg-white shadow-xl  flex flex-col items-start justify-center gap-4 px-6 py-2  2xs:w-full xs:h-[180px]  xs:gap-3" ref={ref} style={float}>
          <div className="bg-pink h-[70px] w-[70px]  rounded-full flex items-center justify-center  xs:h-[50px]  xs:w-[50px]">
            <img src={props.img} alt="" className="w-8 xs:w-6" />
          </div>
          <div className="">
            <h1 className="text-2xl  font-[500]  uppercase xs:text-xl">{props.feature}</h1>
            <h1 className="text-base text-grey font-semibold xs:text-sm">{props.content}</h1>
          </div>
        </div>
      )}

      {props.bookmain && (
        <button ref={ref} style={fade} onClick={handleClick} className={`flex flex-col gap-2 items-start    w-[200px]    shadow-lg hover:shadow-2xl ease-in  transition duration 300   overflow-hidden  relative  shrink-0  md:shadow-none md:hover:shadow-none  md:border border-lightGrey h-[335px] rounded-sm  4xl:w-[280px] 4xl:h-[460px]`}



        >
          {props.hot && (

            <img src='/assets/images/tag.png' className="w-8 absolute -top-1 right-0" alt="" />

          )}
          <img src={props.book} className="object-cover  w-[200px]  h-[280px]  shrink-0  object-top 4xl:w-[280px] 4xl:h-[400px]" alt="" />
          <div className="flex flex-col gap-2 w-full ">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none  line-clamp-1  lg:text-lg lg:leading-none">{props.name}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>
            </div>



          </div>
        </button>
      )}
      {props.readingBook && (
        <div className={`flex  gap-2 items-start    w-[380px] bg-lightPink      ease-out  transition duration 300   overflow-hidden  relative  shrink-0    md:border border-lightGrey  cursor-default  h-[280px] rounded-md hover:shadow-xl pr-1  2xs:w-full readingBook`}
          ref={ref} style={fade}>

          {!loading && (
            <button className="bg-[#00000091] w-6  h-6  rounded-md items-center  justify-center absolute top-1 left-1 z-20 flex readingBook-button hover:ring-offset-2  hover:ring-[0.1px]  ring-white   transition  duration-300" onClick={toggleAddPopup}>
              <img src='/assets/icons/ellipsis.svg' className="w-[4px]  " alt="" />
            </button>
          )}
          
          <AddPopup
        addPopup={addPopup}
        isAddPopupVisible={isAddPopupVisible}
        AddPopupRef={AddPopupRef}
        user={user}
        props={props}
        handleDonatedShelfSelection={handleDonatedShelfSelection}
        handleShelfSelection={handleShelfSelection}
        loadingShelfId={loadingShelfId}
        successfulShelfId={successfulShelfId}
      />
          <button onClick={() => window.location.href = props.pdf} className="  w-[190px]  h-[280px]  shrink-0">
            <img src={props.book ? props.book : props.coverImage} className="object-cover    shrink-0  object-top w-full h-full " alt="" />
          </button>
          <div className="flex flex-col gap-2 w-full  py-3 items-center justify-between h-full">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none    lg:text-lg lg:leading-none">{props.name ? props.name : props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>

              <h1 className="text-xs text-grey text-center font-semibold">{props.pages ? props.pages : props.pageCount} pages</h1>

            </div>

            <div className="flex items-center gap-2 flex-col w-full">
              <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={() => window.location.href = props.pdf}>
                Read
              </button>
              {props.coverImage ? <button className="h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8 " type="button" onClick={handleCompleteDonated}
                disabled={isDonatedComplete}>
                {isDonatedComplete ? 'Completed' : 'Mark as Completed'}
              </button> : <button className="h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8 " type="button" onClick={handleComplete}
                disabled={isCompleted}>
                {isCompleted ? 'Completed' : 'Mark as Completed'}
              </button>}

            </div>


          </div>
        </div>
      )}
      {props.alreadyReadBook && (
        <div className={`flex  gap-2 items-start    w-[380px] bg-lightPink      ease-out  transition duration 300   overflow-hidden  relative  shrink-0    md:border border-lightGrey  cursor-default  h-[280px] rounded-md hover:shadow-xl pr-1  2xs:w-full readingBook `}
          ref={ref} style={fade} >
          {!loading && (
            <button className="bg-[#00000091] w-6  h-6  rounded-md items-center  justify-center absolute top-1 left-1 z-20 flex readingBook-button hover:ring-offset-2  hover:ring-[0.1px]  ring-white   transition  duration-300" onClick={toggleAddPopup}>
              <img src='/assets/icons/ellipsis.svg' className="w-[4px]  " alt="" />
            </button>
          )}
           <AddPopup
        addPopup={addPopup}
        isAddPopupVisible={isAddPopupVisible}
        AddPopupRef={AddPopupRef}
        user={user}
        props={props}
        handleDonatedShelfSelection={handleDonatedShelfSelection}
        handleShelfSelection={handleShelfSelection}
        loadingShelfId={loadingShelfId}
        successfulShelfId={successfulShelfId}
      />
          <Link href={props.coverImage ? `${props.pdf}` : `/books/${props.url}`} className="  w-[190px]  h-[280px]  shrink-0">
            <img src={props.book ? props.book : props.coverImage} className="object-cover    shrink-0  object-top w-full h-full " alt="" />
          </Link>
          <div className="flex flex-col gap-2 w-full  py-3 items-center justify-between h-full">
            
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none    lg:text-lg lg:leading-none">{props.name ? props.name : props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>

              <h1 className="text-xs text-grey text-center font-semibold">{props.pages ? props.pages : props.pageCount} pages</h1>

            </div>

            <div className="flex items-center gap-2 w-full flex-col">
              {props.coverImage ? <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={handleAddToDonatedCurrentlyReading}>
                Read Again
              </button> : <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={handleAddToCurrentlyReading}>
                Read Again
              </button>}


              <button className="h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8" type="button" onClick={toggleAddPopup} >
                Save
              </button>
            </div>


          </div>
        </div>
      )}
      {props.wantToReadBook && (
        <div className={`flex  gap-2 items-start    w-[380px] bg-lightPink      ease-out  transition duration 300   overflow-hidden  relative  shrink-0    md:border border-lightGrey  cursor-default  h-[280px] rounded-md hover:shadow-xl pr-2 readingBook `}
          ref={ref} style={fade} >
          {!loading && (
            <button className="bg-[#00000091] w-6  h-6  rounded-md items-center  justify-center absolute top-1 left-1 z-20 flex readingBook-button hover:ring-offset-2  hover:ring-[0.1px]  ring-white   transition  duration-300" onClick={toggleAddPopup}>
              <img src='/assets/icons/ellipsis.svg' className="w-[4px]  " alt="" />
            </button>
          )}
  
  <AddPopup
        addPopup={addPopup}
        isAddPopupVisible={isAddPopupVisible}
        AddPopupRef={AddPopupRef}
        user={user}
        props={props}
        handleDonatedShelfSelection={handleDonatedShelfSelection}
        handleShelfSelection={handleShelfSelection}
        loadingShelfId={loadingShelfId}
        successfulShelfId={successfulShelfId}
      />
          <Link href={props.coverImage ? `${props.pdf}` : `/books/${props.url}`} className="  w-[190px]  h-[280px]  shrink-0">
            <img src={props.book ? props.book : props.coverImage} className="object-cover    shrink-0  object-top w-full h-full " alt="" />
          </Link>
          <div className="flex flex-col gap-2 w-full  py-3 items-center justify-between h-full">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none    lg:text-lg lg:leading-none">{props.name ? props.name : props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>

              <h1 className="text-xs text-grey text-center font-semibold">{props.pages ? props.pages : props.pageCount} pages</h1>

            </div>

            <div className="flex items-center gap-2 w-full flex-col">

              <button className="   h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8" type="button" onClick={props.coverImage ? handleAddToDonatedCurrentlyReading : handleAddToCurrentlyReading}>
                Read Now
              </button>
              {props.coverImage ? <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={() => handleRemoveFromWantToReadDonated(props.coverImage)} >
                {isDonatedRemoved ? (<img src={'/assets/images/doubleWhite.gif'} alt="" className="w-6  mx-auto" />) : 'Remove'}

              </button> : <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={() => handleRemoveFromWantToRead(props.url)} >
                {isRemoved ? (<img src={'/assets/images/doubleWhite.gif'} alt="" className="w-6  mx-auto" />) : 'Remove'}

              </button>}

            </div>


          </div>
        </div>
      )}
      {props.shelvedBook && (
        <div className={`flex  gap-2 items-start    w-[380px] bg-lightPink      ease-out  transition duration 300   overflow-hidden  relative  shrink-0    md:border border-lightGrey  cursor-default  h-[280px] rounded-md hover:shadow-xl pr-1  2xs:w-full readingBook`}
          ref={ref} style={fade}>

          {!loading && (
            <button className="bg-[#00000091] w-6  h-6  rounded-md items-center  justify-center absolute top-1 left-1 z-20 flex readingBook-button hover:ring-offset-2  hover:ring-[0.1px]  ring-white   transition  duration-300" onClick={toggleAddPopup}>
              <img src='/assets/icons/ellipsis.svg' className="w-[4px]  " alt="" />
            </button>
          )}
 <AddPopup
        addPopup={addPopup}
        isAddPopupVisible={isAddPopupVisible}
        AddPopupRef={AddPopupRef}
        user={user}
        props={props}
        handleDonatedShelfSelection={handleDonatedShelfSelection}
        handleShelfSelection={handleShelfSelection}
        loadingShelfId={loadingShelfId}
        successfulShelfId={successfulShelfId}
      />

          <button onClick={() => window.location.href = props.pdf} className="  w-[190px]  h-[280px]  shrink-0">
            <img src={props.book ? props.book : props.coverImage} className="object-cover    shrink-0  object-top w-full h-full " alt="" />
          </button>
          <div className="flex flex-col gap-2 w-full  py-3 items-center justify-between h-full">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none    lg:text-lg lg:leading-none">{props.name ? props.name : props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>

              <h1 className="text-xs text-grey text-center font-semibold">{props.pages ? props.pages : props.pageCount} pages</h1>

            </div>

            <div className="flex items-center gap-2 flex-col w-full">
              {user?.currentlyReading.some((readingBook: any) => readingBook?.url === props.url) ? (<button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={() => window.location.href = props.pdf}>
                Read
              </button>) : (<button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={handleAddToCurrentlyReading}>
                Read
              </button>)}


              <button className="h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8 " type="button" onClick={toggleAddPopup}>
                Save
              </button>
            </div>


          </div>
        </div>
      )}
      {props.donatedBook && (
        <Link href={`/dashboard/donated-books/${props._id}`} ref={ref} style={fade} className={`flex flex-col gap-2 items-start    w-[200px]    shadow-lg hover:shadow-2xl ease-in  transition duration 300   overflow-hidden  relative  shrink-0  md:shadow-none md:hover:shadow-none  md:border border-lightGrey h-[335px] rounded-sm 4xl:w-[280px] 4xl:h-[460px] `}
        >

          <img src={props.coverImage} className="object-cover   w-[200px]  h-[280px]  shrink-0  object-top 4xl:w-[280px] 4xl:h-[400px]  " alt="" />
          <div className="flex flex-col gap-2 w-full ">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none  line-clamp-1  lg:text-lg lg:leading-none">{props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>
            </div>
            {linkname !== '/dashboard/reading' && (<h1 className="text-base  font-bold text-center  text-red ">{props.price}</h1>)}


          </div>
        </Link>
      )}
      {props.donatedBooksRead && (
        <div className={`flex  gap-2 items-start    w-[380px] bg-lightPink      ease-out  transition duration 300   overflow-hidden  relative  shrink-0    md:border border-lightGrey  cursor-default  h-[280px] rounded-md hover:shadow-xl pr-1  2xs:w-full readingBook  `}
          ref={ref} style={fade} >
          {!loading && (
            <button className="bg-[#00000091] w-6  h-6  rounded-md items-center  justify-center absolute top-1 left-1 z-20 flex readingBook-button hover:ring-offset-2  hover:ring-[0.1px]  ring-white   transition  duration-300" onClick={toggleAddPopup}>
              <img src='/assets/icons/ellipsis.svg' className="w-[4px]  " alt="" />
            </button>
          )}
           <AddPopup
        addPopup={addPopup}
        isAddPopupVisible={isAddPopupVisible}
        AddPopupRef={AddPopupRef}
        user={user}
        props={props}
        handleDonatedShelfSelection={handleDonatedShelfSelection}
        handleShelfSelection={handleShelfSelection}
        loadingShelfId={loadingShelfId}
        successfulShelfId={successfulShelfId}
      />
          <Link href={`/dashboard/donated-books/${props._id}`} className="  w-[190px]  h-[280px]  shrink-0">
            <img src={props.book ? props.book : props.coverImage} className="object-cover    shrink-0  object-top w-full h-full " alt="" />
          </Link>
          <div className="flex flex-col gap-2 w-full  py-3 items-center justify-between h-full">
            <div>
              <h1 className="text-xl  font-bold  text-center leading-none    lg:text-lg lg:leading-none">{props.name ? props.name : props.title}</h1>
              <h1 className="text-sm text-grey text-center  leading-none ">by {props.author}</h1>

              <h1 className="text-xs text-grey text-center font-semibold">{props.pages ? props.pages : props.pageCount} pages</h1>

            </div>

            <div className="flex items-center gap-2 w-full flex-col">
              {props.coverImage ? <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={handleAddToDonatedCurrentlyReading}>
                Read
              </button> : <button className="h-10  rounded-full      w-full   text-sm       border border-pink bg-red text-white ease-out duration-300  hover:bg-black  hover:text-white  xs:text-xs xs:h-8" type="button" onClick={handleAddToCurrentlyReading}>
                Read
              </button>}


              <button className="h-10  rounded-full     w-full    text-sm       border border-pink ring-1 ring-black  ring-inset text-black  text-center duration-300  hover:bg-black  hover:text-white xs:text-xs xs:h-8" type="button" onClick={toggleAddPopup} >
                Save
              </button>
            </div>


          </div>
        </div>
      )}

    </>
  );
}

export default Cards;

// components/AddPopup.tsx



