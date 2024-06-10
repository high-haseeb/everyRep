import { useStateStore } from "@/stores/state";
import Image from "next/image";
import React from "react";

const Overlay = () => {
  const { setSection, section } = useStateStore();
  return (
    <div className="w-screen h-screen absolute top-0 left-0 z-50 pointer-events-none font-sans text-7xl font-bold transition-colors">
      {/* <Image src={"/images/logo_name.jpg"} width={150} height={100} alt="logo" className="absolute top-10 left-10" /> */}
      <div className="w-full h-full relative">
        {section === "home" ? (
          <>
            <Image
              src={"/images/g12.png"}
              width={200}
              height={100}
              alt="logo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
            />
            <div className="cursor-pointer ">
              <div className="absolute top-1/4 left-1/4 pointer-events-auto glow black text-white" onClick={() => setSection("black")}>
                MEN
              </div>
              <div className="absolute bottom-1/4 right-1/4 pointer-events-auto glow white text-black" onClick={() => setSection("white")}>
                WOMEN
              </div>
            </div>
          </>
        ) : (
          <div className={`pointer-events-auto cursor-pointer absolute top-10 left-10`} onClick={() => setSection("home")}>
            ←
          </div>
        )}
      </div>
    </div>
  );
};

export default Overlay;
