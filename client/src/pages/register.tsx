import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/features/auth";

export default function LoginPage({}) {
  const { push } = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const { username, password, passwordRepeated } = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
      passwordRepeated: { value: string };
    };

    if (password.value === passwordRepeated.value) {
      register
        .mutateAsync({ username: username.value, password: password.value })
        .then(() => setTimeout(() => push("/"), 0))
        .catch((err) => setError(err.response.data.message));
    } else {
      setError("Passwords missmatch");
    }
  };

  return (
    <main className="flex h-screen w-full items-start justify-center">
      <form
        className="flex h-full w-full flex-col justify-center gap-4 rounded-xl border-[#ccc] px-8 shadow-lg dark:bg-gray-700 sm:mt-20 sm:h-[28rem] sm:w-96"
        onSubmit={handleSubmit}
      >
        <Image
          priority
          alt="chatterbox-icon"
          className="mx-auto"
          height={48}
          src="/icons/chatterbox-icon.svg"
          width={48}
        />
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input id="username" maxLength={24} minLength={4} type="text" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input id="password" maxLength={24} minLength={4} type="password" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Repeat password</label>
          <input id="passwordRepeated" maxLength={24} minLength={4} type="password" />
        </div>

        {error && <p className=" text-center text-red-500">{error}</p>}
        <button className="btn-primary" type="submit">
          {register.isLoading ? (
            <Image
              alt="loading"
              className="m-auto"
              height={24}
              src="/icons/loading.svg"
              width={24}
            />
          ) : (
            "Register"
          )}
        </button>

        <div className="flex flex-col items-center justify-center">
          <span>Already have an account?</span>
          <Link href="/login">Login</Link>
        </div>
      </form>
    </main>
  );
}
