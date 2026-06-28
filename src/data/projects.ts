import type { Project } from '../types/project.types'
import secoreLogo from '../assets/logos/secore-logo.png'
import careInActionLogo from '../assets/logos/care-in-action-logo.png'
import mhiLogo from '../assets/logos/mhi-logo.png'
import plantForThePlanetLogo from '../assets/logos/plant-for-the-planet-logo.png'
import elephantsForAfricaLogo from '../assets/logos/elephants-for-africa-logo.png'
import missionPositivityLogo from '../assets/logos/mission-positivity-logo.png'

export const projects: Project[] = [
  {
    id: '6',
    slug: 'rich-in-life',
    name: 'Rich in Life',
    tagline: 'Rethinking what wealth truly means.',
    location: {
      lat: 5.632,
      lon: -72.43,
      label: 'Paya, Colombia',
    },
    mission: {
      heroImage: '/assets/images/rich-in-life-hero.png',
      problem:
        'In the remote rural communities of Milagros, La Unión, and other campos in Paya, Colombia, material wealth is scarce. Schools often lack basic learning materials, access to healthcare is limited, and teachers work under challenging conditions to provide education for children growing up far from urban resources.\n\nYet despite these challenges, the people living here possess something many of us have forgotten: strong communities, a close connection to nature, and a remarkable ability to make the most of what they have.\n\nThe question is not only what these communities lack, but also what they can teach us about a different kind of wealth.',
      solution:
        'Together with Mission Positivity, we created the Rich in Life collection to support children, teachers, and families in the rural communities of Paya, Colombia.\n\nEvery shirt helps fund educational projects, school materials, community programs, health initiatives, and opportunities that would otherwise remain out of reach. Every purchase creates direct impact where it is needed most.\n\nIt is an invitation to rethink what wealth truly means. Rich in Life reminds us that fulfillment is often found in connection, purpose, and community rather than material possessions.\n\n100% of profits from this collection support Mission Positivity’s work on the ground.',
      impact: ['Speech therapy funding', 'School materials & resources', 'Volunteer program support', 'Environmental education'],
      partnerCharity: {
        name: 'Mission Positivity e.V.',
        description: 'Mission Positivity is a German non-profit organization driven by a simple belief: positive change becomes possible when people come together and take action. The organization works to expand educational opportunities for children and young people, support communities facing social and economic challenges, and help create pathways toward a more self-determined and sustainable future.\n\nSince 2023, Mission Positivity has been working closely with schools, teachers, children, and families in the remote rural communities of Paya, Colombia. Through educational support, school materials, health initiatives, volunteer programs, and long-term local partnerships, the organization helps create opportunities where access to resources is limited.\n\nIn 2025, the team returned to Milagros and La Unión to continue their projects and film a documentary exploring life in these remote communities. At its heart lies a simple but question: What does it really mean to be rich?\n\nThe Rich in Life collection was born from the answers they found.',
        website: 'https://missionpositivity.org/',
        logo: missionPositivityLogo,
      },
    },
    shopifyCollection: {
      handle: 'rich-in-life',
      title: 'Rich in Life',
    },
    theme: {
      primaryColor: '#D4A373',
      secondaryColor: '#A98467',
    },
  },
  {
    id: '5',
    slug: 'wild-at-heart',
    name: 'Wild at Heart',
    tagline: 'Together for Giants. Together for Hope.',
    location: {
      lat: -8.7,
      lon: 34.9,
      label: 'Africa',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2560&auto=format&fit=crop',
      problem:
        'The African elephant is one of Earth\'s most extraordinary beings — intelligent, social, emotional, and deeply connected to its herd. Yet despite their importance, elephants are under constant pressure from habitat loss, human–elephant conflict, and shifting landscapes. This collaboration is built on a simple belief: when we take action out of love, we protect what\'s wild and keep hope alive. WILD AT HEART is more than a design — it\'s a reminder that protecting nature starts with choosing compassion, choosing awareness, and choosing to act.',
      solution:
        'At Perfect World, we believe that every thread can tell a story — a story of connection, of action, of compassion. With our WILD AT HEART design, we\'re proud to join hands with Elephants for Africa to support the wild spirit of the African elephant and the communities who share its home. With every piece from the WILD AT HEART collection, 100% of profits go directly to Elephants for Africa. The design is a tribute to the strength, gentleness and resilience of African elephants — and to the wild spirit that lives in all of us. Created by Libby, a 10th-grade student from Munich International School, the design carries a message of hope from the next generation: a reminder that protecting our planet starts with awareness, compassion and bold imagination. By choosing this design, you\'re not simply following a trend—you\'re making a statement. You\'re saying: I stand for the wild. I stand for hope.',
      impact: [
        '5,000+ elephants protected',
        '50,000 acres of habitat preserved',
        '100+ poachers arrested',
      ],
      partnerCharity: {
        name: 'Elephants for Africa',
        description: 'Elephants for Africa, founded by Dr. Kate Evans, is a charity dedicated to safeguarding elephants through research, education, and community partnership in Botswana. Their work focuses on researching elephant behaviour (especially male elephants who often receive less conservation attention), supporting local communities and farmers to protect their livelihoods while coexisting with migrating elephant herds, and educating the next generation through school programmes and conservation clubs. Elephants for Africa isn\'t just "protecting elephants" — they\'re building a world where people and wildlife can thrive side by side.',
        website: 'https://www.elephantsforafrica.org',
        logo: elephantsForAfricaLogo,
      },
    },
    shopifyCollection: {
      handle: 'wild-at-heart',
      title: 'Wild at Heart Collection',
    },
    theme: {
      primaryColor: '#8B7D6B',
      secondaryColor: '#6D5F4D',
    },
  },
  {
    id: '1',
    slug: 'endangered-oceans',
    name: 'Endangered Oceans',
    tagline: 'Saving our oceans, one coral at a time',
    location: {
      lat: 18.0,
      lon: -76.8,
      label: 'Caribbean Sea',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Coral reefs are the lungs of our oceans, supporting marine life and protecting our coastlines. But they\'re disappearing at an alarming rate due to climate change, pollution, and human activity.',
      solution:
        'The ENDANGERED OCEANS Collection is more than just fashion—it\'s a call to action. Each piece is designed to spread awareness and fund real solutions for our oceans. All profits go directly to SECORE International, a global leader in coral restoration. Through pioneering research, innovative reef restoration techniques, and education, they\'re working to ensure a future where coral reefs thrive—not just survive.',
      impact: [
        '100,000+ coral fragments planted',
        '15 species being restored',
        '8 countries supported',
      ],
      partnerCharity: {
        name: 'SECORE International',
        description: 'SECORE International is on a mission to save our oceans through pioneering research, innovative reef restoration techniques, and education. They\'re working to ensure coral reefs thrive for generations to come.',
        website: 'https://www.secore.org',
        logo: secoreLogo,
      },
    },
    shopifyCollection: {
      handle: 'endangered-oceans',
      title: 'Endangered Oceans',
    },
    theme: {
      primaryColor: '#002147',
      secondaryColor: '#00152e',
    },
  },
  {
    id: '2',
    slug: 'one-world',
    name: 'One World',
    tagline: 'Hope for children facing the realities of war',
    location: {
      lat: 48.3,
      lon: 31.2,
      label: 'Ukraine',
    },
    mission: {
      heroImage: '/assets/images/one%20world.png',
      problem:
        'Countless children around the world grow up without parental care, facing disadvantages that can shape their entire lives. For those caught in war-torn regions, the challenges are even more severe—lacking access to basic necessities, education, and the nurturing environment every child deserves.',
      solution:
        'The ONE WORLD Collection stands for unity and compassion in the face of adversity. All profits from this collection go directly to Care in Action, a non-profit charity dedicated to helping disadvantaged children—especially those without parental care—to grow up and succeed in life. By providing essential care, education, and a nurturing environment, Care in Action serves as a lifeline for children facing the harsh realities of war.',
      impact: [
        '50,000+ people with clean water access',
        '20+ schools built',
        '5,000+ women in microfinance programs',
      ],
      partnerCharity: {
        name: 'Care in Action',
        description: 'Care in Action is a non-profit charity dedicated to helping disadvantaged children, but especially those without parental care, to grow up and succeed in life. By striving to provide essential care, education and a nurturing environment, Care in Action is a lifeline for those facing the harsh realities of war.',
        website: 'https://www.careinaction.org',
        logo: careInActionLogo,
      },
    },
    shopifyCollection: {
      handle: 'one-world',
      title: 'One World',
    },
    theme: {
      primaryColor: '#5DADE2',
      secondaryColor: '#3498DB',
    },
  },
  {
    id: '4',
    slug: 'cool-down',
    name: 'Cool Down',
    tagline: 'Fighting for climate justice, one tree at a time',
    location: {
      lat: -3.4,
      lon: -62.2,
      label: 'Amazon Rainforest',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Climate change threatens our planet, and deforestation accelerates its devastating effects. Ecosystems worldwide are in crisis, with millions of trees lost each year. The urgent need for climate justice demands immediate action to restore what has been lost.',
      solution:
        'The COOL DOWN Collection represents our commitment to fighting climate change through direct action. All profits from our design sales go directly to Plant-for-the-Planet, an initiative that supports ecosystem restoration worldwide to fight for climate justice. Every purchase helps plant trees and restore vital ecosystems, creating a tangible impact in the fight against climate change.',
      impact: [
        '15 billion trees pledged',
        '100+ countries participating',
        '1 million climate ambassadors trained',
      ],
      partnerCharity: {
        name: 'Plant-for-the-Planet',
        description: 'Plant-for-the-Planet is an initiative that supports ecosystem restoration worldwide to fight for climate justice. Through global mobilization and direct action, they empower citizens to restore ecosystems and combat climate change by planting trees around the world.',
        website: 'https://www.plant-for-the-planet.org',
        logo: plantForThePlanetLogo,
      },
    },
    shopifyCollection: {
      handle: 'frontpage',
      title: 'Cool Down',
    },
    theme: {
      primaryColor: '#27AE60',
      secondaryColor: '#229954',
    },
  },
  {
    id: '3',
    slug: 'talk-about-it',
    name: 'Talk About It',
    tagline: 'Breaking the silence on mental health',
    location: {
      lat: 48.1,
      lon: 11.6,
      label: 'Munich, Germany',
    },
    mission: {
      heroImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2560&auto=format&fit=crop',
      problem:
        'Mental health challenges affect millions worldwide, yet stigma and silence prevent people from seeking help. Suicide remains a leading cause of death, particularly among young people, and countless individuals suffer in isolation.',
      solution:
        'The TALK ABOUT IT Collection is designed to spark conversations and save lives. All profits from our design sales go directly to the Mental Health Initiative, an organization dedicated to promoting suicide prevention, reducing stigma, creating public awareness, and exerting political and social influence to change how society approaches mental health.',
      impact: [
        '100,000+ people reached',
        '500+ support groups established',
        '24/7 crisis helpline',
      ],
      partnerCharity: {
        name: 'Mental Health Initiative',
        description: 'The Mental Health Initiative aims to promote suicide prevention, reduce stigma, create public awareness and exert political and social influence. Through advocacy, education, and community support, they\'re working to create a world where mental health is treated with the same importance as physical health.',
        website: 'https://www.talkaboutit.org',
        logo: mhiLogo,
      },
    },
    shopifyCollection: {
      handle: 'talk-about-it',
      title: 'Talk About It',
    },
    theme: {
      primaryColor: '#FF8C42',
      secondaryColor: '#FF7420',
    },
  },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug)
}

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id)
}
