"use client";
import AddLanguageForm from "@/components/admin/languageManagement/AddLanguageForm";
import LanguageTable from "@/components/admin/languageManagement/LanguageTable";

const LanguageManagementPage = () => {
  return (
    <div className="flex flex-col items-center">
      <AddLanguageForm />
      <LanguageTable />
    </div>
  );
};

export default LanguageManagementPage;
