import Cards from "~/app/components/cards";
import { bestSellers } from "~/app/data/best-sellers";
import { newBooks } from "~/app/data/new-arrivals";
import Header from "../components/header";
import NewArrivals from "~/app/components/sections/home/new-arrivals";
import BestSellers from "~/app/components/sections/home/best-sellers";


const books = [...newBooks, ...bestSellers]
const Trending = () => {
    return (  <div className="flex  flex-col w-full h-screen overflow-auto ">
        <Header/>
 <section className="flex flex-col gap-12  py-20  xs:py-10 xs:gap-4 w-full px-4">
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


    </div>);
}
 
export default Trending;