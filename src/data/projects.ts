import type { Project } from '../types/project.types'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'secore-international',
    name: 'SECORE International',
    tagline: 'Restoring Coral Reefs',
    location: {
      lat: 18.0,
      lon: -76.8,
      label: 'Caribbean Sea',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Coral reefs are dying at an alarming rate due to climate change, pollution, and human activity. These underwater ecosystems support 25% of all marine life.',
      solution:
        'SECORE International works to restore coral reefs through innovative sexual coral reproduction techniques, ensuring genetic diversity and long-term survival.',
      impact: [
        '100,000+ coral fragments planted',
        '15 species being restored',
        '8 countries supported',
      ],
      partnerCharity: {
        name: 'SECORE International',
        description: 'Leading coral restoration organization',
        website: 'https://www.secore.org',
        logo: '/assets/LOGOS/Secore_Logo.png',
      },
    },
    shopifyCollection: {
      handle: 'secore-international',
      title: 'SECORE Collection',
    },
    theme: {
      primaryColor: '#0077BE',
      secondaryColor: '#00A4CC',
    },
  },
  {
    id: '2',
    slug: 'care-in-action',
    name: 'Care in Action',
    tagline: 'Fighting Poverty in East Africa',
    location: {
      lat: 48.3,
      lon: 31.2,
      label: 'Ukraine',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Millions in East Africa lack access to clean water, education, and healthcare, perpetuating cycles of poverty.',
      solution:
        'Care in Action provides sustainable solutions through community-driven programs in education, clean water, and economic empowerment.',
      impact: [
        '50,000+ people with clean water access',
        '20+ schools built',
        '5,000+ women in microfinance programs',
      ],
      partnerCharity: {
        name: 'Care in Action',
        description: 'Community development organization',
        website: 'https://www.careinaction.org',
        logo: '/assets/LOGOS/care_in_action_logo.png',
      },
    },
    shopifyCollection: {
      handle: 'care-in-action',
      title: 'Care in Action Collection',
    },
    theme: {
      primaryColor: '#E74C3C',
      secondaryColor: '#C0392B',
    },
  },
  {
    id: '3',
    slug: 'mental-health-initiative',
    name: 'Talk About It',
    tagline: 'Breaking Mental Health Stigma',
    location: {
      lat: 48.1,
      lon: 11.6,
      label: 'Munich, Germany',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Mental health challenges affect millions worldwide, yet stigma prevents people from seeking help.',
      solution:
        'Talk About It creates safe spaces for mental health conversations, providing resources, support, and community.',
      impact: [
        '100,000+ people reached',
        '500+ support groups established',
        '24/7 crisis helpline',
      ],
      partnerCharity: {
        name: 'Talk About It',
        description: 'Mental health advocacy organization',
        website: 'https://www.talkaboutit.org',
        logo: '/assets/LOGOS/MHI_logo.png',
      },
    },
    shopifyCollection: {
      handle: 'mental-health-initiative',
      title: 'Talk About It Collection',
    },
    theme: {
      primaryColor: '#9B59B6',
      secondaryColor: '#8E44AD',
    },
  },
  {
    id: '4',
    slug: 'plant-for-the-planet',
    name: 'Plant for the Planet',
    tagline: 'Reforesting the Amazon',
    location: {
      lat: -3.4,
      lon: -62.2,
      label: 'Amazon Rainforest',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Deforestation in the Amazon threatens biodiversity and accelerates climate change, with millions of trees lost each year.',
      solution:
        'Plant for the Planet mobilizes global citizens to plant trees, restore ecosystems, and fight climate change through reforestation.',
      impact: [
        '15 billion trees pledged',
        '100+ countries participating',
        '1 million climate ambassadors trained',
      ],
      partnerCharity: {
        name: 'Plant for the Planet',
        description: 'Global reforestation initiative',
        website: 'https://www.plant-for-the-planet.org',
        logo: '/assets/LOGOS/plant_for_the_planet_logo.png',
      },
    },
    shopifyCollection: {
      handle: 'plant-for-the-planet',
      title: 'Plant for the Planet Collection',
    },
    theme: {
      primaryColor: '#27AE60',
      secondaryColor: '#229954',
    },
  },
  {
    id: '5',
    slug: 'elephant-endangerment',
    name: 'Save the Elephants',
    tagline: 'Protecting Endangered Wildlife',
    location: {
      lat: -8.7,
      lon: 34.9,
      label: 'Africa',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2560&auto=format&fit=crop',
      problem:
        'African elephants face extinction due to poaching, habitat loss, and human-wildlife conflict.',
      solution:
        'Save the Elephants protects elephant populations through anti-poaching efforts, habitat conservation, and community education.',
      impact: [
        '5,000+ elephants protected',
        '50,000 acres of habitat preserved',
        '100+ poachers arrested',
      ],
      partnerCharity: {
        name: 'Save the Elephants',
        description: 'Wildlife conservation organization',
        website: 'https://www.savetheelephants.org',
        logo: '/assets/LOGOS/elephants_for_africa_logo.png',
      },
    },
    shopifyCollection: {
      handle: 'elephant-endangerment',
      title: 'Save the Elephants Collection',
    },
    theme: {
      primaryColor: '#95A5A6',
      secondaryColor: '#7F8C8D',
    },
  },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug)
}

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id)
}
