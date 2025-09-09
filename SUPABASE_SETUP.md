# Supabase Authentication Setup Guide

## Prerequisites
Your Supabase credentials are already configured in `.env.local`. Now you need to set up the database schema.

## Step 1: Set up Database Schema

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com/project/moldfocjoiatszpayzmr
   - Navigate to **SQL Editor**

2. **Run the Setup Script**
   - Copy the entire contents of `supabase-setup.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute the script

This will create:
- User roles and permissions system
- Required tables (users, customers, addresses, etc.)
- Row Level Security (RLS) policies
- Database functions and triggers

## Step 2: Test Authentication

1. **Restart the development server**
   ```bash
   npm run dev
   ```

2. **Create a test account**
   - Go to http://localhost:3000/auth/sign-up
   - Fill out the registration form
   - Submit to create a new user

3. **Verify user creation**
   - Check the Supabase dashboard **Authentication** > **Users** tab
   - You should see your new user listed

## Step 3: Create Admin User

After creating your first user account:

1. **Go to SQL Editor in Supabase Dashboard**
2. **Run this command** (replace with your email):
   ```sql
   SELECT create_admin_user('your-email@example.com');
   ```
3. **Verify admin role**
   - Check the **Table Editor** > **users** table
   - Your user should now have role = 'admin'

## Step 4: Test Admin Access

1. **Log in with your admin account**
   - Go to http://localhost:3000/auth/login
   - Use your admin credentials

2. **Access admin dashboard**
   - Go to http://localhost:3000/admin/dashboard
   - You should have full access to admin features

## Troubleshooting

### Authentication not working?
- Check browser console for error messages
- Verify environment variables in `.env.local`
- Ensure database schema was created successfully

### Admin access denied?
- Confirm your user role is set to 'admin' in the database
- Check the users table in Supabase dashboard
- Try logging out and back in

### Database errors?
- Check that all SQL scripts ran without errors
- Verify tables were created in the Supabase dashboard
- Check RLS policies are enabled

## Email Configuration (Optional)

For production use, you'll want to configure email templates:

1. Go to **Authentication** > **Email Templates** in Supabase
2. Customize the email templates for:
   - Confirm signup
   - Reset password  
   - Magic link

## Next Steps

Once authentication is working:
- Test all user flows (signup, login, logout)
- Verify role-based access control
- Test password reset functionality
- Configure email templates for production
