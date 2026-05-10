import { ExternalLink, ArrowRight, ShieldCheck, UserPlus, CalendarCheck, BarChart3, Database, Globe, Smartphone, Activity } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Health Metro | Ecosystem Showcase',
  description: 'A presentation of the Health Metro platform architecture and applications.',
};

export default function PresentationPage() {
  const projects = [
    {
      title: 'Customer Landing Page',
      description: 'The public-facing marketing website designed to capture leads, explain services, and direct users to booking forms.',
      url: 'https://healthmetro-lannding.vercel.app',
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20',
      textColor: 'text-blue-500',
      workflow: [
        'Responsive, mobile-first aesthetic design',
        'Direct Call-to-Action routing to dynamic forms',
        'Built with Next.js App Router for optimal SEO and performance'
      ]
    },
    {
      title: 'Dynamic Registration Hub',
      description: 'A centralized forms engine handling multi-tenant B2B partner onboarding and B2C customer blood-test bookings.',
      url: 'https://healthmetro-forms.vercel.app',
      icon: <UserPlus className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
      textColor: 'text-emerald-500',
      workflow: [
        'Client ID Verification: Customer forms require a valid Partner/Provider ID to proceed',
        'Real-time GPS capture via Mapbox API for field agents',
        'Dynamic Slot Filtering: Prevents booking on globally blocked time slots'
      ]
    },
    {
      title: 'Admin Operating System',
      description: 'The secure command center for Health Metro staff to approve partners, manage slots, and view real-time data.',
      url: 'https://healthmetro-admin.vercel.app',
      icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      textColor: 'text-purple-500',
      workflow: [
        'Middleware Authentication: Protected by HTTP-only secure session cookies',
        'Real-time Supabase Integration: Instantly approve B2B partner applications',
        'Global Slot Config: Blocked slots immediately disappear from live customer forms'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-[family-name:var(--font-inter)] selection:bg-[#027473]/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#027473] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-[#1A2020]">Health Metro</span>
          </div>
          <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-[#027473] transition-colors uppercase tracking-wider">
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Database className="w-3.5 h-3.5" />
            Production Infrastructure
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1A2020] tracking-tight leading-[1.1] mb-6">
            An Integrated Ecosystem for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#027473] to-emerald-500">Modern Healthcare</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Three independent Vercel deployments working seamlessly together, powered by a unified Supabase PostgreSQL backend. Built for scale, security, and speed.
          </p>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(2,116,115,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight className={`w-6 h-6 ${project.textColor}`} />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${project.color}`}>
                {project.icon}
              </div>
              
              <h3 className="text-xl font-black text-[#1A2020] tracking-tight mb-3">
                {project.title}
              </h3>
              
              <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Technical Workflow</div>
                {project.workflow.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${project.textColor}`} />
                    <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              
              <a 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm border transition-all ${project.color} hover:bg-transparent`}
              >
                Visit Live Site
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-medium text-sm">
          <ShieldCheck className="w-4 h-4" />
          Secured by Next.js Middleware & Supabase RLS
        </div>
      </footer>
    </div>
  );
}
