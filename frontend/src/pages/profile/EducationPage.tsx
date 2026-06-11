import EducationSection from "../../components/profile/EducationSection";
import PageHeader from "../../components/ui/PageHeader";

export default function EducationPage() {
  return (
    <>
      <PageHeader
        title="Formation"
        description="Diplômes, écoles, formations continues."
      />
      <EducationSection />
    </>
  );
}
