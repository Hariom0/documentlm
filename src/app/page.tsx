"use client";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Download,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";

export default function LandingPage() {
  const features = [
    {
      icon: Upload,
      title: "Upload Notes",
      description:
        "Upload PDF files or paste text directly into our intuitive interface",
    },
    {
      icon: Brain,
      title: "AI Processing",
      description:
        "Our advanced AI analyzes your content and extracts key information",
    },
    {
      icon: FileText,
      title: "Generate Summaries",
      description:
        "Get concise, well-structured summaries of your notes instantly",
    },
    {
      icon: BookOpen,
      title: "Create MCQs",
      description:
        "Automatically generate multiple-choice questions for effective studying",
    },
    {
      icon: Download,
      title: "Export Results",
      description: "Download your summaries and MCQs as PDF or CSV files",
    },
  ];

  return (
    <div className="min-h-screen">

      <Header title="DocumentLM" showDashboardButton />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100/40 to-blue-200/50">
        <div className="max-w-7xl mx-auto text-center ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-gradient-to-r from-teal-600/80 to-blue-700/70 text-white text-sm font-semibold px-4 py-1 rounded-full m-2 shadow-md">
              AI-Powered Learning Assistant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold p-5 mb-6">
              Transform Your Notes into
              <span className="text-blue-800 block mt-2">
                Smart Study Materials
              </span>
            </h1>
            <p className="text-lg text-muted max-w-3xl mx-auto mb-10">
              Upload your notes and let our AI create comprehensive summaries
              and multiple-choice questions to enhance your learning experience.
              Perfect for students, educators, and lifelong learners.
            </p>
              <Link href="/dashboard">
                <Button className="text-lg px-6 py-2 text-white bg-gradient-to-br from-indigo-800/90 to-blue-600/90 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center mx-auto font-semibold cursor-pointer hover:bg-blue-900 transition-colors duration-300 ease-in-out">
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link> 
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50/60 to-stone-200/50 border border-t border-stone-400">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How DocumentLM Works
            </h2>
            <p className="text-lg text-muted text-stone-700 max-w-2xl mx-auto">
              Our simple 5-step process transforms your notes into powerful
              study materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-br from-blue-100 to-blue-400/40 shadow-sm hover:shadow-lg transition-shadow duration-300 border-border/50 border-stone-300 shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-10 h-10 bg-white/30 m-1 p-2 shadow-md rounded-full" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="bg-gradient-to-br from-blue-100/40 to-blue-200/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              See DocumentLM in Action
            </h2>
            <p className="text-xl text-muted text-stone-700 max-w-2xl mx-auto">
              Experience the power of AI-generated summaries and MCQs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 border-border/40 border-stone-300 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-700 px-2">
                  Sample Summary
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Key Points:</strong>{" "}
                    Photosynthesis is the process by which plants convert light
                    energy into chemical energy...
                  </p>
                  <p>
                    <strong className="text-foreground">Main Concepts:</strong>{" "}
                    Chlorophyll, carbon dioxide absorption, oxygen production...
                  </p>
                  <p>
                    <strong className="text-foreground">Applications:</strong>{" "}
                    Understanding plant biology, environmental science...
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 border-border/50 border-stone-300">
                <h3 className="text-lg font-semibold mb-4 text-blue-700 px-2">
                  Sample MCQ
                </h3>
                <div className="space-y-4">
                  <p className="font-medium">
                    What gas do plants absorb during photosynthesis?
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                      <span>A) Oxygen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-b from-blue-700/80 to-teal-600/70 border-2 border-primary "></div>
                      <span className="text-primary font-medium">
                        B) Carbon Dioxide <span className="text-blue-600 font-semibold">✓</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                      <span>C) Nitrogen</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                      <span>D) Hydrogen</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50/60 to-stone-200/50  border border-t border-stone-400">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-6 text-blue-800">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted text-stone-600 px-30 mb-8">
              Join thousands of students and educators who are already using
              DocumentLM to enhance their learning experience.
            </p>
            <Link href="/dashboard">
              <Button className="text-md px-6 py-2 text-white bg-gradient-to-br from-indigo-800/90 to-blue-600/90 rounded-lg shadow-lg flex items-center justify-center mx-auto font-semibold cursor-pointer hover:bg-blue-900 transition-colors duration-300 ease-in-out">
                Get Started!
                <ArrowRight className="w-5 h-5 ml-3 " />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
