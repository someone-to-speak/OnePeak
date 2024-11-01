import React from "react";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
};

interface ImageSelectorDropDownProps {
  selectedLanguage: string;
  languageOptions: LanguageType[];
  onLanguageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ImageSelectorDropDown: React.FC<ImageSelectorDropDownProps> = ({
  selectedLanguage,
  languageOptions,
  onLanguageChange
}) => {
  return (
    <div className="p-4">
      내 언어 설정:
      <label className="text-gray-700">
        <select value={selectedLanguage} onChange={onLanguageChange} className="ml-2 p-2 rounded bg-gray-200">
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.language_name}>
              {lang.language_name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ImageSelectorDropDown;
