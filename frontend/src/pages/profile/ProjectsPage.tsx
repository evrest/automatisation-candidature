import ProjectsSection from "../../components/profile/ProjectsSection";
import PageHeader from "../../components/ui/PageHeader";

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projets"
        description="Side-projects, contributions open source, travaux marquants."
      />
      <ProjectsSection />
    </>
  );
}
