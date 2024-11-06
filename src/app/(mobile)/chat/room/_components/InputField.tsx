import { SubmitHandler, useForm } from "react-hook-form";
import ArrowUp from "@/assets/arrow-Up.svg";
import Image from "next/image";

type FormValues = {
  input: string;
};

const InputField = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = () => {};

  return (
    <form className="w-full px-4 py-[10px] bg-gray-400" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2 h-[40px]">
        <input className="w-full" {...register("input")} />
        {/* <Image
          className="flex-1 justisfy-center items-center cursor-pointer"
          onClick={handleSubmit(onSubmit)}
          src={ArrowUp}
          alt={""}
          width={24}
          height={26}
        /> */}
      </div>
    </form>
  );
};

export default InputField;
