import  connectMongo  from '~/lib/mongodb';
import User from '~/models/User';

import ShelfDetails from '../../components/shelf-details';


interface ShelfDetailProps {
  params: {
    id: string;
  };
}


const ShelfDetail = async ({ params }: ShelfDetailProps) => {
  interface Book {
    url: string;
}
  await connectMongo();

  const { id } = params;
  const user = await User.findOne({ 'shelves._id': id });

  const shelf = user?.shelves.find(shelf => (shelf as any).id === id);



  
  if (!shelf) {
    return <div>Shelf not found</div>;
  }

  return (
<ShelfDetails shelf={shelf}/>
  );
};

export default ShelfDetail;
