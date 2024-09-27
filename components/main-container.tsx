"use client";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rejects } from 'assert';
import { generateKey } from 'crypto';
import Image from 'next/image';
import { resolve } from 'path/posix';
import React, { useState } from 'react';

export const MainContainer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading]= useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleImageUpload = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
      setImage(e.target.files[0]);

    }
  };
  const identifyImage =async (additionalPrompt: string="")=>{
    if(!image) return;
    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });


    try{
      const imageParts = await fileToGenerativePart(image);
      const result = await model.generateContent([
        `Identify this image and provide its name nad important information 
        including a brief explanation about that image, ${additionalPrompt}`,
        imageParts,
      ]);

      const response = await result.response;
      const text = response.text().trim()
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*\*/g, "")
      .replace(/-\s*/g, "")
      .replace(/\n\s*\n/g, "\n");
      setResult(text);
      generateKeywords(text) 
    }
    catch (error)
    {
      console.error((error as Error)?.message);
    }finally{
      setLoading(false);
    }
  };

  const fileToGenerativePart = async (
    file: File
  ): Promise<{
    inlineData: { data: string; mimeType: string };
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        const base64Content = base64Data.split(",")[1];
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

    const generateKeywords=(text : string)=>{
      const words=text.split(/\s+/) //split string into array of words--supllying a regular exp to it
      const keywordsSet = new Set<string>();
      words.forEach((word) => {
        if (
          word.length > 4 && 
          !["this", "that", "with", "from", "have"].includes(word.toLowerCase())
        ) {
          keywordsSet.add(word);
          }
          });
          setKeywords(Array.from(keywordsSet).slice(0,5));
    }

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
            <button type="button" 
            onClick={()=>identifyImage()}
            disabled={!image || loading} className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg'>
              {loading ? "Loading..." : "Identify Image"}
            </button>

        </div>

        {result && (
          <div className='bg-blue-50 p-8 border-t border-blue-100'>
            <h3 className='text-2xl font-bold text-blue-800 mb-4'>Image Information</h3>
            <div className='max-w-none'>
              {result.split("\n").map((line, index)=>{
                if(line.startsWith("Important Information:") || line.startsWith("Other Information:")){
                  return (
                    <h4 className="text-xl font-semibold mt-4 mb-2 text-blue-700" key={index}>
                      {line}
                    </h4>
                  );
                  
                }
                else if(line.match(/^\d+\./) || line.startsWith("-")){
                  return (
                    <li key={index} className='ml-4 mb-2 text-gray-700'>
                      {line}
                    </li>
                  );
                }
                else if(line.trim() != "")
                {
                  return (
                    <p key={index} className="mb-2 text-gray-800">{line}</p>
                  );
                }
                return null;
              })}
            </div>
            <div className='mt-6'>
              <h4 className='text-lg font-semibold mb-2 text-blue-700'>Related Keywords</h4>
              <div className='fkex flex-wrap gap-2'>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
