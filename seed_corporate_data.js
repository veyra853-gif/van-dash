
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error('DATABASE_URL not found in .env.local');
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
            description: 'Vanguard began since 2015 as a family business for customer service work. Over these years, the group has undertaken many challenging projects and gained accumulated skills and experiences in operating and executing solutions, business project management of many categories: commercial, residential, hotels... in the Middle east, European Union, Central and Eastern Europe, Africa and Far East.',
            items: [
                'Started in project management of re-structuring and re-branding',
                'Developed contracting and marketing departments',
                'Specialized in renovation and company openings',
                'Operation consultancy and control expertise',
                'Leading role in big project management',
                'Design inputs and engineering solutions'
            ],
            image: '/image.png'
        });
        console.log('Inserted AboutUs record');

        // 2. FeaturedServices (Objective & Philosophy) -> About2
        const featuredServicesCollection = db.collection('FeaturedServices');
        await featuredServicesCollection.insertOne({
            title: 'Our Project Management & Execution Philosophy',
            description: 'Our objective is to provide clients with an assured experience while executing their projects. Our emphasis on clear communication and follow-through procedures ensures that clients objectives are considered our top priority.',
            image: '/about2-image.webp'
        });
        console.log('Inserted FeaturedServices record');

        // 3. OurSkills (Vision & Mission) -> About3
        const ourSkillsCollection = db.collection('OurSkills');
        await ourSkillsCollection.insertOne({
            title: 'Our Vision & Mission',
            description: 'Our vision is to preserve a highly trained and efficient team that responds quickly to customers concerns. Our mission includes providing creative ideas, high-quality affordable solutions, and building long-term relationships.',
            image: '/about3-image.webp'
        });
        console.log('Inserted OurSkills record');

        // 4. OurServices (Divisions: Trading, Marketing, Consultancy) -> Services1
        const ourServicesCollection = db.collection('OurServices');
        await ourServicesCollection.insertOne({
            title: 'Vanguard Group Divisions',
            card1Title: 'Vanguard Trading',
            card1Description: 'Headquartered in Poland and Lebanon, Vanguard Trading is a leading commodity trading house specializing in Food and Non-Food products, exporting to over 33 countries.',
            card1Image: '/service1.png',
            card2Title: 'Vanguard Digital Marketing',
            card2Description: 'A new generation digital agent aiming to make a difference with performance-oriented next-gen techniques in MENA and GCC regions.',
            card2Image: '/service2.png',
            card3Title: 'Vanguard Consultancy',
            card3Description: 'Experienced in leading and managing new business projects, business development, operation managing, and ERP specialization since 2015.',
            card3Image: '/service3.png',
            card4Title: 'Project Management',
            card4Description: 'Leading industrial and commercial projects to professionalism with detailed planning and resource optimization.',
            card4Image: '/service4.png',
            card5Title: 'Global Logistics',
            card5Description: 'Managing terms of sale, delivery, financing, insurance, and international trade barriers for generic products.',
            card5Image: '/service5.png',
            card6Title: 'Strategic Outsourcing',
            card6Description: 'Identification of global suppliers with capacity for large volumes at competitive prices and payment assurance.',
            card6Image: '/service6.png'
        });
        console.log('Inserted OurServices record');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

main();
