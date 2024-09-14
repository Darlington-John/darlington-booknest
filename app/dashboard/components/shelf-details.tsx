import Link from "next/link";
import Header from "./header";
import { newBooks } from "~/app/data/new-arrivals";
import { bestSellers } from "~/app/data/best-sellers";
import Cards from "~/app/components/cards";

const ShelfDetails = ({shelf}: any) => {
    if (!shelf || !Array.isArray(shelf.books)) return <div>No books available</div>;

    interface Book {
      url: string;
    }
  
    const bookLibrary = [...newBooks, ...bestSellers];
  
    
    const plainBooksArray = shelf.books.map((book: any) => book.toObject ? book.toObject() : book);
  
    const matchingBooks = plainBooksArray
      ?.map((userBook: any) => bookLibrary.find((book: Book) => book.url === userBook.url))
      .filter((book: Book | undefined): book is Book => book !== undefined);
  
    const nonMatchingBooksWithCover = plainBooksArray
      ?.filter((userBook: any) => 
        !bookLibrary.some((book: Book) => book.url === userBook.url) && userBook.coverImage
      );
  
    const allBooks = [...(matchingBooks || []), ...(nonMatchingBooksWithCover || [])];
    return ( 

       
        <div className="flex  flex-col w-full h-full   overflow-auto ">
        <Header/>
          <section className={`flex flex-col gap-12  py-20  xs:py-10 xs:gap-4 w-full px-4 h-full     xs:justify-center    xs:py-4  justify-start xs:h-auto `}>
 <div className="flex flex-col gap-1 items-start  md:gap-0 xs:w-full  xs:items-center">
        <h1 className="font-medium   text-4xl  text-red  md:text-2xl  xs:text-xl  xs:text-center ">{shelf.name}</h1>
<p className="text-base  text-grey  md:text-sm  xs:text-center w-[700px] leading-tight md:w-full">{shelf.description}</p>
        </div>
       
<div className={`flex gap-4   gap-3      w-full      flow  flex-wrap h-auto pb-12     
${allBooks?.length > 0 
  ? 'justify-start xs:justify-center items-start' 
  : 'justify-center items-center  '}
}`}  >

{allBooks.length>0 ?<>{allBooks.slice().reverse().map((data: any, index: any )=> (
<Cards    shelvedBook  key={index + 1} {...data}/>
  ))}</> :(<div className="flex flex-col items-center w-[600px]  bg-lightPink  mx-auto  py-6 gap-5 px-4 sm:w-full  xs:gap-3 xs:px-2">
    <div className="flex flex-col gap-2 items-center xs:gap-1">
<img src={'/assets/images/empty-shelf.jpg'} className="w-40 xs:w-28" alt=""/>
<h1 className="text-2xl font-medium text-center  text-red xs:text-xl">
 This stack is empty
</h1>
</div>
<div className="w-full px-2  xs:px-0 ">
<p className="text-sm font-semibold text-grey text-center  xs:text-xs">
This stack is looking a bit bare right now. No worries—this is the perfect opportunity to fill it up! Explore my vast collection of books across different genres, discover stories that capture your imagination, and hit the  <span className="mx-1"><span className="text-base font-bold text-black xs:text-sm ">&#x22EE;</span></span> icon to choose what stack to add the book to. Your next favorite book is just waiting to be found!
</p>
</div>

<Link href="/dashboard/reading" className="rounded-md bg-red py-3 w-full text-center text-white font-semibold text-sm transition duration-300 hover:bg-black  ease-out xs:py-2 xs:text-xs" >Add a book  to your stack</Link>
</div>)}

        </div>
      

            </section>



    </div>

     );
}
 
export default ShelfDetails;