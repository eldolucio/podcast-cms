import mysql from 'mysql2/promise';

async function setup() {
  console.log('Connecting to database to setup WordPress schema...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'wp_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'wp_clone_db'
  });

  try {
    console.log('Creating wp_posts table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wp_posts (
        ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        post_author bigint(20) unsigned NOT NULL DEFAULT '0',
        post_date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        post_content longtext NOT NULL,
        post_title text NOT NULL,
        post_status varchar(20) NOT NULL DEFAULT 'publish',
        post_type varchar(20) NOT NULL DEFAULT 'post',
        PRIMARY KEY (ID)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Creating wp_postmeta table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wp_postmeta (
        meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        post_id bigint(20) unsigned NOT NULL DEFAULT '0',
        meta_key varchar(255) DEFAULT NULL,
        meta_value longtext,
        PRIMARY KEY (meta_id),
        KEY post_id (post_id),
        KEY meta_key (meta_key(191))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Creating wp_options table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wp_options (
        option_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        option_name varchar(191) NOT NULL DEFAULT '',
        option_value longtext NOT NULL,
        autoload varchar(20) NOT NULL DEFAULT 'yes',
        PRIMARY KEY (option_id),
        UNIQUE KEY option_name (option_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('WordPress schema setup complete.');
  } catch (err) {
    console.error('Error setting up schema:', err);
  } finally {
    await connection.end();
  }
}

setup();
