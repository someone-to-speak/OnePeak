import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import Image from "next/image";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    setSelected(selectedLanguage || "언어를 선택해주세요");
  }, [selectedLanguage]);

  const handleSelectionChange = (key: React.Key) => {
    const chosenLanguage = languageOptions.find((lang) => lang.language_name === key);
    if (chosenLanguage) {
      setSelected(chosenLanguage.language_name);
      onLanguageChange(chosenLanguage.language_name);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out shadow-md">
          <span>{selected}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu onAction={handleSelectionChange} className="bg-white rounded-lg shadow-lg">
        {languageOptions.map((lang) => (
          <DropdownItem
            key={lang.language_name}
            startContent={
              <Image
                src={lang.language_img_url}
                alt={lang.language_name}
                width={100}
                height={100}
                className="w-6 h-6 rounded-full"
              />
            }
          >
            <span className="text-gray-800">{lang.language_name}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ImageSelectorDropDown;
