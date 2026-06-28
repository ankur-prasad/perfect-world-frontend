import LegalPageLayout from '../components/Layout/LegalPageLayout'

export default function LegalNotice() {
  return (
    <LegalPageLayout title="Legal Notice">
      <h2>According to § 5 TMG</h2>
      <p>
        Perfect World<br />
        Nicholas Freitag<br />
        Am Hochwald 5, 82319 Starnberg, Germany
      </p>

      <h2>Represented by</h2>
      <p>Nicholas Freitag</p>

      <h2>Contact</h2>
      <p>
        Telephone: +49 15129109696<br />
        Email: <a href="mailto:info@perfectworld.global">info@perfectworld.global</a>
      </p>
    </LegalPageLayout>
  )
}
