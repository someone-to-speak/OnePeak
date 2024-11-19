// import React from "react";
// import { Typography } from "./ui/typography";
// import {
//   Accordion,
//   AccordionHeader,
//   AccordionBody,
// } from "@material-tailwind/react";
// import type { AccordionProps } from "@material-tailwind/react";

// function Icon({ id, open }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={2}
//       stroke="currentColor"
//       className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
//     </svg>
//   );
// }

// interface LanguageOption {
//   language_name: string;
// }

// interface AccordionProps {
//   text: string;
//   subtitle: string;
//   languageOptions: LanguageOption[];
//   handleSelectionChange: (lang: LanguageOption) => void;
// }

// const AccordionComponent: React.FC<AccordionProps> = ({ text, subtitle, languageOptions, handleSelectionChange }) => {
//   const [open, setOpen] = React.useState(0);
//   const handleOpen = (value) => setOpen(open === value ? 0 : value);

//   return (
//     <div className="border-b border-gray-800">
//       <div className="py-5">
//       <Accordion open={open === 1} icon={<Icon id={1} open={open} />} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//         <AccordionHeader onClick={() => handleOpen(1)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
//           <Typography size={16} weight="medium">
//           {text}
//         </Typography>
//         <Typography size={14} weight="medium" className="text-gray-500">
//           {subtitle}
//         </Typography>
//         </AccordionHeader>
//         <AccordionBody>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 bg-gray-900 rounded w-full">
//         {languageOptions.length > 0 ? (
//           languageOptions.map((lang) => (
//             <div key={lang.language_name} className="mb-2">
//               <button
//                 onClick={() => handleSelectionChange(lang)}
//                 className="w-full h-[64px] md:h-[48px] px-5 bg-white rounded-[10px] border border-gray-800 flex justify-center items-center gap-2.5 hover:bg-secondary-900 hover:text-secondary-500"
//               >
//                 <Typography weight="bold" className="text-[16px] md:text-[12px]">
//                   {lang.language_name}
//                 </Typography>
//               </button>
//             </div>
//           ))
//         ) : (
//           <Typography size={16} className="text-gray-500">
//             결과가 없습니다.
//           </Typography>
//         )}
//       </div>
//         </AccordionBody>
//         </Accordion>
//       </div>

//     </div>
//   );
// };

// export default AccordionComponent;
import React from "react";
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

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
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({
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
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-col">
            {text}
            <p className="text-gray-500 mb-4">{subtitle}</p>
          </div>
        </AccordionHeader>
        <AccordionBody>
          <ul className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-gray-900 rounded p-4">
            {languageOptions.length > 0 ? (
              languageOptions.map((lang) => (
                <li key={lang.language_name}>
                  <button
                    onClick={() => handleSelectionChange(lang)}
                    className="w-full h-[64px] md:h-[48px] px-5 bg-white rounded-[10px] border border-gray-800 flex justify-center items-center gap-2.5 hover:bg-secondary-900 hover:text-secondary-500"
                  >
                    <span className="font-bold text-[16px] md:text-[12px]">{lang.language_name}</span>
                  </button>
                </li>
              ))
            ) : (
              <li>
                <p className="text-gray-500 text-center">결과가 없습니다.</p>
              </li>
            )}
          </ul>
        </AccordionBody>
      </Accordion>
    </>
  );
};

export default CustomAccordion;
