import Image from 'next/image';
import Link from 'next/link';
import { Header } from '../components/header';
import { MainContainer } from "@/components/main-container";



const  HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <MainContainer />
    </div>
  );
}
 
export default HomePage;