// ============================================
// File: app/(public)/page.tsx
// Home Page - Hero & Features
// ============================================

import Link from "next/link";
import {
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Globe,
  Award,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Comprehensive student profiles, enrollment, and tracking systems.",
    },
    {
      icon: BookOpen,
      title: "Academic Planning",
      description:
        "Manage curriculum, schedules, and educational resources efficiently.",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Real-time insights and detailed reports on student progress.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with FERPA and GDPR compliance.",
    },
    {
      icon: Clock,
      title: "Attendance Tracking",
      description:
        "Automated attendance management with real-time notifications.",
    },
    {
      icon: Globe,
      title: "Parent Portal",
      description: "Keep parents engaged with transparent communication tools.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Students Managed" },
    { value: "500+", label: "Schools Trust Us" },
    { value: "99.9%", label: "Uptime Guaranteed" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Principal, Lincoln High School",
      content:
        "EduManage transformed our school administration. The intuitive interface and powerful features saved us countless hours.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "IT Director, Valley District",
      content:
        "Best investment we made. The support team is exceptional and the platform is incredibly reliable.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Teacher, Oakwood Academy",
      content:
        "Finally, a system that teachers actually enjoy using. Grade management has never been easier.",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Modern School Management</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Simplify School
                <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Administration
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The complete platform for modern education management.
                Streamline operations, enhance communication, and focus on what
                matters most—student success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button className="btn-primary">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 text-lg px-8">
                    Schedule Demo
                  </button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        1,245 Students
                      </p>
                      <p className="text-sm text-gray-600">
                        Active This Semester
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        94.2% Attendance
                      </p>
                      <p className="text-sm text-gray-600">Above Average</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        87% A/B Grades
                      </p>
                      <p className="text-sm text-gray-600">Top Performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to simplify school management and
              enhance educational outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Educators
            </h2>
            <p className="text-xl text-gray-600">
              See what schools are saying about EduManage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of schools already using EduManage to streamline
            their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
                Start Free Trial
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
