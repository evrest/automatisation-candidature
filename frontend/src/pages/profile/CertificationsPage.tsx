import CertificationsSection from "../../components/profile/CertificationsSection";
import PageHeader from "../../components/ui/PageHeader";

export default function CertificationsPage() {
  return (
    <>
      <PageHeader
        title="Certifications"
        description="Diplômes professionnels, cours en ligne validés, accréditations."
      />
      <CertificationsSection />
    </>
  );
}
