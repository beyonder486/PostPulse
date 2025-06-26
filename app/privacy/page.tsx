export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32] py-16 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/5 rounded-2xl p-8 shadow-lg border border-blue-400/10 mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-300 mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use PostPulse.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Information you provide directly (such as your email address and profile details).</li>
          <li>Usage data (such as generated posts, analytics, and preferences).</li>
          <li>Device and technical information (such as browser type and device ID).</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>To provide and improve our services.</li>
          <li>To personalize your experience.</li>
          <li>To communicate with you about updates or support.</li>
          <li>To analyze usage and enhance security.</li>
        </ul>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">3. Data Security</h2>
        <p className="text-gray-300 mb-4">
          We use industry-standard security measures to protect your data. Your information is never sold or shared with third parties except as required by law.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">4. Cookies</h2>
        <p className="text-gray-300 mb-4">
          We use cookies to enhance your experience and analyze site usage. You can control cookie preferences in your browser settings.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">5. Changes to This Policy</h2>
        <p className="text-gray-300 mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
        </p>
        <h2 className="text-xl font-semibold text-white mt-6 mb-2">6. Contact Us</h2>
        <p className="text-gray-300 mb-2">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@postpulse.app" className="text-blue-400 underline">support@postpulse.app</a>.
        </p>
        <p className="text-xs text-gray-500 mt-8 text-center">
          &copy; {new Date().getFullYear()} PostPulse
        </p>
      </div>
    </div>
  );
}