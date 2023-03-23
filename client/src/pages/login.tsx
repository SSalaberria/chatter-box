import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

import { useAuth } from "@/features/auth";

export default function LoginPage({}) {
  const { push } = useRouter();
  const { logIn } = useAuth();
  const [error, setError] = useState();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { username, password } = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    logIn
      .mutateAsync({ username: username.value, password: password.value })
      .then(() => setTimeout(() => push("/"), 0))
      .catch((err) => setError(err.response.data.message));
  };

  return (
    <main className="flex h-screen w-full items-start justify-center">
      <form
        className="mt-20 flex h-96 w-96 flex-col justify-center gap-4 rounded-xl border-[#ccc] px-8 shadow-lg dark:bg-gray-700"
        onSubmit={handleSubmit}
      >
        <Image
          priority
          alt="chatterbox-icon"
          className="mx-auto"
          height={86}
          src="/icons/chatterbox-icon.svg"
          width={86}
        />
        <p className="mx-auto text-xxl font-extrabold text-blue-400">
          <span className="text-gray-400 dark:text-white">Chatter</span>box
        </p>
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>

        {error && <p className=" text-center text-red-500">{error}</p>}
        <button className="btn-primary" type="submit">
          {logIn.isLoading ? (
            <Image
              alt="loading"
              className="m-auto"
              height={24}
              src="/icons/loading.svg"
              width={24}
            />
          ) : (
            "Login"
          )}
        </button>
      </form>
    </main>
  );
}
