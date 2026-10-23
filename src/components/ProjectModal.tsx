import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ArrowRight, MapPin, Calendar, Clock, ExternalLink } from 'lucide-react';
import { ProjectCaseStudy } from '../types';

interface ProjectModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
  onRequestSimilar: (title: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onRequestSimilar,
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-[#11141c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0e15]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#c81e32]/20 text-[#c81e32]">
                {project.categoryLabel}
              </span>
              <span className="text-sm text-zinc-400 font-mono">Case Study #{project.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Modal schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Title & Metadata Strip */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c81e32]" />
                  <span>{project.location}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{project.year}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Umsetzung: {project.duration}</span>
                </span>
              </div>
            </div>

            {/* Visual Media Showcase */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-[16/9] max-h-96">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Quantified Results Grid */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Messbare Projektergebnisse:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.results.map((res, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-2xl font-bold text-white font-display tabular-nums">
                      {res.value}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">{res.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge & Solution Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-red-950/15 border border-red-900/30">
                <h5 className="text-sm font-bold text-red-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c81e32]" />
                  Ausgangslage &amp; Herausforderung
                </h5>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-emerald-950/15 border border-emerald-900/30">
                <h5 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Milky BOSS Lösung &amp; Umsetzung
                </h5>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Eingesetzte Technologien &amp; Integrationen:
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0c0e15]">
            <span className="text-xs text-zinc-400 hidden sm:inline">
              Möchten Sie ein vergleichbares Ergebnis für Ihr Unternehmen?
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white"
              >
                Schließen
              </button>
              <button
                onClick={() => {
                  onRequestSimilar(project.title);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#c81e32] hover:bg-[#b01829] rounded-md transition-colors"
              >
                <span>Ähnliches Projekt anfragen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
