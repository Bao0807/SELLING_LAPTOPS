require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function exportSQL() {
  let connection;
  try {
    const config = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_NAME || 'cas_db'
    };

    console.log('Connecting to database with config:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });

    connection = await mysql.createConnection(config);
    
    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    const tableKey = `Tables_in_${config.database}`;
    
    let sqlOutput = `-- CAS Laptop E-commerce Database Dump\n`;
    sqlOutput += `-- Generated on ${new Date().toISOString()}\n\n`;
    sqlOutput += `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;\n`;
    sqlOutput += `USE \`${config.database}\`;\n\n`;
    sqlOutput += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    for (const row of tables) {
      const tableName = row[tableKey];
      
      console.log(`Exporting table: ${tableName}`);
      
      // Get create table
      const [createRes] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSql = createRes[0]['Create Table'];
      
      sqlOutput += `-- ------------------------------------------------------\n`;
      sqlOutput += `-- Table structure for table \`${tableName}\`\n`;
      sqlOutput += `-- ------------------------------------------------------\n`;
      sqlOutput += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
      sqlOutput += `${createTableSql};\n\n`;
      
      // Get data
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``);
      if (rows.length > 0) {
        sqlOutput += `-- Dumping data for table \`${tableName}\`\n`;
        const columns = Object.keys(rows[0]).map(col => `\`${col}\``).join(', ');
        
        sqlOutput += `INSERT INTO \`${tableName}\` (${columns}) VALUES\n`;
        const valuesList = [];
        for (const dataRow of rows) {
          const vals = Object.values(dataRow).map(val => {
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
            }
            // Escape string
            const escaped = String(val)
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/\r/g, '\\r')
              .replace(/\n/g, '\\n');
            return `'${escaped}'`;
          });
          valuesList.push(`  (${vals.join(', ')})`);
        }
        sqlOutput += valuesList.join(',\n') + ';\n\n';
      }
    }
    
    sqlOutput += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    
    const outputPath = path.resolve(__dirname, '../../cas_db_dump.sql');
    fs.writeFileSync(outputPath, sqlOutput, 'utf8');
    console.log(`Database exported successfully to ${outputPath}`);
  } catch (error) {
    console.error('Error exporting database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

exportSQL();
