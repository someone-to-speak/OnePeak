// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { insertLanguageInfo } from "@/api/supabase/admin";
// import CountrySelect from "./CountrySelect";
// import { useCountries } from "use-react-countries";
// import Button from "./ui/button";

// export function CountriesSelect() {
//   const { countries } = useCountries();
//   const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
//   const queryClient = useQueryClient();

//   const { mutate } = useMutation({
//     mutationFn: async ({ name, imageUrl }: { name: string; imageUrl: string }) => {
//       await insertLanguageInfo({ language: name, imageUrl });
//     },
//     onSuccess: () => {
//       alert("선택된 국가를 저장하였습니다.");
//       queryClient.invalidateQueries({ queryKey: ["countries"] });
//     },
//     onError: () => {
//       alert("선택된 국가를 저장하는 데 실패하였습니다.");
//     }
//   });

//   const handleSelectChange = (value: string | undefined) => {
//     setSelectedCountry(value);
//   };

//   const handleSubmit = () => {
//     if (!selectedCountry) {
//       alert("국가를 선택해 주세요");
//       return;
//     }

//     const selectedCountryData = countries.find((country) => country.name === selectedCountry);

//     if (!selectedCountryData) {
//       alert("선택된 국가 데이터를 찾을 수 없습니다.");
//       return;
//     }

//     const { name, flags } = selectedCountryData;

//     mutate({ name, imageUrl: flags.svg });
//   };

//   return (
//     <div className="w-full flex flex-row gap-[30px] justify-between items-center bg-white my-[20px] px-[16px]">
//       <CountrySelect selectedCountry={selectedCountry} onCountryChange={handleSelectChange} />
//       <Button onClick={handleSubmit} text="선택된 국가 저장" />
//     </div>
//   );
// }

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertLanguageInfo } from "@/api/supabase/admin";
import CountrySelect from "./CountrySelect";
import { useCountries } from "use-react-countries";
import Button from "./ui/button";

export function CountriesSelect() {
  const { countries } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ language, imageUrl }: { language: string; imageUrl: string }) => {
      await insertLanguageInfo({ language, imageUrl });
    },
    onSuccess: () => {
      alert("선택된 국가를 저장하였습니다.");
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: () => {
      alert("선택된 국가를 저장하는 데 실패하였습니다.");
    }
  });

  const handleSelectChange = (value: string | undefined) => {
    setSelectedCountry(value);
  };

  const handleSubmit = () => {
    if (!selectedCountry) {
      alert("국가를 선택해 주세요");
      return;
    }

    const selectedCountryData = countries.find((country) => country.name === selectedCountry);

    if (!selectedCountryData) {
      alert("선택된 국가 데이터를 찾을 수 없습니다.");
      return;
    }

    const { languages, flags } = selectedCountryData;

    // 첫 번째 언어를 선택하여 mutate 호출
    const primaryLanguage = languages[0]; // 첫 번째 언어 선택
    mutate({ language: primaryLanguage, imageUrl: flags.svg });
  };

  return (
    <div className="w-full flex flex-row gap-[30px] justify-between items-center bg-white my-[20px] px-[16px]">
      <CountrySelect selectedCountry={selectedCountry} onCountryChange={handleSelectChange} />
      <Button onClick={handleSubmit} text="선택된 국가 저장" />
    </div>
  );
}
