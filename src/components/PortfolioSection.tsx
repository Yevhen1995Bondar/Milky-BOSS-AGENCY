import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectCaseStudy } from '../types';
import { ArrowUpRight, ExternalLink, FileText } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assets';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

interface PortfolioSectionProps {
  onRequestProject: (projectTitle: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onRequestProject }) => {
  const { projects, dict, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle Projekte' : 'All Projects' },
    { id: 'smm', label: language === 'de' ? 'SMM & Content' : 'SMM & Content Strategy' },
    { id: 'shopify', label: language === 'de' ? 'Shopify Stores' : 'Shopify Stores' },
    { id: 'landingpage', label: language === 'de' ? 'Landingpages' : 'Landing Pages' },
    { id: 'corporate', label: language === 'de' ? 'Corporate & CRM' : 'Corporate & CRM' },
  ].filter((cat) => cat.id === 'all' || projects.some((p) => p.category === cat.id));


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
            <EditableText
              as="div"
              contentKey="portfolio.tag"
              defaultValue={dict.portfolio.tag}
              label="Тег секции проектов"
              className="text-xs font-semibold uppercase tracking-wider text-[#c81e32]"
            />
            <EditableText
              as="h2"
              contentKey="portfolio.heading"
              defaultValue={dict.portfolio.heading}
              label="Заголовок секции проектов"
              className="text-3xl sm:text-4xl font-bold font-display text-white mt-2 tracking-tight"
            />
            <EditableText
              as="p"
              contentKey="portfolio.subtext"
              defaultValue={dict.portfolio.subtext}
              multiline
              label="Подзаголовок секции проектов"
              className="text-zinc-400 mt-3 text-base block"
            />
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
                <EditableImage
                  contentKey={`project.${project.id}.image`}
                  defaultSrc={project.image}
                  alt={project.title}
                  loading="lazy"
                  label={`Фото кейса: ${project.client}`}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#11141c] via-transparent to-black/30" />
                <div className="absolute top-3.5 inset-x-3.5 flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/65 backdrop-blur-md text-white border border-white/10 truncate max-w-full">
                      {project.categoryLabel}
                    </span>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#c81e32] hover:bg-[#e5253e] text-white shadow-lg shadow-[#c81e32]/40 flex items-center gap-1 transition-all shrink-0"
                        title={language === 'de' ? 'Live-Website im neuen Tab öffnen' : 'Open live website in new tab'}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {project.pdfUrl && (
                      <a
                        href={resolveAssetUrl(project.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#c81e32] hover:bg-[#e5253e] text-white shadow-lg shadow-[#c81e32]/40 flex items-center gap-1 transition-all shrink-0"
                        title={language === 'de' ? 'Original PDF Case Study öffnen' : 'Open PDF Case Study'}
                      >
                        <FileText className="w-3 h-3" />
                        <span>PDF Study</span>
                      </a>
                    )}
                  </div>

                  <div className="shrink-0 text-[11px] font-mono text-zinc-200 bg-black/55 backdrop-blur-md px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                    {project.location}
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <EditableText
                    as="div"
                    contentKey={`project.${project.id}.client`}
                    defaultValue={project.client}
                    label="Клиент кейса"
                    className="text-xs text-zinc-400 uppercase tracking-wider font-mono"
                  />
                  <EditableText
                    as="h3"
                    contentKey={`project.${project.id}.title`}
                    defaultValue={project.title}
                    label="Заголовок кейса"
                    className="text-lg font-bold text-white font-display mt-1 group-hover:text-red-400 transition-colors block"
                  />
                  <EditableText
                    as="p"
                    contentKey={`project.${project.id}.overview`}
                    defaultValue={project.overview}
                    multiline
                    label="Описание кейса"
                    className="text-zinc-400 text-xs mt-2.5 line-clamp-2 leading-relaxed block"
                  />
                </div>

                {/* Key Metric Highlights */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3">
                    {project.results.slice(0, 2).map((res, i) => (
                      <div key={i}>
                        <EditableText
                          as="div"
                          contentKey={`project.${project.id}.res.${i}.value`}
                          defaultValue={res.value}
                          shared
                          label={`Метрика кейса ${project.client} #${i + 1}`}
                          className="text-lg font-bold font-display text-white tabular-nums"
                        />
                        <EditableText
                          as="div"
                          contentKey={`project.${project.id}.res.${i}.label`}
                          defaultValue={res.label}
                          label={`Подпись метрики ${project.client} #${i + 1}`}
                          className="text-xs text-zinc-400 truncate"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline underline-offset-4 cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{language === 'de' ? 'Details & Metriken' : 'Case Study & Stack'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1.5 rounded bg-[#c81e32]/20 hover:bg-[#c81e32] text-white border border-[#c81e32]/40 transition-colors inline-flex items-center gap-1 font-medium"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.pdfUrl && (
                        <a
                          href={resolveAssetUrl(project.pdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1.5 rounded bg-[#c81e32]/20 hover:bg-[#c81e32] text-white border border-[#c81e32]/40 transition-colors inline-flex items-center gap-1 font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                      <button
                        onClick={() => onRequestProject(project.title)}
                        className="text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-[#c81e32] text-zinc-200 hover:text-white transition-colors cursor-pointer"
                      >
                        {language === 'de' ? 'Anfragen' : 'Inquire'}
                      </button>
                    </div>

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
