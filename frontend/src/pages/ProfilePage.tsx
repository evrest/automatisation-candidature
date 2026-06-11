import CertificationsSection from "../components/profile/CertificationsSection";
import EducationSection from "../components/profile/EducationSection";
import ExperiencesSection from "../components/profile/ExperiencesSection";
import LanguagesSection from "../components/profile/LanguagesSection";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import SkillsSection from "../components/profile/SkillsSection";
import { useProfile } from "../contexts/ProfileContext";

export default function ProfilePage() {
  const { status, error } = useProfile();

  if (status === "loading") return <p className="muted">Chargement…</p>;

  return (
    <>
      <PersonalInfoSection />
      <ExperiencesSection />
      <ProjectsSection />
      <EducationSection />
      <SkillsSection />
      <LanguagesSection />
      <CertificationsSection />

      {status === "saved" && <div className="toast success">Profil enregistré</div>}
      {status === "error" && error && <div className="toast error">Erreur : {error}</div>}
    </>
  );
}
