/* eslint-disable react-hooks/exhaustive-deps */
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";

import Toggle from "../ui/toggle.component";

import css from "./layout.module.css";

import { ThemeOption } from "@/utils/types";

const DynamicToggle = dynamic(() => Promise.resolve(Toggle), { ssr: false });

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const initThemeState = () => {
  if (typeof window !== "undefined")
    return (localStorage?.getItem("theme") as ThemeOption) || "dark";
  else return "light";
};

export const Layout = memo(
  function Layout({ children, className, loading }: LayoutProps) {
    const [finishedAnimation, setFinishedAnimation] = useState(false);
    const [theme, setTheme] = useState<ThemeOption>(initThemeState);
    const animationRef = useRef<HTMLElement>(null);

    const toggleTheme = () => {
      const newTheme = theme === "dark" ? "light" : "dark";

      setTheme(newTheme);
    };

    useEffect(() => {
      if (theme) {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
      }
    }, [theme]);

    useEffect(() => {
      const onAnimationEnd = () => setFinishedAnimation(true);

      animationRef.current?.addEventListener("animationend", onAnimationEnd);

      return () => {
        animationRef.current?.removeEventListener("animationend", onAnimationEnd);
      };
    }, []);

    return (
      <main className={`flex h-screen flex-col overflow-hidden ${className}`}>
        {!loading && finishedAnimation ? (
          <>
            <div className="flex justify-between bg-gray-200 p-1 dark:bg-[#1E1F22]">
              <Image
                alt="chatterbox-icon"
                height={18}
                src="/icons/chatterbox-icon.svg"
                width={18}
              />
              <DynamicToggle value={theme} onChange={toggleTheme} />
            </div>
            <div
              className="flex"
              style={{
                height: "calc(100% - 26px)",
              }}
            >
              {children}
            </div>
          </>
        ) : (
          <div className="flex h-1/2 flex-col items-center justify-center">
            <Image
              priority
              alt="chatterbox-icon"
              height={128}
              src="/icons/chatterbox-icon.svg"
              width={128}
            />
            <div className={"relative mx-auto text-[4rem] font-extrabold text-blue-400"}>
              <h2 className="relative">
                {"Chatterbox".split("").map((letter, index) => (
                  <span
                    key={index}
                    className={[`${index < 7 && "text-gray-500 dark:text-white"}`, css.anim].join(
                      " ",
                    )}
                    style={{
                      animationDelay: `${0.3 + index / 10}s`,
                    }}
                    {...(index === 9 && {
                      ref: animationRef,
                    })}
                  >
                    {letter}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        )}
      </main>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.loading === nextProps.loading &&
    prevProps.className === nextProps.className,
);
