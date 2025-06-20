import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Zap, Globe, CheckCircle, TrendingUp, Lock } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
        {/* Background Elements (existing) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-violet-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative px-4 sm:px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl xl:text-7xl/none">
                  Banking
                  <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                  for Tomorrow
                </h1>
                <p className="max-w-[600px] text-xl text-gray-600 leading-relaxed sm:text-lg md:text-xl">
                  Experience the future of digital banking with AI-powered insights, instant transfers, and bank-grade
                  security that puts you in complete control of your financial journey.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg sm:text-base"
                  >
                    Start Your Journey
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dynamic & Small Hero Visual with Text (Revised) */}
            <div className="flex items-center justify-center relative min-h-[250px] md:min-h-[350px] w-full py-8">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Central Glowing Orb */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl animate-pulse">
                  <Zap className="h-16 w-16 text-white" />
                </div>

                {/* Text elements positioned outside the central orb */}
                <div className="absolute top-0 left-0 md:left-1/4 bg-purple-50/80 border border-purple-200 rounded-lg px-3 py-1 shadow-md text-purple-700 text-xs md:text-sm font-semibold animate-bounce delay-100">
                  Instant Transfers
                </div>
                <div className="absolute top-1/4 right-0 md:right-1/4 bg-violet-50/80 border border-violet-200 rounded-lg px-3 py-1 shadow-md text-violet-700 text-xs md:text-sm font-semibold animate-bounce delay-300">
                  Real-time Updates
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-purple-50/80 border border-purple-200 rounded-lg px-3 py-1 shadow-md text-purple-700 text-xs md:text-sm font-semibold animate-bounce delay-500">
                  Secure Banking
                </div>

                {/* Smaller pulsing particles (retained) */}
                <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-purple-300 opacity-70 animate-ping delay-100"></div>
                <div className="absolute top-1/4 -right-4 h-6 w-6 rounded-full bg-violet-400 opacity-70 animate-ping delay-300"></div>
                <div className="absolute bottom-0 left-1/3 h-5 w-5 rounded-full bg-purple-400 opacity-70 animate-ping delay-500"></div>
                <div className="absolute -bottom-4 -right-4 h-7 w-7 rounded-full bg-violet-300 opacity-70 animate-ping delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* New Section: Why Choose Quantum Bank */}
      <section className="w-full py-20 md:py-32 bg-white">
        <div className="container px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              <Globe className="h-4 w-4" />
              Your Trusted Financial Partner
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl max-w-3xl">
              Why Choose
              <span className="block bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Quantum Bank?
              </span>
            </h2>
            <p className="max-w-[800px] text-xl text-gray-600 leading-relaxed">
              We are committed to providing you with a banking experience that is secure, efficient, and tailored to
              your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Benefit Card 1 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-4 rounded-full bg-purple-100 mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Seamless Experience</h3>
              <p className="text-gray-600">
                Enjoy intuitive interfaces and smooth transactions across all our platforms.
              </p>
            </div>

            {/* Benefit Card 2 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-4 rounded-full bg-violet-100 mb-4">
                <Lock className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Uncompromised Security</h3>
              <p className="text-gray-600">
                Your financial safety is our top priority with advanced security protocols.
              </p>
            </div>

            {/* Benefit Card 3 */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-4 rounded-full bg-indigo-100 mb-4">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Growth</h3>
              <p className="text-gray-600">Leverage intelligent tools and insights to grow your wealth effectively.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
