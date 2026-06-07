import type { Profile } from "../../types/profile";
import { Checkbox, Field, Row, TagList, TextArea } from "../ui/Field";

interface Props {
  profile: Profile;
  patch: (p: Partial<Profile>) => void;
}

export default function PersonalInfoSection({ profile, patch }: Props) {
  return (
    <section className="section">
      <h2>Identité</h2>

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

      <h2 style={{ marginTop: "1.5rem" }}>Liens</h2>
      <Row>
        <Field label="LinkedIn" value={profile.linkedinUrl ?? ""} onChange={(v) => patch({ linkedinUrl: v })} />
        <Field label="GitHub" value={profile.githubUrl ?? ""} onChange={(v) => patch({ githubUrl: v })} />
      </Row>
      <Row>
        <Field label="Portfolio" value={profile.portfolioUrl ?? ""} onChange={(v) => patch({ portfolioUrl: v })} />
        <Field label="Site web" value={profile.websiteUrl ?? ""} onChange={(v) => patch({ websiteUrl: v })} />
      </Row>

      <h2 style={{ marginTop: "1.5rem" }}>Pitch</h2>
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
        placeholder="3 à 5 lignes pour le haut du CV"
      />
      <TagList
        label="Centres d'intérêt"
        value={profile.interests}
        onChange={(v) => patch({ interests: v })}
        placeholder="photo, escalade, open source..."
      />
    </section>
  );
}
