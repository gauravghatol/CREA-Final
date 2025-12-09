const mongoose = require('mongoose');

// Source and destination URIs
const SOURCE_URI = 'mongodb+srv://gauravgame01_db_user:jieKYDzz5XdmaoGL@cluster0.latkfla.mongodb.net/crea?retryWrites=true&w=majority&appName=Cluster0';
const DEST_URI = 'mongodb+srv://crearail5_db_user:crea1234@crea.bvyozxr.mongodb.net/crea?retryWrites=true&w=majority&appName=crea';

async function migrateDatabase() {
  console.log('Starting database migration...\n');

  // Create separate connections
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  const destConn = await mongoose.createConnection(DEST_URI).asPromise();

  console.log('Connected to both databases\n');

  try {
    // Get all collections from source database
    const collections = await sourceConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate\n`);

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Migrating collection: ${collectionName}`);

      // Get all documents from source collection
      const sourceCollection = sourceConn.db.collection(collectionName);
      const documents = await sourceCollection.find({}).toArray();

      console.log(`  - Found ${documents.length} documents`);

      if (documents.length > 0) {
        // Insert documents into destination collection
        const destCollection = destConn.db.collection(collectionName);
        
        // Clear destination collection first (optional - comment out if you want to preserve existing data)
        await destCollection.deleteMany({});
        
        // Insert documents one by one to handle duplicates
        let successCount = 0;
        let errorCount = 0;
        
        for (const doc of documents) {
          try {
            await destCollection.insertOne(doc);
            successCount++;
          } catch (error) {
            if (error.code === 11000) {
              console.log(`  - Skipped duplicate document with _id: ${doc._id}`);
              errorCount++;
            } else {
              throw error;
            }
          }
        }
        
        console.log(`  - Successfully migrated ${successCount} documents`);
        if (errorCount > 0) {
          console.log(`  - Skipped ${errorCount} duplicate documents`);
        }
        console.log();
      } else {
        console.log(`  - No documents to migrate\n`);
      }
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    // Close connections
    await sourceConn.close();
    await destConn.close();
    console.log('\nConnections closed');
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('\n🎉 Database migration finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
