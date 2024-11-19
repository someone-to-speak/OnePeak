import React from "react";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { Typography } from "./ui/typography";

interface LanguageOption {
  language_name: string;
}

interface CustomAccordionProps {
  text: string;
  subtitle: string;
  languageOptions: LanguageOption[];
  handleSelectionChange: (lang: LanguageOption) => void;
}

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-6 w-6 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({
  text,
  subtitle,
  languageOptions,
  handleSelectionChange
}) => {
  const [open, setOpen] = React.useState<number | null>(null);

  const handleOpen = (id: number) => setOpen(open === id ? null : id);

  return (
    <>
      <Accordion
        open={open === 1}
        icon={<Icon id={1} open={open ?? 0} />}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className={`px-[12px] ${
            open === 1 ? "bg-primary-900 border-gray-800 mb-[-16px]" : "border-b border-gray-800 text-black"
          }`}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-col">
            <Typography size={16} weight="medium" className="md:text-[20px]">
              {text}
            </Typography>
            <Typography size={14} weight="medium" className="md:text-[16px] text-gray-500">
              {subtitle}
            </Typography>
          </div>
        </AccordionHeader>

        <AccordionBody>
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-gray-900 w-full mb-[-16px]">
            {languageOptions.length > 0 ? (
              languageOptions.map((lang) => (
                <li key={lang.language_name}>
                  <button
                    onClick={() => handleSelectionChange(lang)}
                    className="w-full h-[64px] md:h-[48px] px-5 bg-white rounded-[10px] border border-gray-800 flex justify-center items-center gap-2.5 hover:bg-secondary-900 hover:text-secondary-500"
                  >
                    <Typography size={16} weight="bold" className="md:text-[12px] text-gray-50">
                      {lang.language_name}
                    </Typography>
                  </button>
                </li>
              ))
            ) : (
              <div className="mx-auto">
                <Typography size={16} weight="bold" className="md:text-[12px]">
                  선택 가능한 언어가 없습니다.
                </Typography>
              </div>
            )}
          </ul>
        </AccordionBody>
      </Accordion>
    </>
  );
};
