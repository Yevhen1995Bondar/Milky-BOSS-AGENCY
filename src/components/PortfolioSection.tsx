import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/content';
import { ProjectCaseStudy } from '../types';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

interface PortfolioSectionProps {
  onRequestProject: (projectTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onRequestProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const categories = [
    { id: 'all', label: 'Alle Projekte' },
    { id: 'shopify', label: 'Shopify Onlineshops' },
    { id: 'landingpage', label: 'Landingpages' },
    { id: 'corporate', label: 'Corporate & CRM' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-[#0c0e15] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
              Erfolgsgeschichten &amp; Referenzen
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
              Echte Ergebnisse für ambitionierte Unternehmen.
            </h2>
            <p className="text-zinc-400 mt-3 text-base">
              Entdecken Sie ausgewählte Arbeiten aus den Bereichen E-Commerce, Lead-Generierung und intelligenter CRM-Automatisierung.
            </p>
          </div>

          {/* Filter Tabs (Interactive Segmented Control) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#141824] rounded-xl border border-white/5 self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#c81e32] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: ProjectCaseStudy) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group rounded-2xl border border-white/10 bg-[#11141c] overflow-hidden hover:border-[#c81e32]/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Media Visual with Hover State */}
              <div
                onClick={() => setActiveModalProject(project)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-black/60 cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-transparent opacity-80" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#090a0f]/80 backdrop-blur-md text-zinc-200 border border-white/10">
                    {project.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="w-8 h-8 rounded-full bg-[#090a0f]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-[#c81e32] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-zinc-400 font-mono">{project.client} · {project.location}</div>
                  <h3
                    onClick={() => setActiveModalProject(project)}
                    className="text-xl font-bold font-display text-white mt-1 group-hover:text-[#c81e32] transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h3>
                  <p className="text-zinc-300 text-sm mt-3 line-clamp-2 leading-relaxed">
                    {project.overview}
                  </p>
                </div>

                {/* Metrics Highlight Row */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3">
                    {project.results.slice(0, 2).map((res, i) => (
                      <div key={i}>
                        <div className="text-lg font-bold font-display text-white tabular-nums">
                          {res.value}
                        </div>
                        <div className="text-xs text-zinc-400 truncate">{res.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline underline-offset-4 cursor-pointer"
                    >
                      Case Study ansehen →
                    </button>
                    <button
                      onClick={() => onRequestProject(project.title)}
                      className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-[#c81e32] text-zinc-200 hover:text-white transition-colors cursor-pointer"
                    >
                      Anfragen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onRequestSimilar={onRequestProject}
      />
    </section>
  );
};
