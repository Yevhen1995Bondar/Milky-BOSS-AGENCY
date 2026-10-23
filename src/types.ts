export type ServiceCategory =
  | 'shopify'
  | 'landingpage'
  | 'corporate'
  | 'marketing'
  | 'meta-ads'
  | 'social-audit'
  | 'strategic-analysis'
  | 'crm-ai';

export interface ServiceItem {
  id: ServiceCategory;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  technologies: string[];
  metricsHighlight: string;
  idealFor: string;
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  category: 'shopify' | 'landingpage' | 'corporate';
  categoryLabel: string;
  image: string;
  overview: string;
  challenge: string;
  solution: string;
  results: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  duration: string;
  year: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period?: string;
  recommended?: boolean;
  deliveryTime: string;
  features: string[];
  suitableFor: string;
}

export interface ContactFormData {
  service: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  crmInterest: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}
