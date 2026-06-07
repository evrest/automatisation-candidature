export interface Experience {
  id?: number;
  company: string;
  position: string;
  location?: string | null;
  contractType?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  tags: string[];
  order: number;
}

export interface Project {
  id?: number;
  name: string;
  role?: string | null;
  context?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  url?: string | null;
  githubUrl?: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  tags: string[];
  order: number;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
  order: number;
}

export interface Skill {
  id?: number;
  category: string;
  name: string;
  level?: string | null;
  yearsOfExperience?: number | null;
  order: number;
}

export interface Language {
  id?: number;
  name: string;
  level: string;
  order: number;
}

export interface Certification {
  id?: number;
  name: string;
  issuer: string;
  date: string;
  url?: string | null;
  order: number;
}

export interface Profile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  drivingLicense: boolean;

  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  websiteUrl?: string | null;

  title: string;
  summary: string;
  interests: string[];

  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
}

export const emptyProfile = (): Profile => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  address: "",
  city: "",
  country: "",
  drivingLicense: false,
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  websiteUrl: "",
  title: "",
  summary: "",
  interests: [],
  experiences: [],
  projects: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
});
