import { useCallback, useEffect, useState } from "react";

import { profileApi } from "../api/profile";
import CertificationsSection from "../components/profile/CertificationsSection";
import EducationSection from "../components/profile/EducationSection";
import ExperiencesSection from "../components/profile/ExperiencesSection";
import LanguagesSection from "../components/profile/LanguagesSection";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import SkillsSection from "../components/profile/SkillsSection";
import { emptyProfile, type Profile } from "../types/profile";

type Status = "idle" | "loading" | "saving" | "saved" | "error";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileApi
      .get()
      .then((p) => {
        setProfile({ ...emptyProfile(), ...p });
        setStatus("idle");
      })
      .catch((e) => {
        setError(String(e));
        setStatus("error");
      });
  }, []);

  const patch = useCallback(
    (delta: Partial<Profile>) => setProfile((p) => ({ ...p, ...delta })),
    [],
  );

  const setField = <K extends keyof Profile>(key: K) =>
    (value: Profile[K]) => patch({ [key]: value } as Partial<Profile>);

  const handleSave = async () => {
    setStatus("saving");
    setError(null);
    try {
      const saved = await profileApi.put(profile);
      setProfile({ ...emptyProfile(), ...saved });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setError(String(e));
      setStatus("error");
    }
  };

  if (status === "loading") return <p className="muted">Chargement…</p>;

  return (
    <>
      <div className="toolbar">
        <h1 style={{ margin: 0 }}>Mon profil</h1>
        <button
          className="btn toolbar-right"
          onClick={handleSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      <PersonalInfoSection profile={profile} patch={patch} />
      <ExperiencesSection items={profile.experiences} setItems={setField("experiences")} />
      <ProjectsSection items={profile.projects} setItems={setField("projects")} />
      <EducationSection items={profile.educations} setItems={setField("educations")} />
      <SkillsSection items={profile.skills} setItems={setField("skills")} />
      <LanguagesSection items={profile.languages} setItems={setField("languages")} />
      <CertificationsSection items={profile.certifications} setItems={setField("certifications")} />

      {status === "saved" && <div className="toast success">Profil enregistré</div>}
      {status === "error" && error && <div className="toast error">Erreur : {error}</div>}
    </>
  );
}
