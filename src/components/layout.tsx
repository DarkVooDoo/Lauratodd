
import {Roboto} from "@next/font/google"

import Navbar from '@/components/Navbar/navbar'
import Footer from "./Footer/footer"

// const font = Roboto({ subsets: ['latin'], weight: "400"})

interface LayoutProps {
  children: JSX.Element
}

const Layout:React.FC<LayoutProps> = ({children})=> {
  return (
 
      <>
        <Navbar />
        {children}
        <Footer />
      </>
  )
}

export default Layout