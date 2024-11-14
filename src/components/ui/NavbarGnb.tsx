import Link from "next/link";
import { usePathname } from "next/navigation";
import home from "@/assets/home-icon.svg";
import lesson from "@/assets/lesson-icon.svg";
import chat from "@/assets/chat-icon.svg";
import chal from "@/assets/chal-icon.svg";
import mypage from "@/assets/mypage-icon.svg";
import Image from "next/image";

const NavbarGnb = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: home, label: "home" },
    { href: "/lesson", icon: lesson, label: "lesson" },
    { href: "/chat", icon: chat, label: "chat" },
    { href: "/challenge", icon: chal, label: "chal" },
    { href: "/myPage", icon: mypage, label: "mypage" }
  ];

  return (
    <div className="relative z-[200]">
      <div className="w-full h-20 mx-auto my-0 px-[24px] pt-[11px] pb-safe-offset-0 fixed left-0 right-0 bottom-0 bg-[#fcfcfc] border-t border-[#f3f3f3] flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center h-[55px] font-semibold text-[11px] basis-1/5 decoration-inherit`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              className={`w-[43px] h-[35px] ${pathname === item.href ? "opacity-100" : "opacity-50"}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavbarGnb;
