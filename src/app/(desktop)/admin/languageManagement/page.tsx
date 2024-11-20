"use client";
import AddLanguageForm from "@/components/admin/languageManagement/AddLanguageForm";
import LanguageTable from "@/components/admin/languageManagement/LanguageTable";
// import { CountriesSelect } from "@/components/CountriesSelect";

const LanguageManagementPage = () => {
  return (
    <div className="flex flex-col items-center">
      <AddLanguageForm />
      {/* <CountriesSelect /> */}
      <LanguageTable />
    </div>
  );
};

export default LanguageManagementPage;
