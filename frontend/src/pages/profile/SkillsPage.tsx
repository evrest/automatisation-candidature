import SkillsSection from "../../components/profile/SkillsSection";
import PageHeader from "../../components/ui/PageHeader";

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Compétences"
        description="Langages, frameworks, outils, soft skills."
      />
      <SkillsSection />
    </>
  );
}
