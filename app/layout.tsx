import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
import Header from "./components/header";
import Footer from "./components/footer";
import { UserProvider } from "./context/AuthContext";


const myFont = localFont({ src: [
  {
  path: './../public/assets/fonts/Recoleta-Bold.ttf',
      weight: '700',
},
{
  path: './../public/assets/fonts/mulish.ttf',
      weight: '400',
},
{
  path: './../public/assets/fonts/Recoleta-SemiBold.ttf',
      weight: '500',
},
{
  path: './../public/assets/fonts/Mulish-SemiBold.ttf',
      weight: '600',
},
{ path: './../public/assets/fonts/dancing.ttf', weight: '800' }
],

})
export const metadata: Metadata = {
  title: "Book nest",
  description: "Your personal library, redefined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` bg-white relative   ${myFont.className}`}>
        <UserProvider>
        <Header/>
       {/* <UserProvider> */}
        {children}
        {/* </UserProvider> */}
        <Footer/>
        </UserProvider>
        </body>
    </html>
  );
}
