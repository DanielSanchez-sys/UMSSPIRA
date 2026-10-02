import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'No se encontraron SUPABASE_URL o SUPABASE_ANON_KEY en el archivo .env',
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
);