const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgress://localhost/acme_icecream_db');
const express = require('express');
const app = express();
const path = require('path');
console.log('__dirname');

app.use(express.json());

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/api/flavors', async(req, res, next)=>{
    try{
    const SQL = `
    SELECT * 
    FROM flavors
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
   }
    catch(ex){
      next(ex);  
}
});

app.post('/api/flavors', async(req, res, next)=>{
    try{
        const SQL = `
        INSERT INTO flavors(txt) VALUES($1) RETURNING *
        `;
        const response = await client.query(SQL, [req.body.txt]);
        res.status(201).send(response.rows[0]);
    }
    catch(ex){
        next(ex);
        
    }
});

app.delete('/api/flavors/:id', async(req, res, next)=>{
    try{
        const SQL = `
       DELETE FROM flavors
       WHERE id = $1
        `;
        await client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    }
    catch(ex){
        next(ex);
        
    }
});


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
    
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
    
};

init();