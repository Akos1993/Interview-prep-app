import { InterviewPlan } from '../types';

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  shortDescription: string;
  jobTitle: string;
  elevatorPitch: string;
  plan: InterviewPlan;
}

export const CATEGORIES_DB: CategoryData[] = [
  {
    id: 'frontend',
    name: 'Frontend Engineer',
    icon: '💻',
    shortDescription: 'Focus on user interface, state management, component architecture, CSS, design systems, and web performance.',
    jobTitle: 'Frontend Engineer',
    elevatorPitch: 'I am a Frontend Engineer who loves crafting accessible, high-performance web applications. In my previous role, I optimized a complex state management architecture that reduced load times by 30% and improved Web Vitals. Right now, I am focusing on building inclusive component systems using React, and in the future, I aim to lead modern interface delivery that bridges the gap between designers and developers.',
    plan: {
      jobTitle: 'Frontend Engineer',
      companyName: 'TechVibe Interactive',
      adhdFocusTips: [
        {
          title: 'The Blue Anchor Focus Breath',
          expansion: 'Visualize a cool, calm blue light entering your chest with each breath. This anchors your drifting neural pathways and shuts down the anxiety-induced "fight-or-flight" response.',
          practiceExercise: 'Take a deep breath for 4 seconds, hold for 2, and release for 6. Follow the visual breathing bubble below!',
          reward: 'Great job! Your nervous system is now in "rest and digest" mode. You are ready to process questions analytical-first.'
        },
        {
          title: '3-Step Fingertip Tapping Grounding',
          expansion: 'A kinetic sensory motor anchoring practice. Lightly press your thumb against each of your fingers sequentially while counting silently. This shifts attention from frantic predictions back to the sensory present.',
          practiceExercise: 'Tap: Thumb-to-Index (1), Thumb-to-Middle (2), Thumb-to-Ring (3), Thumb-to-Pinky (4) and backward.',
          reward: 'Physical sensation acts as a circuit breaker for infinite worry loops. Excellent anchoring!'
        },
        {
          title: 'The 5-Second Strategic Silence',
          expansion: 'The ADHD brain seeks to fill silences instantly out of fear of looking slow. Excellent candidates consistently wait 5 seconds to organize thoughts. Rewire your silence anxiety into structured planning time.',
          practiceExercise: 'Count slowly to 5 in your head before thinking about your reaction. Write down a calming word in the pad below.',
          reward: 'Silence is power. Recruiter feedback states that candidates who pause are perceived as analytical, calm, and deliberate.'
        }
      ],
      stages: [
        {
          stageId: 'fe_phone_screen',
          stageName: 'Recruiter Video Screen',
          description: 'Initial fit conversation focusing on professional history, project cooperation styles, and fundamental technical domains.',
          recruiterExpectations: 'They are looking for standard project timelines, general cultural alignment, enthusiastic tone, clear articulation, and to ensure you do not wander off-topic (tangential speaking) when describing past work.',
          practicePointers: [
            'Keep your past project summaries under 90 seconds.',
            'Maintain brief conversational breaks to let the recruiter prompt you.',
            'Focus on your direct engineering actions, not just what the general team did.'
          ],
          starExample: {
            situation: 'Our core customer dashboard was receiving complaints about rendering lag on older devices.',
            task: 'I was assigned to identify the main bottleneck and optimize components without introducing visual regressions.',
            action: 'I profiled the rendering cycles using Chrome DevTools, identified redundant state updates in our lists, implemented React.memo, and virtualized long scrolling feeds.',
            result: 'This reduced unnecessary re-renders by 75% and improved our Lighthouse performance score from 68 to 92.'
          },
          questions: [
            {
              id: 'fe_q1',
              question: 'Tell me about a time you had to optimize the web performance of a React application.',
              hint: 'Identify specific bottlenecks (unnecessary re-renders, oversized bundles, asset loading) and name the precise tools (Lighthouse, DevTools, Webpack Analyzer) you used to diagnose and resolve them.',
              modelAnswer: 'At my last job, our dashboard rendered hundreds of items, causing a 1.2-second input lag. I used Chrome DevTools performance tab to identify that deep component nesting was triggering global re-renders. I refactored the parent state to keep updates local, introduced React.memo for static card elements, and applied item virtualization. Ultimately, input latency dropped to under 50ms, resulting in a significantly smoother and faster user experience.'
            },
            {
              id: 'fe_q2',
              question: 'How do you structure code to make it maintainable and clear for other members of the engineering team?',
              hint: 'Mention coding conventions, atomic component structures, self-documenting code, type safety with TypeScript, and proactive peer code review processes.',
              modelAnswer: 'I believe maintainability starts with predictable conventions. I split components using the atomic design hierarchy (atoms, molecules, organisms) so they have a single responsibility. I leverage TypeScript strictly to catch type issues early and write self-explanatory function names to avoid excessive comments. Finally, when opening Pull Requests, I write detailed summaries detailing "Why" and "What" changes were made so code reviews are efficient.'
            }
          ]
        },
        {
          stageId: 'fe_manager_tech',
          stageName: 'Technical & Architecture Interview',
          description: 'Deep dive into complex component lifecycle, asynchronous data patterns, custom hooks, design system scaling, and state management.',
          recruiterExpectations: 'They want to understand your mental model of the DOM, state synchronization, browser constraints, and see your problem-solving process when facing challenging UI architectures.',
          practicePointers: [
            'Draw/outline architecture diagrams mentally or on paper before typing.',
            'Explain trade-offs between local, contextual, and global state machines.',
            'Clarify assumptions about web compatibility, responsive styles, and API error states upfront.'
          ],
          starExample: {
            situation: 'We needed to build a collaborative multi-step workspace builder requiring instant state saves and shared custom widgets.',
            task: 'I had to design a global state client system that synchronized user drags and custom settings without heavy network strain.',
            action: 'I implemented a lightweight state store using Zustand, decoupled local drag-state coordinates from global state saves, and debounced server updates to fire only once per second.',
            result: 'This optimized state flows, eliminated UI lag, and reduced server payload write frequencies by 82% while keeping collaborative state entirely accurate.'
          },
          questions: [
            {
              id: 'fe_q3',
              question: 'Explain how you approach state management in complex, nested interfaces. When do you choose Context, Redux, Zustand, or simple local state?',
              hint: 'Demonstrate architectural maturity by aligning data persistence constraints with the appropriate tools. Keep state as local as possible, use Context for configurations (e.g., themes), and globally scoped stores for transactional workspace data.',
              modelAnswer: 'My philosophy is to keep state as close to the consumer as possible to prevent excessive re-renders. If state is confined to a single component subtree, I use standard useState/useReducer hooks. For semi-global configurations like color tokens or user credentials, React Context is ideal. For heavy, rapid transaction state, I prefer lightweight libraries like Zustand because they prevent unnecessary tree traversal and provide decoupled selectors, keeping our UI extremely snap-responsive.'
            },
            {
              id: 'fe_q4',
              question: 'Describe a challenging browser-compatibility or accessibility (a11y) bug you debugged.',
              hint: 'Discuss actual standard protocols like WCAG guidelines, semantic HTML elements, screen readers, keyboard focus traps, or touch gestures.',
              modelAnswer: 'We had a custom dropdown select element that looked perfect but was completely unusable for keyboard navigating users and screen readers. I refactored the generic divs to use native button and list elements, bounded focus using a keyboard trap with React refs, added ARIA attributes (aria-expanded, aria-haspopup), and registered ESC key handlers. This ensured full WCAG AA compliance and expanded our target accessibility reach.'
            }
          ]
        },
        {
          stageId: 'fe_final_round',
          stageName: 'Collaborative Final & Leadership',
          description: 'Cross-functional alignment conversation with product owners, engineering directors, and designer partners.',
          recruiterExpectations: 'Evaluating your team empathy, compromise ability, prioritization when facing tight deadlines, and communication with non-technical stakeholders.',
          practicePointers: [
            'Avoid overly dogmatic technical claims; prioritize business goals and user happiness.',
            'Highlight moments you supported, mentored, or collaborated with colleagues.',
            'Be clear and structured—do not drift into endless stories (keep answers tight).'
          ],
          starExample: {
            situation: 'We had a strict technical launch deadline, but the design team delivered highly elaborate CSS transition mocks that would add two weeks of dev work.',
            task: 'I had to navigate this conflict to deliver a fantastic UX on time.',
            action: 'I set up a collaborative session with the design lead, explained the rendering performance and timeline trade-offs, and proposed simplified micro-interactions using native Tailwind utilities.',
            result: 'We agreed on the streamlined animation set, completed development three days ahead of schedule, and achieved a 4.9/5 satisfaction rating from early beta users.'
          },
          questions: [
            {
              id: 'fe_q5',
              question: 'How do you handle disagreements with UI/UX designers regarding feature implementation and layout constraints?',
              hint: 'Highlight proactive compromise, user-first thinking, cost-benefit analysis, and setting up collaborative design/engineering syncs.',
              modelAnswer: 'Disagreements are valuable alignment opportunities. When a mock is difficult or performance-intensive, I show, rather than tell. I set up a quick sandbox draft or CodePen demonstrating the rendering bottlenecks, explain the core UX and speed trade-offs, and outline alternative micro-animations that deliver 90% of the impact in 10% of the time, keeping our release cycles agile and collaborative.'
            },
            {
              id: 'fe_q6',
              question: 'Tell me about a time you had to mentor an associate junior developer or onboard a team member.',
              hint: 'Discuss active listening, pair-programming, setting clear step-by-step milestones, and creating a psychologically safe learning environment.',
              modelAnswer: 'I mentored a junior developer who struggled with async logic in React. Instead of giving them the answers, we initiated weekly pair-programming sessions. I encouraged them to draw raw state maps on paper, scaffold code into logical steps, and celebrate minor architectural wins. They gained incredible self-reliance and successfully shipped their first custom data hook ahead of the project milestone.'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'backend',
    name: 'Backend Engineer',
    icon: '⚡',
    shortDescription: 'Focus on APIs, database schemas, scaling, caching strategies, asynchronous message queues, and server stability.',
    jobTitle: 'Backend Engineer',
    elevatorPitch: 'I am a Backend Engineer passionate about designing scalable microservices, relational databases, and high-performance server logic. In my last role, I refactored our database indexes and introduced Redis caching, which reduced SQL latency by 45% and doubled our concurrent user capacity. My goal is to build secure, fault-tolerant infrastructure that remains hyper-resilient under any scaling spike.',
    plan: {
      jobTitle: 'Backend Engineer',
      companyName: 'ScaleGrid Systems',
      adhdFocusTips: [
        {
          title: 'The Database Schema Breathe',
          expansion: 'Visualize an unindexed database table slowly transforming into a clean, perfectly structured index with every long release of breath. Feel the noise and chaos in your mind fade away as structural order is restored.',
          practiceExercise: 'Breathe in deeply for 4 seconds, indexing your thoughts. Hold for 2. Breathe out, releasing the query stress for 5 seconds.',
          reward: 'Latency dropped to zero! Your headspace is neat, clean, and indexed for technical queries.'
        },
        {
          title: 'The Brain Dump Task Breakout',
          expansion: 'ADHD brains often experience working-memory overload during high-stress situations. Before answering, immediately write down 3 quick engineering terms on your notepad. This offloads active processing stress from your subconscious.',
          practiceExercise: 'Use the typing pad to draft 3 backend keywords (e.g., Redis, ACID, Lock) to clear mental ram.',
          reward: 'Your mental working memory is cleared. You can now articulate your system flows systematically!'
        },
        {
          title: 'System Boundary Self-Regulation',
          expansion: 'Remind yourself that an interview is simply a technical collaborative session, not an intelligence test. If you run out of energy, pause, drink a sip of water, and state: "Let me trace that flow step-by-step to be precise."',
          practiceExercise: 'Take a virtual sip of water, relax your shoulders, and write a calming anchor phrase below.',
          reward: 'Your nervous system feels safe and secure. No threat response needed.'
        }
      ],
      stages: [
        {
          stageId: 'be_phone_screen',
          stageName: 'Initial Screening Call',
          description: 'Fundamental backend check covering professional alignment, basic server setup, protocols (HTTP, REST, gRPC), and database choices (SQL vs NoSQL).',
          recruiterExpectations: 'Evaluating core language fluencies (Node, Python, Go, Java), clear communication about high-load experiences, and general collaborative engineering attitudes.',
          practicePointers: [
            'Highlight real system volumes you have worked with (e.g., thousands of requests per minute).',
            'Avoid getting stuck explaining too many technical details unless prompted.',
            'Maintain a positive, humble tone when explaining legacy codebase difficulties.'
          ],
          starExample: {
            situation: 'Our old monolith took over 4 seconds to export monthly transaction CSV sheets, blocking event processing loops.',
            task: 'I had to decouple this resource-intensive export task from the primary user thread.',
            action: 'I migrated the export logic to an asynchronous background worker flow triggered by a BullMQ job queue and saved final outputs to an AWS S3 bucket.',
            result: 'This optimized main thread server availability to 99.99% and allowed users to receive their files in the background via email notifications.'
          },
          questions: [
            {
              id: 'be_q1',
              question: 'What is your process for choosing between a relational (SQL) and non-relational (NoSQL) database for a new backend feature?',
              hint: 'Explain database choice based on structural demands: SQL for complex relational graphs, transaction safety (ACID), and rigorous schemas; NoSQL for document-based caching, dynamic fields, or high write speed limits.',
              modelAnswer: 'I evaluate database choices based on data shape and consistency requirements. If the data is highly structured with rigid relationships and requires strict transactional consistency (such as financial balances), SQL is our winner because of ACID compliance and indexing patterns. If the data changes shape constantly, is hierarchically structured (like product metadata catalogues), and needs to scale horizontally with write volumes, I leverage document NoSQL stores like MongoDB.'
            },
            {
              id: 'be_q2',
              question: 'Explain the difference between authentication and authorization, and how you implement them securely in an API.',
              hint: 'Define authentication as identity validation (Who you are, e.g. JWT, OAuth logins) and authorization as permission verification (What you can do, e.g. RBAC roles, ACL controls).',
              modelAnswer: 'Authentication validates *who* a user is, while authorization determines *what* actions they are permitted to execute. In APIs, I handle authentication securely by validating cryptographic JWT signatures or checking temporary session tokens generated via secure HTTPS cookies. Once validated, our authorization middleware verifies the user roles against our ACL database before letting them access sensitive microservice paths.'
            }
          ]
        },
        {
          stageId: 'be_manager_tech',
          stageName: 'Systems Design & DB Tech Deep Dive',
          description: 'Designing high-availability systems, load balancing, caching architectures, concurrency limits, replication, and indexing optimization.',
          recruiterExpectations: 'They want to observe how you handle ambiguous scaling questions and examine your awareness of data pipelines, microservice faults, and latency costs.',
          practicePointers: [
            'Break down your design step-by-step: API routing, application layer, caching, database replication.',
            'Explicitly state where failures can happen (Single points of failure) and how to protect them.',
            'Explain how caching expiration (TTL) or race conditions are controlled.'
          ],
          starExample: {
            situation: 'Our flash-sale platform crashed due to database lock contentions when 10,000 customers checked out identical digital tickets concurrently.',
            task: 'I was tasked with redesigning the checkout process to handle massive concurrency spikes.',
            action: 'I introduced a Redis-based distributed lock system, queued checkout checkout applications using RabbitMQ to rate-limit database queries, and utilized optimistic lock index controls.',
            result: 'This successfully absorbed the throughput spikes, eliminated database transaction timeouts, and maintained 100% stock accuracy across heavy flash sales.'
          },
          questions: [
            {
              id: 'be_q3',
              question: 'How do you design a database indexing strategy to optimize slow read queries without crippling write performance?',
              hint: 'Analyze indexing costs (B-Trees take memory and slow down INSERT/UPDATE writes). Discuss compound indexes, query execution profiling (EXPLAIN ANALYZE), and database write trade-offs.',
              modelAnswer: 'Database indexes are powerful but double write costs. I start by running EXPLAIN ANALYZE on our slowest queries to identify which index paths are ignored. I establish indexes strictly on fields heavily targeted by WHERE, JOIN, and ORDER BY clauses. To minimize write impact, I avoid indexing highly repetitive columns (like booleans) and implement compound indexes based on left-prefix search parameters.'
            },
            {
              id: 'be_q4',
              question: 'How would you handle cascading failures or system downtime within a microservices architecture?',
              hint: 'Explain resilience patterns: Circuit Breakers (e.g. Resilience4j, Hystrix), structured fallback responses, timeout policies, retry configurations with exponential backoff, and distributed monitoring logs.',
              modelAnswer: 'To stop cascading failures, I implement circuit breakers on our intermediate service calls. If a subscale API times out repeatedly, the circuit trips immediately, enabling the primary client to display a friendly cached fallback instead of stalling the complete pipeline. I support this with retry mechanisms built with randomized exponential backoff to avoid overloading the service, and route unified tracing logs to OpenTelemetry for fast debugging.'
            }
          ]
        },
        {
          stageId: 'be_final_round',
          stageName: 'General Architecture & Management Sync',
          description: 'Discussions around engineering standards, mentoring, cloud cost optimizations, security reviews, and dev-ops integrations.',
          recruiterExpectations: 'Evaluating your long-term vision, willingness to enforce security and clean testing, and collaborative engineering ownership.',
          practicePointers: [
            'Discuss the importance of automated unit, integration, and load tests.',
            'Talk about how clear API contracts (Swagger/OpenAPI docs) help frontend developers move faster.',
            'Focus on cost-effective scaling and keeping systems simple over overly complex microservice networks.'
          ],
          starExample: {
            situation: 'Our development environment deployment pipelines were manual, variable, and often broke on release, taking several hours of team downtime.',
            task: 'I had to standardize our continuous integration and delivery (CI/CD) pipelines to secure deployment quality.',
            action: 'I containerized our microservices using Docker, configured automated GitHub Actions workflows to validate tests and linters, and rolled out staging blue-green deploys.',
            result: 'This reduced release integration times from 3 hours to 8 minutes, caught 98% of compile-time syntax flaws before production, and lowered manual release errors to zero.'
          },
          questions: [
            {
              id: 'be_q5',
              question: 'Tell me about a time you identified and resolved a major security vulnerability in your server code.',
              hint: 'Discuss patterns like SQL injection, cross-site scripting (XSS), dependency audits (npm audit, Snyk), sanitizing inputs, or securing authorization headers.',
              modelAnswer: 'During an audit, I discovered our query parameters were directly interpolated into raw SQL lines, leaving us vulnerable to SQL injections. I refactored our system to use parameterized queries and ORM mappings, implemented Helmet middleware to secure HTTP security headers, and established Snyk in our pipeline to flag outdated vulnerable libraries automatically. This fully locked down our database access layers.'
            },
            {
              id: 'be_q6',
              question: 'How do you maintain clear documentation for highly complex backend APIs?',
              hint: 'Focus on auto-generating docs like OpenAPI/Swagger, creating detailed postman collections, maintaining clean READMEs with setup step guides, and writing API contract first codes.',
              modelAnswer: 'I believe documentation should reside close to the codebase. I use contract-first design to generate OpenAPI (Swagger) specifications directly from our typescript routers. This ensures our docs are updated with every build. I supplement this with Postman environments and clear READMEs specifying dependencies so new developers can complete their workspace setups in less than 20 minutes.'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'pm',
    name: 'Product Manager',
    icon: '🗺️',
    shortDescription: 'Focus on product market fit, roadmapping, backlog prioritization, metric definitions, user testing, and stakeholder alignment.',
    jobTitle: 'Product Manager',
    elevatorPitch: 'I am a Product Manager dedicated to building user-centric software that solves actual human problems while driving business outcomes. In my last role, I launched a new onboarding flow that increased user activation rates by 22% and reduced initial customer drop-offs. I thrive on translating ambiguous user data into structured product roadmaps that bring design, business, and engineering teams into flawless alignment.',
    plan: {
      jobTitle: 'Product Manager',
      companyName: 'NexStep Consumer Tech',
      adhdFocusTips: [
        {
          title: 'The Roadmap Horizon Grounding',
          expansion: 'Anxiety arises from wanting to solve every product problem simultaneously. ADHD PMs can hyperfocus on edge-cases. ground yourself into a single, high-impact user problem for this conversation.',
          practiceExercise: 'Breathe in for 4 seconds, thinking about an empty roadmap. Breathe out for 6, prioritizing a single step.',
          reward: 'Your mind is organized. You are focusing strictly on high-yield, high-clarity business goals.'
        },
        {
          title: 'The Backlog Dump Exercise',
          expansion: 'If your thoughts are racing, write them down immediately. Typing calming anchors clears the active noise so you can respond with calm, structured business frameworks (like RICE or MoSCoW).',
          practiceExercise: 'Type three words explaining how users experience pain points below.',
          reward: 'Great job. You are grounded in user-empathy and structured prioritization.'
        },
        {
          title: 'Active Listening Anchor Pause',
          expansion: 'An experienced PM never jumps to answer instantly. Pause for 4 seconds when asked a question, and write the question core down. This prevents tangential rambling and ensures high-relevance replies.',
          practiceExercise: 'Count slowly to 4 while breathing shallow, steady breaths before thinking about metrics.',
          reward: 'You are calibrated to deliver highly relevant, objective, metrics-first product answers.'
        }
      ],
      stages: [
        {
          stageId: 'pm_phone_screen',
          stageName: 'Conversational Screen',
          description: 'A dialogue focusing on product execution philosophies, past product launches, stakeholder management, and metrics orientation.',
          recruiterExpectations: 'They seek structured story patterns, strong communication, crisp customer-first frameworks, and metrics awareness (converting metrics into actual impact).',
          practicePointers: [
            'Answer using the CIRCLES or STAR frameworks to prevent going off-topic.',
            'Name concrete business metrics (Retention, activation, monthly recurring revenue).',
            'Validate design and engineering contributions explicitly.'
          ],
          starExample: {
            situation: 'Our customer churn rate increased by 8% after we introduced our premium subscription tier interface.',
            task: 'I had to find the root cause of this customer bounce and implement a fast validation recovery.',
            action: 'I ran 15 user testing sessions, realized users felt tricked by hidden pricing info, and refactored the paywall transparency copy, adding a prominent "cancel anytime" notice.',
            result: 'This transparency boosted checkouts by 14% and restored our user retention rate to its original baseline within 30 days.'
          },
          questions: [
            {
              id: 'pm_q1',
              question: 'How do you prioritize features when you have duplicate demands from Sales, Engineering, and Design leads?',
              hint: 'Structure prioritization via formal assessment frameworks: RICE (Reach, Impact, Confidence, Effort) or MoSCoW to objectively convert noise into structured product roadmap tracks.',
              modelAnswer: 'I rely on objective data frameworks to remove emotion from prioritization. I run all proposed features through the RICE framework, mapping out expected Reach and Impact against our engineering Effort and Confidence score. This provides an objective matrix that we review collectively with product and dev leads, ensuring alignment based on hard metrics and realistic resource limits.'
            },
            {
              id: 'pm_q2',
              question: 'Tell me about a product you managed that failed. What did you learn from that experience?',
              hint: 'Choose a real case, take accountability (no blame), illustrate how you measured failure (data), and share the actionable product principles you extracted.',
              modelAnswer: 'We launched a personalized recommendation engine that we assumed users wanted. However, our monthly activation rate dropped because users found the setup questionnaire too long. We failed to launch a lightweight MVP first. This taught me to always test assumptions using minimal prototypes, and measure weekly drop-off charts closely before executing heavy development builds.'
            }
          ]
        },
        {
          stageId: 'pm_manager_tech',
          stageName: 'Product Execution Case Study',
          description: 'Working through a complex mock product launch case (e.g. "How would you design an elevator booking app for a 100-story building?").',
          recruiterExpectations: 'Testing your operational breakdown skill, persona analysis, feature prioritization, technical scale understanding, and metrics dashboard creation.',
          practicePointers: [
            'Ask clarifying questions before proposing solutions.',
            'Identify target customer personas first, then define painful problems, and then specify feature solutions.',
            'Include specific success metrics (guardrail metrics) to measure launch performance.'
          ],
          starExample: {
            situation: 'Our parent e-commerce application needed to design and launch an in-house group gifting feature for the holiday season.',
            task: 'I had to coordinate this new category proposal from design inception to production launch within 8 weeks.',
            action: 'I mapped customer personas, specified an MVP capturing payment contributions under a single lead user, ran quick wireframe tests, and prioritized work in 2-week sprints.',
            result: 'We successfully launched on time, achieved $450k in transaction volume in December, and onboarded 20,000 new users who received group gifts.'
          },
          questions: [
            {
              id: 'pm_q3',
              question: 'How would you decide when a feature is ready for launch, or if it requires more testing?',
              hint: 'Balance engineering stability (crash rates), minimal user activation rates (usability feedback tests), and project timeline goals.',
              modelAnswer: 'I look at a healthy mix of qualitative and quantitative indicators. Quantitatively, the feature must meet our pre-defined QA stability goals (e.g., crash rate under 0.1%) and demonstrate stable retention in a small 5% canary test group. Qualitatively, user testing must confirm zero blocking usability errors. If these targets are met, we roll out the feature in phased groups to monitor guardrail metrics.'
            },
            {
              id: 'pm_q4',
              question: 'Explain how you translate a high-level business vision into actionable, daily sprint tickets for developer teams.',
              hint: 'Focus on writing clear Epics, rich user stories with clear "As a user, I want to, So that..." structures, and detailed Acceptance Criteria (Given-When-Then rules).',
              modelAnswer: 'I bridge the gap by writing clear user stories with deep Acceptance Criteria. I structure tickets using the User Story framework ("As a... I want to... So that...") and map out exact functional requirements using "Given-When-Then" constraints. I review engineering drafts with developers during grooming to ensure all technical complexities are accounted for, which prevents downstream blockers.'
            }
          ]
        },
        {
          stageId: 'pm_final_round',
          stageName: 'Executive Alignment & Leadership',
          description: 'Meetings with Vice Presidents and Chief Product Officers assessing business strategy, cloud monetization limits, and cultural synergy.',
          recruiterExpectations: 'Are you ready to influence without authority, make difficult strategic compromises, and think about long-term company values?',
          practicePointers: [
            'Convey long-term product vision tied directly to company financial objectives.',
            'Acknowledge resource constraints immediately and show maturity regarding costs.',
            'Project structured, positive energy—keep answers crisp and executive-friendly.'
          ],
          starExample: {
            situation: 'Our executive board wanted to roll out ads, which I knew would degrade our Core UX and increase user churn.',
            task: 'I had to present a data-supported counter-proposal that satisfied our growth revenue goals without spoiling retention.',
            action: 'I analyzed user cohorts, designed a subscription tier that removed ads while adding 3 highly requested features, and presented a comparative mock model to the stakeholders.',
            result: 'We launched the premium tier, successfully hitting our revenue target within 60 days, and increased our NPS score by 5 points by keeping the base user experience clean.'
          },
          questions: [
            {
              id: 'pm_q5',
              question: 'How do you handle situations where executive leadership requests a feature that contradicts your user research data?',
              hint: 'Avoid emotional arguments. Lean heavily on user test recordings, visual charts, cohort models, and propose quick, low-cost interactive experiments to validate.',
              modelAnswer: 'I always respond with data and objectivity. Rather than saying "no," I present our user research cohort data and customer surveys. I then propose a low-effort landing page experiment or a simple A/B test with a limited audience to compile hard conversion metrics, allowing us to align on decisions based on real user behavior rather than opinions.'
            },
            {
              id: 'pm_q6',
              question: 'What is your strategy for communicating product roadmap delays to key business stakeholders?',
              hint: 'Showcase proactive honesty, clear root-cause analysis, and presenting alternative mitigation solutions immediately.',
              modelAnswer: 'Proactivity is key. The moment we identify a potential delay, I schedule a sync with stakeholders. I explain the technical root-cause simply, walk them through the business impact, and present alternative paths—like launching a minor MVP on time or reallocating resources to accelerate key deliverables. This keeps trust intact.'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'general_behavioral',
    name: 'General Behavioral / HR',
    icon: '🤝',
    shortDescription: 'Ideal for any job role. Master conflict resolution, collaboration, adaptability, performance under pressure, and career direction.',
    jobTitle: 'Candidate',
    elevatorPitch: 'I am a highly motivated team member who loves solving challenging puzzles and collaborating across departments. In my professional journey, I have prioritized structured communication, strong project deadlines, and proactive problem solving. In the future, I look forward to contributing my analytical skills and creative energy to support high-growth team environments.',
    plan: {
      jobTitle: 'Team candidate',
      companyName: 'Unified Partners Inc.',
      adhdFocusTips: [
        {
          title: 'The Calm Heartrate Anchor',
          expansion: 'Anxiety creates rapid chest shallow breathing. Slow, steady abdominal breathing sends a direct neurological safety signal from your heart back to your brain, instantly soothing nervous vocal wobbles.',
          practiceExercise: 'Inhale for 4 seconds, expand your belly. Exhale slowly for 6 seconds. Repeat following our visual pulse.',
          reward: 'Your heart rate has stabilized! You can now speak in a steady, confident, and warm conversational tone.'
        },
        {
          title: 'Notes & Structure Preparation',
          expansion: 'Our minds love to explore details. During the interview, write down 3 key stories you want to highlight. This stops mental freeze when asked unexpected questions.',
          practiceExercise: 'Type or write down 3 career stories you feel most proud of.',
          reward: 'Your career highlights are mapped out, ready to be retrieved for any behavioral prompt!'
        },
        {
          title: 'The ADHD Power Visualization',
          expansion: 'Neurodiversity comes with intense creativity, high responsiveness, and incredible passion. View your focus variance as an adaptive advantage in solving complex, rapid client problems.',
          practiceExercise: 'Close your eyes for 5 seconds and visualize yourself shaking hands and laughing at the end of a successful interview.',
          reward: 'Confident state loaded. Go shine!'
        }
      ],
      stages: [
        {
          stageId: 'hr_screen',
          stageName: 'Conversational HR Screening',
          description: 'A friendly conversation exploring your background, career changes, work style, compensation goals, and general organizational fit.',
          recruiterExpectations: 'They are looking for standard project timelines, professional maturity, polite listening, and a calm, positive narrative of your career history.',
          practicePointers: [
            'Maintain a positive outlook regarding your past employers and challenges.',
            'Give direct, 60-90 second answers to avoid rambling.',
            'Show enthusiastic interest in the company mission statement.'
          ],
          starExample: {
            situation: 'Our department was shifting to an entirely new project tracking tool in the middle of a major product delivery.',
            task: 'I had to adapt mine and my colleagues\' daily routines without missing our client release dates.',
            action: 'I dedicated a weekend to mastering the new interface, set up three quick 15-minute onboarding sessions for our core coworkers, and drafted a simple cheat-sheet guide.',
            result: 'Our team adopted the platform with zero delays, completed the client project on time, and reduced dashboard coordination bugs by 20%.'
          },
          questions: [
            {
              id: 'hr_q1',
              question: 'Tell me about a time you had to adapt quickly to a major shift in project goals or priorities.',
              hint: 'Detail how you managed your initial stress (cognitive flexibility), mapped out a structured action plan, and successfully aligned your team to hit the target.',
              modelAnswer: 'At my previous company, our core client pivot required us to redesign our main campaign in under a week. Instead of worrying, I gathered the team, mapped out our top priorities, and divided the deliverables into daily goals. By establishing transparent tracking and maintaining open communication, we shipped the project on time and achieved an outstanding satisfaction rating from the client.'
            },
            {
              id: 'hr_q2',
              question: 'Why are you looking to leave your current role, and what excites you about joining our team?',
              hint: 'Keep it positive and forward-looking. Avoid speaking negatively of previous employers; instead, frame the change as a natural next step in your professional growth.',
              modelAnswer: 'I have learned a tremendous amount about coordination and execution in my current role. However, I am eager to apply these skills in a fast-paced environment where I can take on more user-facing challenges. I have been following your company mission closely, and yours is exactly the type of collaborative and innovative team I want to contribute to.'
            }
          ]
        },
        {
          stageId: 'hr_collaboration',
          stageName: 'Collaboration & Conflict Resolution',
          description: 'Deep behavioral check tracking how you resolve conflict, work with cross-functional partners, and handle challenging coworkers.',
          recruiterExpectations: 'Are you emotionally mature? Can you listen to criticism without reacting defensively, and find constructive compromises?',
          practicePointers: [
            'Avoid casting yourself as a flawless hero; show vulnerability and self-improvement.',
            'Focus on empathy and active listening when describing coworker friction.',
            'Highlight metrics-first outcomes from your compromises.'
          ],
          starExample: {
            situation: 'A team member disagreed with my analytical design and refused to cooperate on our shared dashboard build.',
            task: 'I needed to resolve this tension to hit our pipeline deadline.',
            action: 'I set up a private 1-on-1 coffee chat, listened actively to their design concerns, compromised by incorporating their layout suggestions, and established clear roles.',
            result: 'We resolved the friction, delivered the interface ahead of schedule, and established a strong collaborative dynamic that lasted throughout our subsequent projects.'
          },
          questions: [
            {
              id: 'hr_q3',
              question: 'Tell me about a time you had to deliver a critical project with a highly difficult stakeholder or teammate.',
              hint: 'Focus on empathy, active listening, setting boundaries, and focusing solely on professional goals to maintain high output.',
              modelAnswer: 'I worked with a peer who was highly critical of our project workflow. Instead of taking it personally, I scheduled a 1-on-1 to listen to their feedback. I realized they were stressed about scope creep. We collaborated to establish transparent boundaries, which not only eased the tension but also helped us ship the project on time.'
            },
            {
              id: 'hr_q4',
              question: 'How do you handle receiving constructive, direct criticism about your work performance?',
              hint: 'Explain your growth mindset: active listening, separating identity from output, asking clarifying questions, and designing a progress roadmap.',
              modelAnswer: 'I view feedback as essential dashboard data for growth. When my supervisor noted that my project summaries were too extensive, I thanked them for the insight. I asked for examples of their preferred style, designed a concise 3-bullet template, and applied it to all subsequent updates, which significantly improved our team alignment.'
            }
          ]
        },
        {
          stageId: 'hr_pressure',
          stageName: 'Performance Under Stress & Ambiguity',
          description: 'How you handle high workloads, missing data, tight deadlines, and prioritize tasks when everything feels urgent.',
          recruiterExpectations: 'Evaluating your prioritization framework, task-breakdown methods, boundary-setting strategies, and resilience when facing stress.',
          practicePointers: [
            'Talk about breaking complex projects down into smaller, bite-sized tasks.',
            'Mention tools or calendars you use to keep your workspace structured.',
            'Explain how you proactively communicate workload boundaries to prevent burnout.'
          ],
          starExample: {
            situation: 'Two major client launches scheduled on the exact same afternoon created a massive workload bottleneck.',
            task: 'I had to ensure both projects were delivered flawlessly without compromising quality.',
            action: 'I mapped out our deliverables, used a prioritization matrix to identify critical tasks, delegated secondary items, and set up clear milestones.',
            result: 'Both launches were completed on time, resulting in a 15% increase in account renewals from both clients.'
          },
          questions: [
            {
              id: 'hr_q5',
              question: 'How do you structure your daily workflow to stay focused and productive when managing multiple urgent tasks?',
              hint: 'Mention explicit ADHD-friendly methods (task batching, time blocking, clear lists, taking scheduled breaks) that demonstrate outstanding self-awareness.',
              modelAnswer: 'I stay highly productive by organizing my day into structured time-blocks. I prioritize critical actions using a matrix, batch similar tasks together to minimize context switching, and use focus apps to manage my energy. This structured approach allows me to deliver exceptional results consistently.'
            },
            {
              id: 'hr_q6',
              question: 'Describe a time you were given a highly ambiguous assignment or project. How did you proceed?',
              hint: 'Highlight how you gathered missing information, interviewed key stakeholders, drafted an initial roadmap proposal, and iterated based on feedback.',
              modelAnswer: 'I was asked to "improve our team alignment" with no further instructions. I proactively interviewed team members to identify bottlenecks, designed a customized sprint planning template based on their feedback, and iterated on the design over two weeks. This simple shift reduced miscommunication by 40% and established a highly efficient, transparent workflow.'
            }
          ]
        }
      ]
    }
  }
];
