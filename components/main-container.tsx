"use client";
import Image from 'next/image';
import React, { useState } from 'react';

export const MainContainer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading]= useState(false)
  const handleImageUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      setImage(e.target.files[0]);

    }
  };
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
            Identify your image
          </h2>
          <div className="mb-8">
            <label
              htmlFor="image-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload An Image
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm to-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50
                  file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
            />
          </div>
          {/* Display the image*/}
          {image && (
            <div className="mb-8 flex justify-center">
              <Image
              src={URL.createObjectURL(image)}
              alt="Uploaded Image"
              width={300}
              height={300}
              className="rounded-lg shadow-md"
              />

            </div>
            )}
            <button type="button" disabled={!image || loading} className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg'>
              {loading ? "Loading..." : "Identify Image"}
            </button>

        </div>
      </div>
    </main>
  );
}
