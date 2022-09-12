import { useEffect, useState } from "react";
import { shortcutService } from "../services";
import useLoading from "../hooks/useLoading";
import Icon from "./Icon";
import { generateDialog } from "./Dialog";
import toastHelper from "./Toast";

interface Props extends DialogProps {
  workspaceId: WorkspaceId;
  shortcutId?: ShortcutId;
}

const CreateShortcutDialog: React.FC<Props> = (props: Props) => {
  const { destroy, workspaceId, shortcutId } = props;
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const requestState = useLoading(false);

  useEffect(() => {
    if (shortcutId) {
      const shortcutTemp = shortcutService.getShortcutById(shortcutId);
      if (shortcutTemp) {
        setName(shortcutTemp.name);
        setLink(shortcutTemp.link);
      }
    }
  }, [shortcutId]);

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setName(text);
  };

  const handleLinkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value as string;
    setLink(text);
  };

  const handleSaveBtnClick = async () => {
    if (!name) {
      toastHelper.error("Name is required");
      return;
    }

    try {
      if (shortcutId) {
        await shortcutService.patchShortcut({
          id: shortcutId,
          name,
          link,
        });
      } else {
        await shortcutService.createShortcut({
          workspaceId,
          name,
          link,
          visibility: "PRIVATE",
        });
      }
    } catch (error: any) {
      console.error(error);
      toastHelper.error(error.response.data.message);
    }
    destroy();
  };

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <p className="text-base">{shortcutId ? "Edit Shortcut" : "Create Shortcut"}</p>
        <button className="rounded p-1 hover:bg-gray-100" onClick={destroy}>
          <Icon.X className="w-5 h-auto text-gray-600" />
        </button>
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-start items-center mb-2">
          <input className="rounded border px-2 py-2" type="text" placeholder="Name" value={name} onChange={handleNameInputChange} />
        </div>
        <div className="w-full flex flex-row justify-start items-center mb-2">
          <input className="rounded border px-2 py-2" type="text" placeholder="Link" value={link} onChange={handleLinkInputChange} />
        </div>
      </div>
      <div className="w-full flex flex-row justify-end items-center mt-2">
        <div className="flex flex-row justify-start items-center">
          <button
            className={`border rounded px-2 py-1 border-green-600 text-green-600 ${requestState.isLoading ? "opacity-80" : ""}`}
            onClick={handleSaveBtnClick}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default function showCreateShortcutDialog(workspaceId: WorkspaceId, shortcutId?: ShortcutId): void {
  generateDialog(
    {
      className: "px-2 sm:px-0",
    },
    CreateShortcutDialog,
    {
      workspaceId,
      shortcutId,
    }
  );
}
