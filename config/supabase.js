// require('dotenv').config();
// const createClient = require('@supabase/supabase-js');

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_PUBLIC_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

