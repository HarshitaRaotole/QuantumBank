import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react" // Import social media icons

export function Footer() {
  return (
    <footer className="w-full bg-purple-800 py-12 text-white">
      {" "}
      {/* Changed background color to purple-800 */}
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
          {/* Column 1: Accounts */}
          <div>
            <h3 className="text-lg font-bold mb-4">Accounts</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white hover:underline">
                  Savings Account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:underline">
                  Current Account
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:underline">
                  Credit Cards
                </Link>
              </li>
              {/* Removed Loans and Investments */}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white hover:underline">
                  Online Banking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:underline">
                  Web App {/* Changed from Mobile App */}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:underline">
                  Instant Transfer {/* Changed from Fund Transfers */}
                </Link>
              </li>
              {/* Removed Bill Payments */}
              <li>
                <Link href="#" className="text-white hover:underline">
                  Secure Transactions {/* Changed from Notifications */}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white hover:underline">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-white mb-2">info@quantumbank.com</p>
            <p className="text-white mb-4">+91 9340029112</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-white hover:text-gray-300" />
              </Link>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-white hover:text-gray-300" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-white hover:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-white/20 pt-8 text-center">
          {/* Copyright */}
          <p className="text-sm text-white/70">© 2024 Quantum Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
