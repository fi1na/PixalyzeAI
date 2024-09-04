"use client"
import React from 'react'
import Image from 'next/image';
import Link from "next/link";


export const Header = () => {
     return (
       <div className="min-w-screen bg-gray-100">
         <header className="bg-white shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <Image
                   src={"/image-logo.jpg"}
                   alt="Logo Image"
                   width={40}
                   height={40}
                   className="mr-3"
                 />
                 <h1 className="text-2xl font-bold text-blue-600">
                   PixelyzeAI
                 </h1>
               </div>
               <nav>
                 <ul className="flex space-x-4">
                   <Link
                     href={"#"}
                     className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                   >
                     Home
                   </Link>
                   <Link
                     href={"#how-it-works"}
                     className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                   >
                     How it works?
                   </Link>
                   <Link
                     href={"#features"}
                     className="text-gray-600 hover:text-blue-600 transition duration-150 ease-in-out"
                   >
                     Features
                   </Link>
                 </ul>
               </nav>
             </div>
           </div>
         </header>

       </div>
     );

}
