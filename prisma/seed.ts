import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================
  // 1. USER ROLES
  // ============================================
  console.log('Creating user roles...');
  
  const adminRole = await prisma.userRole.upsert({
    where: { code: 'admin' },
    update: {},
    create: {
      name: 'Administrateur',
      code: 'admin',
      status: 1,
    },
  });

  const editorRole = await prisma.userRole.upsert({
    where: { code: 'editor' },
    update: {},
    create: {
      name: 'Éditeur',
      code: 'editor',
      status: 1,
    },
  });

  const viewerRole = await prisma.userRole.upsert({
    where: { code: 'viewer' },
    update: {},
    create: {
      name: 'Lecteur',
      code: 'viewer',
      status: 1,
    },
  });

  // ============================================
  // 2. USERS
  // ============================================
  console.log('Creating users...');
  
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ergo.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Ergo',
      email: 'admin@ergo.com',
      password: hashedPassword,
      userRoleId: adminRole.id,
      status: 1,
      emailVerifiedAt: new Date(),
    },
  });

  // ============================================
  // 3. BLOG CATEGORIES
  // ============================================
  console.log('Creating blog categories...');
  
  const categories = await Promise.all([
    prisma.postCategoryBlog.upsert({
      where: { code: 'genre' },
      update: {},
      create: {
        name: { fr: 'Genre', en: 'Gender' },
        code: 'genre',
        status: 1,
      },
    }),
    prisma.postCategoryBlog.upsert({
      where: { code: 'durabilite' },
      update: {},
      create: {
        name: { fr: 'Durabilité', en: 'Sustainability' },
        code: 'durabilite',
        status: 1,
      },
    }),
    prisma.postCategoryBlog.upsert({
      where: { code: 'citoyennete' },
      update: {},
      create: {
        name: { fr: 'Citoyenneté', en: 'Citizenship' },
        code: 'citoyennete',
        status: 1,
      },
    }),
  ]);

  // ============================================
  // 4. BLOG POSTS
  // ============================================
  console.log('Creating blog posts...');
  
  await prisma.postBlog.upsert({
    where: { slug: 'egalite-genre-afrique' },
    update: {},
    create: {
      title: {
        fr: "L'égalité de genre en Afrique : défis et opportunités",
        en: 'Gender Equality in Africa: Challenges and Opportunities',
      },
      slug: 'egalite-genre-afrique',
      description: {
        fr: 'Une analyse approfondie des enjeux de genre sur le continent africain',
        en: 'An in-depth analysis of gender issues on the African continent',
      },
      postText: {
        fr: '<p>Le continent africain fait face à des défis majeurs en matière d\'égalité de genre...</p>',
        en: '<p>The African continent faces major challenges in terms of gender equality...</p>',
      },
      img: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      postCategoryId: categories[0].id,
      createdBy: adminUser.id,
      status: 1,
    },
  });

  // ============================================
  // 5. TEAM ROLES
  // ============================================
  console.log('Creating team roles...');
  
  const directorRole = await prisma.teamRole.upsert({
    where: { code: 'director' },
    update: {},
    create: {
      name: { fr: 'Directeur', en: 'Director' },
      code: 'director',
      status: 1,
    },
  });

  const managerRole = await prisma.teamRole.upsert({
    where: { code: 'manager' },
    update: {},
    create: {
      name: { fr: 'Manager', en: 'Manager' },
      code: 'manager',
      status: 1,
    },
  });

  // ============================================
  // 6. TEAM MEMBERS
  // ============================================
  console.log('Creating team members...');
  
  await prisma.ourTeam.upsert({
    where: { email: 'director@ergo.com' },
    update: {},
    create: {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'director@ergo.com',
      img: 'https://res.cloudinary.com/demo/image/upload/avatar1.jpg',
      sex: 'femme',
      description: {
        fr: 'Directrice générale avec 15 ans d\'expérience',
        en: 'CEO with 15 years of experience',
      },
      socialNetwork: {
        linkedin: 'https://linkedin.com/in/mariedupont',
        twitter: 'https://twitter.com/mariedupont',
      },
      teamRoleId: directorRole.id,
      status: 1,
    },
  });

  // ============================================
  // 7. EVENTS
  // ============================================
  console.log('Creating events...');
  
  await prisma.event.upsert({
    where: { slug: 'conference-genre-2024' },
    update: {},
    create: {
      title: {
        fr: 'Conférence sur le Genre 2024',
        en: 'Gender Conference 2024',
      },
      slug: 'conference-genre-2024',
      description: {
        fr: 'Grande conférence annuelle sur les questions de genre',
        en: 'Major annual conference on gender issues',
      },
      details: {
        fr: '<p>Rejoignez-nous pour trois jours de discussions enrichissantes...</p>',
        en: '<p>Join us for three days of enriching discussions...</p>',
      },
      bgImg: { url: 'https://res.cloudinary.com/demo/image/upload/event-bg.jpg' },
      imgs: ['https://res.cloudinary.com/demo/image/upload/event1.jpg'],
      videos: [],
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-17'),
      status: 1,
    },
  });

  // ============================================
  // 8. ERGO NEWS
  // ============================================
  console.log('Creating Ergo news...');
  
  await prisma.ergoNews.upsert({
    where: { slug: 'lancement-babylone' },
    update: {},
    create: {
      title: {
        fr: 'Lancement du projet Babylone',
        en: 'Launch of the Babylon project',
      },
      slug: 'lancement-babylone',
      img: 'https://res.cloudinary.com/demo/image/upload/babylone.jpg',
      description: {
        fr: 'Découvrez notre nouveau projet innovant Babylone',
        en: 'Discover our new innovative Babylon project',
      },
      status: 1,
    },
  });

  // ============================================
  // 9. PARTNERS
  // ============================================
  console.log('Creating partners...');
  
  await prisma.partner.create({
    data: {
      nom: 'ONU Femmes',
      logo: 'https://res.cloudinary.com/demo/image/upload/unwomen-logo.png',
      lien: 'https://www.unwomen.org',
      status: 1,
    },
  });

  // ============================================
  // 10. WORKS
  // ============================================
  console.log('Creating works...');
  
  await prisma.ourWork.create({
    data: {
      title: 'Étude sur l\'autonomisation des femmes',
      description: {
        fr: 'Recherche approfondie sur l\'autonomisation économique des femmes en Afrique',
        en: 'In-depth research on women\'s economic empowerment in Africa',
      },
      img: 'https://res.cloudinary.com/demo/image/upload/work1.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/upload/work1-1.jpg',
        'https://res.cloudinary.com/demo/image/upload/work1-2.jpg',
      ],
      status: 1,
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
