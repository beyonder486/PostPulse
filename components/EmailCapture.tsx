// components/EmailCapture.tsx
'use client';
import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState<string>('');

  return (
    <div className="mt-12 bg-gray-800 p-6 rounded-xl text-center">
      <h3 className="text-white text-xl font-bold">Want 5 Free Posts Weekly?</h3>
      <p className="text-gray-300 mt-2">Drop your email—no credit card needed.</p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your work email"
          className="bg-gray-700 text-white px-4 py-2 rounded-lg sm:w-64"
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg">
          Get Free Posts
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-2">
        We&apos;ll send login magic links (no passwords).
      </p>
    </div>
  );
}