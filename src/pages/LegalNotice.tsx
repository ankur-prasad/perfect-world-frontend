import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function LegalNotice() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('legalNotice.title')}>
      <LegalContent blocks={t('legalNotice.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
