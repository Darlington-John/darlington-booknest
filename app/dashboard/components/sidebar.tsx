"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const SideBar = (props:  any) => {
  const linkname = usePathname();
  const nested = linkname.startsWith('/dashboard/donated-books') ?'xl:hidden ': 'lg:hidden'
    return (<div className={`w-[260px] flex flex-col     items-center gap-3  border-r border-pink h-screen overflow-auto flow  shrink-0 xl:bg-white  xs:w-full     ${props.hidden &&[nested]}   `}>
        <Link href="/" className={`flex  items-center text-3xl font-[800] md:text-xl  2xs:shrink-0  bg-red  w-full py-   justify-center flex-nowrap h-[60px] gap-1 md:h-[50px] ${(linkname ==='/' || linkname.startsWith('/books')) && 'hidden'}`}>
<img
      src="/assets/images/me.png"
  className="w-5  md:w-4  " alt="library"
    />
    <h1 className="   text-white  ">BookNest</h1>
</Link>
<Accordion/>
    </div>  );
}
 
export default SideBar;



const log = [
    {

      content: 'Your library' ,
features: [
    {

        content: 'Currently reading' ,
        to: '/dashboard/reading'
      },
      {

        content: 'Already read' ,
            to: '/dashboard/already-read'
      },
      {

        content: 'Want to read' ,
            to: '/dashboard/to-read'
      },
]
    },
    {

        content: 'Browse' ,
  features: [
        {
  
          content: 'Trending' ,
              to: '/dashboard/trending'
        },
        {
  
          content: 'Shelf' ,
              to: '/dashboard/shelf'
        },
        {
  
          content: 'Donated books' ,
              to: '/dashboard/donated-books'
        },
  ]
      },

      {

        content: 'Donate' ,
  features: [
      {
  
          content: 'Donate book' ,
          to: '/dashboard/donate-book'
        },
        {
  
          content: 'Donate fund' ,
              to: '/dashboard/donate-fund'
        },
  ]
      }
   ];
   interface AccordionItemProps {
    isOpen: boolean;
    onClick: () => void;
    
    [key: string]: any; 
  }
   const AccordionItem: React.FC<AccordionItemProps> = ({ isOpen, onClick ,...props}) => {
    const contentHeight = useRef<HTMLDivElement | null>(null);
    const features = props.features || [];
    const linkname = usePathname();
    const [height, setHeight] = useState('0px');
    useEffect(() => {
      if (isOpen && contentHeight.current) {
        setHeight(`${contentHeight.current.scrollHeight}px`);
      } else {
        setHeight('0px');
      }
    }, [isOpen]);
    return (
      <div className=" overflow-hidden text-[28px]  w-full flex flex-col    px-2 bg-white  border-b  border-pink">
        <button
          className={`w-full text-left py-3 px- flex items-center justify-between font-medium border-none pointer leading-none xs:py-2  flex-nowrap   `}
          onClick={onClick}
        >
          <p className="text-lg  font-semibold xs:text-sm  text-nowrap ">{props.content}</p>
          <img
            src={'/assets/icons/caret-down.svg'}
            alt=""
            className={`w-3 ease-out duration-300 ${isOpen ? 'rotate-[360deg]' : ''}`}
          />
        </button>
        <div
          ref={contentHeight}
          className="ease-out duration-300"
          style={{ height }}
        >
          <div className="flex flex-col  py-2 ">
            {features.map((data: any, index: any) => (
              <Link href={data.to} className={`leading-none  py-3 rounded-md shrink-0 xs:py-2 ease-out duration-100    ${linkname.startsWith(data.to)  && 'bg-red' }`} key={index + 1}>
                <p className={`text-base font-semibold xs:text-sm       px-3 text-nowrap  ${linkname.startsWith(data.to) ? 'text-white': 'hover:text-red text-grey' }`}>{data.content}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };
   const Accordion = () => {
    const [activeIndices, setActiveIndices] = useState<number[]>(log.map((_, index) => index));

    const handleItemClick = (index: number) => {
      setActiveIndices((prevIndices) =>
        prevIndices.includes(index)
          ? prevIndices.filter((i) => i !== index)
          : [...prevIndices, index]
      );
    };
   
    return (
     <div className='w-full flex flex-col  '>
       {log.map((item, index) => (
       <AccordionItem
       key={item.content}
       {...item}
        isOpen={activeIndices.includes(index)}
        onClick={() => handleItemClick(index)}
        features={item.features}
       />
      ))}
     </div>
    )
   };
  