
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function main() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error('DATABASE_URL not found in .env.local');
        return;
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(); // MongoDB usually uses the DB from the URI
        const collection = db.collection('Video');

        const records = await collection.find({}).toArray();
        console.log('Current Video Records:', JSON.stringify(records, null, 2));

        if (records.length === 0) {
            console.log('No records found. Inserting default data...');
            const result = await collection.insertOne({
                title: 'Get Solutions for Your Business',
                description: 'Empower your organization with data-driven strategies and innovative business automation solutions tailored for growth.',
                video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // placeholder
            });
            console.log('Inserted record with id:', result.insertedId);
        } else {
            console.log('Updating most recent record...');
            const latest = records[records.length - 1];
            await collection.updateOne(
                { _id: latest._id },
                {
                    $set: {
                        title: 'Get Solutions for Your Business',
                        description: 'Empower your organization with data-driven strategies and innovative business automation solutions tailored for growth.',
                        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                    }
                }
            );
            console.log('Updated record:', latest._id);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

main();
