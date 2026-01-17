import { placeHolderImages } from './placeholder-images';

const devAvatar1 = placeHolderImages.find(p => p.id === 'dev-avatar-1')?.imageUrl || '';
const devAvatar2 = placeHolderImages.find(p => p.id === 'dev-avatar-2')?.imageUrl || '';
const devAvatar3 = placeHolderImages.find(p => p.id === 'dev-avatar-3')?.imageUrl || '';

const companyLogo1 = placeHolderImages.find(p => p.id === 'company-logo-1')?.imageUrl || '';
const companyLogo2 = placeHolderImages.find(p => p.id === 'company-logo-2')?.imageUrl || '';
const companyLogo3 = placeHolderImages.find(p => p.id === 'company-logo-3')?.imageUrl || '';

export const mockProjects = [
  {
    id: "1",
    title: "E-commerce Platform Redesign",
    company: "Shopify",
    companyLogo: companyLogo1,
    budget: 8000,
    skills: ["UI/UX", "React", "Figma"],
    proposals: 5,
    createdAt: "2024-07-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Mobile App for Fitness Tracking",
    company: "Fitbit",
    companyLogo: companyLogo2,
    budget: 12000,
    skills: ["React Native", "Firebase", "Node.js"],
    proposals: 12,
    createdAt: "2024-07-14T12:30:00Z",
  },
  {
    id: "3",
    title: "Data Visualization Dashboard",
    company: "DataBricks",
    companyLogo: companyLogo3,
    budget: 6500,
    skills: ["D3.js", "Python", "SQL"],
    proposals: 8,
    createdAt: "2024-07-12T09:00:00Z",
  },
  {
      id: "4",
      title: "AI-Powered Chatbot",
      company: "Intercom",
      companyLogo: companyLogo1,
      budget: 15000,
      skills: ["NLP", "Python", "TensorFlow"],
      proposals: 3,
      createdAt: "2024-07-18T11:00:00Z",
  }
];

export const mockProposalsForDeveloper = [
    {
        id: "1",
        projectId: "1",
        projectName: "E-commerce Platform Redesign",
        company: "Shopify",
        status: "Submitted",
        submittedAt: "2024-07-16T14:00:00Z",
    },
    {
        id: "2",
        projectId: "2",
        projectName: "Mobile App for Fitness Tracking",
        company: "Fitbit",
        status: "Accepted",
        submittedAt: "2024-07-15T18:00:00Z",
    },
    {
        id: "3",
        projectId: "3",
        projectName: "Data Visualization Dashboard",
        company: "DataBricks",
        status: "Rejected",
        submittedAt: "2024-07-13T10:00:00Z",
    }
];

export const mockProposalsForCompany = [
    {
        id: "1",
        projectId: "1",
        projectName: "E-commerce Platform Redesign",
        developerName: "Sarah",
        developerAvatar: devAvatar2,
        status: "Submitted",
        submittedAt: "2024-07-16T14:00:00Z",
    },
    {
        id: "2",
        projectId: "1",
        projectName: "E-commerce Platform Redesign",
        developerName: "Mike",
        developerAvatar: devAvatar3,
        status: "In Review",
        submittedAt: "2024-07-17T09:30:00Z",
    },
    {
        id: "3",
        projectId: "1",
        projectName: "E-commerce Platform Redesign",
        developerName: "Alex",
        developerAvatar: devAvatar1,
        status: "Contacted",
        submittedAt: "2024-07-18T11:00:00Z",
    },
];

export const developerStats = {
    proposalsSent: 5,
    activeApplications: 3,
    projectsWon: 1,
};

export const companyStats = {
    projectsPosted: 4,
    proposalsReceived: 28,
    developersHired: 2,
};
