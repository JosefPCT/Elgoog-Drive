// Separated config file to use supabase, uses ES6 syntax
// Used in fileController.js, has a particular way on getting the correct object when importing and when using ES5 syntax to import, check fileController.js for it

// require('dotenv').config();
// const createClient = require('@supabase/supabase-js');

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Get the Project URL and API Key from the website itself
const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

