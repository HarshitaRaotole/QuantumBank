"use client"

import { Shield, Zap, BarChart3, Globe } from "lucide-react"

export default function FeaturesPage() {
  return (
    <main className="flex-1">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
