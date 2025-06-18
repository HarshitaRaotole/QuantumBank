"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { Zap } from "lucide-react"
import { useRef, useEffect, useState } from "react" // Import React, useRef, useEffect, useState

// Custom hook to detect if an element is in view
function useInView(options: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return [ref, inView] as const
}

export default function AboutPage() {
  // For the parallax effect on the image
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Calculate parallax transform
  const parallaxY = scrollPosition * 0.25 // Adjust multiplier for desired effect

  // Use useInView hook for each card
  const [missionRef, missionInView] = useInView({ threshold: 0.5 }) // Trigger when 50% of element is visible
  const [valuesRef, valuesInView] = useInView({ threshold: 0.5 })

  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto border border-purple-100 bg-white text-gray-900 shadow-lg rounded-xl overflow-hidden mb-8">
        <CardHeader className="p-0">
          <div className="relative w-full h-64 bg-gradient-to-br from-purple-500 to-violet-600 flex flex-col items-center justify-center text-white overflow-hidden">
            <div
              style={{ transform: `translateY(${parallaxY}px)` }} // Apply parallax effect
              className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
            >
              <Image
                src="/placeholder.svg?height=256&width=1024" // Placeholder image for visual appeal
                alt="Quantum Bank Building"
                width={1024}
                height={256}
                className="object-cover w-full h-full opacity-30"
              />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
              {/* Quantum Bank Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-md">
                  <Zap className="h-7 w-7 text-purple-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">Quantum Bank</h1>
              </div>
              <p className="text-lg md:text-xl font-semibold drop-shadow-sm">About Us: Your Future, Secured.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Innovating Your Financial Journey</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Quantum Bank is your trusted partner for modern and secure financial management. We leverage cutting-edge
              technology to provide seamless banking experiences, ensuring your money is safe and accessible, anytime,
              anywhere.
            </p>
          </div>

          {/* Our Mission and Our Values in a straight line */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div
              ref={missionRef}
              className={`space-y-4 p-4 border border-gray-100 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-700 ease-out ${
                missionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" /> Our Mission
              </h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Our mission is to empower individuals and businesses with intuitive tools for managing their finances,
                offering transparency, efficiency, and unparalleled customer support. We are committed to innovation and
                building lasting relationships with our clients.
              </p>
            </div>
            <div
              ref={valuesRef}
              className={`space-y-4 p-4 border border-gray-100 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-700 ease-out ${
                valuesInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" /> Our Values
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <span className="font-medium text-gray-800 text-base">Integrity:</span> Upholding the highest ethical
                  standards.
                </li>
                <li>
                  <span className="font-medium text-gray-800 text-base">Innovation:</span> Continuously improving our
                  services.
                </li>
                <li>
                  <span className="font-medium text-gray-800 text-base">Security:</span> Protecting your assets with
                  advanced measures.
                </li>
                <li>
                  <span className="font-medium text-gray-800 text-base">Customer Focus:</span> Prioritizing your
                  financial well-being.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
