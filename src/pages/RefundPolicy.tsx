import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function RefundPolicy() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('refund.title')}>
      <LegalContent blocks={t('refund.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
