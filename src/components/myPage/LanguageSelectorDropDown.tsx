"use client";

import { CustomAccordion } from "../AccordionItem";

type LanguageType = {
  language_name: string;
};

interface ImageSelectorDropDownProps {
  text: string;
  subtitle: string;
  languageOptions: LanguageType[];
  onLanguageChange: (language: string) => void;
}

const ImageSelectorDropDown: React.FC<ImageSelectorDropDownProps> = ({
  text,
  subtitle,
  languageOptions,
  onLanguageChange
}) => {
  const handleSelectionChange = (language: LanguageType) => {
    onLanguageChange(language.language_name); // 언어 변경 함수 호출
  };

  return (
    <div className="w-full">
      <CustomAccordion
        text={text}
        subtitle={subtitle}
        languageOptions={languageOptions}
        handleSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default ImageSelectorDropDown;
