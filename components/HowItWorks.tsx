'use client';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
// Removed unused import: ArrowRightIcon
import { AnimatePresence, motion } from 'framer-motion';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  expandedContent?: React.ReactNode;
}

const steps: Step[] = [
  {
    icon: '✍️',
    title: 'You Describe Your Niche',
    description: 'Tell us your industry (e.g., &quot;SaaS marketing&quot;, &quot;Freelance design&quot;) and target audience.',
    expandedContent: (
      <div className="mt-3 text-gray-300 text-sm">
        <p>Example inputs we optimize for:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>&quot;I help e-commerce brands grow&quot;</li>
          <li>&quot;Web developer specializing in Next.js&quot;</li>
        </ul>
      </div>
    )
  },
  {
    icon: '🤖',
    title: 'AI Generates Drafts',
    description: 'Get tailored LinkedIn post drafts in seconds.',
    expandedContent: (
      <div className="mt-3 text-gray-300 text-sm">
        <p>Our AI specializes in:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Thought leadership posts</li>
          <li>Case study templates</li>
          <li>Engagement hooks</li>
        </ul>
      </div>
    )
  },
  {
    icon: '📤',
    title: 'Copy & Post',
    description: 'One-click copy to LinkedIn with optimal formatting.',
    expandedContent: (
      <div className="mt-3 text-gray-300 text-sm">
        <p>Pro tips included:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Best times to post (underway)</li>
          <li>Hashtag suggestions</li>
          <li>Templates inspired by top-performing posts (underway)</li>
        </ul>
      </div>
    )
  }
];

export default function HowItWorksCards() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <main className='mt-20 md:mx-25 mx-10'>
      <h1 className='md:text-4xl text-2xl font-bold mb-5 bg-gradient-to-b from-[#ffffff] to-[#78f3fcc5] bg-clip-text text-transparent'>
        Tired of blank screens and content guilt?
      </h1>
      <h3 className='md:text-lg text-sm bg-gradient-to-b from-gray-200 ml-5 font-semibold to-gray-400 text-transparent bg-clip-text mx-auto mb-12'>
        That&apos;s where Postpulse steps in. We eliminate the guesswork, <br /> turning your ideas into engaging posts in a flash. Here&apos;s how simple it is:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            layout
            className={`bg-gray-700/30 border-1 shadow-blue-400/30 shadow-xl border-gray-200/30 rounded-lg p-5 cursor-pointer ${
              expandedIndex === index ? 'border border-blue-500/30' : 'hover:transform hover:scale-105 hover:border-blue-500/30 hover:shadow-lg transition-all duration-300 ease-in-out'
            }`}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            transition={{
              layout: { duration: 0.3, ease: "easeInOut" }
            }}
          >
            <motion.div layout className="flex flex-col justify-between items-center">
              <div className='flex flex-col text-center items-center'>
                <span className="text-2xl">{step.icon}</span>
                <h3 className="text-white font-medium mt-3">{step.title}</h3>
                <p className="text-gray-300 mt-1 text-sm">{step.description}</p>
              </div>
              {expandedIndex === index ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400 mt-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400 mt-5" />
              )}
            </motion.div>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    transition: { duration: 0.2, delay: 0.15 } // Slight delay for smoother reveal
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -5,
                    transition: {
                      opacity: { duration: 0.15 },
                      height: { duration: 0.3, ease: [0.17, 0.67, 0.24, 0.99] },
                      y: { duration: 0.25 }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.expandedContent}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </main>
  );
}