'use client'
import { useUser } from "~/app/context/AuthContext";
import Header from "../components/header";
import { useEffect, useRef, useState, FormEvent } from "react";
import Cards from "~/app/components/cards";
import Link from "next/link";
import { useBooks } from "~/app/context/BookContext";

const DonateBook = () => {
    const [donatePopup, setDonatePopup] = useState(false);
    const {user, loading} = useUser();
    const [isDonatePopupVisible, setIsDonatePopupVisible] = useState(false);
    const donatePopupRef = useRef<HTMLDivElement>(null);
    const [sucessPopup, setSucessPopup] = useState(false);
    const [isSucessPopupVisible, setIsSucessPopupVisible] = useState(false);
    const SucessPopupRef = useRef<HTMLDivElement>(null);
    const pdfInputRef = useRef<HTMLInputElement | null>(null);
    const coverInputRef = useRef<HTMLInputElement | null>(null);
    const authorInputRef = useRef<HTMLInputElement | null>(null);
    const [bookDetails, setBookDetails] = useState({
      title: '',
      author: '',
      description: '',
      pageCount: '',
      aboutAuthor: '',
      authorProfile: '',
      coverImage: '',
      pdf : '',
      genres: {
        mystery: false,
        sciFi: false,
        romance: false,
        tragedy: false,
        comedy: false,
        horror: false,
        youngAdult: false,
        inspirational: false,
        biography: false,
      }
    });
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: boolean }>({
      pdf: false,
      coverImage: false,
      authorProfile: false,
    });
    const [submit,setSubmit] =useState(false);
    const [donatedBooks, setDonatedBooks] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const toggleDonatePopup = () => {
      if (!donatePopup) {
        setDonatePopup(true);
        setIsDonatePopupVisible(true);
      } else {
        setIsDonatePopupVisible(false);
        setTimeout(() => setDonatePopup(false), 500);
      }
      
    };
    const handleClickOutside = (event:any) => {
      if (donatePopupRef.current && !donatePopupRef.current.contains(event.target)) {
        setIsDonatePopupVisible(false);
        setTimeout(() => setDonatePopup(false), 500);
      }
      
    };
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const toggleSucessPopup = () => {
      if (!sucessPopup) {
        setSucessPopup(true);
        setIsSucessPopupVisible(true);
      } else {
        setIsSucessPopupVisible(false);
        setTimeout(() => setSucessPopup(false), 500);
      }
      
    };
    const handleClickOutsideSucess = (event:any) => {
      if (SucessPopupRef.current && !SucessPopupRef.current.contains(event.target)) {
        setIsSucessPopupVisible(false);
        setTimeout(() => setSucessPopup(false), 500);
        setTimeout(() => window.location.reload(), 1000);
        
      }
      
    };
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutsideSucess);
      return () => {
        document.removeEventListener('mousedown', handleClickOutsideSucess);
      };
    }, []);

  

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
      if (event.target.files?.[0]) {
        const file = event.target.files[0];
        setBookDetails((prevDetails) => ({
          ...prevDetails,
          [type]: file,
        }));
        setSelectedFiles((prev) => ({
          ...prev,
          [type]: true,
        }));
      } else {
        setSelectedFiles((prev) => ({
          ...prev,
          [type]: false,
        }));
      }
    };
  
    const handleToggleGenre = (genre: keyof typeof bookDetails.genres) => {
      setBookDetails({
        ...bookDetails,
        genres: {
          ...bookDetails.genres,
          [genre]: !bookDetails.genres[genre],
        },
      });
    };
    const check = !(
      bookDetails.title &&
      bookDetails.author &&
      bookDetails.description &&
      bookDetails.pageCount &&
      bookDetails.aboutAuthor &&
      bookDetails.pdf &&
      bookDetails.coverImage &&
      bookDetails.authorProfile
    );


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (check) {
        alert('Please fill out all required fields.');
        return;
      }
      setSubmit(true);
      const formData = new FormData();
      formData.append('title', bookDetails.title);
      formData.append('author', bookDetails.author);
      formData.append('description', bookDetails.description);
      formData.append('pageCount', bookDetails.pageCount);
      formData.append('aboutAuthor', bookDetails.aboutAuthor);
      formData.append('genres', JSON.stringify(bookDetails.genres));
      formData.append('donatedBy', user._id); 
    
      if (bookDetails.pdf) formData.append('pdf', bookDetails.pdf);
      if (bookDetails.coverImage) formData.append('coverImage', bookDetails.coverImage);
      if (bookDetails.authorProfile) formData.append('authorProfile', bookDetails.authorProfile);
    
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch('/api/donate-book', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: formData,
        });
    
        if (response.ok) {
toggleSucessPopup();
setSubmit(false);
toggleDonatePopup();
        } else {
          const error = await response.json();
          alert(`Failed to upload book: ${error.error}`);
        }
      } catch (error) {
        console.error('Error uploading book:', error);
        alert('An unexpected error occurred. Please try again later.');
      }
    };
  
    const userId = user?._id; 

    
    useEffect(() => {
      const fetchDonatedBooks = async () => {
        if (!userId) {
          setError('User ID is missing');
          return;
        }
  
        try {
          const response = await fetch('/api/user-donated-books', {
            method: 'GET',
            headers: {
              'user-id': userId, 
            },
          });
  
          const data = await response.json();
  
          if (response.ok) {
            setDonatedBooks(data.books); 
          } else {
            setError(data.error || 'Failed to fetch donated books');
          }
        } catch (error) {
          console.error('Error fetching donated books:', error);
          setError('An unexpected error occurred');
        }
      };
  
      fetchDonatedBooks();
    }, [userId]);
  
    const nested =(donatedBooks?.length > 0 
      ? 'justify-start xs:justify-center items-start' 
      : 'justify-center items-center  ');
const {books} = useBooks();

    return ( <div className="flex  flex-col w-full h-screen overflow-auto ">
        <Header/>

        {error &&''}
        {loading? <div className="w-full h-full flex items-center justify-center">
<img src="/assets/images/double.gif" alt="" className="w-32  xs:w-20"/>
      </div>: ( <section className={`flex flex-col gap-4  py-10  xs:py-10 xs:gap-4 w-full px-4 h-full    ${donatedBooks.length>0? ' justify-start':' '}`}>
        <div className="flex      flex-col items-start gap-4 ">
        <p className=" font-medium   text-3xl  text-red  md:text-2xl  xs:text-xl  xs:text-start   text-center leading-none  4xl:text-start">Donate free books to share knowledge. </p>
        <button className="bg-red text-white  rounded-md py-3 w-[90px] text-sm font-semibold flex gap-2 items-center justify-center duration-300 hover:bg-black  sm:py-2   sm:w-[70px]  sm:text-xs" onClick={toggleDonatePopup}>

<span>
Donate
</span>
<img src={'/assets/icons/plus.svg'} alt="" className="w-3"/>
</button>
        </div>
        {donatedBooks.length>0?( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="   text-2xl text-start  font-medium  text-red">Books you donated</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all books you donated to the community </p>
      </div>):(null)}
      <div className={`flex gap-4         w-full      flow  flex-wrap h-auto pb-12     justify-start xs:justify-center items-start`}>
  {donatedBooks.length>0?<>{donatedBooks.slice().reverse().map((data: any, index: number) => (
  <Cards donatedBooksRead key={index +1} data={data} {...data}/>
      ))}</>:(   null)}
     </div>
     {books.length>0&& ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-2xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">All Books donated by the community</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">
Acess all books donated  by the community </p>
      </div>)}
     <div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: 'justify-start xs:justify-center items-start'
}`}  >

  
{books?.length > 0 ? (
      books.slice().reverse().map((book: any, index : any)=> (
        <Cards key={index + 1} donatedBook  book={book} {...book}/>
      ))
    ) : (
  
null
    )}
      </div>
            </section>)}

            {donatePopup && (   <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8    xs:px-4   ">
        <div className={`pop w-[400px]  bg-white rounded-xl  flex flex-col   gap-4 py-6 px-4 shrink-none max-h-[97vh] overflow-auto book-flow   ${isDonatePopupVisible ? '' : 'pop-hidden'}`}  ref={donatePopupRef}>
          <div className="flex flex-col gap-1 text-grey text-sm ">
          <h1 className="text-center text-2xl text-red font-medium sm:text-xl">Share a book you own or wrote</h1>
          <h1 className="text-center text-sm text-grey font-semibold text-center leading-tight sm:text-xs">Fill in book details, it{`'`}s a bit much,<br/> but it ensures the book is accessible. </h1>
          </div>
<form className="flex flex-col gap-2 sm:gap-1  " onSubmit={handleSubmit}>
  <div className="flex items-center gap-2">
  <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs sm:text-xs">Book name</label>
          <input
            type="text" required
            placeholder="A Little Life"
            value={bookDetails.title}
            onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
            className="text-sm  sm:text-xs font-semibold  outline-none px-2 h-[40px] sm:h-[35px]  rounded-md rounded-md  w-full border border-lightGrey "

          />
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">Author:</label>
          <input
            type="text" required
            placeholder="Hanya Yanagihara"
            value={bookDetails.author}
            onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
            className="text-sm  sm:text-xs font-semibold  outline-none px-2  h-[40px] sm:h-[35px]   rounded-md rounded-md  w-full border border-lightGrey "

          />
          </div>
  </div>
  
          <div className="flex items-center gap-2">
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">PDF</label>
  <button className={`  h-[35px] px-4 text-sm  sm:text-xs font-semibold  rounded-lg  flex gap-1 items-center justify-center  hover:ring-1 ring-red duration-300 ease-out  xs:h-[30px]  ${selectedFiles.pdf ? 'bg-red  text-white' : 'bg-pink  text-red'}`} type="button" onClick={() => pdfInputRef.current?.click()} >
  <span>File</span>
<img src={selectedFiles.pdf  ?'/assets/icons/check-white.svg':'/assets/icons/file-import.svg'} className='w-4' alt=""/>
</button>
          <input type="file" ref={pdfInputRef}  className="hidden" onChange={(e) => handleFileChange(e, 'pdf')}/>
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">Book cover</label>
  <button className={`bg-pink  h-[35px] px-4 text-sm  sm:text-xs font-semibold text-red rounded-lg  flex gap-1 items-center justify-center  hover:ring-1 ring-red duration-300 ease-out xs:h-[30px]   ${selectedFiles.coverImage ? 'bg-red  text-white' : 'bg-pink  text-red'}`}onClick={() => coverInputRef.current?.click()} type="button">
  <span>File</span>
<img src={selectedFiles.coverImage  ?'/assets/icons/check-white.svg':'/assets/icons/file-import.svg'} className='w-3' alt=""/>
</button>
          <input type="file" ref={coverInputRef}  
          onChange={(e) => handleFileChange(e, 'coverImage')} className="hidden"/>
          </div>
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">About the book:</label>
          <textarea
         
            placeholder="When four classmates from a small Massachusetts college move to New York to make their way, they're broke, adrift, and buoyed only by their friendship and ambition. There is kind..."
            value={bookDetails.description}
            onChange={(e) => setBookDetails({ ...bookDetails, description: e.target.value })}
            className="text-sm  sm:text-xs font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full border border-lightGrey  min-h-[100px]  leading-tight"
required
          />
          </div>
          <div className="flex items-center gap-2">
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">No. of Pages:</label>
          <input
            type="number"
            placeholder="626"
            value={bookDetails.pageCount}
            onChange={(e) => setBookDetails({ ...bookDetails, pageCount: e.target.value })}
            className="text-sm  sm:text-xs font-semibold  outline-none px-2 h-[40px] sm:h-[35px]  rounded-md rounded-md  w-full border border-lightGrey "

          />
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">Author profile:</label>
  <button className={`bg-pink  h-[40px] sm:h-[35px]  px-4 text-sm  sm:text-xs font-semibold text-red rounded-lg  flex gap-1 items-center justify-center  hover:ring-1 ring-red duration-300 ease-out xs:h-[30px]   ${selectedFiles.authorProfile ? 'bg-red  text-white' : 'bg-pink  text-red'}`} onClick={() => authorInputRef.current?.click()}type="button">
  <span>File</span>
<img src={selectedFiles.authorProfile  ?'/assets/icons/check-white.svg':'/assets/icons/file-import.svg'} className='w-3' alt=""/>
</button>
          <input type="file" ref={authorInputRef}    onChange={(e) => handleFileChange(e, 'authorProfile')} className="hidden"/>
          </div>
          </div>
          <div className="flex w-full flex-col gap-1 ">
  <label htmlFor="name" className="text-sm  sm:text-xs ">About the author:</label>
          <textarea
         
            placeholder="Hanya Yanagihara lives in New York City"
            value={bookDetails.aboutAuthor}
            onChange={(e) => setBookDetails({ ...bookDetails, aboutAuthor: e.target.value })}
            className="text-sm  sm:text-xs font-semibold  outline-none px-2 py-3 rounded-md rounded-md  w-full border border-lightGrey  min-h-[50px]  leading-tight"
required
          />
          </div>
          <div className="flex w-full flex-wrap  gap-1 items-start">
          {Object.keys(bookDetails.genres).map((genre) => (
            <button
              type="button"
              key={genre}
              onClick={() => handleToggleGenre(genre as keyof typeof bookDetails.genres)}
              className={`bg-pink h-[30px] px-4 text-xs font-semibold text-red rounded-lg flex gap-1 items-center justify-center hover:ring-1 ring-red duration-300 ease-out w-auto xs:h-[25px] ${bookDetails.genres[genre as keyof typeof bookDetails.genres] ? 'bg-red text-white' : 'bg-pink'}`}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
          <button type="submit" className={` h-[40px] sm:h-[35px]  px-4 text-xs font-semibold text-white  rounded-lg flex gap-1 items-center justify-center    duration-300 ease-out w-auto w-full   mt-4  ${check ? 'bg-[#d1403178]  cursor-default': 'bg-red  hover:ring-offset-1   hover:ring-red hover:ring ring-red'}`} disabled={check}>
{submit ? (<img src={'/assets/images/doubleWhite.gif'} className="w-5" alt=""/>):('Submit')}
          </button>
          </div>
          </form>
        </div>
      </div>)}
      {sucessPopup && (   <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8    xs:px-4  ">
        <div className={`w-[420px]  rounded-md pop  duration-300 ease-in-out bg-white flex flex-col   overflow-hidden  items-center justify-center  px-4 py-6 gap-6 xs:w-full   ${isSucessPopupVisible ? '' : 'pop-hidden'}`} ref={SucessPopupRef} >
      <div className="flex flex-col items-center gap-4">
      <div className="h-20  w-20 rounded-full bg-lighterGrey  flex items-center justify-center">
        <img src={'/assets/icons/circle-check.svg'} alt='' className="w-10"/>
</div>
<div className="flex flex-col gap-1">
<p className="text-lg  font-medium  text-center text-black ">Book added to donated books</p>
<p className="text-sm  sm:text-xs  font-semibold text-grey text-center">Every book shared is a gateway to new worlds, a bridge connecting minds, and a spark that ignites endless imagination.</p>
</div>
</div>
<div className="flex flex-col gap-2 w-full">
<a href={'/dashboard/donated-books'} className="w-full  text-white text-sm   bg-black  rounded-md text-center h-[45px] items-center justify-center flex hover:ring-offset-1   hover:ring-black  hover:ring-[2px] ring-black transition duration-300 ease-out " >
<span>
View donated books
</span>
</a>
<button className="w-full  text-black text-sm    rounded-md text-center h-[25px] font-semibold  cursor-default">
  <button className="cursor-pointer" onClick={()=>  window.location.reload()}>
Close
</button>
</button>
</div>
      </div>
      </div>)}
    </div>);
}
 
export default DonateBook;

 
