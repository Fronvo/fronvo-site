import { serverData } from "@/lib/stores";
import { Member } from "@/lib/types";
import { PersonIcon } from "@radix-ui/react-icons";
import { useReadable } from "react-use-svelte-store";

interface Props {
  member: Member;
}

export default function MemberView({ member }: Props) {
  const $serverData = useReadable(serverData);

  function getNameColor(): string {
    const memberRoles = member.roles.map((v) => v.role_id);

    const serverRoles = $serverData.roles;
    const serverRoleIds = serverRoles.map((v) => v.id);

    const usedRoles = memberRoles.filter((v) => serverRoleIds.includes(v));

    if (usedRoles.length === 0) return "";

    const nameColor =
      serverRoles.find((v) => v.id === usedRoles[usedRoles.length - 1])
        ?.hex_color || "";

    return nameColor;
  }

  return (
    <div className="flex items-center hover:bg-accent/50 cursor-pointer w-[90%] ml-2 rounded-md p-2">
      {/* TODO: Online status */}
      {member.server_avatar || member.avatar ? (
        <img
          src={member.server_avatar || member.avatar}
          alt={`${member.id}\'s avatar`}
          className="w-[22px] h-[22px] rounded-full"
        />
      ) : (
        <PersonIcon width={22} height={22} />
      )}

      <div className="flex flex-col">
        <h1
          className="font-semibold ml-2 text-[0.9rem] max-w-[150px] text-ellipsis overflow-hidden"
          style={{
            color: getNameColor(),
            fontWeight: getNameColor() !== "" ? 800 : 500,
          }}
        >
          {member.server_username || member.username}
        </h1>

        {/* TODO: Note / activity */}
      </div>
    </div>
  );
}
