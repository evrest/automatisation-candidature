import PersonalInfoSection from "../../components/profile/PersonalInfoSection";
import PageHeader from "../../components/ui/PageHeader";

export default function IdentityPage() {
  return (
    <>
      <PageHeader
        title="Identité"
        description="Tes coordonnées, liens et pitch — le tronc commun de chaque CV."
      />
      <PersonalInfoSection />
    </>
  );
}
