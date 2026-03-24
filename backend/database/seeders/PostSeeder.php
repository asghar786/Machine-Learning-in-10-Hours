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
        ];
    }
}
