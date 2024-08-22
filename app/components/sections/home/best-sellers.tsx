
import BookFlow from "../../flow";
import { bestSellers } from "~/app/data/best-sellers";

const BestSellers = () => {
    return ( <BookFlow header="Best sellers" books={bestSellers}/> );
}
 
export default BestSellers;