
import Cards from "./cards";


const BookFlow = (props: any) => {
    return (   <section className="flex flex-col gap-12  py-20  xs:py-10 xs:gap-4">
        <div className="flex flex-col gap-1 items-center">
        <h1 className="font-[600]  text-3xl  text-red  xs:text-2xl">{props.header}</h1>
        <img src="/assets/images/line.png" className="w-44" alt=""/>
        </div>
        <div className="flex gap-8 items-start justify-center 2xl:overflow-auto   2xl:justify-normal w-screen   xs:gap-4  flow"style={{paddingLeft: '16px', paddingRight: '16px'}}  >
        {props.books && props.books.length > 0 ? (
        props.books.map((book: any) => (
          <Cards bookNew key={book.id} {...book} />
        ))
      ) : (
        <p>No books available</p>
      )}
        
        </div>
            </section>);
}
 
export default BookFlow;