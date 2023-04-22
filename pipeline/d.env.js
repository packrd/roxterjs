import dotenv from 'dotenv';
import fs from 'fs';

const env = fs.existsSync('./.env');

dotenv.config({ 
    path: (!env) ? ".env.test" : ".env" 
});