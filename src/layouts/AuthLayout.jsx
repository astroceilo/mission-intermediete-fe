import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";


export default function AuthLayout({ bgClass }) {
  return (
    <>
      <Header />

      <div
        className={`min-h-screen w-full flex items-center justify-center ${bgClass}`}
      >
        <main className="mx-auto max-w-360 w-full flex flex-col items-center gap-6 md:gap-12! lg:gap-16! px-5 md:px-10! lg:px-30! py-7 md:py-12! lg:py-16!">
          <Outlet />
        </main>
      </div>
    </>
  );
}
