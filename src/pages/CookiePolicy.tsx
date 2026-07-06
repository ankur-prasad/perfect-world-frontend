import { useTranslation } from 'react-i18next'
import LegalPageLayout from '../components/Layout/LegalPageLayout'
import LegalContent, { type LegalBlock } from '../components/Layout/LegalContent'

export default function CookiePolicy() {
  const { t } = useTranslation('legal')
  return (
    <LegalPageLayout title={t('cookie.title')}>
      <LegalContent blocks={t('cookie.blocks', { returnObjects: true }) as LegalBlock[]} />
    </LegalPageLayout>
  )
}
