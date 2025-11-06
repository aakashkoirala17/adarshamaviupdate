# Admin Panel Setup Instructions

## How to Create an Admin Account

1. **Sign Up**: Go to `/auth` and create a new account
2. **Make Yourself Admin**: After signing up, you need to add admin role to your account in the database

### Adding Admin Role (via Backend Interface)

1. Click the "View Backend" button to open Lovable Cloud dashboard
2. Go to the **Database** section
3. Find the **user_roles** table
4. Click **Insert** to add a new row
5. Fill in:
   - **user_id**: Copy your user ID from the auth.users table
   - **role**: Select `admin` from dropdown
6. Click **Save**

### OR Using SQL (in Backend > SQL Editor)

```sql
-- Replace 'YOUR_EMAIL@example.com' with your actual email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com';
```

## Admin Panel Features

Once you're logged in as admin, you can access `/admin` to:

- **Hero Images**: Add/remove carousel images on the homepage
- **Team Members**: Manage staff profiles with photos
- **Gallery**: Upload and categorize school photos
- **Notices**: Post announcements and updates

## Important Notes

- Email confirmation is disabled for faster testing
- First admin must be created manually using the steps above
- Only users with admin role can access `/admin`
- Admin can upload images directly through the panel
