
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error('DATABASE_URL not found in .env');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();

        // 1. AboutUs (Company History) -> About1
        const aboutUsCollection = db.collection('AboutUs');
        await aboutUsCollection.insertOne({
            title: 'About Vanguard Group',
            description: 'Vanguard began since 2015 as a family business for customer service work. Over these years, the group has undertaken many challenging projects and gained accumulated skills and experiences in operating and executing solutions, business project management of many categories: commercial, residential, hotels... in the Middle east, European Union, Central and Eastern Europe, Africa and Far East.\n\nThe business started in project management of re-structuring, re-branding, or opening new projects for big local and gulf countries. After many client requests, we developed contracting and marketing departments to renovate or open companies or branches while dealing with operation consultancy and control.\n\nToday, Vanguard takes on the leading role in: consultancy and big project management, marketing, and contracting for small to mid-sized companies.',
            items: [
                'Started in 2015 as a family business',
                'Expertise in operating and executing solutions',
                'Project management for commercial and residential categories',
                'Global presence: Middle East, EU, Africa, and Far East',
                'Developed contracting and marketing departments',
                'Operation consultancy and control services'
            ],
            image: '/image.png'
        });
        console.log('Inserted Detailed AboutUs record');

        // 2. FeaturedServices (Philosophy) -> About2
        const featuredServicesCollection = db.collection('FeaturedServices');
        await featuredServicesCollection.insertOne({
            title: 'Our Project Management & Execution Philosophy',
            description: 'Our objective is to provide clients with an assured experience while executing their projects. Our emphasis on clear communication and follow-through procedures ensures that clients objectives are considered our top priority during the planning and execution of all processes under market mentality.',
            items: [
                { title: 'Schedule & Resources', description: 'To create detail schedule and resources plan to meet client’s project objective', icon: 'Settings' },
                { title: 'Clear Communication', description: 'To communicate clearly with all project stakeholders/Clients', icon: 'TrendingUp' },
                { title: 'Progress Tracking', description: 'To track project progress and fine-tune deviations', icon: 'BarChart3' },
                { title: 'Quality Supervision', description: 'To closely supervise the quality of project/products from initiation till completion and receiving', icon: 'Settings' },
                { title: 'On-Time Delivery', description: 'To complete and deliver the projects/products on time.', icon: 'TrendingUp' }
            ],
            image: '/about2-image.webp'
        });
        console.log('Inserted Detailed FeaturedServices record');

        // 3. OurSkills (Vision & Mission) -> About3
        const ourSkillsCollection = db.collection('OurSkills');
        await ourSkillsCollection.insertOne({
            title: 'Our Vision & Mission',
            description: 'Our vision is to preserve a highly trained and efficient team that responds quickly to customers’ concerns and are ready for any arising issue.',
            items: [
                'Providing customers with creative ideas, high-quality, and affordable contracts and solutions after highlighting the problems and gaps',
                'Creating and building long-term relationships with clients',
                'Responding immediately to the changing needs of our clients',
                'Achieving complete customer satisfaction',
                'Improving our services continuously',
                'Maintaining professional relationships with businesses to achieve the highest standard of performance.'
            ],
            image: '/about3-image.webp'
        });
        console.log('Inserted Detailed OurSkills record');

        // 4. OurServices (Divisions: Trading, Marketing, Consultancy) -> Services1
        const ourServicesCollection = db.collection('OurServices');
        await ourServicesCollection.insertOne({
            title: 'Vanguard Group Divisions',
            card1Title: 'Vanguard Trading',
            card1Description: 'Headquartered in Poland and Lebanon, Vanguard Trading is one of the leading commodity trading houses. Specializing in sugar, edible oils, grains, and agricultural items.\n\nIts portfolio includes sunflower oil, palm-based oil, soybean oil, corn oil, olive oil, maize, wheat, barley, sugar, rice, soya, and corn. Representative in Arab Countries for Key Global Brands Ltd, trading worldwide the Top FMCG brands across Beverages, Sweets, Coffee, Tea, and Detergents.',
            card1Image: '/service1.png',
            card2Title: 'Vanguard Digital Marketing',
            card2Description: 'A new generation digital agent aiming to reach more potential customers with performance-oriented techniques.\n\nWe aim to spread our digital marketing expertise throughout MENA and GCC starting with Amman, Doha, Kuwait, Saudi Arabia, and Lebanon. We help clients understand the underlying power of digital marketing strategies to transform their online presence and maximize business productivity.',
            card2Image: '/service2.png',
            card3Title: 'Vanguard Consultancy',
            card3Description: 'Experienced in leading and managing any new business project and developing existing ones since 2015.\n\nWe offer coaching programs including:\n1. A free trial (try before you buy)\n2. Payment plan options to prevent cash flow issues\n3. A 100% Money Back guarantee for total confidence.',
            card3Image: '/service3.png',
            card4Title: 'Trading Logistics',
            card4Description: 'Negotiating terms of sale and delivery, financing payment assurance to supplier-exporters, and managing logistics and transport managing customs barriers in international trade across 33+ countries.',
            card4Image: '/service4.png',
            card5Title: 'Brand & Identity',
            card5Description: 'Vanguard Digital Marketing produces creative solutions through its sector analysis and is completely tailor-made for individuals and brands to create a difference in their revenue.',
            card5Image: '/service5.png',
            card6Title: 'Project Management',
            card6Description: 'We perform project management services to coordinate industrial/commercial projects leading them to professionalism, providing design inputs and engineering solutions as added-value services.',
            card6Image: '/service6.png'
        });
        console.log('Inserted Detailed OurServices record');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

main();
