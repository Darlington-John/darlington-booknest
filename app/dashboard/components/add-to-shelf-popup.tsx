import Link from "next/link";
import React, { FC, RefObject} from "react";
interface Shelf {
    _id: string;
    name: string;
    books: any[];
  }
  
  interface AddPopupProps {
    addPopup: boolean;
    isAddPopupVisible: boolean;
    AddPopupRef: RefObject<HTMLDivElement>;
    user?: {
      shelves: Shelf[];
    };
    props: {
      url?: string;
      coverImage?: string;
    };
    handleDonatedShelfSelection: (shelf: Shelf) => void;
    handleShelfSelection: (shelf: Shelf) => void;
    loadingShelfId: string | null;
    successfulShelfId: string | null;
  }
  
  const AddPopup: FC<AddPopupProps> = ({
    addPopup,
    isAddPopupVisible,
    AddPopupRef,
    user,
    props,
    handleDonatedShelfSelection,
    handleShelfSelection,
    loadingShelfId,
    successfulShelfId,
  }) => {
    return (
      <>
        {addPopup && (
          <div
            className={`w-[160px] bg-[#000000db] rounded-md flex flex-col gap-1 py-1 px-1 shrink-none transition ease-out duration-300 absolute top-2 left-8 z-20 opacity-0 ${isAddPopupVisible ? 'opacity-100' : 'opacity-0'}`}
            ref={AddPopupRef}
          >
            <h1 className="text-white text-sm font-semibold text-center">Add to shelf</h1>
  
            <div className="flex flex-col leading-0">
              {user?.shelves?.map((shelf: Shelf, index: number) => {
                const isBookInShelf = shelf.books.some((book: any) =>
                  (book?.url === props.url && book?.coverImage === props.coverImage) ||
                  (book?.url === props.url && props.coverImage === undefined) ||
                  (book?.coverImage === props.coverImage && props.url === undefined)
                );
                return (
                  <button
                    className={`text-xs font-semibold text-white w-full py-[6px] rounded-sm line-clamp-1 px-1 text-start items-center justify-between flex ${isBookInShelf ? 'opacity-[0.3]' : 'hover:bg-grey'}`}
                    key={index + 1}
                    onClick={props.coverImage ? () => handleDonatedShelfSelection(shelf) : () => handleShelfSelection(shelf)}
                    disabled={isBookInShelf}
                  >
                    <span>{shelf.name}</span>
                    {loadingShelfId === shelf._id ? (
                      <img src="/assets/images/doubleWhite.gif" className="w-4" alt="Loading" />
                    ) :(<>{ successfulShelfId === shelf._id ? (
                      <img src="/assets/icons/check-white.svg" className="w-3" alt="Success" />
                    ) : null}</>)}
                  </button>
                );
              })}
            </div>
  
            <Link
              href="/dashboard/shelf"
              className="text-xs font-semibold text-white w-full py-[6px] rounded-sm px-1 text-start items-center justify-between hover:bg-grey flex"
            >
              <span>Create stack</span>
              <img src="/assets/icons/plus.svg" alt="" className="w-3" />
            </Link>
          </div>
        )}
      </>
    );
  };

  export default AddPopup;
  