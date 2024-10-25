import Link from "next/link";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const userManagement = () => {
  return (
    <div>
      <p>aaa</p>
      <Link href={"/admin/userManagement"}>사용자관리</Link>
    </div>
  );
};

export default userManagement;
