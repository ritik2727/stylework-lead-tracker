import { PrismaClient, LeadStatus } from '@prisma/client';

const prisma = new PrismaClient();

const sampleLeads = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@techcorp.in',
    phone: '+91 98765 43210',
    status: 'NEW' as LeadStatus,
    company: 'TechCorp Solutions',
    notes: 'Interested in enterprise coworking desks for team of 25 in Gurgaon.',
    daysAgo: 1,
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@innovatehub.com',
    phone: '+91 98123 45678',
    status: 'CONTACTED' as LeadStatus,
    company: 'InnovateHub Labs',
    notes: 'Introductory call completed. Requested virtual office tour next Tuesday.',
    daysAgo: 2,
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.m@apexventures.io',
    phone: '+91 97654 32109',
    status: 'QUALIFIED' as LeadStatus,
    company: 'Apex Ventures',
    notes: 'Budget approved ($15k/mo). Evaluating Bangalore central locations.',
    daysAgo: 4,
  },
  {
    name: 'Neha Deshmukh',
    email: 'neha.d@fincloud.org',
    phone: '+91 99345 67890',
    status: 'PROPOSAL_SENT' as LeadStatus,
    company: 'FinCloud Technologies',
    notes: 'Proposal for 50 dedicated workstations sent with 12-month lock-in.',
    daysAgo: 5,
  },
  {
    name: 'Rohan Gupta',
    email: 'rohan.gupta@nexusretail.com',
    phone: '+91 98450 11223',
    status: 'WON' as LeadStatus,
    company: 'Nexus Retail Inc.',
    notes: 'Contract signed! Onboarding 40 engineers starting next Monday.',
    daysAgo: 6,
  },
  {
    name: 'Ananya Verma',
    email: 'ananya.verma@globalstride.com',
    phone: '+91 97112 33445',
    status: 'WON' as LeadStatus,
    company: 'GlobalStride Logistics',
    notes: 'Managed office space finalized in Noida Sector 62.',
    daysAgo: 8,
  },
  {
    name: 'Kabir Singhania',
    email: 'kabir.s@stellarbiotech.com',
    phone: '+91 99887 66554',
    status: 'LOST' as LeadStatus,
    company: 'Stellar BioTech',
    notes: 'Opted for permanent lease in private commercial building.',
    daysAgo: 10,
  },
  {
    name: 'Meera Nambiar',
    email: 'meera.n@solardynamics.in',
    phone: '+91 98223 99881',
    status: 'NEW' as LeadStatus,
    company: 'Solar Dynamics',
    notes: 'Inquired via website lead form. Needs flexible hot desks for 5 interns.',
    daysAgo: 0,
  },
  {
    name: 'Devendra Joshi',
    email: 'd.joshi@zenithai.ai',
    phone: '+91 96554 12389',
    status: 'CONTACTED' as LeadStatus,
    company: 'Zenith AI Research',
    notes: 'Follow-up scheduled for pricing tier discussion with CTO.',
    daysAgo: 3,
  },
  {
    name: 'Sneha Kulkarni',
    email: 'sneha.k@orbitmedia.co',
    phone: '+91 98901 23456',
    status: 'QUALIFIED' as LeadStatus,
    company: 'Orbit Media House',
    notes: 'Requires sound-proof podcast studio room within coworking facility.',
    daysAgo: 7,
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@vectorhealth.com',
    phone: '+91 97234 56781',
    status: 'PROPOSAL_SENT' as LeadStatus,
    company: 'Vector Health Tech',
    notes: 'Shared customized quote with annual discount and meeting room credits.',
    daysAgo: 9,
  },
  {
    name: 'Tara Sundaram',
    email: 'tara.s@pulsepay.in',
    phone: '+91 99100 88223',
    status: 'LOST' as LeadStatus,
    company: 'PulsePay Solutions',
    notes: 'Project postponed due to internal hiring freeze.',
    daysAgo: 14,
  },
];

async function main() {
  console.log('🌱 Seeding Stylework Lead Tracker database...');

  // Clean existing leads
  await prisma.lead.deleteMany();

  for (const item of sampleLeads) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - item.daysAgo);

    await prisma.lead.create({
      data: {
        name: item.name,
        email: item.email,
        phone: item.phone,
        status: item.status,
        company: item.company,
        notes: item.notes,
        createdAt: createdDate,
        updatedAt: createdDate,
      },
    });
  }

  console.log(`✅ Successfully seeded ${sampleLeads.length} sample leads!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
