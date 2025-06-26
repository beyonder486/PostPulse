import Link from "next/link";
// Remove unused import
// import { div } from "framer-motion/m"
import Image from "next/image";

// components/FeatureTeaser.tsx
export default function FeatureTeaser() {
  return (
    <div className="mt-15 flex flex-col gap-2 mb-15">
      <h1 className="md:ml-25 ml-5 md:text-4xl text-2xl font-bold mb-10 bg-gradient-to-b from-[#ffffff] to-[#78f3fcc5] bg-clip-text text-transparent">
        Powerful insights. Personalized suggestions. Better posts.
      </h1>
      <div className="flex md:mx-auto mx-5 flex-col md:flex-row gap-7 justify-center">
        {/* First card */}
        <div className="bg-gradient-to-br from-[#232946] via-[#181c2a] to-[#232946] p-6 rounded-2xl shadow-xl border border-blue-400/20 w-full max-w-md flex flex-col justify-between items-center min-h-[380px]">
          <h1 className="text-xl md:text-2xl font-semibold text-center text-white tracking-tight">
            No More Guesswork
          </h1>
          <p className="text-blue-200 text-center mb-4 text-base">
            Instantly visualize your individual post performance and engagement trends.
          </p>
          <div className="flex-1 flex items-center justify-center w-full">
            <Image
              className="h-60 w-80 object-cover rounded-2xl"
              src="/Screenshot 2025-06-25 201824.png"
              alt="metrics"
              width={320}
              height={240}
              style={{ objectFit: "cover", borderRadius: "1rem" }}
            />
          </div>
        </div>

        {/* Second card, same size and style */}
        <div className="bg-gradient-to-br from-[#232946] via-[#181c2a] to-[#232946] p-6 rounded-2xl shadow-xl border border-blue-400/20 w-full max-w-md flex flex-col justify-between items-center min-h-[380px]">
          <h1 className="text-xl md:text-2xl font-semibold text-center text-white mb-2 tracking-tight">
            Discover your top performing posts
          </h1>
          <p className="text-blue-200 text-center mb-4 text-base">Know what works. Instantly.</p>
          <div className="flex-1 flex items-center justify-center w-full">
            <Image
              className="h-65 w-60 object-cover rounded-2xl"
              src="/top.png"
              alt="top"
              width={240}
              height={260}
              style={{ objectFit: "cover", borderRadius: "1rem" }}
            />
          </div>
        </div>

        {/* Third card, same size and style */}
        <div className="bg-gradient-to-br from-[#232946] via-[#181c2a] to-[#232946] p-6 rounded-2xl shadow-xl border border-blue-400/20 w-full max-w-md flex flex-col justify-between items-center min-h-[380px]">
          <h1 className="text-xl md:text-2xl font-semibold text-center text-white mb-2 tracking-tight">
            Templates Inspired by What Actually Works
          </h1>
          <p className="text-blue-200 text-center mb-4 text-base">
           Our AI studies what works — and gives you ready-to-use templates tailored to your audience and goals.
          </p>
          <div className="flex-1 flex items-center justify-center w-full">
            <h1 className="text-3xl">Coming Soon!</h1>
          </div>
        </div>
      </div>
      <Link href="/features">
        <button className="underline text-blue-400 hover:text-blue-200 transition mt-6 mx-auto block cursor-pointer">
          see all features
        </button>
      </Link>
    </div>
  );
}