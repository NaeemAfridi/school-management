// ============================================
// File: app/(public)/about/page.tsx
// About Page
// ============================================

import { Users, Target, Heart, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "Empowering educators to focus on teaching, not administration.",
    },
    {
      icon: Heart,
      title: "Student-Centered",
      description: "Every feature designed with student success in mind.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Building tools that bring schools, parents, and students together.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly evolving to meet the needs of modern education.",
    },
  ];

  const team = [
    { name: "John Smith", role: "CEO & Founder", image: "👨‍💼" },
    { name: "Sarah Johnson", role: "CTO", image: "👩‍💻" },
    { name: "Michael Brown", role: "Head of Product", image: "👨‍🎨" },
    { name: "Emily Davis", role: "Customer Success", image: "👩‍💼" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About EduManage
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We&#39;re on a mission to make school management simple, efficient,
            and effective for educators worldwide.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p className="mb-4">
              Founded in 2020, EduManage was born from a simple observation:
              schools were drowning in paperwork and outdated systems while
              trying to provide quality education in an increasingly digital
              world.
            </p>
            <p className="mb-4">
              Our founders, a team of educators and technologists, came together
              with a shared vision—to create a platform that would free
              educators from administrative burdens and allow them to focus on
              what truly matters: teaching and nurturing young minds.
            </p>
            <p>
              Today, EduManage serves over 500 schools worldwide, managing
              millions of student records and helping educators save countless
              hours every week.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-6xl">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
