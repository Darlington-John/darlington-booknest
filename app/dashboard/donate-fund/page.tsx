import Link from "next/link";
import Header from "../components/header";

const Reading = () => {
    return ( <div className="flex  flex-col w-full h-screen overflow-auto ">
        <Header/>
 <section className="flex flex-col gap-12  py-20  xs:py-10 xs:gap-4 w-full px-4 h-full   justify-center">
        <div className="flex flex-col gap-1 items-center">
        <p className="    text-2xl text-center  font-medium  text-red">Support  Booknest, let{`'`}s work together in spreading  knowledge.<br/> <Link href='/dashboard/trending' className="underline  hover:text-red font-semibold text-grey text-lg">Support Booknest!</Link></p>
        </div>

            </section>


    </div>);
}
 
export default Reading;