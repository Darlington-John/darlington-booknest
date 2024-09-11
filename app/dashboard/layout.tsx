
import SideBar from "./components/sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={
        "flex  h-screen items-start"}
    >
<SideBar hidden/>

      {children}

    </main>
  );
}


