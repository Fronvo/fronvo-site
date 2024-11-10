"use client";

import {
  appVersion,
  assigningRoleData,
  assigningRoles,
  bannedMemberData,
  banningMember,
  banningMembers,
  changingPassword,
  channelData,
  creatingChannel,
  creatingRole,
  creatingServer,
  deletingAccount,
  deletingChannel,
  deletingChannelData,
  deletingRole,
  deletingRoleData,
  deletingServer,
  editingChannel,
  editingChannelData,
  editingRole,
  editingRoleData,
  editingServer,
  joiningServer,
  kickingMember,
  leavingServer,
  loggingOut,
  managingChannels,
  managingMembers,
  managingRoles,
  memberData,
  requestingData,
  serverData,
  settingsOpen,
  sharingPost,
  switchingAccounts,
  transferringServer,
  unbanningMember,
  updatingProfileNote,
  userData,
} from "@/lib/stores";
import { useReadable, useWritable } from "react-use-svelte-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleBackslashIcon,
  Cross1Icon,
  Cross2Icon,
  DoubleArrowUpIcon,
  GearIcon,
  HamburgerMenuIcon,
  ImageIcon,
  Pencil1Icon,
  PersonIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  BannedMember,
  Channel,
  DMOption,
  FilterOption,
  Member,
  MemberRole,
  Role,
  Server,
  TabOption,
  ThemeOption,
  UserData,
} from "@/lib/types";
import { useTheme } from "next-themes";
import SettingsChoice from "../settings/SettingsChoice";
import SettingsHeader from "../settings/SettingsHeader";
import SettingsSubheader from "../settings/SettingsSubheader";
import SettingsSeparator from "../settings/SettingsSeparator";
import { DialogClose } from "@radix-ui/react-dialog";
import AccountSwitchView from "./AccountSwitchView";
import { toast } from "sonner";
import ImageKit from "imagekit-javascript";
import { v4 } from "uuid";
import { Textarea } from "../ui/textarea";
import { DataTable } from "../global/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableSortableHeader } from "../global/DataTableSortableHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { normaliseDate } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";

type SettingsHeader = "Account" | "Privacy" | "Appearance" | "About";

export default function Dialogs() {
  const { setTheme, theme } = useTheme();

  const [disabled, setDisabled] = useState(false);
  const [selectedHeader, setSelectedHeader] =
    useState<SettingsHeader>("Account");
  const [$userData, setUserData] = useWritable(userData);

  const $appVersion = useReadable(appVersion);

  const [themeOption, setThemeOption] = useState<ThemeOption>(
    theme === "light" ? 0 : 1
  );
  const [tabOption, setTabOption] = useState<TabOption>($userData.default_tab);

  const [dmOption, setDMOption] = useState<DMOption>($userData.dm_option);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    $userData.filter_option
  );

  const [moreShown, setMoreShown] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [extraInput, setExtraInput] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postData, setPostData] = useState("");

  const [serverName, setServerName] = useState("");
  const [serverAvatarData, setServerAvatarData] = useState("");
  const [serverBannerData, setServerBannerData] = useState("");

  const [inviteLink, setInviteLink] = useState("");

  const [descriptionChanged, setDescriptionChanged] = useState(false);

  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  const [roleName, setRoleName] = useState("");
  const [roleColor, setRoleColor] = useState("");
  const [roleMembers, setRoleMembers] = useState<string[]>([]);

  // Profile options
  const [$updatingProfileNote, setUpdatingProfileNote] =
    useWritable(updatingProfileNote);
  const [$sharingPost, setSharingPost] = useWritable(sharingPost);
  const [$settingsOpen, setSettingsOpen] = useWritable(settingsOpen);
  const [$switchingAccounts, setSwitchingAccounts] =
    useWritable(switchingAccounts);
  const [$loggingOut, setLoggingOut] = useWritable(loggingOut);
  const [$changingPassword, setChangingPassword] =
    useWritable(changingPassword);
  const [$deletingAccount, setDeletingAccount] = useWritable(deletingAccount);
  const [$requestingData, setRequestingData] = useWritable(requestingData);
  const [$creatingServer, setCreatingServer] = useWritable(creatingServer);
  const [$joiningServer, setJoiningServer] = useWritable(joiningServer);
  const [$editingServer, setEditingServer] = useWritable(editingServer);
  const [$deletingServer, setDeletingServer] = useWritable(deletingServer);
  const [$leavingServer, setLeavingServer] = useWritable(leavingServer);
  const [$serverData, setServerData] = useWritable(serverData);
  const [$channelData, setChannelData] = useWritable(channelData);
  const [$creatingChannel, setCreatingChannel] = useWritable(creatingChannel);
  const [$editingChannel, setEditingChannel] = useWritable(editingChannel);
  const [$editingChannelData, setEditingChannelData] =
    useWritable(editingChannelData);
  const [$deletingChannel, setDeletingChannel] = useWritable(deletingChannel);
  const [$deletingChannelData, setDeletingChannelData] =
    useWritable(deletingChannelData);
  const [$managingMembers, setManagingMembers] = useWritable(managingMembers);
  const [$banningMembers, setBanningMembers] = useWritable(banningMembers);
  const [$kickingMember, setKickingMember] = useWritable(kickingMember);
  const [$banningMember, setBanningMember] = useWritable(banningMember);
  const [$unbanningMember, setUnbanningMember] = useWritable(unbanningMember);
  const [$memberData, setMemberData] = useWritable(memberData);
  const [$bannedMemberData, setBannedMemberData] =
    useWritable(bannedMemberData);
  const [$transferringServer, setTransferringServer] =
    useWritable(transferringServer);
  const [$creatingRole, setCreatingRole] = useWritable(creatingRole);
  const [$editingRole, setEditingRole] = useWritable(editingRole);
  const [$editingRoleData, setEditingRoleData] = useWritable(editingRoleData);
  const [$assigningRole, setAssigningRole] = useWritable(assigningRoles);
  const [$assigningRoleData, setAssigningRoleData] =
    useWritable(assigningRoleData);
  const [$deletingRole, setDeletingRole] = useWritable(deletingRole);
  const [$deletingRoleData, setDeletingRoleData] =
    useWritable(deletingRoleData);
  const [$managingRoles, setManagingRoles] = useWritable(managingRoles);
  const [$managingChannels, setManagingChannels] =
    useWritable(managingChannels);

  // Settings
  const settingHeaders: SettingsHeader[] = [
    "Account",
    "Appearance",
    "Privacy",
    "About",
  ];

  const memberColumns: ColumnDef<Member>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Username" />
      ),
      cell({ getValue, row }) {
        return (
          <h1 className="ml-5">
            {row.original.server_username || (getValue() as string)}
          </h1>
        );
      },
    },
    {
      accessorKey: "roles",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Roles" />
      ),
      cell({ getValue }) {
        return (
          <h1 className="ml-2">
            {(getValue() as MemberRole[])
              .filter((v) => v.server_id === $serverData.id)
              .map(
                (v) => $serverData.roles.find((v2) => v2.id === v.role_id)?.name
              )
              .join(", ")}
          </h1>
        );
      },
    },
    {
      accessorKey: "joined_at",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Joined at" />
      ),
      cell({ getValue }) {
        return normaliseDate(getValue() as string);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{member.id}</DropdownMenuLabel>
              <DropdownMenuItem>
                <PersonIcon className="mr-2" /> View profile
              </DropdownMenuItem>

              {member.id !== $serverData?.owner_id && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      setMemberData(member);
                      setKickingMember(true);
                    }}
                  >
                    <Cross2Icon className="mr-2" color={"red"} /> Kick
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      setMemberData(member);
                      setBanningMember(true);
                    }}
                  >
                    <CircleBackslashIcon className="mr-2" color={"red"} /> Ban
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      setMemberData(member);
                      setTransferringServer(true);
                    }}
                  >
                    <DoubleArrowUpIcon className="mr-2" /> Transfer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const bannedColumns: ColumnDef<BannedMember>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Username" />
      ),
      cell({ getValue }) {
        return <h1 className="ml-5">{getValue() as string}</h1>;
      },
    },
    {
      accessorKey: "banned_at",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Banned at" />
      ),
      cell({ getValue }) {
        return normaliseDate(getValue() as string);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{member.id}</DropdownMenuLabel>
              <DropdownMenuItem>
                <PersonIcon className="mr-2" /> View profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setBannedMemberData(member);
                  setUnbanningMember(true);
                }}
              >
                <CircleBackslashIcon className="mr-2" color={"red"} /> Unban
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const roleColumns: ColumnDef<Role>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Role name" />
      ),
      cell({ getValue }) {
        return <h1 className="ml-4">{getValue() as string}</h1>;
      },
    },
    {
      accessorKey: "hex_color",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Color" />
      ),
      cell({ getValue }) {
        return (
          <TooltipProvider disableHoverableContent delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  style={{ background: getValue() as string }}
                  className="w-8 h-8 ml-3 rounded-sm drop-shadow-xl cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(getValue() as string);

                    toast.success("Color copied to clipboard!");
                  }}
                />
              </TooltipTrigger>

              <TooltipContent className="ml-3">Click to copy</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Created at" />
      ),
      cell({ getValue }) {
        return <h1 className="ml-2">{normaliseDate(getValue() as string)}</h1>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{role.name}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditingRoleData(role);
                  setEditingRole(true);
                }}
              >
                <Pencil1Icon className="mr-2" /> Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setDeletingRoleData(role);
                  setDeletingRole(true);
                }}
              >
                <TrashIcon className="mr-2" color={"red"} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const channelColumns: ColumnDef<Channel>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Channel name" />
      ),
      cell({ getValue }) {
        return <h1 className="ml-5">{getValue() as string}</h1>;
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Description" />
      ),
      cell({ getValue }) {
        return <h1 className="ml-2">{getValue() as string}</h1>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableSortableHeader column={column} title="Created at" />
      ),
      cell({ getValue }) {
        return normaliseDate(getValue() as string);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const channel = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{channel.name}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditingChannelData(channel);
                  setEditingChannel(true);
                }}
              >
                <Pencil1Icon className="mr-2" /> Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setDeletingChannelData(channel);
                  setDeletingChannel(true);
                }}
              >
                <TrashIcon className="mr-2" color={"red"} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function updateProfileNote() {
    const note = extraInput;

    if (note.length == 0 || note === $userData.note) {
      setUpdatingProfileNote(false);

      return;
    }

    const tempNote = $userData.note;

    // Dialog button hidden till dialog close
    setTimeout(() => {
      setUserData({
        ...$userData,
        note,
      });
    }, 100);

    setUpdatingProfileNote(false);

    const res = await fetch("api/me/note", {
      method: "POST",

      body: JSON.stringify({
        note,
      }),

      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    // Revert if failed
    if (!res.ok) {
      setUserData({
        ...$userData,
        note: tempNote,
      });
    }
  }

  async function clearProfileNote() {
    const tempNote = $userData.note;

    setUserData({
      ...$userData,
      note: "",
    });

    setUpdatingProfileNote(false);

    const res = await fetch("api/me/note", {
      method: "POST",

      body: JSON.stringify({
        note: "",
      }),

      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    // Revert if failed
    if (!res.ok) {
      setUserData({
        ...$userData,
        note: tempNote,
      });
    }
  }

  async function sharePost() {
    setDisabled(true);

    toast.promise(sharePostPromise, {
      loading: "Sharing post...",
      success: () => "Post shared!",
    });

    async function sharePostPromise() {
      const authRes = (await (await fetch("uploadInit")).json()) as {
        publicKey: string;
        urlEndpoint: string;
      };

      const imagekit = new ImageKit({
        publicKey: authRes.publicKey,
        urlEndpoint: authRes.urlEndpoint,
      });

      const auth = (await (await fetch("upload")).json()) as {
        expire: number;
        token: string;
        signature: string;
      };

      const attachment = (
        await imagekit.upload({
          file: postData,
          fileName: v4(),
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          folder: `posts/${$userData.id.replaceAll(".", "_")}`,
          useUniqueFileName: false,
        })
      ).url;

      await fetch("api/me/post", {
        method: "POST",
        headers: {
          Authorization: Cookies.get("accessToken") as string,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          text: postTitle,
          attachment,
        }),
      });

      setDisabled(false);
      setSharingPost(false);

      setTimeout(() => {
        setPostTitle("");
        setPostData("");
      }, 100);
    }
  }

  async function updateTabOption(newOption: TabOption) {
    localStorage.setItem("fronvo_defaultTab", `${newOption}`);
  }

  async function updateDMOption(newOption: DMOption) {
    await fetch("api/me/dm", {
      method: "POST",

      body: JSON.stringify({
        dmOption: newOption,
      }),

      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });
  }

  async function updateFilterOption(newOption: FilterOption) {
    await fetch("api/me/filter", {
      method: "POST",

      body: JSON.stringify({
        filterOption: newOption,
      }),

      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });
  }

  async function requestData() {
    setDisabled(true);

    const res = await fetch("api/me/data", {
      method: "POST",
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    if (res.status !== 200) {
      toast.error((await res.json()).errors[0].message);
    } else {
      setRequestingData(false);

      toast.success("Your data has been sent!");
    }

    setDisabled(false);
  }

  function logout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    localStorage.removeItem("fronvo_defaultTab");

    location.href = "/auth";
  }

  async function switchAccount() {}

  async function changePassword() {
    setDisabled(true);

    const res = await fetch("api/me/password", {
      method: "POST",
      body: JSON.stringify({
        password: passwordInput,
        newPassword: extraInput,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    if (res.status !== 200) {
      toast.error((await res.json()).errors[0].message);
    } else {
      logout();
    }

    setDisabled(false);
  }

  async function deleteAccount() {
    setDisabled(true);

    const res = await fetch("api/login", {
      method: "DELETE",
      body: JSON.stringify({
        password: passwordInput,
      }),
      headers: {
        Authorization: Cookies.get("accessToken") as string,
        "content-type": "application/json",
      },
    });

    if (res.status !== 200) {
      toast.error((await res.json()).errors[0].message);
    } else {
      logout();
    }

    setDisabled(false);
  }

  async function createServer() {
    if (!serverName) {
      toast.error("Server name is required");
      return;
    }

    setDisabled(true);

    toast.promise(createServerPromise, {
      loading: "Creating server...",
      success: () => "Server created!",
    });

    async function createServerPromise() {
      const finalDict: { [key: string]: any } = { name: serverName };

      if (serverAvatarData) {
        const authRes = (await (await fetch("uploadInit")).json()) as {
          publicKey: string;
          urlEndpoint: string;
        };

        const imagekit = new ImageKit({
          publicKey: authRes.publicKey,
          urlEndpoint: authRes.urlEndpoint,
        });

        const auth = (await (await fetch("upload")).json()) as {
          expire: number;
          token: string;
          signature: string;
        };

        const avatar = (
          await imagekit.upload({
            file: serverAvatarData,
            fileName: v4(),
            token: auth.token,
            signature: auth.signature,
            expire: auth.expire,
            folder: `avatars/`,
            useUniqueFileName: false,
          })
        ).url;

        finalDict["avatar"] = avatar;
      }

      if (serverBannerData) {
        const authRes = (await (await fetch("uploadInit")).json()) as {
          publicKey: string;
          urlEndpoint: string;
        };

        const imagekit = new ImageKit({
          publicKey: authRes.publicKey,
          urlEndpoint: authRes.urlEndpoint,
        });

        const auth = (await (await fetch("upload")).json()) as {
          expire: number;
          token: string;
          signature: string;
        };

        const banner = (
          await imagekit.upload({
            file: serverBannerData,
            fileName: v4(),
            token: auth.token,
            signature: auth.signature,
            expire: auth.expire,
            folder: `banners/`,
            useUniqueFileName: false,
          })
        ).url;

        finalDict["banner"] = banner;
      }

      const res = await fetch("/api/servers/create", {
        method: "POST",
        body: JSON.stringify(finalDict),
        headers: {
          Authorization: Cookies.get("accessToken") as string,
          "content-type": "application/json",
        },
      });

      if (res.status === 200) {
        const userData = (
          await (
            await fetch("api/me", {
              headers: {
                Authorization: Cookies.get("accessToken") as string,
              },
            })
          ).json()
        ).profileData as UserData;

        setUserData(userData);
      }

      setDisabled(false);
      setCreatingServer(false);
      setServerName("");
      setServerAvatarData("");
      setServerBannerData("");
    }
  }

  async function joinServer() {
    if (!inviteLink || inviteLink?.length !== 8) {
      toast.error("Invite is required");
      return;
    }

    const localServer = $userData.servers.find((v) => v.invite === inviteLink);

    if (localServer) {
      setServerData(localServer);
      setJoiningServer(false);

      return;
    }

    setDisabled(true);

    toast.promise(joinServerPromise, {
      loading: "Joining server...",
      success: () => "Joined server!",
      error: (e) => e,
    });

    async function joinServerPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/servers/join", {
          method: "POST",
          body: JSON.stringify({
            invite: inviteLink,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.find((v) => v.invite === inviteLink) as Server
          );
          setJoiningServer(false);
          setInviteLink("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function editServer() {
    if (!serverName) {
      toast.error("Server name is required");
      return;
    }

    setDisabled(true);

    toast.promise(editServerPromise, {
      loading: "Updating server...",
      success: () => "Server updated!",
      error: (e) => `${e}`,
    });

    async function editServerPromise() {
      return new Promise(async (resolve, reject) => {
        const finalDict: { [key: string]: any } = {
          id: $serverData.id,
          name: serverName,
        };

        if (serverAvatarData) {
          if (serverAvatarData?.includes("imagekit")) {
            if (finalDict["resetAvatar"]) delete finalDict["resetAvatar"];
            finalDict["avatar"] = serverAvatarData;
          } else {
            const authRes = (await (await fetch("uploadInit")).json()) as {
              publicKey: string;
              urlEndpoint: string;
            };

            const imagekit = new ImageKit({
              publicKey: authRes.publicKey,
              urlEndpoint: authRes.urlEndpoint,
            });

            const auth = (await (await fetch("upload")).json()) as {
              expire: number;
              token: string;
              signature: string;
            };

            const avatar = (
              await imagekit.upload({
                file: serverAvatarData,
                fileName: v4(),
                token: auth.token,
                signature: auth.signature,
                expire: auth.expire,
                folder: `avatars/`,
                useUniqueFileName: false,
              })
            ).url;

            if (finalDict["resetAvatar"]) delete finalDict["resetAvatar"];
            finalDict["avatar"] = avatar;
          }
        } else {
          if (finalDict["avatar"]) delete finalDict["avatar"];
          finalDict["resetAvatar"] = true;
        }

        if (serverBannerData) {
          if (serverBannerData?.includes("imagekit")) {
            if (finalDict["resetBanner"]) delete finalDict["resetBanner"];
            finalDict["banner"] = serverBannerData;
          } else {
            const authRes = (await (await fetch("uploadInit")).json()) as {
              publicKey: string;
              urlEndpoint: string;
            };

            const imagekit = new ImageKit({
              publicKey: authRes.publicKey,
              urlEndpoint: authRes.urlEndpoint,
            });

            const auth = (await (await fetch("upload")).json()) as {
              expire: number;
              token: string;
              signature: string;
            };

            const banner = (
              await imagekit.upload({
                file: serverBannerData,
                fileName: v4(),
                token: auth.token,
                signature: auth.signature,
                expire: auth.expire,
                folder: `banners/`,
                useUniqueFileName: false,
              })
            ).url;

            if (finalDict["resetBanner"]) delete finalDict["resetBanner"];
            finalDict["banner"] = banner;
          }
        } else {
          if (finalDict["banner"]) delete finalDict["banner"];
          finalDict["resetBanner"] = true;
        }

        const res = await fetch("/api/servers/edit", {
          method: "POST",
          body: JSON.stringify(finalDict),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          const newServerData = (await res.json())
            .serverData as Partial<Server>;

          setServerData({
            ...$serverData,
            ...newServerData,
          });

          let newServers = $userData.servers;

          newServers = newServers.map((v) => {
            if (v.id === $serverData.id) {
              return { ...$serverData, ...newServerData };
            } else return v;
          });

          setUserData({
            ...$userData,
            servers: newServers,
          });

          resolve("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
        setEditingServer(false);
        setServerName("");
        setServerAvatarData("");
        setServerBannerData("");
      });
    }
  }

  async function deleteServer() {
    setDisabled(true);

    toast.promise(deleteServerPromise, {
      loading: "Deleting server...",
      success: () => "Deleted server!",
      error: (e) => `${e}`,
    });

    async function deleteServerPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("api/servers/delete", {
          method: "DELETE",
          body: JSON.stringify({
            id: $serverData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);

          // @ts-ignore
          setServerData(undefined);
          setDeletingServer(false);

          resolve("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function leaveServer() {
    setDisabled(true);

    toast.promise(leaveServerPromise, {
      loading: "Leaving server...",
      success: () => "Left server!",
      error: (e) => `${e}`,
    });

    async function leaveServerPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("api/servers/leave", {
          method: "DELETE",
          body: JSON.stringify({
            id: $serverData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);

          // @ts-ignore
          setServerData(undefined);
          setLeavingServer(false);

          resolve("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function transferServer() {
    setDisabled(true);

    toast.promise(transferServerPromise, {
      loading: `Transferring server to ${$memberData.id}...`,
      success: () => `Transferred server to ${$memberData.id}!`,
      error: (e) => `${e}`,
    });

    async function transferServerPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("api/servers/transfer", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            memberId: $memberData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);

          // @ts-ignore
          setServerData(undefined);
          setTransferringServer(false);
          setManagingMembers(false);

          resolve("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function createChannel() {
    if (!channelName) {
      toast.error("Channel name is required");
      return;
    }

    setDisabled(true);

    toast.promise(createChannelPromise, {
      loading: "Creating channel...",
      success: () => "Channel created!",
      error: (e) => e,
    });

    async function createChannelPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/channels/create", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            name: channelName,
            description: channelDescription,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setCreatingChannel(false);
          setChannelName("");
          setChannelDescription("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function editChannel() {
    setDisabled(true);

    toast.promise(editChannelPromise, {
      loading: "Updating channel...",
      success: () => "Channel updated!",
      error: (e) => e,
    });

    async function editChannelPromise() {
      return new Promise(async (resolve, reject) => {
        const newChannelData: Channel = {
          id: $editingChannelData.id,
          name: channelName || $editingChannelData.name,
          description: descriptionChanged
            ? channelDescription
            : $editingChannelData.description,
          created_at: $editingChannelData.created_at,
          server_id: $editingChannelData.server_id,
        };

        const res = await fetch("/api/channels/edit", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            channelId: newChannelData.id,
            name: newChannelData.name,
            description: newChannelData.description,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );

          if ($channelData.id === $editingChannelData.id) {
            setChannelData(newChannelData);
          }

          setEditingChannel(false);
          setChannelName("");
          setChannelDescription("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function deleteChannel() {
    setDisabled(true);

    toast.promise(deleteChannelPromise, {
      loading: "Deleting channel...",
      success: () => "Channel deleted!",
      error: (e) => e,
    });

    async function deleteChannelPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/channels/delete", {
          method: "DELETE",
          body: JSON.stringify({
            id: $serverData.id,
            channelId: $deletingChannelData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );

          if ($channelData.id === $deletingChannelData.id) {
            // @ts-ignore
            setChannelData(undefined);
          }

          setDeletingChannel(false);
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function kickMember() {
    setDisabled(true);

    toast.promise(kickMemberPromise, {
      loading: `Kicking ${$memberData.id}...`,
      success: () => `${$memberData.id} kicked!`,
      error: (e) => e,
    });

    async function kickMemberPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/members/kick", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            memberId: $memberData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setKickingMember(false);
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function banMember() {
    setDisabled(true);

    toast.promise(banMemberPromise, {
      loading: `Banning ${$memberData.id}...`,
      success: () => `${$memberData.id} banned!`,
      error: (e) => e,
    });

    async function banMemberPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/members/ban", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            memberId: $memberData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setBanningMember(false);
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function unbanMember() {
    setDisabled(true);

    toast.promise(unbanMemberPromise, {
      loading: `Unbanning ${$bannedMemberData.id}...`,
      success: () => `${$bannedMemberData.id} unbanned!`,
      error: (e) => e,
    });

    async function unbanMemberPromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/members/unban", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            memberId: $bannedMemberData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setUnbanningMember(false);
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function createRole() {
    if (!roleName) {
      toast.error("Role name is required");
      return;
    }

    setDisabled(true);

    toast.promise(createRolePromise, {
      loading: "Creating role...",
      success: () => "Role created!",
      error: (e) => e,
    });

    async function createRolePromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/roles/create", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            name: roleName,
            color: roleColor || "#ffffff",
            members: roleMembers,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setCreatingRole(false);
          setRoleName("");
          setRoleColor("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function editRole() {
    setDisabled(true);

    toast.promise(editRolePromise, {
      loading: "Updating role...",
      success: () => "Role updated!",
      error: (e) => e,
    });

    async function editRolePromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/roles/edit", {
          method: "POST",
          body: JSON.stringify({
            id: $serverData.id,
            roleId: $editingRoleData.id,
            name: roleName || $editingRoleData.name,
            color: roleColor || $editingRoleData.hex_color,
            members: roleMembers,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setEditingRole(false);
          setRoleName("");
          setRoleColor("");
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  async function deleteRole() {
    setDisabled(true);

    toast.promise(deleteRolePromise, {
      loading: "Deleting role...",
      success: () => "Role deleted!",
      error: (e) => e,
    });

    async function deleteRolePromise() {
      return new Promise(async (resolve, reject) => {
        const res = await fetch("/api/roles/delete", {
          method: "DELETE",
          body: JSON.stringify({
            id: $serverData.id,
            roleId: $deletingRoleData.id,
          }),
          headers: {
            Authorization: Cookies.get("accessToken") as string,
            "content-type": "application/json",
          },
        });

        if (res.status === 200) {
          resolve("");

          const userData = (
            await (
              await fetch("api/me", {
                headers: {
                  Authorization: Cookies.get("accessToken") as string,
                },
              })
            ).json()
          ).profileData as UserData;

          setUserData(userData);
          setServerData(
            userData.servers.filter((v) => v.id === $serverData.id)[0]
          );
          setDeletingRole(false);
        } else {
          reject((await res.json()).errors[0].message);
        }

        setDisabled(false);
      });
    }
  }

  // Update on theme change
  useEffect(() => {
    setThemeOption(theme === "light" ? 0 : 1);
  }, [theme]);

  useEffect(() => {
    if ($editingServer) {
      setServerName($serverData.name);
      setServerAvatarData($serverData.avatar);
      setServerBannerData($serverData.banner);
    }
  }, [$editingServer]);

  useEffect(() => {
    setRoleMembers([]);
  }, [$creatingRole]);

  useEffect(() => {
    setRoleMembers(
      $serverData?.members
        .filter((v) =>
          v.roles.map((v) => v.role_id).includes($editingRoleData.id)
        )
        .map((v) => v.id)
    );
  }, [$editingRole]);

  return (
    <>
      <Dialog open={$updatingProfileNote} onOpenChange={setUpdatingProfileNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile note</DialogTitle>
            <DialogDescription>Visible to everyone</DialogDescription>
          </DialogHeader>
          <div className="flex">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Note</Label>
              <Input
                defaultValue={$userData.note}
                maxLength={30}
                className="col-span-3 w-full"
                onKeyDown={(e) => e.key == "Enter" && updateProfileNote()}
                onInput={(e) => {
                  // @ts-ignore
                  setExtraInput(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            {$userData.note && (
              <>
                <Button variant={"outline"} onClick={clearProfileNote}>
                  <Cross2Icon className="mr-2" />
                  Clear note
                </Button>

                <span className="flex-1" />
              </>
            )}

            <Button
              disabled={disabled}
              type="submit"
              onClick={updateProfileNote}
              className="mobile:mt-2"
            >
              <CheckIcon className="mr-2" />
              Update note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$sharingPost} onOpenChange={setSharingPost}>
        <DialogContent className="h-[90vh] min-w-[500px] w-[45vw] max-w-none flex flex-col justify-center items-center text-center">
          <div className="grid gap-4 py-4 h-full">
            {!postData ? (
              <>
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon width={80} height={80} />
                  <h1 className="text-md font-normal mt-2 mb-4">
                    Drag an image or upload one from your device
                  </h1>
                  <Button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";

                      input.onchange = (e) => {
                        // @ts-ignore
                        let image = e.target.files[0];

                        if (!image.type.includes("image/")) {
                          toast.error("Only images allowed");

                          return;
                        }

                        // Max 25MB
                        if (image.size > 2000000) {
                          toast.error("Images must be under 2MB");
                          return;
                        }

                        let reader = new FileReader();
                        reader.readAsDataURL(image);
                        reader.onload = (e) => {
                          setPostData(e.target?.result as string);
                        };
                      };

                      input.click();
                    }}
                  >
                    Select image
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center text-center m-auto h-[80vh]">
                  <Input
                    disabled={disabled}
                    placeholder="Title"
                    className="mb-2 text-md"
                    maxLength={50}
                    onChange={(e) => {
                      setPostTitle(e.target.value);
                    }}
                    defaultValue={postTitle}
                  />

                  <img
                    src={postData}
                    className="h-[70vh] max-h-[800px] max-w-full mb-2 rounded-lg"
                  />

                  <span className="flex-1" />

                  <div className="flex items-center justify-center w-full">
                    <Button
                      disabled={disabled}
                      onClick={() => {
                        setPostTitle("");
                        setPostData("");
                      }}
                      variant={"outline"}
                      className="mr-2"
                    >
                      Reset
                    </Button>

                    <Button
                      onClick={sharePost}
                      disabled={disabled}
                      className="ml-2"
                    >
                      Share post
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="mobile:h-screen mobile:w-screen mobile:rounded-none mobile:border-none w-[90vw] max-w-none h-[90vh] flex flex-col p-0">
          <div className="mobile:flex-col flex p-0 m-0 flex-1">
            <div className="bg-accent/15 border-r border-1 flex mobile:justify-center lg:flex-col mr-6 pl-6 pr-6 mobile:mr-0 mobile:pl-0 mobile:mb-1">
              <h1 className="mobile:hidden font-bold text-center mb-2 mt-2">
                Settings
              </h1>

              {settingHeaders.map((v) => {
                return (
                  <>
                    <Button
                      className={`mobile:text-[0.8rem] mobile:pt-3 mobile:pb-3 w-[125px] mobile:w-[25%] mobile:h-full mobile:rounded-none mobile:border-r-0 mobile:border-l-0 mobile:mt-0 mobile:mb-0 mt-1 mb-1`}
                      variant={selectedHeader === v ? "secondary" : "outline"}
                      onClick={() => setSelectedHeader(v)}
                    >
                      {v}
                    </Button>
                  </>
                );
              })}

              <h1 className="mobile:hidden text-center font-thin opacity-50 text-sm mt-2">
                v{$appVersion}
              </h1>
            </div>

            <div className="mobile:pr-5 mobile:pl-5 flex flex-col flex-1 pr-10 overflow-auto mobile:max-h-[90vh] max-h-[89.75vh]">
              <div className="flex flex-col flex-1 mt-2 m-auto w-full">
                {selectedHeader !== "Privacy" &&
                  selectedHeader !== "Appearance" && (
                    <SettingsHeader className="mb-3">
                      {selectedHeader}
                    </SettingsHeader>
                  )}

                {selectedHeader === "Account" && (
                  <>
                    <div className="pb-4 flex flex-col flex-1">
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center">
                          {!$userData?.avatar ? (
                            <PersonIcon
                              width={20}
                              height={20}
                              className="mobile:min-w-[16px] mobile:min-h-[16px] min-w-[24px] min-h-[24px] mr-2"
                            />
                          ) : (
                            <img
                              src={$userData.avatar}
                              className="mobile:min-w-[16px] mobile:min-h-[16px] mobile:w-[16px] mobile:h-[16px] min-w-[24px] min-h-[24px] w-[24px] h-[24px] rounded-full mr-2"
                            />
                          )}

                          <h1 className="max-w-[150px] overflow-hidden text-ellipsis mobile:text-xs text-sm font-semibold m-0 p-0">
                            {$userData.username}
                          </h1>

                          <span className="flex-1" />

                          <Button
                            className="mobile:text-[0.7rem]"
                            size={"default"}
                          >
                            Edit Profile
                          </Button>
                        </div>
                      </div>

                      <SettingsSeparator />

                      <div>
                        <SettingsHeader className="mb-4">
                          Security
                        </SettingsHeader>

                        <Button
                          onClick={() => setChangingPassword(true)}
                          variant={"outline"}
                          size="default"
                          className="mobile:text-[0.7rem]"
                        >
                          <Pencil1Icon className="mr-2" /> Change password
                        </Button>

                        <SettingsSeparator />

                        <SettingsHeader>Extra Auth</SettingsHeader>

                        <SettingsSubheader>
                          Authenticator apps allow you to protect your account
                          with a randomly-generated code
                        </SettingsSubheader>

                        {/* TODO: Enable in future version */}
                        <Button
                          className="mobile:text-[0.7rem]"
                          disabled
                          variant={"outline"}
                          size="default"
                        >
                          <GearIcon className="mr-2" /> Add authenticator
                        </Button>

                        <SettingsSeparator />

                        <Button
                          onClick={() => setMoreShown(!moreShown)}
                          variant={moreShown ? "ghost" : "ghost"}
                          className="mobile:text-[0.8rem]"
                        >
                          {!moreShown ? (
                            <ChevronDownIcon className="w-[16px] h-[16px] mr-2" />
                          ) : (
                            <ChevronUpIcon className="w-[16px] h-[16px] mr-2" />
                          )}
                          Show {moreShown ? "less" : "more"}
                        </Button>

                        {moreShown && (
                          <div className="border-red-500 border-2 rounded-md border mt-4 p-4 pt-3">
                            <SettingsHeader className="mt-0">
                              Danger zone
                            </SettingsHeader>

                            <SettingsSubheader>
                              Proceed with caution
                            </SettingsSubheader>

                            <Button
                              variant={"destructive"}
                              onClick={() => setDeletingAccount(true)}
                              className="mobile:text-[0.7rem]"
                            >
                              <Cross1Icon className="mr-2" />
                              Delete account
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {selectedHeader === "Appearance" && (
                  <>
                    <div className="pb-4 flex flex-col flex-1">
                      <div>
                        <SettingsHeader>Theme</SettingsHeader>

                        <SettingsSubheader>
                          Adjust the Fronvo app theme
                        </SettingsSubheader>

                        <SettingsChoice
                          selected={themeOption}
                          values={["White", "Dark"]}
                          clickListener={(i) => {
                            setThemeOption(i as 0 | 1);
                            setTheme(i === 0 ? "light" : "dark");
                          }}
                        />

                        <SettingsSeparator />

                        <SettingsHeader>Default tab</SettingsHeader>

                        <SettingsSubheader>
                          Change the default landing page of Fronvo
                        </SettingsSubheader>

                        <SettingsChoice
                          selected={tabOption}
                          values={["Home", "Messaging"]}
                          clickListener={(i) => {
                            setTabOption(i as 0 | 1);
                            updateTabOption(i as 0 | 1);
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedHeader === "Privacy" && (
                  <>
                    <div className="pb-4 flex flex-col flex-1">
                      <div>
                        <SettingsHeader>Direct Messages</SettingsHeader>

                        <SettingsSubheader>
                          Set who can message you directly, outside of a server
                          or group
                        </SettingsSubheader>

                        <SettingsChoice
                          selected={dmOption}
                          values={["Everyone", "Friends Only"]}
                          clickListener={(i) => {
                            setDMOption(i as 0 | 1);
                            updateDMOption(i as 0 | 1);
                          }}
                        />

                        <SettingsSeparator />

                        <SettingsHeader>Filter messages</SettingsHeader>

                        <SettingsSubheader>
                          Update message filtering to hide vulgar words
                        </SettingsSubheader>

                        <SettingsChoice
                          selected={filterOption}
                          values={["Everything", "Nothing"]}
                          clickListener={(i) => {
                            setFilterOption(i as 0 | 1);
                            updateFilterOption(i as 0 | 1);
                          }}
                        />
                      </div>

                      <SettingsSeparator />

                      <SettingsHeader>Request data</SettingsHeader>

                      <SettingsSubheader>
                        Fetch all of your data straight from the Fronvo servers
                      </SettingsSubheader>

                      <div>
                        <Button
                          className="mobile:text-[0.7rem]"
                          onClick={() => setRequestingData(true)}
                        >
                          Request data
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {selectedHeader === "About" && (
                  <>
                    <div className="m-auto pb-4 flex flex-col flex-1 items-center justify-center">
                      <img
                        className="mobile:min-w-[128px] mobile:w-[128px] mobile:min-h-[128px] mobile:h-[128px] min-w-[164px] w-[164px] min-h-[164px] h-[164px]"
                        src="/favicon.ico"
                      />

                      <h1 className="font-bold mobile:text-[1.7rem] text-[2.2rem] translate-y-[-20px]">
                        Fronvo
                      </h1>

                      <SettingsSubheader className="translate-y-[-20px]">
                        Version {$appVersion}
                      </SettingsSubheader>

                      <span className="flex-1" />

                      <h1 className="font-medium mobile:text-xs text-sm opacity-50">
                        Created with ♥ by{" "}
                        <Link href={"https://stamtsag.com"} target="_blank">
                          Stam
                        </Link>
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={$loggingOut} onOpenChange={setLoggingOut}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of Fronvo?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose disabled={disabled}>
              <Button
                disabled={disabled}
                variant={"outline"}
                className="mobile:hidden"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={logout} variant={"destructive"}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$switchingAccounts} onOpenChange={setSwitchingAccounts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch accounts</DialogTitle>
            <DialogDescription>
              Choose or add another account to use on Fronvo
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center mb-6 mt-6">
            <AccountSwitchView
              username={$userData.username}
              avatar={$userData.avatar}
              active
            />
          </div>

          <DialogFooter className="mobile:flex mobile:w-max mobile:m-auto">
            <DialogClose disabled={disabled} className="mobile:flex">
              <Button
                disabled={disabled}
                variant={"outline"}
                className="mobile:hidden"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled
              onClick={switchAccount}
              variant={"default"}
              className="mobile:w-max"
            >
              Add account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$deletingAccount}
        onOpenChange={() => {
          setDeletingAccount(false);
          setPasswordInput("");
          setExtraInput("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete my account</DialogTitle>
            <DialogDescription>
              Follow the steps below to delete your account
            </DialogDescription>
          </DialogHeader>

          <hr />

          <h1>Type in your password</h1>
          <Input
            onInput={(e) => {
              // @ts-ignore
              setPasswordInput(e.target.value.trim());
            }}
            type="password"
            placeholder="Password"
          />

          <h1 className="mt-4">
            Type{" "}
            <span className="font-bold select-none">delete my account</span>{" "}
            below
          </h1>

          <Input
            className="font-bold"
            onInput={(e) => {
              // @ts-ignore
              setExtraInput(e.target.value);
            }}
          />

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                disabled ||
                extraInput !== "delete my account" ||
                passwordInput.length < 8
              }
              onClick={deleteAccount}
              variant={"destructive"}
            >
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$changingPassword}
        onOpenChange={() => {
          setChangingPassword(false);
          setPasswordInput("");
          setExtraInput("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change my password</DialogTitle>
            <DialogDescription>
              Follow the steps below to change the password of your account
            </DialogDescription>
          </DialogHeader>

          <hr />

          <h1>Type in your password</h1>
          <Input
            onInput={(e) => {
              // @ts-ignore
              setPasswordInput(e.target.value.trim());
            }}
            type="password"
            placeholder="Password"
          />

          <h1 className="mt-4">Type your new password below</h1>

          <Input
            onInput={(e) => {
              // @ts-ignore
              setExtraInput(e.target.value);
            }}
            type="password"
            placeholder="New password"
          />

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                disabled || extraInput.length < 8 || passwordInput.length < 8
              }
              onClick={changePassword}
            >
              Change password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$requestingData} onOpenChange={setRequestingData}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request my data</DialogTitle>
            <DialogDescription>
              Get all of your account data sent to your email
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={disabled} onClick={requestData}>
              Request data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$creatingServer}
        onOpenChange={(e) => {
          setCreatingServer(e);
          setServerName("");
          setServerAvatarData("");
          setServerBannerData("");
        }}
      >
        <DialogContent className="mobile:w-full w-max max-w-none min-w-none pt-10 h-[375px]">
          {!serverBannerData ? (
            <div className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md">
              <Pencil1Icon
                width={32}
                height={32}
                className="hover:bg-accent transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-36px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerBannerData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              />
            </div>
          ) : (
            <div className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md">
              <Pencil1Icon
                width={32}
                height={32}
                className="hover:bg-accent bg-background transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-72px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    // Max 25MB
                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerBannerData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              />

              <Cross1Icon
                width={32}
                height={32}
                className="hover:bg-accent bg-background transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-36px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  setServerBannerData("");
                }}
              />

              <img
                src={serverBannerData}
                className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex">
            <Button
              className={`${
                !serverAvatarData && "opacity-0 cursor-default"
              } fixed mobile:translate-y-[-60px] translate-y-[-68px] mobile:translate-x-14 translate-x-20 rounded-full  mobile:w-[24px] w-[32px] mobile:h-[24px] p-1 z-10`}
              size="sm"
              variant={"outline"}
              onClick={() => setServerAvatarData("")}
            >
              <Cross1Icon width={14} height={14} />
            </Button>

            {!serverAvatarData ? (
              <div
                className="hover:bg-background/75 transition-[100ms] mobile:min-w-[56px] mobile:min-h-[56px] min-w-[64px] min-h-[64px] bg-background border border-1 rounded-md mobile:translate-x-2 mobile:translate-y-[-50px] translate-y-[-56px] translate-x-10 cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    // Max 25MB
                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerAvatarData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              ></div>
            ) : (
              <div className="hover:opacity-90 transition-[100ms] mobile:min-w-[56px] mobile:min-h-[56px] min-w-[64px] min-h-[64px] bg-background border border-1 rounded-md mobile:translate-x-2 mobile:translate-y-[-50px] translate-y-[-56px] translate-x-10 cursor-pointer">
                <img
                  src={serverAvatarData}
                  className="hover:opacity-90 transition-[100ms] mobile:min-w-[56px] mobile:w-[56px] min-w-[64px] max-w-[64px] mobile:min-h-[56px] mobile:h-[56px] min-h-[64px] max-h-[64px] rounded-md cursor-pointer object-cover"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";

                    input.onchange = (e) => {
                      // @ts-ignore
                      let image = e.target.files[0];

                      if (!image.type.includes("image/")) {
                        toast.error("Only images allowed");

                        return;
                      }

                      // Max 25MB
                      if (image.size > 2000000) {
                        toast.error("Images must be under 2MB");
                        return;
                      }

                      let reader = new FileReader();
                      reader.readAsDataURL(image);
                      reader.onload = (e) => {
                        setServerAvatarData(e.target?.result as string);
                      };
                    };

                    input.click();
                  }}
                />
              </div>
            )}
            <Input
              placeholder="Server Name"
              maxLength={30}
              autoFocus
              onChange={(e) => {
                setServerName(e.target.value);
              }}
              defaultValue={serverName}
              className="mobile:translate-x-4 translate-y-[-36px] translate-x-14 mobile:w-[60%] w-[250px] bg-background"
            ></Input>
          </div>
          <DialogFooter className="translate-y-[-52px]">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button variant={"outline"} disabled={disabled}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={disabled || serverName.length === 0}
              onClick={createServer}
            >
              Create server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$joiningServer}
        onOpenChange={(e) => {
          setJoiningServer(e);
          setInviteLink("");
        }}
      >
        <DialogContent>
          <DialogTitle>Join Server</DialogTitle>
          <DialogDescription>
            Enter a server invite link in order to join
          </DialogDescription>

          <Input
            onChange={(e) => setInviteLink(e.target.value)}
            maxLength={8}
            placeholder="hellowor"
          />

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button variant={"outline"} disabled={disabled}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={disabled || inviteLink.length !== 8}
              onClick={joinServer}
            >
              Join server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$editingServer}
        onOpenChange={(e) => {
          setEditingServer(e);
          setServerName("");
          setServerAvatarData("");
          setServerBannerData("");
        }}
      >
        <DialogContent className="mobile:w-full w-max max-w-none min-w-none pt-10 h-[375px]">
          {!serverBannerData ? (
            <div className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md">
              <Pencil1Icon
                width={32}
                height={32}
                className="hover:bg-accent transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-36px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    // Max 25MB
                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerBannerData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              />
            </div>
          ) : (
            <div className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md">
              <Pencil1Icon
                width={32}
                height={32}
                className="hover:bg-accent bg-background transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-72px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    // Max 25MB
                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerBannerData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              />

              <Cross1Icon
                width={32}
                height={32}
                className="hover:bg-accent bg-background transition-[100ms] cursor-pointer fixed m-auto right-0 translate-x-[-36px] translate-y-2 border border-1 p-1.5 rounded-full"
                onClick={() => {
                  setServerBannerData("");
                }}
              />

              <img
                src={serverBannerData}
                className="mobile:w-full w-[600px] h-[240px] border border-1 rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex">
            <Button
              className={`${
                !serverAvatarData && "opacity-0 cursor-default"
              } fixed mobile:translate-y-[-60px] translate-y-[-68px] mobile:translate-x-14 translate-x-20 rounded-full  mobile:w-[24px] w-[32px] mobile:h-[24px] p-1 z-10`}
              size="sm"
              variant={"outline"}
              onClick={() => setServerAvatarData("")}
            >
              <Cross1Icon width={14} height={14} />
            </Button>

            {!serverAvatarData ? (
              <div
                className="hover:bg-background transition-[100ms] mobile:min-w-[56px] mobile:min-h-[56px] min-w-[64px] min-h-[64px] bg-background border border-1 rounded-md mobile:translate-x-2 mobile:translate-y-[-50px] translate-y-[-56px] translate-x-10 cursor-pointer"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";

                  input.onchange = (e) => {
                    // @ts-ignore
                    let image = e.target.files[0];

                    if (!image.type.includes("image/")) {
                      toast.error("Only images allowed");

                      return;
                    }

                    // Max 25MB
                    if (image.size > 2000000) {
                      toast.error("Images must be under 2MB");
                      return;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = (e) => {
                      setServerAvatarData(e.target?.result as string);
                    };
                  };

                  input.click();
                }}
              ></div>
            ) : (
              <div className="hover:bg-background transition-[100ms] mobile:min-w-[56px] mobile:min-h-[56px] min-w-[64px] min-h-[64px] bg-background border border-1 rounded-md mobile:translate-x-2 mobile:translate-y-[-50px] translate-y-[-56px] translate-x-10 cursor-pointer">
                <img
                  src={serverAvatarData}
                  className="hover:opacity-75 transition-[100ms] mobile:min-w-[56px] mobile:w-[56px] min-w-[64px] max-w-[64px] mobile:min-h-[56px] mobile:h-[56px] min-h-[64px] max-h-[64px] rounded-md cursor-pointer object-cover"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";

                    input.onchange = (e) => {
                      // @ts-ignore
                      let image = e.target.files[0];

                      if (!image.type.includes("image/")) {
                        toast.error("Only images allowed");

                        return;
                      }

                      // Max 25MB
                      if (image.size > 2000000) {
                        toast.error("Images must be under 2MB");
                        return;
                      }

                      let reader = new FileReader();
                      reader.readAsDataURL(image);
                      reader.onload = (e) => {
                        setServerAvatarData(e.target?.result as string);
                      };
                    };

                    input.click();
                  }}
                />
              </div>
            )}
            <Input
              placeholder="Server Name"
              maxLength={30}
              onChange={(e) => {
                setServerName(e.target.value);
              }}
              defaultValue={serverName}
              className="mobile:translate-x-4 translate-y-[-36px] translate-x-14 mobile:w-[60%] w-[250px] bg-background"
            ></Input>
          </div>
          <DialogFooter className="translate-y-[-52px]">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button variant={"outline"} disabled={disabled}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={disabled || serverName.length === 0}
              onClick={editServer}
            >
              Update server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$leavingServer} onOpenChange={setLeavingServer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave server</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave from <b>{$serverData?.name}</b>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={disabled}
              onClick={leaveServer}
              variant={"destructive"}
            >
              Leave server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$deletingServer}
        onOpenChange={() => {
          setDeletingServer(false);
          setPasswordInput("");
          setExtraInput("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete server</DialogTitle>
            <DialogDescription>
              Follow the steps below to delete <b>{$serverData?.name}</b>
            </DialogDescription>
          </DialogHeader>

          <hr />

          <h1>Type in the server name</h1>
          <Input
            onInput={(e) => {
              // @ts-ignore
              setServerName(e.target.value.trim());
            }}
            type="text"
            placeholder="Server Name"
          />

          <h1 className="mt-4">
            Type <span className="font-bold select-none">delete my server</span>{" "}
            below
          </h1>

          <Input
            className="font-bold"
            onInput={(e) => {
              // @ts-ignore
              setExtraInput(e.target.value);
            }}
          />

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                disabled ||
                extraInput !== "delete my server" ||
                serverName !== $serverData?.name
              }
              onClick={deleteServer}
              variant={"destructive"}
            >
              Delete server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$transferringServer}
        onOpenChange={() => {
          setTransferringServer(false);
          setPasswordInput("");
          setExtraInput("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>
              Follow the steps below to transfer ownership of{" "}
              <b>{$serverData?.name}</b> to <b>{$memberData?.id}</b>
            </DialogDescription>
          </DialogHeader>

          <hr />

          <h1>Type in the server name</h1>
          <Input
            onInput={(e) => {
              // @ts-ignore
              setServerName(e.target.value.trim());
            }}
            type="text"
            placeholder="Server Name"
          />

          <h1 className="mt-4">
            Type{" "}
            <span className="font-bold select-none">transfer my server</span>{" "}
            below
          </h1>

          <Input
            className="font-bold"
            onInput={(e) => {
              // @ts-ignore
              setExtraInput(e.target.value);
            }}
          />

          <DialogFooter>
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                disabled ||
                extraInput !== "transfer my server" ||
                serverName !== $serverData?.name
              }
              onClick={transferServer}
              variant={"destructive"}
            >
              Transfer ownership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$creatingChannel} onOpenChange={setCreatingChannel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create channel</DialogTitle>
            <DialogDescription>Publicly visible</DialogDescription>
          </DialogHeader>
          <div className="flex-col">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Name</Label>
              <Input
                maxLength={20}
                className="col-span-3 w-full"
                onInput={(e) => {
                  // @ts-ignore
                  setChannelName(e.target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Description</Label>
              <Textarea
                maxLength={500}
                className="col-span-3 w-full max-h-40"
                onInput={(e) => {
                  // @ts-ignore
                  setChannelDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={createChannel}
              className="mobile:mt-2"
            >
              Create channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$editingChannel}
        onOpenChange={() => {
          setEditingChannel(false);
          setDescriptionChanged(false);
          setChannelName("");
          setChannelDescription("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit channel</DialogTitle>
          </DialogHeader>
          <div className="flex-col">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Name</Label>
              <Input
                maxLength={20}
                className="col-span-3 w-full"
                defaultValue={$editingChannelData?.name}
                onInput={(e) => {
                  // @ts-ignore
                  setChannelName(e.target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Description</Label>
              <Textarea
                maxLength={500}
                className="col-span-3 w-full max-h-40"
                defaultValue={$editingChannelData?.description}
                onInput={(e) => {
                  // @ts-ignore
                  setChannelDescription(e.target.value);
                  setDescriptionChanged(true);
                }}
              />
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={editChannel}
              className="mobile:mt-2"
            >
              Update channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$deletingChannel} onOpenChange={setDeletingChannel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete channel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <b className="text-primary">{$deletingChannelData?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={deleteChannel}
              className="mobile:mt-2"
              variant={"destructive"}
            >
              Delete channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$managingMembers} onOpenChange={setManagingMembers}>
        <DialogContent className="flex flex-col w-[90vw] max-w-none h-[90vh]">
          <DialogTitle>
            {$serverData?.members.length} member
            {$serverData?.members.length !== 1 ? "s" : ""}
          </DialogTitle>

          <DataTable
            viewOptions
            columns={memberColumns}
            data={
              $serverData?.owner_id === $userData.id ? $serverData?.members : []
            }
            enableFiltering
            filterPlaceholder="Search for users..."
          />

          <DialogFooter>
            <DialogClose disabled={disabled}>
              <Button disabled={disabled} variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$banningMembers} onOpenChange={setBanningMembers}>
        <DialogContent className="flex flex-col w-[90vw] max-w-none h-[90vh]">
          <DialogTitle>
            {$serverData?.banned_members.length > 0
              ? $serverData?.banned_members.length
              : "No"}{" "}
            banned member
            {$serverData?.banned_members.length !== 1 ? "s" : ""}
          </DialogTitle>

          <DataTable
            viewOptions
            columns={bannedColumns}
            data={$serverData?.banned_members}
            enableFiltering
            filterPlaceholder="Search for banned users..."
          />

          <DialogFooter>
            <DialogClose disabled={disabled}>
              <Button disabled={disabled} variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$kickingMember} onOpenChange={setKickingMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kick member</DialogTitle>
            <DialogDescription>
              Are you sure you want to kick{" "}
              <b className="text-primary">{$memberData?.id}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={kickMember}
              className="mobile:mt-2"
              variant={"destructive"}
            >
              Kick member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$banningMember} onOpenChange={setBanningMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban member</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban{" "}
              <b className="text-primary">{$memberData?.id}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={banMember}
              className="mobile:mt-2"
              variant={"destructive"}
            >
              Ban member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$unbanningMember} onOpenChange={setUnbanningMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unban member</DialogTitle>
            <DialogDescription>
              Are you sure you want to unban{" "}
              <b className="text-primary">{$bannedMemberData?.id}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={unbanMember}
              className="mobile:mt-2"
              variant={"destructive"}
            >
              Unban member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$creatingRole}
        onOpenChange={(e) => {
          setCreatingRole(false);
          setRoleMembers([]);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create role</DialogTitle>
          </DialogHeader>
          <div className="flex-col">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Name</Label>
              <Input
                maxLength={15}
                className="col-span-3 w-full"
                onInput={(e) => {
                  // @ts-ignore
                  setRoleName(e.target.value);
                }}
              />

              <Label className="text-right">Color</Label>
              <Input
                maxLength={6}
                className="col-span-3 w-full"
                defaultValue={"#ffffff"}
                onInput={(e) => {
                  // @ts-ignore
                  setRoleColor(e.target.value);
                }}
                type="color"
              />

              <Label className="text-right">Members</Label>
              <Button
                onClick={() => {
                  setAssigningRole(true);
                  setAssigningRoleData({
                    id: "-1",
                    name: roleName,
                    hex_color: roleColor,
                    created_at: new Date().toString(),
                  });
                }}
                variant={"outline"}
                className="col-span-3 w-full"
              >
                {roleMembers?.length} member
                {roleMembers?.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={createRole}
              className="mobile:mt-2"
            >
              Create role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={$editingRole}
        onOpenChange={(e) => {
          setEditingRole(e);
          setDescriptionChanged(false);
          setRoleName("");
          setRoleColor("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit role</DialogTitle>
          </DialogHeader>
          <div className="flex-col">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2">
              <Label className="text-right">Name</Label>
              <Input
                defaultValue={$editingRoleData?.name}
                maxLength={15}
                className="col-span-3 w-full"
                onInput={(e) => {
                  // @ts-ignore
                  setRoleName(e.target.value);
                }}
              />

              <Label className="text-right">Color</Label>
              <Input
                maxLength={6}
                className="col-span-3 w-full"
                defaultValue={$editingRoleData?.hex_color}
                onInput={(e) => {
                  // @ts-ignore
                  setRoleColor(e.target.value);
                }}
                type="color"
              />

              <Label className="text-right">Members</Label>
              <Button
                onClick={() => {
                  setAssigningRole(true);
                  setAssigningRoleData({
                    id: $editingRoleData.id,
                    name: $editingRoleData.name,
                    hex_color: $editingRoleData.hex_color,
                    created_at: $editingRoleData.created_at,
                  });
                }}
                variant={"outline"}
                className="col-span-3 w-full"
              >
                {roleMembers?.length} member
                {roleMembers?.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={editRole}
              className="mobile:mt-2"
            >
              Update role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$assigningRole} onOpenChange={setAssigningRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign {$assigningRoleData?.name} to members
            </DialogTitle>
          </DialogHeader>
          <div className="flex-col">
            <div className="grid grid-cols-4 items-center gap-4 mt-2 mb-2 max-h-[500px] overflow-y-auto">
              {$serverData?.members.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    if (roleMembers.includes(member.id)) {
                      setRoleMembers(
                        roleMembers.filter((v) => v !== member.id)
                      );
                    } else {
                      setRoleMembers([...roleMembers, member.id]);
                    }
                  }}
                  className={`hover:bg-accent ${
                    roleMembers?.includes(member.id) && "bg-accent"
                  } pt-2.5 pb-2.5 duration-150 cursor-pointer flex items-center border rounded-lg w-full col-span-4 p-2 select-none`}
                >
                  <h1 className="ml-2 flex-1 text-md">{member.username}</h1>

                  {roleMembers?.includes(member.id) && (
                    <CheckIcon width={20} height={20} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="mobile:flex-col">
            <Button
              disabled={disabled}
              type="submit"
              onClick={() => setAssigningRole(false)}
              className="mobile:mt-2 flex-1"
            >
              Update members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$deletingRole} onOpenChange={setDeletingRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role{" "}
              <b className="text-primary">{$deletingRoleData?.name}</b>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mobile:flex-col">
            <DialogClose disabled={disabled} className="mobile:hidden">
              <Button disabled={disabled} variant={"outline"}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              disabled={disabled}
              type="submit"
              onClick={deleteRole}
              className="mobile:mt-2"
              variant={"destructive"}
            >
              Delete role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$managingRoles} onOpenChange={setManagingRoles}>
        <DialogContent className="flex flex-col w-[90vw] max-w-none h-[90vh]">
          <DialogTitle>
            {$serverData?.roles.length > 0 ? $serverData?.roles.length : "No"}{" "}
            role
            {$serverData?.roles.length !== 1 ? "s" : ""}
          </DialogTitle>

          <DataTable
            viewOptions
            hiddenColumns={["id"]}
            columns={roleColumns}
            data={$serverData?.roles}
            enableFiltering
            filterPlaceholder="Search for roles..."
          />

          <DialogFooter>
            <DialogClose disabled={disabled}>
              <Button disabled={disabled} variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={$managingChannels} onOpenChange={setManagingChannels}>
        <DialogContent className="flex flex-col w-[90vw] max-w-none h-[90vh]">
          <DialogTitle>
            {$serverData?.channels.length > 0
              ? $serverData?.channels.length
              : "No"}{" "}
            channel
            {$serverData?.channels.length !== 1 ? "s" : ""}
          </DialogTitle>

          <DataTable
            viewOptions
            hiddenColumns={["id"]}
            columns={channelColumns}
            data={$serverData?.channels}
            enableFiltering
            filterPlaceholder="Search for channels..."
          />

          <DialogFooter>
            <DialogClose disabled={disabled}>
              <Button disabled={disabled} variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
