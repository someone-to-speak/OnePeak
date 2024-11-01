import React from "react";

type LanguageType = {
  id: number;
  language_name: string;
  language_url_img: string;
};

interface ImageSelectorProps {
  selectedLanguages: string[];
  languageOptions: LanguageType[];
  onLanguageChange: (language: string) => void; // 언어 값을 직접 받음
}

const ImageSelectorToggle: React.FC<ImageSelectorProps> = ({
  selectedLanguages,
  languageOptions,
  onLanguageChange
}) => {
  return (
    <div className="p-4">
      내 언어 설정:
      <div className="flex flex-wrap mt-2">
        {languageOptions.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onLanguageChange(lang.language_name)}
            className={`m-1 p-2 rounded border ${
              selectedLanguages.includes(lang.language_name) ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {lang.language_name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectorToggle;
