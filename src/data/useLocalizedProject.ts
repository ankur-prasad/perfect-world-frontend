import { useTranslation } from 'react-i18next'
import type { Project } from '../types/project.types'
import { projectTranslations } from './projectTranslations'

/**
 * Merge translated project copy (tagline, mission text, impact, charity blurb)
 * over the English source. Non-translatable fields — names, logos, images,
 * theme, Shopify handles — always come from the base project. English is the
 * fallback whenever a locale is missing a field.
 */
export function localizeProject(project: Project, language: string): Project {
  const lang = language.split('-')[0]
  const tr = projectTranslations[project.slug]?.[lang]
  if (!tr) return project

  return {
    ...project,
    tagline: tr.tagline ?? project.tagline,
    mission: {
      ...project.mission,
      problem: tr.problem ?? project.mission.problem,
      solution: tr.solution ?? project.mission.solution,
      impact: tr.impact ?? project.mission.impact,
      partnerCharity: {
        ...project.mission.partnerCharity,
        description: tr.charityDescription ?? project.mission.partnerCharity.description,
      },
    },
  }
}

/** Hook variant: localizes a single project into the active language. */
export function useLocalizedProject<T extends Project | null | undefined>(project: T): T {
  const { i18n } = useTranslation()
  if (!project) return project
  return localizeProject(project, i18n.language) as T
}
