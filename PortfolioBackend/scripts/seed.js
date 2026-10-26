import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import AdminUser from '../modules/auth/auth.model.js';
import Profile from '../modules/profile/profile.model.js';
import Skill from '../modules/skills/skill.model.js';
import Experience from '../modules/experience/experience.model.js';
import Project from '../modules/projects/project.model.js';
import Service from '../modules/services/service.model.js';
import Education from '../modules/education/education.model.js';
import Certification from '../modules/certifications/certification.model.js';
import Achievement from '../modules/achievements/achievement.model.js';
import Testimonial from '../modules/testimonials/testimonial.model.js';
import BlogPost from '../modules/blog/blog.model.js';
import Settings from '../modules/settings/settings.model.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_cms';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for database seed...');

    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminName = process.env.ADMIN_NAME || 'Arshlan Sheikh';

    let admin = await AdminUser.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      admin = new AdminUser({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin',
      });
      await admin.save();
      console.log(`Admin user seeded: ${adminEmail} (password: ${adminPassword})`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        siteTitle: 'Arshlan Sheikh | Full Stack Web Developer',
        siteDescription: 'Professional Full Stack Developer specializing in React, Node.js, Express, and MongoDB. Building robust, production-grade web systems.',
        siteUrl: 'http://localhost:5173',
        contactEmail: 'arshlans29@gmail.com',
        contactPhone: '+91 98765 43210',
        contactAddress: 'New Delhi, India',
        githubUrl: 'https://github.com/ArshlanSheikh',
        linkedinUrl: 'https://www.linkedin.com/in/arshlan-sheikh-b27114236',
        theme: {
          mode: 'dark',
          accentColor: '#00f2fe',
          heroVariant: 'standard',
        },
        sectionVisibility: {
          about: true,
          skills: true,
          experience: true,
          projects: true,
          services: true,
          education: true,
          certifications: true,
          achievements: true,
          testimonials: true,
          blog: true,
          contact: true,
        },
      });
      console.log('Settings seeded.');
    }

    // 3. Seed Profile
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        fullName: 'Arshlan Sheikh',
        title: 'Full Stack Web Developer',
        bio: 'I am a dedicated Full Stack Web Developer specializing in the MERN stack (MongoDB, Express, React, Node.js). I focus on engineering clean, scalable architectures with responsive user interfaces and dependable REST APIs. From component state machines to database query indexing, I bridge frontend elegance with backend resilience.',
        shortBio: 'Specializing in React.js, Node.js, Express, MongoDB, and modern web architectures.',
        email: 'arshlans29@gmail.com',
        phone: '+91 98765 43210',
        location: 'New Delhi, India',
        avatar: '',
        resumeUrl: '',
        availabilityStatus: 'Available',
        availabilityNote: 'Available for freelance projects & full-time opportunities',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/ArshlanSheikh', icon: 'Github' },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/arshlan-sheikh-b27114236', icon: 'Linkedin' },
          { platform: 'Email', url: 'mailto:arshlans29@gmail.com', icon: 'Mail' },
        ],
        stats: [
          { label: 'Years Experience', value: '2+' },
          { label: 'Projects Completed', value: '15+' },
          { label: 'Core Technologies', value: '12+' },
        ],
      });
      console.log('Profile seeded.');
    }

    // 4. Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const skillsData = [
        { name: 'React.js', category: 'Frontend', proficiency: 'Expert', isFeatured: true, order: 1 },
        { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 'Expert', isFeatured: true, order: 2 },
        { name: 'HTML5 & CSS3 / CSS Modules', category: 'Frontend', proficiency: 'Expert', isFeatured: false, order: 3 },
        { name: 'Node.js', category: 'Backend', proficiency: 'Expert', isFeatured: true, order: 4 },
        { name: 'Express.js', category: 'Backend', proficiency: 'Expert', isFeatured: true, order: 5 },
        { name: 'RESTful API Architecture', category: 'Backend', proficiency: 'Expert', isFeatured: true, order: 6 },
        { name: 'JWT & Session Security', category: 'Backend', proficiency: 'Advanced', isFeatured: false, order: 7 },
        { name: 'MongoDB & Mongoose', category: 'Database', proficiency: 'Expert', isFeatured: true, order: 8 },
        { name: 'Redis Caching', category: 'Database', proficiency: 'Intermediate', isFeatured: false, order: 9 },
        { name: 'Git & GitHub', category: 'DevOps & Tools', proficiency: 'Expert', isFeatured: true, order: 10 },
        { name: 'Cloudinary Media API', category: 'DevOps & Tools', proficiency: 'Advanced', isFeatured: false, order: 11 },
        { name: 'Vite & Webpack', category: 'DevOps & Tools', proficiency: 'Advanced', isFeatured: false, order: 12 },
      ];
      await Skill.insertMany(skillsData);
      console.log('Skills seeded.');
    }

    // 5. Seed Experience
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      const experienceData = [
        {
          company: 'Tech Solutions Inc.',
          position: 'Full Stack Web Developer',
          employmentType: 'Full-time',
          location: 'Remote',
          startDate: new Date('2024-01-01'),
          endDate: null,
          isCurrent: true,
          responsibilities: [
            'Architecting and delivering full-stack web applications with React.js, Express, and MongoDB.',
            'Designing secure RESTful endpoints with JWT authentication and rate limiting.',
            'Optimizing MongoDB aggregations and indexing to reduce query latency by 35%.',
          ],
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
          accomplishments: ['Migrated legacy monolithic systems to modular REST micro-services.'],
          companyUrl: 'https://example.com',
          order: 1,
        },
        {
          company: 'Digital Craft Agency',
          position: 'Frontend & API Developer',
          employmentType: 'Full-time',
          location: 'Hybrid',
          startDate: new Date('2022-06-01'),
          endDate: new Date('2023-12-31'),
          isCurrent: false,
          responsibilities: [
            'Created responsive UI components using modern React patterns and CSS Modules.',
            'Collaborated with UX designers to implement polished interactive interfaces.',
            'Integrated external payment gateways (Razorpay) and asset pipelines (Cloudinary).',
          ],
          technologies: ['React', 'JavaScript', 'CSS Modules', 'Node.js', 'REST APIs'],
          accomplishments: ['Delivered 8 client web platforms on schedule with 100% mobile accessibility scores.'],
          companyUrl: 'https://example.com',
          order: 2,
        },
      ];
      await Experience.insertMany(experienceData);
      console.log('Experience seeded.');
    }

    // 6. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projectsData = [
        {
          title: 'Developer Portfolio CMS',
          slug: 'developer-portfolio-cms',
          summary: 'A full-stack CMS platform for developers featuring an editorial public portfolio and a secure administrative dashboard.',
          description: 'A production-oriented Developer Portfolio CMS allowing full administrative control over all public content without code changes. Features secure JWT authentication, modular Express architecture, responsive React interface, and comprehensive CRUD management.',
          problemStatement: 'Developers frequently spend hours manually editing code or redeploying whenever their project, skill, or role changes.',
          solution: 'Built a headless CMS architecture with a unified design system, allowing instant updates to projects, services, blog articles, and credentials via a password-protected admin portal.',
          features: [
            'Role-based JWT authentication with HttpOnly cookies',
            'Full CRUD controllers for 12+ portfolio content domains',
            'Centralized error handling and standard JSON response envelopes',
            'Rate-limited public inquiry submission with anti-spam honeypot',
            'Media asset storage with Cloudinary and safe local fallback',
          ],
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'CSS Modules'],
          architectureNotes: 'Follows strict modular controller patterns, central routing, and decoupled state management.',
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
          screenshots: [
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
          ],
          liveDemoUrl: 'http://localhost:5173',
          repoUrl: 'https://github.com/ArshlanSheikh/Portfolio',
          category: 'Full Stack',
          isFeatured: true,
          order: 1,
        },
        {
          title: 'TechZen Corporate Platform',
          slug: 'techzen-corporate-platform',
          summary: 'Modern corporate web application built with React, Express, MongoDB, and Cloudinary media processing.',
          description: 'A high-performance company portal featuring interactive product showcases, dynamic team directories, automated contact routing, and an administrative control panel.',
          problemStatement: 'The client needed an expressive digital presence with quick content iteration and robust customer contact tracking.',
          solution: 'Engineered a modern React frontend connected to an Express/MongoDB backend with automated image compression via Cloudinary.',
          features: [
            'Dynamic product showcase grid with category filtering',
            'Authenticated administrator portal for editorial management',
            'Automated email dispatch for incoming client inquiries',
          ],
          technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Cloudinary', 'JWT'],
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          liveDemoUrl: 'https://example.com/techzen',
          repoUrl: 'https://github.com/ArshlanSheikh/TechZen',
          category: 'Full Stack',
          isFeatured: true,
          order: 2,
        },
        {
          title: 'Full-Stack E-Commerce Engine',
          slug: 'full-stack-ecommerce-engine',
          summary: 'Comprehensive online commerce engine with shopping cart, Razorpay payment verification, and order lifecycle tracking.',
          description: 'Enterprise-grade MERN e-commerce application equipped with product catalog filters, secure session cart management, Razorpay payment capture and refund processing, and automated inventory sync.',
          problemStatement: 'Small retailers require a turnkey, customizable commerce platform without hefty monthly subscription tolls.',
          solution: 'Built an end-to-end storefront and admin back-office with atomic transactions and inventory protection.',
          features: [
            'Real-time product stock checking and reservation',
            'Razorpay payment gateway with cryptographic signature verification',
            'Customer order history and shipment status tracker',
          ],
          technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'Razorpay'],
          thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop&q=80',
          liveDemoUrl: 'https://example.com/ecommerce',
          repoUrl: 'https://github.com/ArshlanSheikh/ecommerce-platform',
          category: 'Full Stack',
          isFeatured: true,
          order: 3,
        },
      ];
      await Project.insertMany(projectsData);
      console.log('Projects seeded.');
    }

    // 7. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const servicesData = [
        {
          title: 'Full-Stack Web Development',
          description: 'End-to-end architecture and implementation of scalable web applications using React, Node.js, and MongoDB.',
          deliverables: ['Custom frontend UI', 'Secure REST API', 'Database schema & indexes', 'Deployment ready codebase'],
          startingPrice: '$1,500',
          ctaLabel: 'Start a Project',
          order: 1,
        },
        {
          title: 'REST API Design & Integration',
          description: 'Architecting clean, standard-compliant RESTful APIs with strict validation, error handling, and authorization.',
          deliverables: ['API specification', 'JWT / OAuth security', 'Comprehensive integration tests', 'Swagger / Postman docs'],
          startingPrice: '$800',
          ctaLabel: 'Discuss API',
          order: 2,
        },
        {
          title: 'Frontend Modernization & Optimization',
          description: 'Refactoring existing web interfaces into modern React components with CSS Modules, responsive layouts, and 95+ Lighthouse scores.',
          deliverables: ['Performance audits', 'Component modularization', 'Mobile-first adaptation', 'Accessibility (a11y) fixes'],
          startingPrice: '$950',
          ctaLabel: 'Modernize UI',
          order: 3,
        },
      ];
      await Service.insertMany(servicesData);
      console.log('Services seeded.');
    }

    // 8. Seed Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      const educationData = [
        {
          institution: 'State Technical University',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science & Engineering',
          startDate: new Date('2019-08-01'),
          endDate: new Date('2023-06-30'),
          isCurrent: false,
          grade: 'First Class with Distinction',
          description: 'Core curriculum focused on Data Structures, Algorithms, Database Management Systems, and Software Engineering Principles.',
          order: 1,
        },
      ];
      await Education.insertMany(educationData);
      console.log('Education seeded.');
    }

    // 9. Seed Certifications & Achievements
    const certCount = await Certification.countDocuments();
    if (certCount === 0) {
      const certData = [
        {
          title: 'Full Stack Web Development Professional',
          issuer: 'freeCodeCamp / Open Certification',
          issueDate: new Date('2023-04-15'),
          credentialId: 'FCC-FSWD-9821',
          verificationUrl: 'https://freecodecamp.org/certification/arshlansheikh',
          description: 'Demonstrated mastery of JavaScript algorithms, React state architectures, and Express backend microservices.',
          order: 1,
        },
        {
          title: 'Node.js Application Developer',
          issuer: 'OpenJS Foundation / Partner',
          issueDate: new Date('2023-11-20'),
          credentialId: 'JSF-NAD-4109',
          verificationUrl: 'https://example.com/verify',
          description: 'Advanced asynchronous programming, stream handling, and security hardening for Node.js backends.',
          order: 2,
        },
      ];
      await Certification.insertMany(certData);
      console.log('Certifications seeded.');
    }

    const achCount = await Achievement.countDocuments();
    if (achCount === 0) {
      const achData = [
        {
          title: '1st Place Winner - Regional Web Hackathon',
          issuer: 'Tech Fest Delhi',
          date: new Date('2023-09-10'),
          description: 'Built a collaborative peer learning platform in 36 hours utilizing React, Express, and WebSocket protocols.',
          url: 'https://example.com/hackathon-winner',
          order: 1,
        },
        {
          title: 'Open Source Contributor Milestone',
          issuer: 'GitHub Community',
          date: new Date('2024-03-01'),
          description: 'Active contributor to JavaScript tooling, developer documentation, and popular NPM utilities.',
          url: 'https://github.com/ArshlanSheikh',
          order: 2,
        },
      ];
      await Achievement.insertMany(achData);
      console.log('Achievements seeded.');
    }

    // 10. Seed Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      const testimonialsData = [
        {
          name: 'Sarah Jenkins',
          role: 'Lead Architect',
          organization: 'Digital Dynamics',
          content: 'Arshlan is an exceptionally talented developer who understands both frontend aesthetics and backend resilience. His attention to detail in API design and database efficiency is exemplary.',
          rating: 5,
          order: 1,
        },
        {
          name: 'Rajesh Sharma',
          role: 'Product Manager',
          organization: 'InnovateSphere',
          content: 'Working with Arshlan was seamless. He delivered our web application well ahead of the deadline with clean documentation, complete mobile responsiveness, and zero regression issues.',
          rating: 5,
          order: 2,
        },
      ];
      await Testimonial.insertMany(testimonialsData);
      console.log('Testimonials seeded.');
    }

    // 11. Seed Blog Posts
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      const blogData = [
        {
          title: 'Architecting Scalable REST APIs with Express & Mongoose',
          slug: 'architecting-scalable-rest-apis-express-mongoose',
          summary: 'A deep dive into building modular, maintainable Express backends using the controller-per-action pattern, robust validation, and index optimization.',
          content: `### Why Architecture Matters in Backend Systems\n\nWhen developing backend services with Node.js and Express, maintaining clean separation of concerns is the difference between an adaptable codebase and technical debt.\n\n### The Dedicated Controller Pattern\n\nRather than stuffing business logic inside router files or monolithic controllers, dedicating specific functions to each operation (Create, Read, Update, Delete) ensures:\n\n1. **Deterministic Input Validation**: Missing fields are trapped immediately before reaching database layers.\n2. **Standardized Responses**: Every endpoint returns identical envelopes with \`success\`, \`message\`, \`data\`, and \`error\` keys.\n3. **Granular Unit Testing**: Each business operation can be tested in isolation.\n\n### Database Indexing with Mongoose\n\nAlways ensure that query predicates like \`slug\`, \`category\`, and \`isPublished\` are backed by compound indexes in MongoDB. This keeps query execution time constant even as records scale into the millions.`,
          tags: ['Node.js', 'Express', 'MongoDB', 'Architecture'],
          category: 'Engineering',
          readTime: '6 min read',
          coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
          publishedAt: new Date('2024-02-15'),
          isPublished: true,
        },
        {
          title: 'Mastering Modern React State and Component Encapsulation',
          slug: 'mastering-modern-react-state-component-encapsulation',
          summary: 'Techniques for structuring reusable React components, managing global auth state without bloat, and leveraging CSS Modules.',
          content: `### Beyond Generic Component Libraries\n\nWhile off-the-shelf UI libraries offer quick prototypes, bespoke developer portfolios and corporate tools demand fine control over typography, focus rings, and dark-theme tokens.\n\n### CSS Modules for Clean Scoping\n\nCSS Modules provide the perfect balance between Vanilla CSS flexibility and zero class-name collisions. By pairing scoped classes with CSS custom properties (\`var(--color-bg)\`), theming becomes effortless.\n\n### Predictable Authentication State\n\nUsing a dedicated React Context backed by HttpOnly session verification guarantees that authenticated views remain rock solid across browser refreshes.`,
          tags: ['React', 'CSS Modules', 'Web Design', 'JavaScript'],
          category: 'Frontend',
          readTime: '4 min read',
          coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
          publishedAt: new Date('2024-03-20'),
          isPublished: true,
        },
      ];
      await BlogPost.insertMany(blogData);
      console.log('Blog posts seeded.');
    }

    console.log('Database seed complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
