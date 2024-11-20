import React from "react";
import { Select, Option } from "@material-tailwind/react";
import Image from "next/image";
import { useCountries } from "use-react-countries";

interface Country {
  name: string;
  languages: string[];
  flags: {
    svg: string;
  };
}

interface CountryLanguagesSelectProps {
  selectedCountryLanguages: string | undefined;
  onCountryChange: (value: string | undefined) => void;
}

const CountrySelect: React.FC<CountryLanguagesSelectProps> = ({ selectedCountryLanguages, onCountryChange }) => {
  const { countries } = useCountries();

  // 중복 언어 제거 및 국가 데이터 매핑
  const uniqueLanguages = countries.reduce((acc: Map<string, Country>, country) => {
    country.languages.forEach((language) => {
      if (!acc.has(language)) {
        acc.set(language, country); // 언어별 국가 정보 저장
      }
    });
    return acc;
  }, new Map<string, Country>());

  const languageList = Array.from(uniqueLanguages.entries()); // Map을 배열로 변환

  return (
    <Select
      value={selectedCountryLanguages}
      onChange={onCountryChange}
      placeholder="국가를 선택해주세요"
      selected={(element) =>
        element &&
        React.cloneElement(element, {
          disabled: true,
          className: "flex items-center"
        })
      }
      className="max-h-10 py-auto"
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {languageList.map(([language, country]) => (
        <Option key={language} value={language} className="flex items-center gap-4">
          <Image
            src={country.flags.svg}
            alt={language}
            width={20}
            height={20}
            className="h-5 w-5 my-2 rounded-full object-cover"
          />
          {language}
        </Option>
      ))}
    </Select>
  );
};

export default CountrySelect;
