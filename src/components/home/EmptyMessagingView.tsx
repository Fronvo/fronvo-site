import { PaperPlaneIcon } from "@radix-ui/react-icons";

export default function EmptyMessagingView() {
    return (
      <div className="mobile:hidden flex flex-col w-max m-auto translate-x-[-175px] pb-[100px]">
        <PaperPlaneIcon className="w-[164px] h-[164px] m-auto mb-3 text-primary" />

        <h1 className="m-auto mb-6 font-medium select-none">
          Select a Server channel or DM to get started
        </h1>

        <h1 className="w-[125px] h-[30px] m-auto"></h1>
      </div>
    );
}