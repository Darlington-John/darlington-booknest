import { newBooks } from "~/app/data/new-arrivals";
import BookFlow from "../../flow";

const NewArrivals = () => {

    return (
        <BookFlow header='NEW ARRIVALS' books={newBooks}/>);
}
 
export default NewArrivals;