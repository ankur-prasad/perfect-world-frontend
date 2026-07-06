import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function PrivacyPolicy() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('privacy.title')} subtitle={t('privacy.subtitle')}>
      <LegalContent blocks={t('privacy.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
