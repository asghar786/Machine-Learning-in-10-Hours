<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) return;

        $posts = $this->getPosts();

        foreach ($posts as $data) {
            Post::updateOrCreate(
                ['slug' => $data['slug']],
                array_merge($data, ['author_id' => $admin->id, 'is_published' => true])
            );
        }
    }

    private function getPosts(): array
    {
        return [
            [
                'title'            => 'AI and its Future Usability',
                'slug'             => 'ai-and-its-future-usability',
                'category'         => 'Artificial Intelligence',
                'type'             => 'blog',
                'thumbnail'        => 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
                'excerpt'          => 'Artificial Intelligence is no longer science fiction. Explore how AI is reshaping industries, automating complex tasks, and opening doors to a smarter tomorrow.',
                'content'          => <<<HTML
<h2>Introduction</h2>
<p>Artificial Intelligence (AI) is transforming how we live, work, and interact with technology. From virtual assistants like Siri and Alexa to self-driving cars and medical diagnostics, AI is becoming embedded in every aspect of daily life.</p>
<h2>Current Applications</h2>
<p>Today, AI powers recommendation engines on Netflix and Spotify, detects fraud in banking, personalises shopping experiences on e-commerce platforms, and accelerates drug discovery in pharmaceuticals. These applications demonstrate how AI is already solving real-world problems at scale.</p>
<h2>The Near Future</h2>
<p>As models grow larger and datasets richer, AI will automate more cognitive tasks — legal research, code generation, financial analysis, and customer support. Edge AI will bring intelligence to IoT devices, enabling real-time decision-making without cloud dependency.</p>
<h2>Ethical Considerations</h2>
<p>With great power comes great responsibility. Bias in training data, job displacement, privacy concerns, and autonomous weapons are challenges that policymakers, researchers, and businesses must address together to ensure AI benefits humanity broadly.</p>
<h2>Conclusion</h2>
<p>The future of AI is not about replacing humans but augmenting human capability. Those who understand and adapt to AI will have a significant competitive advantage — making AI literacy one of the most important skills of the 21st century.</p>
HTML,
                'meta_title'       => 'AI and its Future Usability | ML in 10 Hours',
                'meta_description' => 'Discover how Artificial Intelligence is reshaping industries and what the future holds for AI usability across healthcare, finance, education, and more.',
                'og_title'         => 'AI and its Future Usability',
                'og_description'   => 'From self-driving cars to medical AI, explore how artificial intelligence is redefining the future of every industry.',
                'og_image'         => 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
                'focus_keyword'    => 'AI future usability',
                'published_at'     => now()->subDays(20),
            ],
            [
                'title'            => 'Why Machine Learning is Important for Everyone',
                'slug'             => 'why-machine-learning-important-for-everyone',
                'category'         => 'Machine Learning',
                'type'             => 'blog',
                'thumbnail'        => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
                'excerpt'          => 'Machine Learning is not just for data scientists. Learn why ML literacy is becoming essential for professionals across every industry.',
                'content'          => <<<HTML
<h2>What is Machine Learning?</h2>
<p>Machine Learning (ML) is a branch of AI that enables systems to learn from data and improve their performance without being explicitly programmed. It is the technology behind spam filters, product recommendations, fraud detection, and predictive analytics.</p>
<h2>Why Should Non-Technical People Care?</h2>
<p>You do not need to write ML algorithms to benefit from understanding them. Marketing teams use ML to segment audiences. HR departments use it for resume screening. Healthcare providers use it for patient risk scoring. Business analysts use ML-powered dashboards for forecasting.</p>
<h2>ML in Everyday Life</h2>
<p>Every time Google autocompletes your search, Gmail filters spam, or your bank flags a suspicious transaction — that is ML at work. Even the traffic predictions on Google Maps rely on machine learning models trained on billions of historical data points.</p>
<h2>The Skills Gap</h2>
<p>Companies struggle to find ML-literate professionals. Understanding the basics of how models are trained, what features matter, and how to interpret results makes any professional more effective and more valuable in the job market.</p>
<h2>Getting Started</h2>
<p>You do not need a PhD. Start with Python basics, then explore scikit-learn, pandas, and Jupyter notebooks. Structured courses like Machine Learning in 10 Hours are designed to get you productive quickly without overwhelming theory.</p>
HTML,
                'meta_title'       => 'Why Machine Learning is Important for Everyone | ML in 10 Hours',
                'meta_description' => 'Machine Learning affects every industry. Learn why ML literacy matters for your career and how to start learning machine learning today.',
                'og_title'         => 'Why Machine Learning Matters for Everyone',
                'og_description'   => 'You do not need to be a data scientist to benefit from ML. Discover how machine learning impacts every profession.',
                'og_image'         => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
                'focus_keyword'    => 'machine learning importance',
                'published_at'     => now()->subDays(15),
            ],
            [
                'title'            => 'Daily Use of MS Office: Boost Your Productivity',
                'slug'             => 'daily-use-of-ms-office-boost-productivity',
                'category'         => 'Productivity',
                'type'             => 'blog',
                'thumbnail'        => 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=800&q=80',
                'excerpt'          => 'Microsoft Office remains the world\'s most used productivity suite. Master Word, Excel, PowerPoint, and Outlook to work smarter every day.',
                'content'          => <<<HTML
<h2>Why MS Office Still Dominates</h2>
<p>Despite the rise of Google Workspace and other alternatives, Microsoft Office remains the gold standard in corporate environments. Understanding it deeply is a non-negotiable professional skill in 2024.</p>
<h2>Microsoft Word: Beyond Typing</h2>
<p>Most people use only 10% of Word capabilities. Styles, templates, mail merge, track changes, and automated table of contents are features that save hours every week. Learn to use heading styles consistently for instant navigation and professional documents.</p>
<h2>Excel: The Analyst Best Friend</h2>
<p>Excel is arguably the most powerful productivity tool ever made. VLOOKUP, pivot tables, conditional formatting, data validation, and Power Query can transform raw data into actionable insights. Learning Excel formulas is like learning a second language that pays dividends every day.</p>
<h2>PowerPoint: Storytelling with Data</h2>
<p>A great presentation does not just inform — it persuades. Use master slides, animations sparingly, SmartArt for process flows, and the Presenter View for confident delivery. Avoid the death-by-PowerPoint trap with clear, visual-first design.</p>
<h2>Outlook: Managing Your Professional Life</h2>
<p>Inbox zero is achievable. Use rules to auto-sort emails, categories to prioritize, and Quick Steps to process emails in one click. Calendar blocking and task integration make Outlook a complete personal productivity system.</p>
<h2>Getting Certified</h2>
<p>Microsoft offers MOS (Microsoft Office Specialist) certifications recognised globally. Certifying in Excel or Word can differentiate your CV and demonstrate professional competency to employers.</p>
HTML,
                'meta_title'       => 'Daily Use of MS Office: Boost Your Productivity | ML in 10 Hours',
                'meta_description' => 'Master Microsoft Word, Excel, PowerPoint and Outlook for daily productivity. Tips and tricks to use MS Office like a professional.',
                'og_title'         => 'Daily MS Office Tips to Boost Your Productivity',
                'og_description'   => 'From Excel pivot tables to Word styles — master the MS Office tools you use every day.',
                'og_image'         => 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=1200&q=80',
                'focus_keyword'    => 'MS Office daily productivity',
                'published_at'     => now()->subDays(10),
            ],
            [
                'title'            => 'Networking Essentials: How the Internet Actually Works',
                'slug'             => 'networking-essentials-how-internet-works',
                'category'         => 'Networking',
                'type'             => 'blog',
                'thumbnail'        => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
                'excerpt'          => 'Understanding networking fundamentals is essential for every IT professional. From IP addresses to DNS and firewalls — demystify the backbone of the modern internet.',
                'content'          => <<<HTML
<h2>What is Computer Networking?</h2>
<p>Computer networking is the practice of connecting computers and devices to share resources and communicate. Whether it is two devices on a home Wi-Fi or millions of servers powering the global internet, the underlying principles are the same.</p>
<h2>The OSI Model</h2>
<p>The OSI (Open Systems Interconnection) model is a conceptual framework with 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer has a specific role — from transmitting electrical signals to rendering web pages.</p>
<h2>IP Addressing and Subnetting</h2>
<p>Every device on a network needs an IP address. IPv4 addresses (like 192.168.1.1) are 32-bit numbers divided into network and host portions. Subnetting divides a network into smaller segments for efficiency and security. IPv6 with 128-bit addresses solves the IPv4 exhaustion problem.</p>
<h2>DNS: The Internet Phone Book</h2>
<p>When you type "google.com," your browser translates it via DNS (Domain Name System) to an IP address. Understanding DNS records (A, CNAME, MX, TXT) is crucial for web developers and sysadmins alike.</p>
<h2>Firewalls and Security</h2>
<p>Firewalls control traffic between network zones. Packet filtering, stateful inspection, and application-layer firewalls each provide different levels of protection. Understanding firewall rules is fundamental to securing any network infrastructure.</p>
<h2>Career Paths in Networking</h2>
<p>CompTIA Network+, Cisco CCNA, and CCNP are industry-recognised certifications that can launch or advance a networking career. Network engineers, security architects, and cloud networking specialists are among the highest-paid IT roles globally.</p>
HTML,
                'meta_title'       => 'Networking Essentials: How the Internet Works | ML in 10 Hours',
                'meta_description' => 'Learn networking fundamentals — IP addressing, DNS, OSI model, firewalls, and more. Essential knowledge for every IT professional.',
                'og_title'         => 'Networking Essentials: How the Internet Really Works',
                'og_description'   => 'From IP addresses to firewalls — a complete guide to networking fundamentals every tech professional should know.',
                'og_image'         => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
                'focus_keyword'    => 'networking essentials',
                'published_at'     => now()->subDays(6),
            ],
            [
                'title'            => 'Learn Website Designing and Development from Scratch',
                'slug'             => 'learn-website-designing-and-development',
                'category'         => 'Web Development',
                'type'             => 'blog',
                'thumbnail'        => 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=80',
                'excerpt'          => 'Web development is one of the most in-demand skills in 2024. Learn the complete roadmap from HTML and CSS basics to React, databases, and deploying your first website.',
                'content'          => <<<HTML
<h2>Why Learn Web Development?</h2>
<p>Web development offers one of the clearest paths from beginner to employed professional. The web powers e-commerce, social media, education, healthcare, and virtually every modern service. Demand for skilled developers far outstrips supply globally.</p>
<h2>The Front-End: What Users See</h2>
<p>Front-end development involves everything a user interacts with: HTML for structure, CSS for styling, and JavaScript for interactivity. Modern front-end developers use frameworks like React, Vue, or Angular to build complex, dynamic user interfaces efficiently.</p>
<h2>HTML and CSS Fundamentals</h2>
<p>HTML (HyperText Markup Language) defines the structure of web pages using elements like headings, paragraphs, images, and links. CSS (Cascading Style Sheets) controls layout, colors, typography, and responsiveness. Together they are the building blocks of every website on the internet.</p>
<h2>JavaScript: Bringing Pages to Life</h2>
<p>JavaScript enables dynamic behaviour — form validation, animations, API calls, and real-time updates. Understanding async/await, DOM manipulation, and ES6+ features is essential for any front-end developer. Node.js extends JavaScript to the server side.</p>
<h2>Back-End Development</h2>
<p>The back-end handles data processing, authentication, and business logic. Popular choices include PHP (Laravel), Python (Django, FastAPI), JavaScript (Node.js/Express), and Java (Spring Boot). Databases like MySQL, PostgreSQL, and MongoDB store application data.</p>
<h2>Your Learning Roadmap</h2>
<p>Start with HTML, then CSS, then JavaScript, then React, then a back-end framework, then databases, then deployment. Build real projects at each stage. A portfolio of 3-5 live projects is worth more than any certificate when applying for jobs.</p>
HTML,
                'meta_title'       => 'Learn Website Designing and Development from Scratch | ML in 10 Hours',
                'meta_description' => 'Complete roadmap to learn web design and development — from HTML/CSS basics to React, databases, and launching your first website.',
                'og_title'         => 'Learn Website Design and Development from Scratch',
                'og_description'   => 'From HTML basics to React and databases — your complete guide to becoming a web developer in 2024.',
                'og_image'         => 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=1200&q=80',
                'focus_keyword'    => 'learn web development',
                'published_at'     => now()->subDays(2),
            ],

            // ── CASE STUDIES ──────────────────────────────────────────────────

            [
                'title'            => 'How ML Helped a Retail Chain Cut Losses by 30%',
                'slug'             => 'ml-retail-chain-cut-losses-case-study',
                'category'         => 'Machine Learning',
                'type'             => 'case-study',
                'thumbnail'        => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                'excerpt'          => 'A mid-size retail chain used machine learning demand forecasting to reduce overstock and waste — saving 30% on inventory losses in under six months.',
                'content'          => <<<HTML
<h2>The Challenge</h2>
<p>A mid-size retail chain operating 120 stores across three regions was struggling with chronic inventory imbalance. Popular items sold out on weekends while slow-moving stock accumulated in warehouses, driving up carrying costs and markdowns. Their manual forecasting process, relying on spreadsheets and buyer intuition, was failing to keep pace with shifting consumer demand.</p>
<h2>The Approach</h2>
<p>The data science team built a demand forecasting pipeline using <strong>XGBoost regression</strong> trained on three years of point-of-sale data, enriched with external signals — local weather, regional holidays, and competitor promotions scraped weekly. Features included lag variables (7-day, 14-day, 28-day), rolling averages, and store-level clustering based on demographic profiles.</p>
<h2>Implementation</h2>
<p>The model was deployed as a FastAPI microservice integrated with the existing ERP system. Every Sunday night it produced a 14-day rolling forecast per SKU per store, automatically generating purchase orders and redistribution recommendations. Store managers received a simple dashboard showing predicted demand vs. current stock with colour-coded alerts.</p>
<h2>Results</h2>
<ul>
  <li>Inventory write-offs reduced by <strong>30%</strong> in the first two quarters</li>
  <li>Out-of-stock incidents dropped by <strong>22%</strong> across top-100 SKUs</li>
  <li>Manual buyer time on routine replenishment cut by <strong>60%</strong></li>
  <li>ROI on the ML project achieved in under 5 months</li>
</ul>
<h2>Key Takeaway</h2>
<p>The success was not just about model accuracy — it was about trust. Getting store managers to act on model recommendations required transparent explainability dashboards showing why the model suggested ordering more or less. Adoption drove the ROI, not the algorithm alone.</p>
HTML,
                'meta_title'       => 'ML Case Study: Retail Chain Cuts Losses by 30% | ML in 10 Hours',
                'meta_description' => 'Learn how a retail chain used machine learning demand forecasting with XGBoost to reduce inventory losses by 30% in six months.',
                'og_title'         => 'How ML Cut Retail Inventory Losses by 30%',
                'og_description'   => 'A real-world machine learning case study: demand forecasting in retail saves millions and reduces waste.',
                'og_image'         => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
                'focus_keyword'    => 'machine learning retail case study',
                'published_at'     => now()->subDays(18),
            ],
            [
                'title'            => 'Predicting Student Dropout with Machine Learning: A University Case Study',
                'slug'             => 'predicting-student-dropout-ml-case-study',
                'category'         => 'Machine Learning',
                'type'             => 'case-study',
                'thumbnail'        => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
                'excerpt'          => 'A university deployed a machine learning early-warning system to identify at-risk students — reducing dropout rates by 18% in the first academic year.',
                'content'          => <<<HTML
<h2>Background</h2>
<p>A mid-sized university was experiencing a 24% first-year dropout rate — significantly above the national average. Traditional intervention methods (academic advisors reaching out after failed exams) were reactive and too late. The administration wanted a proactive system to identify struggling students before they disengaged.</p>
<h2>Data Sources</h2>
<p>The team combined LMS (Learning Management System) engagement data, attendance records, library access logs, assignment submission timestamps, and financial aid status. After careful anonymisation and ethics board approval, a dataset of 14,000 student-semester records was assembled spanning five academic years.</p>
<h2>Model Development</h2>
<p>A <strong>Random Forest classifier</strong> was trained to predict dropout risk within the first six weeks of semester. Key predictive features included: LMS login frequency in week 1–3, proportion of deadlines missed, attendance drop-off gradient, and social isolation indicators (library visits, group project participation).</p>
<p>The model achieved 81% precision and 74% recall on the hold-out test set — meaning the vast majority of flagged students genuinely needed support, minimising false positives that could stigmatise students unfairly.</p>
<h2>Intervention Design</h2>
<p>High-risk students received a personalised outreach from their academic advisor within 48 hours of the weekly model run. Advisors were equipped with a summary of the student's engagement signals — not raw scores — framed as "we noticed you might be finding the transition challenging."</p>
<h2>Outcome</h2>
<ul>
  <li>First-year dropout rate fell from <strong>24% to 19.7%</strong> — an 18% relative reduction</li>
  <li>Student satisfaction scores for advisor support increased by <strong>14 points</strong></li>
  <li>Model has been running for three consecutive academic years with continuous retraining</li>
</ul>
<h2>Lessons Learned</h2>
<p>The biggest challenge was not technical — it was cultural. Faculty needed assurance the model was a support tool, not a surveillance system. Clear communication about what data was used and what was not (no social media, no personal communications) was essential for institutional trust.</p>
HTML,
                'meta_title'       => 'ML Case Study: Predicting Student Dropout at University | ML in 10 Hours',
                'meta_description' => 'How a university used Random Forest machine learning to predict student dropout risk and reduce attrition by 18% in one academic year.',
                'og_title'         => 'Predicting Student Dropout with ML: University Case Study',
                'og_description'   => 'A university cut dropout rates by 18% using machine learning early-warning systems. Learn how they did it.',
                'og_image'         => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
                'focus_keyword'    => 'student dropout prediction machine learning',
                'published_at'     => now()->subDays(12),
            ],
            [
                'title'            => 'AI-Powered Fraud Detection: How a Fintech Stopped £2M in Monthly Losses',
                'slug'             => 'ai-fraud-detection-fintech-case-study',
                'category'         => 'Artificial Intelligence',
                'type'             => 'case-study',
                'thumbnail'        => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
                'excerpt'          => 'A fintech startup replaced its rule-based fraud system with a real-time ML model — cutting false positives by 40% and stopping £2M in fraudulent transactions monthly.',
                'content'          => <<<HTML
<h2>The Problem with Rules</h2>
<p>The company's legacy fraud system relied on 200+ hand-crafted rules maintained by a risk analyst team. Every time fraudsters adapted their tactics, the rules needed manual updates — a cat-and-mouse game the business was losing. False positive rates were at 8.3%, meaning legitimate customers were having transactions blocked and churning at an unacceptable rate.</p>
<h2>The ML Solution</h2>
<p>The engineering team built a two-stage fraud detection system. The first stage was a real-time <strong>Gradient Boosting model</strong> (LightGBM) scoring every transaction within 50ms using 180 engineered features: transaction velocity, device fingerprint, geo-anomaly score, merchant category risk, and time-series patterns of account behaviour.</p>
<p>The second stage was a graph neural network mapping relationships between accounts, devices, and merchants to detect fraud rings — coordinated attacks that evade individual account-level models.</p>
<h2>Deployment Architecture</h2>
<p>Models were served via a low-latency REST API with a Redis cache for feature lookups. A shadow deployment ran for six weeks alongside the rule system, validating performance before cutover. Continuous retraining on a 90-day rolling window kept the model fresh against evolving fraud patterns.</p>
<h2>Business Impact</h2>
<ul>
  <li>Fraudulent transactions blocked: <strong>£2.1M per month</strong></li>
  <li>False positive rate reduced from <strong>8.3% to 4.9%</strong></li>
  <li>Customer complaints about blocked transactions down <strong>42%</strong></li>
  <li>Rule maintenance overhead eliminated — saving 3 FTE analyst hours per week</li>
</ul>
<h2>What Made It Work</h2>
<p>Speed and explainability. Risk operations teams needed to understand why a transaction was flagged — SHAP values were integrated into the case management UI, showing the top 5 contributing factors for every declined transaction. This built confidence in the model and accelerated dispute resolution.</p>
HTML,
                'meta_title'       => 'AI Fraud Detection Case Study: Fintech Stops £2M Monthly | ML in 10 Hours',
                'meta_description' => 'How a fintech company used LightGBM and graph neural networks to stop £2M in monthly fraud while cutting false positives by 40%.',
                'og_title'         => 'AI Fraud Detection: Fintech Stops £2M in Monthly Losses',
                'og_description'   => 'Real-time ML fraud detection replaced legacy rules — and transformed customer experience. Read the full case study.',
                'og_image'         => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
                'focus_keyword'    => 'AI fraud detection fintech',
                'published_at'     => now()->subDays(7),
            ],

            // ── NEWS ──────────────────────────────────────────────────────────

            [
                'title'            => 'Google DeepMind Releases Gemini 2.0: What It Means for Developers',
                'slug'             => 'google-deepmind-gemini-2-release-developers',
                'category'         => 'Artificial Intelligence',
                'type'             => 'news',
                'thumbnail'        => 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80',
                'excerpt'          => 'Google DeepMind has released Gemini 2.0, a multimodal AI model with significantly improved reasoning, coding, and real-time capabilities. Here is what developers need to know.',
                'content'          => <<<HTML
<h2>What Is Gemini 2.0?</h2>
<p>Google DeepMind has launched Gemini 2.0, the next generation of its flagship multimodal AI model. The release includes Gemini 2.0 Flash — a faster, more efficient variant — and Gemini 2.0 Pro for more complex reasoning tasks. Both models are now accessible through the Google AI Studio and Vertex AI APIs.</p>
<h2>Key Improvements</h2>
<ul>
  <li><strong>Multimodal output</strong>: Gemini 2.0 can natively generate text, images, and audio in a single model pass</li>
  <li><strong>Improved code generation</strong>: Benchmarks show a 30% improvement on HumanEval coding tasks compared to Gemini 1.5 Pro</li>
  <li><strong>Real-time streaming</strong>: The model supports low-latency streaming for conversational applications via the new Live API</li>
  <li><strong>Agentic capabilities</strong>: Built-in support for tool use, web browsing, and multi-step task planning</li>
  <li><strong>Extended context</strong>: Up to 2 million token context window for processing large codebases or documents</li>
</ul>
<h2>What This Means for Developers</h2>
<p>The release is particularly significant for developers building AI-powered applications. The Live API enables real-time voice and vision interactions — opening new possibilities for accessibility tools, tutoring platforms, and customer service agents. The improved tool-use capabilities mean agents can now reliably execute multi-step workflows involving web search, code execution, and API calls.</p>
<h2>Pricing and Access</h2>
<p>Gemini 2.0 Flash is available in the free tier of Google AI Studio, making it accessible to individual developers and startups. Enterprise pricing via Vertex AI is structured per 1M tokens with significant discounts for batch processing workloads.</p>
<h2>Competitive Context</h2>
<p>The release comes amid intense competition from Anthropic (Claude 3.5 Sonnet), OpenAI (GPT-4o), and Meta (Llama 3.3). Gemini 2.0 positions Google strongly in the agentic AI space, where the ability to take real-world actions — not just generate text — is becoming the key differentiator.</p>
HTML,
                'meta_title'       => 'Google DeepMind Gemini 2.0 Released: Developer Guide | ML in 10 Hours',
                'meta_description' => 'Google DeepMind releases Gemini 2.0 with multimodal output, improved coding, and real-time capabilities. What developers need to know.',
                'og_title'         => 'Google Gemini 2.0 Released: What Developers Need to Know',
                'og_description'   => 'Gemini 2.0 brings native multimodal output, 2M token context, and real-time APIs. Full breakdown for developers.',
                'og_image'         => 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80',
                'focus_keyword'    => 'Gemini 2.0 release developers',
                'published_at'     => now()->subDays(5),
            ],
            [
                'title'            => 'OpenAI Introduces o3: The Model That Thinks Before It Answers',
                'slug'             => 'openai-o3-model-reasoning-release',
                'category'         => 'Artificial Intelligence',
                'type'             => 'news',
                'thumbnail'        => 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
                'excerpt'          => 'OpenAI has unveiled o3, its most advanced reasoning model to date. With chain-of-thought processing baked into the architecture, o3 sets new benchmarks in mathematics, science, and coding.',
                'content'          => <<<HTML
<h2>OpenAI Unveils o3</h2>
<p>OpenAI has officially released o3, the successor to its o1 reasoning model series. Unlike conventional large language models that generate responses token-by-token without explicit deliberation, o3 is designed to spend compute time "thinking" — running an internal chain-of-thought process before producing its final answer.</p>
<h2>Benchmark Performance</h2>
<p>o3 achieved remarkable scores on industry-standard benchmarks:</p>
<ul>
  <li><strong>ARC-AGI</strong>: 87.5% on the semi-private evaluation set — a test designed to be difficult for current AI systems</li>
  <li><strong>AIME 2024</strong>: 96.7% on advanced mathematics competition problems</li>
  <li><strong>SWE-bench Verified</strong>: 71.7% on real-world software engineering tasks</li>
  <li><strong>GPQA Diamond</strong>: 87.7% on graduate-level science questions</li>
</ul>
<h2>How It Works</h2>
<p>o3 uses a technique OpenAI calls "private chain of thought" — the model generates extensive internal reasoning steps that are not shown to the user but inform the final answer. This allows it to decompose complex problems, check its own logic, and backtrack when it detects errors. The trade-off is compute cost: o3 uses significantly more tokens per response than GPT-4o.</p>
<h2>Availability</h2>
<p>o3 is available via the OpenAI API with tiered access levels — o3-mini for cost-sensitive applications and o3 full for maximum capability. Access is currently limited to tier-4 and tier-5 API users, with broader rollout planned over the coming months.</p>
<h2>Implications for AI Education</h2>
<p>For learners and practitioners in the ML space, o3 represents a significant shift: from models that pattern-match to models that reason. Understanding the distinction between retrieval-based generation and deliberative reasoning is becoming a core literacy skill for anyone working with AI systems.</p>
HTML,
                'meta_title'       => 'OpenAI o3 Model Released: Reasoning AI Explained | ML in 10 Hours',
                'meta_description' => 'OpenAI releases o3, its most advanced reasoning model. Benchmark scores, how it works, and what it means for AI developers.',
                'og_title'         => 'OpenAI o3: The Model That Thinks Before It Answers',
                'og_description'   => 'o3 sets new records on ARC-AGI, AIME, and SWE-bench. Here is what the reasoning revolution means for developers.',
                'og_image'         => 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&q=80',
                'focus_keyword'    => 'OpenAI o3 reasoning model',
                'published_at'     => now()->subDays(3),
            ],
            [
                'title'            => 'Microsoft Copilot Gets Major Upgrade: AI Now Embedded Across All Office 365 Apps',
                'slug'             => 'microsoft-copilot-office-365-upgrade-2024',
                'category'         => 'Productivity',
                'type'             => 'news',
                'thumbnail'        => 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80',
                'excerpt'          => 'Microsoft has rolled out a major Copilot upgrade across Office 365, embedding AI assistance directly into Word, Excel, PowerPoint, Outlook, and Teams for all business subscribers.',
                'content'          => <<<HTML
<h2>The Upgrade</h2>
<p>Microsoft has announced a comprehensive update to its Copilot AI assistant, now deeply integrated into the full Office 365 suite. The rollout affects all Microsoft 365 Business and Enterprise subscribers globally, with consumer plans receiving a lighter version through Microsoft 365 Personal.</p>
<h2>What Is New in Each App</h2>
<h3>Word</h3>
<p>Copilot in Word now offers a "Draft from sources" feature — paste in up to five documents and instruct Copilot to synthesise a new report, proposal, or summary drawing from all of them. The rewriting assistant now supports tone adjustment (formal, casual, persuasive) and readability targeting (grade level).</p>
<h3>Excel</h3>
<p>The most significant upgrade is in Excel, where Copilot can now generate Python analytics code, create pivot tables from natural language instructions, and suggest chart types based on your data distribution. It can also flag anomalies and outliers with a single prompt.</p>
<h3>PowerPoint</h3>
<p>Copilot for PowerPoint can now create branded presentations from a Word document or a bullet list, applying your organisation's PowerPoint template automatically. The new "Narrative Builder" creates presentation storyboards from topic prompts.</p>
<h3>Outlook and Teams</h3>
<p>Outlook's Copilot now offers smart scheduling that reads meeting context and suggests optimal times for all participants. Teams Copilot has improved meeting transcription accuracy and now generates action item lists automatically at the end of every meeting.</p>
<h2>Pricing</h2>
<p>Copilot for Microsoft 365 remains at $30 per user per month on top of existing Microsoft 365 subscriptions for enterprise customers. Microsoft has announced no immediate price changes with this upgrade.</p>
<h2>What It Means for Professionals</h2>
<p>For professionals who spend significant time in Office 365, this upgrade represents a material productivity opportunity. Early adopters report saving 2–3 hours per week on drafting, summarising, and data formatting tasks. However, output quality still requires human review — Copilot works best as a first-draft and analysis assistant, not a final decision-maker.</p>
HTML,
                'meta_title'       => 'Microsoft Copilot Office 365 Upgrade 2024 | ML in 10 Hours',
                'meta_description' => 'Microsoft rolls out major Copilot AI upgrades across Word, Excel, PowerPoint, Outlook and Teams. What is new and what it means for your productivity.',
                'og_title'         => 'Microsoft Copilot Gets Major Upgrade Across All Office 365 Apps',
                'og_description'   => 'AI is now deeply embedded in Word, Excel, PowerPoint, Outlook and Teams. Here is everything that changed.',
                'og_image'         => 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=1200&q=80',
                'focus_keyword'    => 'Microsoft Copilot Office 365 upgrade',
                'published_at'     => now()->subDays(1),
            ],
        ];
    }
}
