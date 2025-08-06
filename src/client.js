import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmccolhylhvknvibimfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtY2NvbGh5bGh2a252aWJpbWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzg1MzMsImV4cCI6MjA2OTg1NDUzM30.mtij7ccD3jYcWs1nUKXXX1eo9RKIv4zHNQsA3jzQc-o';

export const supabase = createClient(supabaseUrl, supabaseKey);