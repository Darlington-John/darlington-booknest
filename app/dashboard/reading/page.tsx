"use client"
import Link from "next/link";
import Header from "../components/header";
import { useUser } from "~/app/context/AuthContext";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Cards from "~/app/components/cards";
import NewArrivals from "~/app/components/sections/home/new-arrivals";
import BestSellers from "~/app/components/sections/home/best-sellers";

const Reading = () => {
    const {user, loading} = useUser();

interface Book {
    url: string;
}
const bookLibrary =[...newBooks, ...bestSellers]
const matchingBooks = user?.currentlyReading
  .map((userBook: { url: string }) => {
    return bookLibrary.find((book: Book) => book.url === userBook?.url);
  })
  .filter((book:Book): book is Book => book !== undefined);
  const donatedBooks = user?.currentlyReading.filter(
    (book: { donatedBy?: string }) => book.donatedBy
  );
  
const nested =(matchingBooks?.length > 0 || donatedBooks?.length>0 
  ? 'justify-start xs:justify-center items-start' 
  : 'justify-center items-center  ');
  const books = [...newBooks, ...bestSellers]
    return ( 
    <div className="flex  flex-col w-full h-full   overflow-auto ">
        <Header/>
        {loading? <div className="w-full h-full flex items-center justify-center">
<img src="/assets/images/double.gif" alt="" className="w-32 xs:w-20"/>
        </div>:( 
          <section className={`flex flex-col py-20  xs:py-10 xs:gap-4 w-full px-4 h-full     xs:justify-center    xs:py-4  ${loading ? 'justify-center':'justify-start xs:h-auto'} ${donatedBooks?.length === 0 ? 'gap-0': 'gap-12  ' }  `}>
          {matchingBooks.length > 0  || donatedBooks?.length > 0? null: (<div className={`flex flex-col gap-1 items-center`}>
        <p className="    text-2xl text-center  font-medium  text-red  md:text-lg">You don{`'`}t have any books you are reading.<br/> <Link href='/dashboard/trending' className="underline  hover:text-red font-semibold text-grey text-lg  md:text-xs">Start a new book today!</Link></p>
        </div>)}
          <div className={`flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center     ${matchingBooks?.length > 0  ?'': 'hidden'}`}>
     {matchingBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
        <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Books you{`'`}re currently reading</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all books you are currently reading </p>
        </div>)}
       
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
  ? 'justify-center items-center' 
  : nested
}  ${matchingBooks?.length > 0   ?'': 'hidden'}`}  >
{matchingBooks?.length > 0 || donatedBooks?.length > 0  ? (
        matchingBooks.slice().reverse().map((data: any, index: any )=> (
      <Cards    readingBook  key={index + 1} {...data}/>
        ))
      ) : (
null
      )}
        </div>
        </div>
        <div className="flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center    ">
     {donatedBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
        <h1 className="font-medium   text-3xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Donated Books you{`'`}re currently reading</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all the community-donated books you are currently reading </p>
        </div>)}
      
       {donatedBooks?.length>0 && (<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto ${donatedBooks?.length>0? 'pb-12 ': 'hidden'}      ${loading 
  ? 'justify-center items-center' 
  : nested
}`}  >
{donatedBooks?.length > 0 ? (
        donatedBooks.slice().reverse().map((data: any, index: any )=> (
      <Cards    readingBook  key={index + 1} {...data} />
        ))
      ) : (
null
      )}
        </div>)}

        </div>
        <section className="flex flex-col gap-12  xs:py-10 xs:gap-4 w-full px-4">
        <div className="flex flex-col gap-1 items-center">
        <h1 className="font-medium   text-4xl  text-red md:text-2xl    ">Trending books</h1>
<p className="text-base  text-grey  md:text-sm">See what other readers are adding to their bookshelves</p>
        </div>
        <div className="flex gap-8 items-start gap-3      w-full      flow  flex-wrap justify-center sm:hidden 4xl:justify-start"  >
        {books.length > 0 ? (
        books.map((book: any) => (
          <Cards bookmain key={book.id} {...book} />
        ))
      ) : (
        <p>No books available</p>
      )}
        </div>
        <div className="sm:flex gap-0 items-start       w-full      flow  flex-wrap justify-center hidden"  >

        <NewArrivals/>
        <BestSellers/>
        </div>
            </section>
            </section>)}



    </div>);
}
 
export default Reading;