import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Shield, Zap, BarChart3, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Quantum Bank
            </span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="#security"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 relative group"
            >
              Security
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 relative group"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4 ml-8">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container relative px-6 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl xl:text-7xl/none">
                    Banking
                    <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                      Reimagined
                    </span>
                    for Tomorrow
                  </h1>
                  <p className="max-w-[600px] text-xl text-gray-600 leading-relaxed">
                    Experience the future of digital banking with AI-powered insights, instant transfers, and bank-grade
                    security that puts you in complete control of your financial journey.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                    >
                      Start Your Journey
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                    >
                      Explore Features
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="flex items-center justify-center relative">
                <div className="relative">
                  {/* Main Circle */}
                  <div className="relative h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <div className="absolute inset-6 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-inner">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                        <Zap className="h-14 w-14 text-white" />
                      </div>
                    </div>

                    {/* Floating Cards */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100 animate-bounce">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-gray-700">+₹25,000</span>
                      </div>
                    </div>

                    <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100 animate-bounce delay-500">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-gray-700">Secured</span>
                      </div>
                    </div>

                    <div className="absolute top-1/2 -left-8 bg-white rounded-xl p-3 shadow-xl border border-gray-100 animate-pulse">
                      <BarChart3 className="h-5 w-5 text-violet-600" />
                    </div>
                  </div>

                  {/* Background Decorations */}
                  <div className="absolute -top-8 -left-8 h-6 w-6 rounded-full bg-purple-300 animate-ping"></div>
                  <div className="absolute -bottom-4 -right-8 h-4 w-4 rounded-full bg-violet-400 animate-ping delay-700"></div>
                  <div className="absolute top-1/4 -right-12 h-3 w-3 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                <Globe className="h-4 w-4" />
                World-Class Features
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl max-w-3xl">
                Everything you need for
                <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Smart Banking
                </span>
              </h2>
              <p className="max-w-[800px] text-xl text-gray-600 leading-relaxed">
                Discover powerful features designed to simplify your financial life and help you achieve your goals
                faster.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Bank-Grade Security</h3>
                  <p className="text-center text-gray-600 leading-relaxed">
                    Advanced encryption, biometric authentication, and real-time fraud detection keep your money safe
                    24/7.
                  </p>
                  <div className="flex items-center gap-2 text-purple-600 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-10 w-10 text-violet-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Lightning Fast</h3>
                  <p className="text-center text-gray-600 leading-relaxed">
                    Send and receive money instantly across the globe with our cutting-edge payment infrastructure.
                  </p>
                  <div className="flex items-center gap-2 text-violet-600 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-10 w-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Smart Analytics</h3>
                  <p className="text-center text-gray-600 leading-relaxed">
                    AI-powered insights help you understand spending patterns and make smarter financial decisions.
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-r from-purple-600 to-violet-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>
          <div className="container relative px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl max-w-3xl">
                Ready to Transform Your Banking Experience?
              </h2>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-gray-200 py-12 bg-white">
        <div className="container px-6 md:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Quantum Bank
                </span>
                <p className="text-sm text-gray-500">© 2024 All rights reserved.</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 text-sm md:flex-row md:gap-8">
              <div className="flex gap-8">
                <Link
                  href="#"
                  className="text-gray-500 hover:text-purple-600 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-purple-600 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-purple-600 hover:underline underline-offset-4 transition-colors duration-200"
                >
                  Contact Support
                </Link>
              </div>
              <div className="text-gray-500 text-center md:text-left">+919340029112</div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
