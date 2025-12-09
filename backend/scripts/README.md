# Database Migration Scripts

## migrateDatabase.js

This script migrates all data from one MongoDB database to another.

### Usage

**Option 1: Using environment variables (Recommended)**

Add to your `.env` file:
```env
SOURCE_MONGO_URI=mongodb+srv://user:password@source-cluster.mongodb.net/dbname
DEST_MONGO_URI=mongodb+srv://user:password@dest-cluster.mongodb.net/dbname
```

Then run:
```bash
node scripts/migrateDatabase.js
```

**Option 2: Using command line arguments**

```bash
node scripts/migrateDatabase.js "source-uri" "dest-uri"
```

### Features

- Migrates all collections from source to destination
- Handles duplicate documents gracefully
- Clears destination collections before migration
- Provides detailed progress reporting

### Security Notes

- **Never commit database URIs with credentials to version control**
- Always use environment variables or command line arguments for sensitive data
- Add `.env` to your `.gitignore` file
- Rotate credentials if they have been exposed
