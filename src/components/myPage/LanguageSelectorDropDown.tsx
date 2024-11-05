import { useState, useEffect } from "react";
import Image from "next/image";
import caretUp from "@/../public/images/CaretUp.svg";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
};

interface ImageSelectorDropDownProps {
  selectedLanguage: string;
  languageOptions: LanguageType[];
  onLanguageChange: (language: string) => void;
}

const ImageSelectorDropDown: React.FC<ImageSelectorDropDownProps> = ({
  selectedLanguage,
  languageOptions,
  onLanguageChange
}) => {
  const [selected, setSelected] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setSelected(selectedLanguage || "언어를 선택해주세요");
  }, [selectedLanguage]);

  const handleSelectionChange = (language: LanguageType) => {
    setSelected(language.language_name);
    onLanguageChange(language.language_name);
  };

  const filteredLanguages = languageOptions.filter((lang) =>
    lang.language_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setSelected((prev) => (prev === selected ? "" : selected))}
        className="flex items-center gap-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out shadow-md p-2 w-full text-left"
      >
        <span>{selected}</span>
        <Image
          src={caretUp}
          alt={"CaretUp"}
          className={`transform transition-transform duration-200 ${selected ? "rotate-180" : ""}`}
        />
      </button>

      <Accordion>
        <AccordionItem title="언어 선택" className="p-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색..."
            className="p-2 border-b border-gray-300 w-full"
          />
          <ul className="mt-2">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <li key={lang.id}>
                  <button
                    onClick={() => handleSelectionChange(lang)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 w-full text-left"
                  >
                    <Image
                      src={lang.language_img_url}
                      alt={lang.language_name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-gray-800">{lang.language_name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">결과가 없습니다.</li>
            )}
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ImageSelectorDropDown;
