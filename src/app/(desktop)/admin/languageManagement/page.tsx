"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

const page = () => {
  const browserClient = createClient();

  const [languageImg, setLanguageImg] = useState(false);
  const [language, setLanguage] = useState("");

  const handleLanguageImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    console.log(file);
    // const {data, error} = await browserClient.storage.from('language-image').upload()
  };

  return (
    <div>
      {/* <p>{languageImg}</p> */}
      <input type="file" accept="*" onChange={(e) => handleLanguageImg(e)} />
      <input
        type="text"
        value={language}
        placeholder="추가할 언어"
        onChange={(e) => {
          setLanguage(e.target.value);
        }}
      />
      <button onClick={handleLanguageImg}>추가</button>
    </div>
  );
};

export default page;
