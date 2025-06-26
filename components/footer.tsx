// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const links = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="border-t border-gray-800 bg-blue-900/40 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col items-center gap-6">
        <div className='flex gap-4'>
        <img className='h-15 w-18 ' src="pulse logo.png" alt="" />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">PostPulse</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-500">
          © {currentYear} PostPulse. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <span className="sr-only">Twitter</span>
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            <span className="sr-only">LinkedIn</span>
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}