import { useProfile } from "../../contexts/ProfileContext";
import { Checkbox, Field, Row, TagList, TextArea } from "../ui/Field";

/**
 * Section "Identité" — pilote directement le contexte profil via patch().
 * Pas de prop : la page consommatrice se contente de la rendre.
 */
export default function PersonalInfoSection() {
  const { profile, patch } = useProfile();

  return (
    <>
      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Coordonnées</h2>
            <p className="card-subtitle">Nom, contact, adresse — réutilisés sur tous les documents générés.</p>
          </div>
        </header>
        <div className="card-body">
          <Row>
            <Field label="Prénom" value={profile.firstName} onChange={(v) => patch({ firstName: v })} />
            <Field label="Nom" value={profile.lastName} onChange={(v) => patch({ lastName: v })} />
          </Row>
          <Row>
            <Field label="Email" type="email" value={profile.email} onChange={(v) => patch({ email: v })} />
            <Field label="Téléphone" value={profile.phone} onChange={(v) => patch({ phone: v })} />
          </Row>
          <Row>
            <Field label="Date de naissance" type="date" value={profile.birthDate ?? ""} onChange={(v) => patch({ birthDate: v })} />
            <Field label="Ville" value={profile.city ?? ""} onChange={(v) => patch({ city: v })} />
            <Field label="Pays" value={profile.country ?? ""} onChange={(v) => patch({ country: v })} />
          </Row>
          <Field label="Adresse" value={profile.address ?? ""} onChange={(v) => patch({ address: v })} />
          <Checkbox
            label="Permis de conduire"
            checked={profile.drivingLicense}
            onChange={(v) => patch({ drivingLicense: v })}
          />
        </div>
      </section>

      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Liens</h2>
            <p className="card-subtitle">Pour intégrer LinkedIn, GitHub ou ton portfolio sur le CV.</p>
          </div>
        </header>
        <div className="card-body">
          <Row>
            <Field label="LinkedIn" value={profile.linkedinUrl ?? ""} onChange={(v) => patch({ linkedinUrl: v })} placeholder="https://linkedin.com/in/..." />
            <Field label="GitHub" value={profile.githubUrl ?? ""} onChange={(v) => patch({ githubUrl: v })} placeholder="https://github.com/..." />
          </Row>
          <Row>
            <Field label="Portfolio" value={profile.portfolioUrl ?? ""} onChange={(v) => patch({ portfolioUrl: v })} />
            <Field label="Site web" value={profile.websiteUrl ?? ""} onChange={(v) => patch({ websiteUrl: v })} />
          </Row>
        </div>
      </section>

      <section className="card">
        <header className="card-header">
          <div>
            <h2 className="card-title">Pitch</h2>
            <p className="card-subtitle">L'accroche en haut du CV, adaptable par l'IA selon le métier visé.</p>
          </div>
        </header>
        <div className="card-body">
          <Field
            label="Titre professionnel"
            value={profile.title}
            onChange={(v) => patch({ title: v })}
            placeholder="ex. Développeur Full-Stack"
          />
          <TextArea
            label="Résumé / bio courte"
            value={profile.summary}
            onChange={(v) => patch({ summary: v })}
            placeholder="3 à 5 lignes pour situer ton profil — l'IA pourra le condenser ou l'adapter."
          />
          <TagList
            label="Centres d'intérêt"
            value={profile.interests}
            onChange={(v) => patch({ interests: v })}
            placeholder="photo, escalade, open source..."
          />
        </div>
      </section>
    </>
  );
}
