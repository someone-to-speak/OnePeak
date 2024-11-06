// // components/Button.tsx
// import React from "react";

// interface ButtonProps {
//   text: string; // 버튼 텍스트를 위한 prop
//   onClick?: () => void;
//   variant?: "primary" | "secondary" | "outline";
//   size?: "sm" | "md" | "lg";
//   className?: string;
// }

// const Button = ({ text, onClick, variant = "primary", size = "md", className = "" }: ButtonProps) => {
//   // 기본 스타일
//   const baseStyles = " font-lg rounded-md font-medium transition-colors focus:outline-none";

//   // 변형 스타일
//   const variants = {
//     primary: "bg-blue-500 hover:bg-blue-600 text-white",
//     secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
//     outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
//   };

//   return (
//     <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
//       {text}
//     </button>
//   );
// };

// export default Button;
