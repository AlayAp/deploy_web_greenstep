import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedin, FaLeaf } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-50 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Brand and tagline */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FaLeaf className="text-green-200 text-2xl" />
            <span className="font-bold text-xl">GreenSteps</span>
          </div>
          <p className="text-green-100 text-base max-w-xs">
            Making carbon footprint tracking simple and actionable for everyone.
          </p>
        </div>
        {/* Features */}
        <div className="flex-1">
          <div className="font-bold mb-2">Features</div>
          <ul className="space-y-1">
            <li>
              <Link href="/activity-logger" className="hover:underline">Activity Logger</Link>
            </li>
            <li>
              <Link href="/analytics" className="hover:underline">Analytics</Link>
            </li>
            <li>
              <Link href="/reports" className="hover:underline">Reports</Link>
            </li>
            <li>
              <Link href="/community" className="hover:underline">Community</Link>
            </li>
          </ul>
        </div>
        {/* Resources */}
        <div className="flex-1">
          <div className="font-bold mb-2">Resources</div>
          <ul className="space-y-1">
            <li>
              <Link href="/blog" className="hover:underline">Blog</Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline">Guides</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">FAQ</Link>
            </li>
            <li>
              <Link href="/support" className="hover:underline">Support</Link>
            </li>
          </ul>
        </div>
        {/* Connect */}
        <div className="flex-1">
          <div className="font-bold mb-2">Connect</div>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="text-green-100 text-2xl hover:text-green-300" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-green-100 text-2xl hover:text-green-300" />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="text-green-100 text-2xl hover:text-green-300" />
            </a>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-green-800 mt-8 pt-4 text-center text-green-100 text-sm">
        © 2025 GreenSteps. All rights reserved.
      </div>
    </footer>
  );
}
