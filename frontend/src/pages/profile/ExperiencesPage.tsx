import ExperiencesSection from "../../components/profile/ExperiencesSection";
import PageHeader from "../../components/ui/PageHeader";

export default function ExperiencesPage() {
  return (
    <>
      <PageHeader
        title="Expériences"
        description="Détaille chaque poste — la génération choisira ce qui colle au mieux à l'offre ciblée."
      />
      <ExperiencesSection />
    </>
  );
}
