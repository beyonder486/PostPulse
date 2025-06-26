import Image from "next/image";
import Hero from "@/components/Hero";
import DemoBox from "@/components/DemoBox";
import Testimonials from "@/components/Testimonial";
import FeatureTeaser from "@/components/Features";
import EmailCapture from "@/components/EmailCapture";
import AnimatedSection from "@/components/AnimatedSection";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32] text-white overflow-hidden z-0">
      {/* Blurred background circle */}
      <div className="absolute top-1/3 right-1/10 transform -translate-x-1/5 -translate-y-1/3 w-[870px] h-[800px] bg-gradient-to-r from-blue-600 to-teal-400 opacity-25 rounded-full blur-3xl -z-10" />
      
      {/* Main content above background, with animation */}
      <div className="relative z-10">
      <AnimatedSection>
          <Hero />
          <HowItWorks />
          <DemoBox />
          <FeatureTeaser />
      </AnimatedSection>
    </div>
    </div>
  );
}
