import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import JobsPage from "./pages/JobsPage";
import CertificationsPage from "./pages/profile/CertificationsPage";
import EducationPage from "./pages/profile/EducationPage";
import ExperiencesPage from "./pages/profile/ExperiencesPage";
import IdentityPage from "./pages/profile/IdentityPage";
import LanguagesPage from "./pages/profile/LanguagesPage";
import ProfileLayout from "./pages/profile/ProfileLayout";
import ProjectsPage from "./pages/profile/ProjectsPage";
import SkillsPage from "./pages/profile/SkillsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/profile/identity" replace />} />

        {/* /profile/* — partagent un ProfileProvider unique */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="identity" replace />} />
          <Route path="identity" element={<IdentityPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="languages" element={<LanguagesPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
        </Route>

        <Route path="/jobs" element={<JobsPage />} />

        <Route path="*" element={<Navigate to="/profile/identity" replace />} />
      </Route>
    </Routes>
  );
}
