const defaultLinks = [
  // Government Links
  {
    title: "Ministry of Education",
    url: "https://www.education.gov.np",
    category: "government",
    description: "Official website of the Ministry of Education, Nepal",
    order: 1
  },
  {
    title: "Public Service Commission",
    url: "https://www.psc.gov.np",
    category: "government",
    description: "Official portal for government job vacancies and notices",
    order: 2
  },
  {
    title: "Department of Education",
    url: "https://www.doe.gov.np",
    category: "government",
    description: "Department of Education portal for educational resources",
    order: 3
  },

  // Industry Links
  {
    title: "Nepal Chamber of Commerce",
    url: "https://www.nepalchamber.org",
    category: "industry",
    description: "Leading organization for business and industry in Nepal",
    order: 1
  },
  {
    title: "Federation of Nepalese Chambers of Commerce & Industry",
    url: "https://www.fncci.org",
    category: "industry",
    description: "Apex body of business in Nepal",
    order: 2
  },
  {
    title: "Nepal Trade Information Portal",
    url: "https://www.nepaltradeportal.gov.np",
    category: "industry",
    description: "Information portal for trade and business",
    order: 3
  },

  // Organization Links
  {
    title: "UNESCO Nepal",
    url: "https://en.unesco.org/countries/nepal",
    category: "organization",
    description: "UNESCO's activities and programs in Nepal",
    order: 1
  },
  {
    title: "Nepal Teachers Association",
    url: "https://www.nta.org.np",
    category: "organization",
    description: "Professional organization for teachers in Nepal",
    order: 2
  },
  {
    title: "Education International",
    url: "https://www.ei-ie.org",
    category: "organization",
    description: "Global federation of teachers' trade unions",
    order: 3
  },

  // Other Links
  {
    title: "Nepal Education Portal",
    url: "https://www.edukhabar.com",
    category: "other",
    description: "Educational news and resources portal",
    order: 1
  },
  {
    title: "Teachers' Professional Development",
    url: "https://www.teachersportal.edu.np",
    category: "other",
    description: "Resources for teachers' professional development",
    order: 2
  }
];

const seedExternalLinks = async () => {
  try {
    const ExternalLink = require('../models/externalLinkModel');
    
    // Clear existing links
    await ExternalLink.deleteMany({});
    
    // Insert default links
    await ExternalLink.insertMany(defaultLinks);
    
    console.log('External links seeded successfully');
    return defaultLinks.length;
  } catch (error) {
    console.error('Error seeding external links:', error);
    return 0;
  }
};

module.exports = { seedExternalLinks };