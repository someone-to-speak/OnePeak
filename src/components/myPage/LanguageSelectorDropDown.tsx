import Image from "next/image";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Typography } from "../ui/typography";

type LanguageType = {
  id: number;
  language_name: string;
  language_img_url: string;
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
    onLanguageChange(language.language_name);
  };

  return (
    <div className="w-full">
      <Accordion isCompact className="border-b border-gray-800 py-[10px]">
        <AccordionItem
          key={1}
          title={
            <Typography size={16} weight="medium" className="text-primary-50">
              {text}
            </Typography>
          }
          subtitle={
            <Typography size={16} weight="medium" className="text-primary-50">
              {subtitle}
            </Typography>
          }
        >
          <ul className="mt-2 grid grid-cols-2 gap-2 p-4 bg-[#f3f3f3] rounded">
            {languageOptions.length > 0 ? (
              languageOptions.map((lang) => (
                <li key={lang.id}>
                  <button
                    onClick={() => handleSelectionChange(lang)}
                    className="w-full h-20 px-5 bg-[#fcfcfc] rounded-[10px] border border-[#d9d9d9] flex justify-center items-center gap-2.5 hover:bg-[#e6f6d9] hover:border hover:border-[#d9d9d9]"
                  >
                    <Image
                      src={lang.language_img_url}
                      alt={lang.language_name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <Typography size={16} weight="bold" className="text-primary-50">
                      {lang.language_name}
                    </Typography>
                  </button>
                </li>
              ))
            ) : (
              <Typography size={16} className="text-primary-50">
                결과가 없습니다.
              </Typography>
            )}
          </ul>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ImageSelectorDropDown;
