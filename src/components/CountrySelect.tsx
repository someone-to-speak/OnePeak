import React from "react";
import { Select, Option } from "@material-tailwind/react";
import Image from "next/image";
import { useCountries } from "use-react-countries";

interface Country {
  name: string;
  flags: {
    svg: string;
  };
}

interface CountrySelectProps {
  selectedCountry: string | undefined;
  onCountryChange: (value: string | undefined) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ selectedCountry, onCountryChange }) => {
  const { countries } = useCountries();

  return (
    <Select
      value={selectedCountry}
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
      {countries.map(({ name, flags }: Country) => (
        <Option key={name} value={name} className="flex items-center gap-4">
          <Image src={flags.svg} alt={name} width={20} height={20} className="h-5 w-5 my-2 rounded-full object-cover" />
          {name}
        </Option>
      ))}
    </Select>
  );
};

export default CountrySelect;
