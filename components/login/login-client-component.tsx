"use client";

import { login } from "@/actions/auth";
import { FaGithub } from "react-icons/fa";

const LoginClientComponent = () => {
  return (
    <div className="mt-20 flex w-full justify-center">
      <section className="flex w-[400px] flex-col">
        <h1 className="mb-6 w-full text-center text-3xl font-bold">Sign in</h1>
        <div
          onClick={() => login("github")}
          className="mt-6 flex h-12 w-full items-center justify-center gap-4 rounded-md bg-black p-4 hover:cursor-pointer"
        >
          <FaGithub className="text-white" />
          <p className="text-white">Login with Github</p>
        </div>
      </section>
    </div>
  );
};

export default LoginClientComponent;
