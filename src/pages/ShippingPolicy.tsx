import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function ShippingPolicy() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('shipping.title')}>
      <LegalContent blocks={t('shipping.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
