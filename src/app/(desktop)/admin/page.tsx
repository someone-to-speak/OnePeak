import Link from "next/link";
import React from "react";

const UserManagementPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <p className="text-3xl font-semibold text-center text-gray-200">Admin 페이지</p>

      <div className="space-y-4">
        <Link
          href="/admin/userManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          사용자 관리
        </Link>
        <Link
          href="/admin/blockManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          차단 관리
        </Link>
        <Link
          href="/admin/languageManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          언어 관리
        </Link>
        <Link
          href="/admin/alarmManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          알람 관리
        </Link>
        <Link
          href="/admin/faqManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          1:1 문의 관리
        </Link>
        <Link
          href="/admin/aiPromptManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          AI-prompt 관리
        </Link>
        <Link
          href="/admin/quizManagement"
          className="block text-xl font-medium text-blue-600 hover:text-blue-800 transition duration-300"
        >
          문제 관리
        </Link>
      </div>
    </div>
  );
};

export default UserManagementPage;
