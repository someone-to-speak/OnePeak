import Link from "next/link";
import React from "react";

const UserManagementPage = () => {
  return (
    <div>
      <p>admin 페이지</p>
      <Link href={"/admin/userManagement"}>사용자관리</Link>
      <Link href={"/admin/blockManagement"}>차단관리</Link>
      <Link href={"/admin/languageManagement"}>언어관리</Link>
      <Link href={"/admin/alarmManagement"}>알람관리</Link>
    </div>
  );
};

export default UserManagementPage;
