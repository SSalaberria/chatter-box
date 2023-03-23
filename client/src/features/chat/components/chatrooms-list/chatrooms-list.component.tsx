import Image from "next/image";
import { memo, SyntheticEvent, useCallback, useRef, useState } from "react";

import { Chatroom } from "../../utils/types";

interface SelectableItemProps {
  option: Chatroom;
  selected: boolean;
  onSelect: (option: Chatroom) => void;
}

const ItemStyle =
  "inline-flex w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-lg bg-gray-200 px-4 py-2 transition-all duration-300 hover:bg-gray-400 hover:text-gray-600 peer-checked:bg-gray-400 hover:peer-checked:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-[#888E97] dark:hover:bg-gray-600 dark:hover:text-gray-300 dark:peer-checked:bg-[#404249] dark:peer-checked:text-white";

const SelectableItem = memo(
  function SelectableItem({ option, selected, onSelect }: SelectableItemProps) {
    return (
      <li>
        <input
          required
          checked={selected}
          className="peer hidden"
          id={option._id}
          name="chatroom"
          type="radio"
          value={option._id}
          onChange={() => onSelect(option)}
        />
        <label className={ItemStyle} htmlFor={option._id}>
          <div className="w-full overflow-hidden text-ellipsis"># {option.name}</div>
        </label>
      </li>
    );
  },
  (prevProps, nextProps) => prevProps.selected === nextProps.selected,
);

interface ChatroomsListProps {
  chatrooms: Chatroom[];
  selected: Chatroom | null;
  onSelect: (option: Chatroom) => void;
  onAddChatroom: (value: string) => void;
}

export const ChatroomsList = memo(
  function ChatroomsList({ chatrooms, selected, onSelect, onAddChatroom }: ChatroomsListProps) {
    const [inputToggle, setInputToggle] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const isSelected = useCallback(
      (chatroom: Chatroom) => selected?._id === chatroom._id,
      [selected?._id],
    );

    const handleAdd = () => {
      if (!inputToggle) {
        setInputToggle(true);
        inputRef.current?.focus();
      }
    };

    const handleSubmit = (e: SyntheticEvent) => {
      e.preventDefault();

      const { chatroom } = e.target as typeof e.target & {
        chatroom: { value: string };
      };

      if (Boolean(chatroom?.value)) onAddChatroom(chatroom.value);

      setInputToggle(false);
    };

    return (
      <ul className="grid w-full grid-cols-1 gap-6">
        {chatrooms.map((channel) => (
          <SelectableItem
            key={channel._id}
            option={channel}
            selected={isSelected(channel)}
            onSelect={onSelect}
          />
        ))}
        <div className={ItemStyle} onClick={handleAdd}>
          {inputToggle ? (
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                autoFocus
                className="h-[1.5rem] w-full border-b-2 border-gray-300 dark:border-gray-400 dark:!bg-gray-800"
                id="chatroom"
                maxLength={24}
                type="text"
              />
              <button
                className=" transition-all hover:scale-105"
                type="reset"
                onClick={() => setInputToggle(false)}
              >
                <Image alt="cancel" height={12} src="/icons/cross.svg" width={12} />
              </button>
            </form>
          ) : (
            <span>+ Add chatroom</span>
          )}
        </div>
      </ul>
    );
  },
  (prevProps, nextProps) =>
    prevProps.chatrooms.length === nextProps.chatrooms.length &&
    prevProps.selected?._id === nextProps.selected?._id,
);
