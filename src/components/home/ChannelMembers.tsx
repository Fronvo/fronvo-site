import { serverData } from "@/lib/stores";
import { useReadable } from "react-use-svelte-store";
import MemberView from "./MemberView";

export default function ChannelMembers() {
  const $serverData = useReadable(serverData);

  return (
    <div className="w-[200px] flex flex-col h-full items-center select-none border-l">
      <h1 className="text-xs font-semibold uppercase opacity-75 w-full mt-3 mb-2 ml-7">
        Members -- {$serverData.members.length}
      </h1>

      <div className="flex flex-col w-full">
        {$serverData.members.map((member) => (
          <MemberView key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
