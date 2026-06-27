'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const techGroups = [
  {
    key: 'backend',
    items: ['Java', 'Spring Boot', 'NestJS', 'Node.js', '.NET', 'Python'],
  },
  {
    key: 'frontend',
    items: ['Angular', 'React', 'Vue', 'Next.js', 'Flutter'],
  },
  {
    key: 'databases',
    items: ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Redis'],
  },
  {
    key: 'cloud',
    items: ['AWS', 'Azure', 'Google Cloud'],
  },
  {
    key: 'devops',
    items: ['Docker', 'Kubernetes', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Terraform'],
  },
  {
    key: 'ai',
    items: ['OpenAI', 'Gemini', 'Claude', 'Ollama', 'LangChain', 'MCP'],
  },
];

export default function Technologies() {
  const t = useTranslations('technologies');

  return (
    <section id="tecnologias" className="section-padding bg-[#111827]/50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-lumeraq-gray">{t('subtitle')}</p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-lumeraq-blue">
                {t(group.key)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm font-medium text-lumeraq-gray transition-colors hover:border-lumeraq-blue/30 hover:text-lumeraq-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
