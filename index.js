const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_icecream_db');


const init = async()=>{
    await client.connect();
    console.log('connected to datatbase');
    let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        txt VARCHAR(100),
        ranking INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT now()
    );
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO flavors(txt) VALUES ('vanilla');
        INSERT INTO flavors(txt) VALUES ('chocolate');
        INSERT INTO flavors(txt) VALUES ('strawberry');
    `;
    
    await client.query(SQL);
    console.log('data seeded');
    
};

init();