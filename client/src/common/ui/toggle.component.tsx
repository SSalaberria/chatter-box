const Toggle = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (e?: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label
      className="toggle relative right-4 inline-flex cursor-pointer items-center"
      htmlFor="default-toggle"
    >
      <input
        className="peer sr-only"
        id="default-toggle"
        type="checkbox"
        value={value}
        onChange={onChange}
      />
      <div
        className={`peer h-4 w-8 rounded-full bg-blue-300 after:absolute after:top-[1px] after:left-[1px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all dark:border-gray-600 dark:bg-gray-600 ${
          value === "dark" && "after:translate-x-full after:border-white after:content-['']"
        }`}
      />
    </label>
  );
};

export default Toggle;
