"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Animated gradient background for hero */}
      <div className="absolute inset-0 h-screen animate-gradient bg-gradient-to-br from-violet-950 via-gray-950 to-indigo-950" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-0 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl animate-float-delayed" />

      {/* ===== SECTION 1: Hero — Right-aligned heading ===== */}
      <section className="relative z-10 flex min-h-screen items-center px-6 sm:px-12 lg:px-20">
        {/* Animated glowing lines — full screen background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: "12%", delay: 0, duration: 3.5 },
            { top: "22%", delay: 0.6, duration: 2.8 },
            { top: "35%", delay: 1.2, duration: 3.2 },
            { top: "48%", delay: 0.3, duration: 4 },
            { top: "60%", delay: 0.9, duration: 3 },
            { top: "72%", delay: 1.5, duration: 3.6 },
            { top: "85%", delay: 0.4, duration: 2.6 },
          ].map((line, i) => (
            <div key={i} className="absolute left-0 w-full h-[1px]" style={{ top: line.top }}>
              {/* Base subtle line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              {/* Bright pulse streaking right */}
              <motion.div
                className="absolute top-[-3px] h-[7px] w-28 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[2px]"
                animate={{ left: ["-15%", "115%"] }}
                transition={{
                  duration: line.duration,
                  delay: line.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Violet glow trail */}
              <motion.div
                className="absolute top-[-6px] h-[13px] w-44 rounded-full bg-gradient-to-r from-transparent via-violet-400/20 to-transparent blur-lg"
                animate={{ left: ["-20%", "110%"] }}
                transition={{
                  duration: line.duration,
                  delay: line.delay + 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          ))}

          {/* Glowing dots scattered across the screen */}
          {[
            { top: "18%", left: "10%", delay: 1.2, size: 6 },
            { top: "30%", left: "45%", delay: 2.8, size: 4 },
            { top: "55%", left: "25%", delay: 0.5, size: 5 },
            { top: "42%", left: "70%", delay: 1.8, size: 7 },
            { top: "75%", left: "55%", delay: 3.2, size: 4 },
            { top: "65%", left: "15%", delay: 2, size: 6 },
            { top: "25%", left: "80%", delay: 0.8, size: 5 },
            { top: "85%", left: "40%", delay: 1.5, size: 4 },
          ].map((dot, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                boxShadow: `0 0 ${dot.size * 3}px ${dot.size}px rgba(255,255,255,0.3), 0 0 ${dot.size * 6}px ${dot.size * 2}px rgba(139,92,246,0.2)`,
              }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1.2, 0.4] }}
              transition={{
                duration: 2.5,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left side — empty, lines fill the background */}
          <div className="hidden lg:block" />

          {/* Right side — heading and description */}
          <motion.div
            className="text-center lg:text-right"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
              Dheeraj Project for{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Social Booster Media
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 sm:text-xl leading-relaxed">
              A full-stack campaign management platform built with Next.js and FastAPI.
              Create, manage, and analyze your marketing campaigns with powerful
              data visualizations and real-time trending news integration.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-end">
              <a
                href="https://debugwithdheeraj.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105"
              >
                Who is Dheeraj
                <svg className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-gray-700 bg-gray-900/50 px-8 py-3.5 text-base font-semibold text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/50 hover:text-white"
              >
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 transition-colors hover:text-violet-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          aria-label="Scroll down"
        >
          <svg className="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.a>
      </section>

      {/* ===== SECTION 2: About — Left-aligned current hero text ===== */}
      <section id="about" className="relative z-10 bg-gray-950 px-6 py-24 sm:px-12 sm:py-32 lg:px-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Track, Analyze &{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Optimize
              </span>{" "}
              Your Campaigns
            </h2>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              A powerful dashboard to manage your marketing campaigns, visualize
              performance data, and stay ahead with trending industry news — all in
              one place.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { label: "Campaign Management", value: "Full CRUD" },
                { label: "Data Visualizations", value: "Real-time" },
                { label: "News Integration", value: "Trending" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-lg font-bold text-white sm:text-xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative h-[380px] w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900/50 overflow-hidden backdrop-blur-sm">
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-violet-600/15 blur-2xl" />
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-indigo-600/15 blur-2xl" />
              <Image src="/images/dashboard.png" alt="Dashboard Preview" width={480} height={380} className="relative z-10 w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 3: Two images with descriptions on the left ===== */}
      <section className="relative z-10 bg-gray-950 px-6 py-24 sm:px-12 sm:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-24">
          {/* Image block 1 */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300 mb-4">
                Campaign Management
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Full CRUD Operations
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed text-base">
                Create, read, update, and delete campaigns with an intuitive interface.
                Filter by status and category, sort by budget or date, and manage
                everything from a single dashboard. Every action is backed by a robust REST API.
              </p>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden shadow-2xl shadow-violet-500/10">
                <Image src="/images/Campaign2.png" alt="Campaign management interface" width={600} height={400} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>

          {/* Image block 2 */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 mb-4">
                Data Insights
              </span>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Interactive Visualizations
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed text-base">
                Gain actionable insights with real-time charts and metrics. View budget
                breakdowns by category, status distributions, campaign trends over time,
                and key summary metrics — all updating dynamically as your data changes.
              </p>
            </motion.div>
            <motion.div
              className="flex items-center justify-center order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden shadow-2xl shadow-indigo-500/10">
                <Image src="/images/dashboard.png" alt="Dashboard with data visualizations" width={600} height={400} className="w-full h-auto" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: Feature Cards ===== */}
      <section className="relative z-10 bg-gray-950 px-6 py-24 sm:px-12 sm:py-32 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Manage campaigns, visualize data, and track trends — all from one powerful platform.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-gray-900/80 overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-indigo-600/10 pointer-events-none" />
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-violet-500/0 group-hover:bg-violet-500/15 blur-2xl transition-all duration-500 pointer-events-none" />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-all duration-300 group-hover:bg-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-500/20">
                  {feature.icon}
                </div>
                <h3 className="relative z-10 mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="relative z-10 mt-3 text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: Footer ===== */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-950 px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-white">
                Campaign<span className="text-violet-400">Tracker</span>
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed max-w-md">
                A full-stack campaign management platform built by Dheeraj for Social Booster Media.
                Powered by Next.js 14, FastAPI, and Supabase.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Quick Links</h4>
              <ul className="mt-4 space-y-3">
                {[
                  { name: "Campaigns", href: "/campaigns" },
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Trends", href: "/trends" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-500 transition-colors hover:text-violet-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Tech Stack</h4>
              <ul className="mt-4 space-y-3">
                {["Next.js 14", "FastAPI", "Supabase", "Tailwind CSS", "Recharts"].map((tech) => (
                  <li key={tech} className="text-gray-500">{tech}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-gray-500">
              © 2026 Campaign Tracker. Built for Social Booster Media.
            </p>
            <p className="text-sm text-gray-600">
              Made with ❤️ by <a href="https://debugwithdheeraj.com/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">Dheeraj</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Campaign Management",
    description: "Create, update, and organize all your marketing campaigns in one place. Track status, budgets, platforms, and timelines with a full CRUD interface.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Data Visualization",
    description: "Gain insights with interactive charts and dashboards. View budget breakdowns, status distributions, and campaign trends over time at a glance.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Trending News",
    description: "Stay informed with real-time trending news from across the industry. Search by keyword and discover insights to time your campaigns perfectly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
  },
  {
    title: "REST API",
    description: "Every feature is backed by a well-structured REST API with proper validation, error handling, and Swagger documentation at /docs.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: "Supabase Database",
    description: "Powered by PostgreSQL via Supabase for reliable, scalable data persistence. Tables are auto-created on first startup.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    title: "Responsive Design",
    description: "Fully responsive across desktop, tablet, and mobile. Built with Tailwind CSS and smooth Framer Motion animations throughout.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
];
