import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectCaseStudy } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { useLanguage } from '../context/LanguageContext';

interface PortfolioSectionProps {
  onRequestProject: (projectTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onRequestProject }) => {
  const { projects, dict, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Projekte' : 'All Projects' },
    { id: 'shopify', label: language === 'de' ? 'Shopify Stores' : 'Shopify Stores' },
    { id: 'landingpage', label: language === 'de' ? 'Landingpages' : 'Landing Pages' },
    { id: 'corporate', label: language === 'de' ? 'Corporate & CRM' : 'Corporate & CRM' },
  ];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-[#0c0e15] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]">
              {dict.portfolio.tag}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight">
              {dict.portfolio.heading}
            </h2>
            <p className="text-zinc-400 mt-3 text-base">
              {dict.portfolio.subtext}
            </p>
          </div>

          {/* Filter Tabs */}
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
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="group rounded-2xl border border-white/10 bg-[#11141c] overflow-hidden flex flex-col hover:border-[#c81e32]/50 transition-all duration-300 shadow-xl"
            >
              {/* Thumbnail Image */}
              <div className="relative h-56 overflow-hidden bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-black/30" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {project.categoryLabel}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-xs font-mono text-zinc-300 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                  {project.location}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                    {project.client}
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mt-1 group-hover:text-red-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                    {project.overview}
                  </p>
                </div>

                {/* Key Metric Highlights */}
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
                      className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline underline-offset-4 cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{language === 'de' ? 'Case Study ansehen' : 'View Case Study'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRequestProject(project.title)}
                      className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-[#c81e32] text-zinc-200 hover:text-white transition-colors cursor-pointer"
                    >
                      {language === 'de' ? 'Anfragen' : 'Inquire'}
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
