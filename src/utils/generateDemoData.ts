import { supabase } from '../lib/supabase';

export async function generateDemoData(recruiterId: string) {
  try {
    const jobs = [
      {
        recruiter_id: recruiterId,
        title: 'Senior Software Engineer',
        description: `We're looking for an experienced Senior Software Engineer to join our growing team. You'll be working on cutting-edge technologies, building scalable applications, and mentoring junior developers.

Key Responsibilities:
• Design and implement robust, scalable software solutions
• Lead technical discussions and architectural decisions
• Mentor junior team members and conduct code reviews
• Collaborate with cross-functional teams to deliver high-quality products
• Stay up-to-date with emerging technologies and best practices`,
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        salary_range: '$140,000 - $180,000',
        requirements: `• 5+ years of experience in software development
• Strong proficiency in JavaScript/TypeScript and React
• Experience with Node.js and modern backend frameworks
• Solid understanding of database design (SQL and NoSQL)
• Experience with cloud platforms (AWS, GCP, or Azure)
• Excellent problem-solving and communication skills
• Bachelor's degree in Computer Science or related field`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Product Manager',
        description: `Join our product team as a Product Manager and help shape the future of our platform. You'll work closely with engineering, design, and business stakeholders to define and execute product strategy.

What You'll Do:
• Define product vision and strategy
• Conduct market research and competitive analysis
• Create detailed product requirements and specifications
• Work with designers to create intuitive user experiences
• Collaborate with engineering to prioritize and deliver features
• Analyze product metrics and user feedback`,
        location: 'Remote',
        employment_type: 'Full-time',
        salary_range: '$120,000 - $160,000',
        requirements: `• 3+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with Agile development methodologies
• Excellent communication and stakeholder management skills
• Data-driven approach to decision making
• Technical background or ability to work closely with engineering teams
• Bachelor's degree required, MBA preferred`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'UX/UI Designer',
        description: `We're seeking a talented UX/UI Designer to create beautiful, intuitive user experiences. You'll be responsible for the entire design process from research to final implementation.

Your Role:
• Conduct user research and usability testing
• Create wireframes, prototypes, and high-fidelity mockups
• Design intuitive user interfaces for web and mobile applications
• Collaborate with product and engineering teams
• Maintain and evolve our design system
• Present design concepts to stakeholders`,
        location: 'New York, NY',
        employment_type: 'Full-time',
        salary_range: '$100,000 - $140,000',
        requirements: `• 3+ years of UX/UI design experience
• Strong portfolio demonstrating design process and outcomes
• Proficiency in Figma, Sketch, or similar design tools
• Understanding of user-centered design principles
• Experience with design systems and component libraries
• Excellent visual design skills with attention to detail
• Strong communication and collaboration skills`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Data Scientist',
        description: `Join our data science team to build machine learning models and extract insights from large datasets. You'll work on challenging problems that directly impact our business decisions.

Responsibilities:
• Develop and deploy machine learning models
• Analyze large datasets to identify trends and insights
• Create data visualizations and reports for stakeholders
• Collaborate with engineering to productionize models
• Design and run A/B tests
• Stay current with latest ML/AI techniques`,
        location: 'Austin, TX',
        employment_type: 'Full-time',
        salary_range: '$130,000 - $170,000',
        requirements: `• Master's or PhD in Computer Science, Statistics, or related field
• 3+ years of experience in data science or machine learning
• Strong programming skills in Python and SQL
• Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)
• Knowledge of statistical analysis and experimental design
• Experience with big data technologies (Spark, Hadoop)
• Strong communication skills to explain technical concepts`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'DevOps Engineer',
        description: `We're hiring a DevOps Engineer to build and maintain our cloud infrastructure. You'll work on automation, CI/CD pipelines, and ensuring high availability of our systems.

Key Responsibilities:
• Design and maintain cloud infrastructure on AWS/Azure
• Build and improve CI/CD pipelines
• Implement monitoring and alerting systems
• Automate deployment processes
• Ensure security and compliance
• Troubleshoot production issues`,
        location: 'Seattle, WA',
        employment_type: 'Full-time',
        salary_range: '$120,000 - $160,000',
        requirements: `• 3+ years of DevOps or Infrastructure experience
• Strong knowledge of AWS or Azure
• Experience with Docker and Kubernetes
• Proficiency in scripting (Python, Bash, etc.)
• Experience with Terraform or CloudFormation
• Understanding of networking and security
• Strong troubleshooting skills`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Content Marketing Specialist',
        description: `Join our marketing team as a Content Marketing Specialist. Create compelling content that drives engagement and builds our brand presence.

What You'll Do:
• Write blog posts, whitepapers, and case studies
• Develop content strategy aligned with business goals
• Manage social media content calendar
• Collaborate with design team on visual content
• Optimize content for SEO
• Track and analyze content performance`,
        location: 'Remote',
        employment_type: 'Full-time',
        salary_range: '$60,000 - $80,000',
        requirements: `• 2+ years of content marketing experience
• Excellent writing and editing skills
• Understanding of SEO best practices
• Experience with content management systems
• Strong research and analytical skills
• Portfolio of published content
• Bachelor's degree in Marketing, Communications, or related field`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Sales Development Representative',
        description: `Start your sales career as an SDR! You'll be the first point of contact for potential customers, qualifying leads and setting up meetings for our sales team.

Your Responsibilities:
• Generate new leads through outbound outreach
• Qualify inbound leads from marketing campaigns
• Schedule demos for Account Executives
• Maintain accurate records in CRM
• Meet and exceed monthly quotas
• Collaborate with marketing on campaigns`,
        location: 'Boston, MA',
        employment_type: 'Full-time',
        salary_range: '$50,000 - $70,000',
        requirements: `• 1+ years of sales or customer-facing experience
• Excellent communication and interpersonal skills
• Self-motivated with strong work ethic
• Comfortable with cold calling and email outreach
• Experience with Salesforce or similar CRM
• Goal-oriented mindset
• Bachelor's degree preferred`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Customer Success Manager',
        description: `Help our customers achieve their goals as a Customer Success Manager. You'll build relationships, drive adoption, and ensure customer satisfaction.

Key Responsibilities:
• Onboard new customers and ensure smooth adoption
• Conduct regular check-ins and business reviews
• Identify upsell and expansion opportunities
• Resolve customer issues and escalations
• Gather customer feedback for product team
• Track and report on customer health metrics`,
        location: 'Chicago, IL',
        employment_type: 'Full-time',
        salary_range: '$70,000 - $90,000',
        requirements: `• 2+ years in customer success or account management
• Strong relationship building skills
• Experience with SaaS products
• Excellent problem-solving abilities
• Proficiency with customer success tools
• Strong presentation skills
• Bachelor's degree required`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Human Resources Manager',
        description: `Lead our HR initiatives as an HR Manager. You'll oversee recruitment, employee relations, and help build our company culture.

What You'll Do:
• Manage full-cycle recruitment process
• Develop and implement HR policies
• Handle employee relations and conflict resolution
• Coordinate performance review processes
• Ensure compliance with labor laws
• Lead employee engagement initiatives`,
        location: 'Denver, CO',
        employment_type: 'Full-time',
        salary_range: '$80,000 - $110,000',
        requirements: `• 4+ years of HR experience
• Strong knowledge of employment law
• Experience with HRIS systems
• Excellent interpersonal and communication skills
• Ability to handle confidential information
• HR certification (SHRM-CP, PHR) preferred
• Bachelor's degree in HR or related field`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Graphic Designer',
        description: `We're looking for a creative Graphic Designer to bring our brand to life through stunning visual designs.

Your Role:
• Create marketing materials and brand assets
• Design graphics for social media and web
• Develop visual concepts for campaigns
• Collaborate with marketing team
• Maintain brand consistency
• Prepare files for print and digital`,
        location: 'Portland, OR',
        employment_type: 'Full-time',
        salary_range: '$55,000 - $75,000',
        requirements: `• 2+ years of graphic design experience
• Proficiency in Adobe Creative Suite
• Strong portfolio demonstrating design skills
• Understanding of typography and color theory
• Experience with both print and digital design
• Attention to detail
• Bachelor's degree in Graphic Design or related field`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Financial Analyst',
        description: `Join our finance team as a Financial Analyst. You'll analyze financial data, create reports, and support strategic decision-making.

Responsibilities:
• Prepare financial reports and forecasts
• Analyze financial performance and trends
• Support budgeting and planning processes
• Build financial models
• Present findings to management
• Identify cost-saving opportunities`,
        location: 'New York, NY',
        employment_type: 'Full-time',
        salary_range: '$70,000 - $95,000',
        requirements: `• 2+ years of financial analysis experience
• Strong Excel and financial modeling skills
• Bachelor's degree in Finance or Accounting
• CFA or CPA in progress preferred
• Excellent analytical and problem-solving skills
• Strong attention to detail
• Good communication skills`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'QA Engineer',
        description: `Ensure product quality as a QA Engineer. You'll design test plans, identify bugs, and work closely with development teams.

What You'll Do:
• Create and execute test plans and cases
• Perform manual and automated testing
• Identify, document, and track bugs
• Work with developers to resolve issues
• Develop test automation scripts
• Participate in Agile ceremonies`,
        location: 'San Francisco, CA',
        employment_type: 'Full-time',
        salary_range: '$90,000 - $120,000',
        requirements: `• 3+ years of QA or testing experience
• Experience with test automation tools (Selenium, Cypress)
• Understanding of software development lifecycle
• Strong attention to detail
• Programming skills in Python or JavaScript
• Experience with API testing
• Bachelor's degree in Computer Science or related field`,
        status: 'open',
      },
      {
        recruiter_id: recruiterId,
        title: 'Marketing Manager',
        description: `Lead our marketing efforts as a Marketing Manager. You'll develop and execute marketing strategies to drive growth and build brand awareness.

What You'll Do:
• Develop and implement marketing strategies
• Manage digital marketing campaigns across multiple channels
• Analyze campaign performance and optimize for ROI
• Collaborate with sales team to generate qualified leads
• Manage marketing budget and vendor relationships
• Build and maintain brand guidelines`,
        location: 'Los Angeles, CA',
        employment_type: 'Full-time',
        salary_range: '$90,000 - $130,000',
        requirements: `• 4+ years of marketing experience
• Strong understanding of digital marketing channels
• Experience with marketing automation tools
• Data-driven approach to campaign optimization
• Excellent written and verbal communication skills
• Experience managing budgets and external vendors
• Bachelor's degree in Marketing, Business, or related field`,
        status: 'closed',
      },
    ];

    const { data: insertedJobs, error: jobsError } = await supabase
      .from('jobs')
      .insert(jobs)
      .select();

    if (jobsError) throw jobsError;

    for (const job of insertedJobs) {
      const stages = [
        { name: 'Application Review', order_num: 1, pass_threshold: 70, auto_advance: false },
        { name: 'HR Interview', order_num: 2, pass_threshold: 75, auto_advance: false },
        { name: 'Technical Interview', order_num: 3, pass_threshold: 80, auto_advance: false },
        { name: 'Final Interview', order_num: 4, pass_threshold: 85, auto_advance: false },
      ];

      await supabase.from('job_stages').insert(
        stages.map((stage) => ({ ...stage, job_id: job.id }))
      );
    }

    const candidates = [
      {
        full_name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        resume_url: 'https://example.com/resume/sarah-johnson',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson',
      },
      {
        full_name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        resume_url: 'https://example.com/resume/michael-chen',
        linkedin_url: 'https://linkedin.com/in/michaelchen',
      },
      {
        full_name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        resume_url: 'https://example.com/resume/emily-rodriguez',
        linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
      },
      {
        full_name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 456-7890',
        resume_url: 'https://example.com/resume/david-kim',
        linkedin_url: 'https://linkedin.com/in/davidkim',
      },
      {
        full_name: 'Jessica Taylor',
        email: 'jessica.taylor@email.com',
        phone: '+1 (555) 567-8901',
        resume_url: 'https://example.com/resume/jessica-taylor',
        linkedin_url: 'https://linkedin.com/in/jessicataylor',
      },
      {
        full_name: 'Robert Martinez',
        email: 'robert.martinez@email.com',
        phone: '+1 (555) 678-9012',
        resume_url: 'https://example.com/resume/robert-martinez',
        linkedin_url: 'https://linkedin.com/in/robertmartinez',
      },
      {
        full_name: 'Amanda Williams',
        email: 'amanda.williams@email.com',
        phone: '+1 (555) 789-0123',
        resume_url: 'https://example.com/resume/amanda-williams',
        linkedin_url: 'https://linkedin.com/in/amandawilliams',
      },
      {
        full_name: 'James Anderson',
        email: 'james.anderson@email.com',
        phone: '+1 (555) 890-1234',
        resume_url: 'https://example.com/resume/james-anderson',
        linkedin_url: 'https://linkedin.com/in/jamesanderson',
      },
      {
        full_name: 'Lisa Thompson',
        email: 'lisa.thompson@email.com',
        phone: '+1 (555) 901-2345',
        resume_url: 'https://example.com/resume/lisa-thompson',
        linkedin_url: 'https://linkedin.com/in/lisathompson',
      },
      {
        full_name: 'Christopher Lee',
        email: 'christopher.lee@email.com',
        phone: '+1 (555) 012-3456',
        resume_url: 'https://example.com/resume/christopher-lee',
        linkedin_url: 'https://linkedin.com/in/christopherlee',
      },
      {
        full_name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 (555) 123-4568',
        resume_url: 'https://example.com/resume/maria-garcia',
        linkedin_url: 'https://linkedin.com/in/mariagarcia',
      },
      {
        full_name: 'Daniel Brown',
        email: 'daniel.brown@email.com',
        phone: '+1 (555) 234-5679',
        resume_url: 'https://example.com/resume/daniel-brown',
        linkedin_url: 'https://linkedin.com/in/danielbrown',
      },
      {
        full_name: 'Ashley Davis',
        email: 'ashley.davis@email.com',
        phone: '+1 (555) 345-6780',
        resume_url: 'https://example.com/resume/ashley-davis',
        linkedin_url: 'https://linkedin.com/in/ashleydavis',
      },
      {
        full_name: 'Kevin Wilson',
        email: 'kevin.wilson@email.com',
        phone: '+1 (555) 456-7891',
        resume_url: 'https://example.com/resume/kevin-wilson',
        linkedin_url: 'https://linkedin.com/in/kevinwilson',
      },
      {
        full_name: 'Nicole Moore',
        email: 'nicole.moore@email.com',
        phone: '+1 (555) 567-8902',
        resume_url: 'https://example.com/resume/nicole-moore',
        linkedin_url: 'https://linkedin.com/in/nicolemoore',
      },
    ];

    const { data: insertedCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .insert(candidates)
      .select();

    if (candidatesError) throw candidatesError;

    const applications = [];
    const statuses = ['active', 'hired', 'rejected'];

    for (let i = 0; i < insertedCandidates.length; i++) {
      const candidate = insertedCandidates[i];

      const numApplications = Math.floor(Math.random() * 2) + 1;

      for (let j = 0; j < numApplications; j++) {
        const jobIndex = (i + j) % insertedJobs.length;
        const job = insertedJobs[jobIndex];

        const { data: jobStages } = await supabase
          .from('job_stages')
          .select('id')
          .eq('job_id', job.id)
          .order('order_num')
          .limit(1);

        const randomStatusIndex = Math.floor(Math.random() * statuses.length);

        try {
          applications.push({
            job_id: job.id,
            candidate_id: candidate.id,
            current_stage_id: jobStages?.[0]?.id || null,
            status: statuses[randomStatusIndex],
          });
        } catch (e) {
          continue;
        }
      }
    }

    const { data: insertedApplications, error: applicationsError } = await supabase
      .from('applications')
      .insert(applications)
      .select();

    if (applicationsError) throw applicationsError;

    for (let i = 0; i < insertedApplications.length; i++) {
      const application = insertedApplications[i];

      const { data: stages } = await supabase
        .from('job_stages')
        .select('id')
        .eq('job_id', application.job_id)
        .order('order_num')
        .limit(2);

      if (stages && stages.length > 0) {
        await supabase.from('stage_scores').insert([
          {
            application_id: application.id,
            stage_id: stages[0].id,
            score: 75 + Math.floor(Math.random() * 20),
            feedback: 'Strong background and relevant experience. Good communication skills.',
            scored_by: recruiterId,
          },
        ]);

        if (stages.length > 1 && i % 2 === 0) {
          await supabase.from('stage_scores').insert([
            {
              application_id: application.id,
              stage_id: stages[1].id,
              score: 70 + Math.floor(Math.random() * 25),
              feedback: 'Demonstrated technical knowledge. Team fit looks promising.',
              scored_by: recruiterId,
            },
          ]);
        }
      }

      if (i % 3 === 0) {
        await supabase.from('recruiter_notes').insert({
          application_id: application.id,
          recruiter_id: recruiterId,
          note: 'Candidate has excellent qualifications and seems like a great fit for the role. Follow up scheduled.',
        });
      }
    }

    return { success: true, message: 'Demo data generated successfully!' };
  } catch (error) {
    console.error('Error generating demo data:', error);
    throw error;
  }
}
