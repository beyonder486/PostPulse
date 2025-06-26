'use client'
import React from 'react'
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";

const Hero = () => {
  const router = useRouter();
  const session = useSession();

  const handleClick = (e: React.MouseEvent) => {
    if (session) {
      e.preventDefault();
      router.push("/dashboard");
    }
  };

  return (
    <div className='md:mt-45 mt-35 mx-5'> 
      <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-b from-[#ffffff] via-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent text-center leading-tight drop-shadow-lg">
        Create Magnetic LinkedIn Posts <br />That Win Clients
      </h1>
      <p className="mt-8 text-lg font-semibold md:text-xl text-center bg-gradient-to-r from-[#e7e2e2] via-white to-[#a1a2a5] bg-clip-text text-transparent max-w-2xl mx-auto">
        Struggling to post consistently? Let AI craft scroll-stopping LinkedIn content tailored to your niche — designed to boost visibility, authority, and engagement in minutes.
      </p>
      <div className="flex justify-center mt-15">
        <div className="inline-block rounded-full p-0">
          <Link
            href={session ? "/dashboard" : "/login"}
            onClick={handleClick}
            className="
              bg-transparent backdrop-blur-md border-1 border-blue-300/30 text-blue-100 font-semibold py-3 px-8 rounded-full
              transition-all duration-400 shadow-blue-500/30 shadow-xl
              hover:text-white
              hover:shadow-[0_0_20px_0_rgba(59,130,246,0.4),0_0_40px_10px_rgba(0,166,255,0.3)]
              hover:border-2 hover:border-blue-500
              inline-block
              relative
            "
          >
            Get Started — It's Free!
          </Link>
        </div>
      </div>
      <motion.img
        src="home page.png"
        alt="dash"
        className="mx-auto mt-12 rounded-xl shadow-lg"
        style={{ maxWidth: "750px", maxHeight: "660px", width: "100%", height: "auto", objectFit: "cover" }}
        animate={{
          y: [0, -18, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export default Hero