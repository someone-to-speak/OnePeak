import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Typography } from "../ui/typography";

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
    onLanguageChange(language.language_name);
  };

  return (
    <div className="w-full">
      <Accordion isCompact className="border-b border-gray-800 py-[10px]">
        <AccordionItem
          key={1}
          title={
            <Typography size={16} weight="medium">
              {text}
            </Typography>
          }
          subtitle={
            <Typography size={14} weight="medium" className="text-gray-500">
              {subtitle}
            </Typography>
          }
        >
          <ul className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-gray-900 rounded">
            {languageOptions.length > 0 ? (
              languageOptions.map((lang) => (
                <li key={lang.language_name}>
                  <button
                    onClick={() => handleSelectionChange(lang)}
                    className="w-full h-[64px] md:h-[48px] px-5 bg-white rounded-[10px] border border-gray-800 flex justify-center items-center gap-2.5 hover:bg-secondary-900 hover:text-secondary-500"
                  >
                    <Typography weight="bold" className="text-[16px] md:text-[12px]">
                      {lang.language_name}
                    </Typography>
                  </button>
                </li>
              ))
            ) : (
              <Typography size={16} className="text-gray-500">
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
