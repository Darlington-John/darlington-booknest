"use client"
import Link from "next/link";
import Header from "../components/header";
import { useUser } from "~/app/context/AuthContext";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Cards from "~/app/components/cards";

const Reading = () => {
    const {user, loading} = useUser();

interface Book {
    url: string;
}
const bookLibrary =[...newBooks, ...bestSellers]
const matchingBooks = user?.toRead
  .map((userBook: { url: string }) => {
    return bookLibrary.find((book: Book) => book.url === userBook?.url);
  })
  .filter((book:Book): book is Book => book !== undefined);
  const donatedBooks = user?.toRead.filter(
    (book: { donatedBy?: string }) => book.donatedBy
  );
const nested =(matchingBooks?.length > 0 || donatedBooks?.length > 0
  ? 'justify-start xs:justify-center items-start' 
  : 'justify-center items-center  ');
    return (
      <div className="flex  flex-col w-full h-full   overflow-auto ">
      <Header/>
      {loading? <div className="w-full h-full flex items-center justify-center">
<img src="/assets/images/double.gif" alt="" className="w-32 xs:w-20"/>
      </div>:( <section className={`flex flex-col gap-12  py-20  xs:py-10 xs:gap-4 w-full px-4 h-full     xs:justify-center    xs:py-4  ${loading ? 'justify-center':'justify-start xs:h-auto'}  `}>
        {matchingBooks.length > 0  || donatedBooks?.length > 0? null: (<div className={`flex flex-col gap-1 items-center`}>
      <p className="    text-2xl text-center  font-medium  text-red  md:text-lg">You don{`'`}t have any books you want to read.<br/> <Link href='/dashboard/trending' className="underline  hover:text-red font-semibold text-grey text-lg  md:text-xs">Add a book to your wishlist today!</Link></p>
      </div>)}
        <div className={`flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center     ${matchingBooks?.length > 0  ?'': 'hidden'}`}>
   {matchingBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Books you want to read</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all books you want to  read</p>
      </div>)}
     
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: nested
}  ${matchingBooks?.length > 0   ?'': 'hidden'}`}  >
{matchingBooks?.length > 0 || donatedBooks?.length > 0  ? (
      matchingBooks.slice().reverse().map((data: any, index: any )=> (
    <Cards    wantToReadBook  key={index + 1} {...data}/>
      ))
    ) : (
null
    )}
      </div>
      </div>
      <div className="flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center    ">
   {donatedBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-3xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Donated Books you want to read</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all the community-donated books you want to read </p>
      </div>)}
     
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: nested
}`}  >
{donatedBooks?.length > 0 ? (
      donatedBooks.slice().reverse().map((data: any, index: any )=> (
    <Cards    wantToReadBook   key={index + 1} {...data} />
      ))
    ) : (
null
    )}
      </div>
      </div>
          </section>)}



  </div>);
}
 
export default Reading;