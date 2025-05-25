"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Headphones,
  PenTool,
  MessageSquare,
  Trophy,
  Users,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Target,
  Award,
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "Listening Test",
      description: "Practice with authentic IELTS listening materials and improve your comprehension skills",
      color: "bg-blue-500",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Reading Test",
      description: "Master academic and general reading passages with our comprehensive test modules",
      color: "bg-green-500",
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Writing Test",
      description: "Develop your writing skills with Task 1 and Task 2 practice sessions",
      color: "bg-purple-500",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Speaking Test",
      description: "Prepare for the speaking test with interactive practice sessions",
      color: "bg-orange-500",
    },
  ]

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Students Trained" },
    { icon: <Trophy className="w-6 h-6" />, value: "95%", label: "Success Rate" },
    { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Available" },
    { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Rating" },
  ]

  const benefits = [
    "Authentic IELTS test environment",
    "Instant scoring and feedback",
    "Comprehensive skill assessment",
    "Progress tracking and analytics",
    "Expert-designed content",
    "Mobile-friendly platform",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dream Zone</h1>
              <p className="text-xs text-gray-600">IELTS Excellence</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button
              onClick={() => router.push("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Award className="w-4 h-4 mr-2" />
                  Official IELTS Preparation Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Master Your
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {" "}
                    IELTS{" "}
                  </span>
                  Journey
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the most comprehensive IELTS preparation platform designed to help you achieve your target
                  band score with confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
                >
                  Start Your Test
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/register")}
                  className="text-lg px-8 py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Register Now
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2 text-blue-600">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl transform rotate-6 opacity-20" />
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">IELTS Practice Test</h3>
                      <Badge className="bg-green-100 text-green-800">Live</Badge>
                    </div>
                    <div className="space-y-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center text-white`}
                          >
                            {feature.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{feature.title}</div>
                            <div className="text-sm text-gray-600">Ready to start</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Begin Assessment</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete IELTS Test Suite</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice all four IELTS skills with our comprehensive testing platform designed by experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Why Choose Dream Zone?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform provides everything you need to succeed in your IELTS examination with cutting-edge
                technology and expert guidance.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your Progress</h3>
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Listening</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-20 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">8.5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reading</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">7.5</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Writing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-18 h-2 bg-purple-600 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">7.0</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Speaking</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-22 h-2 bg-orange-600 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">8.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Overall Band</span>
                      <span className="text-2xl font-bold text-blue-600">7.75</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Achieve Your Target Band Score?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful IELTS candidates who have achieved their dreams with Dream Zone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/login")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Start Your Test Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/register")}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
            >
              Register for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dream Zone</h3>
                  <p className="text-sm text-gray-400">IELTS Excellence</p>
                </div>
              </div>
              <p className="text-gray-400">
                Your trusted partner for IELTS success with comprehensive preparation tools and expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/login")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Test Modules</h4>
              <div className="space-y-2 text-gray-400">
                <p>Listening Test</p>
                <p>Reading Test</p>
                <p>Writing Test</p>
                <p>Speaking Test</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Telegram: @T0pSpeed524kmh</p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Dream Zone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
