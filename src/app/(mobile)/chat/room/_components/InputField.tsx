import { useForm } from "react-hook-form";
import sendIcon from "@/assets/send.svg";
import Image from "next/image";

type FormValues = {
  input: string;
};

const InputField = () => {
  console.log("");
  const { register } = useForm<FormValues>();

  // const onSubmit: SubmitHandler<FormValues> = () => {};

  return (
    <form className="w-full px-4 py-[10px] bg-gray-900">
      <div className="flex gap-[10px] py-2 pr-2 h-[40px] bg-white items-center rounded-[50px]">
        <input className="w-full px-[20px] " {...register("input")} />
        <Image
          className="flex-1 justisfy-center items-center cursor-pointer"
          // onClick={handleSubmit(onSubmit)}
          src={sendIcon}
          alt={""}
          width={24}
          height={26}
        />
      </div>
    </form>
  );
};

export default InputField;
