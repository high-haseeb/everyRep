"use client";
import { useStateStore } from "@/stores/state";
import Image from "next/image";
import React from "react";

const Overlay = () => {
  const { setSection, section } = useStateStore();

  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-50 pointer-events-none font-sans text-5xl lg:text-7xl font-bold transition-colors " >
      {/* <Image src={"/images/logo_name.jpg"} width={150} height={100} alt="logo" className="absolute top-10 left-10" /> */}
      <div className="w-full h-full relative">
        {section === "home" ? (
          <>

            <Image
              src={"/images/logo_main.svg"}
              width={200}
              height={100}
              alt="logo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 lg:w-40 mix-blend-difference bg-transparent "
            />
            <div className="cursor-pointer">
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 lg:left-1/4 pointer-events-auto text-white flex items-center justify-center flex-col"
                onClick={() => setSection("black")}
              >
                <div className="outlineT white">MEN</div>
                <div className="text-lg pointer-events-auto lg:text-2xl">← explore</div>
              </div>

              <div
                className="absolute bottom-1/4 left-1/2 lg:right-1/4 -translate-x-1/2 lg:translate-x-1/2 pointer-events-auto  text-black flex items-center justify-center flex-col"
                onClick={() => setSection("white")}
              >
                <div className="outlineT black">WOMEN</div>

                <div className="text-lg pointer-events-auto lg:text-2xl text-right">explore →</div>
              </div>
            </div>
          </>
        ) : (
          <div className={`pointer-events-auto cursor-pointer absolute top-10 left-10 ${section == 'black' ? 'text-white' : 'text-black'}`} onClick={() => setSection("home")}>
            ←
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay;
