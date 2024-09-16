"use client"
import Link from "next/link";
import Header from "../components/header";
import { useUser } from "~/app/context/AuthContext";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Cards from "~/app/components/cards";
import { useBooks } from "~/app/context/BookContext";

const Reading = () => {
    const {user, loading} = useUser();
const {books} = useBooks();
interface Book {
    url: string;
}
const bookLibrary =[...newBooks, ...bestSellers]
const matchingBooks = user?.alreadyRead
  .map((userBook: { url: string }) => {
    return bookLibrary.find((book: Book) => book.url === userBook?.url);
  })
  .filter((book:Book): book is Book => book !== undefined);

  const donatedBooks = user?.alreadyRead.filter(
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
      <p className="    text-2xl text-center  font-medium  text-red  md:text-lg">You don{`'`}t have any books you are done reading<br/> <Link href='/dashboard/trending' className="underline  hover:text-red font-semibold text-grey text-lg  md:text-xs">Start a new book today!</Link></p>
      </div>)}
        <div className={`flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center     ${matchingBooks?.length > 0  ?'': 'hidden'}`}>
   {matchingBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Books you{`'`}re done  reading</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all books you are done  reading </p>
      </div>)}
     
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: nested
}  ${matchingBooks?.length > 0   ?'': 'hidden'}`}  >
{matchingBooks?.length > 0 || donatedBooks?.length > 0  ? (
      matchingBooks.slice().reverse().map((data: any, index: any )=> (
    <Cards    alreadyReadBook  key={index + 1} {...data}/>
      ))
    ) : (
null
    )}
      </div>
      </div>
      <div className="flex flex-col gap-10   0 xs:gap-4 w-full  xs:justify-center    ">
   {donatedBooks?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-3xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Donated Books you{`'`}re done  reading</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center">Access all the community-donated books you are done  reading </p>
      </div>)}
     
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     ${loading 
? 'justify-center items-center' 
: nested
}`}  >
{donatedBooks?.length > 0 ? (
      donatedBooks.slice().reverse().map((data: any, index: any )=> (
    <Cards    alreadyReadBook   key={index + 1} {...data} />
      ))
    ) : (
null
    )}
      </div>
      {books?.length>0 && ( <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
      <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">Books donated by the community</h1>
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
  
  <div className="flex flex-col gap-1 items-center">
      <p className="    text-2xl text-center  font-medium  text-red  md:text-lg">There are no books donated by the community<br/> <Link href='/dashboard/donate-book' className="underline  hover:text-red font-semibold text-grey text-lg  md:text-xs">Donate a book today!</Link></p>
      </div>
    )}
      </div>
      </div>
          </section>)}



  </div>);
}
 
export default Reading;