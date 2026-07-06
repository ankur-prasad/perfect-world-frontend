import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function TermsOfService() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('terms.title')}>
      <LegalContent blocks={t('terms.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
