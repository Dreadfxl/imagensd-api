import pool from './database';

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Prompts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        prompt_text TEXT NOT NULL,
        negative_prompt TEXT,
        style VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS generated_images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        prompt_id INTEGER REFERENCES prompts(id) ON DELETE SET NULL,
        image_path VARCHAR(255) NOT NULL,
        thumbnail_path VARCHAR(255),
        prompt_used TEXT,
        generation_params JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
      CREATE INDEX IF NOT EXISTS idx_images_user_id ON generated_images(user_id);
      CREATE INDEX IF NOT EXISTS idx_images_created_at ON generated_images(created_at DESC);
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

createTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
