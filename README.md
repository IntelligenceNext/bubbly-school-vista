# Bubbly School Vista

A comprehensive school management system built with React, TypeScript, and Supabase.

## Features

### Default School Management
The system now includes a powerful default school feature that allows users to:

- **Set a Default School**: Users can designate one school as their default school from the School Management Settings page
- **Automatic School Selection**: When users log in, the system automatically selects their default school
- **Quick Access**: A "Go to Default School" button appears in the header when users are not currently in their default school
- **Visual Indicators**: The sidebar shows which school is currently selected and whether it's the default school
- **Persistent Settings**: Default school preferences are saved in localStorage and persist across sessions

### Admin Authentication System (FIXED)
The system now includes a fully functional admin authentication system:

- **Proper User Creation**: Admin users are created with both database records and Supabase authentication accounts
- **Role-Based Access**: Different user types (admin, school_admin, super_admin) have appropriate access levels
- **Smart Routing**: Users are automatically redirected to the appropriate dashboard based on their role
- **Functional Admin Dashboard**: Comprehensive admin dashboard with quick actions and system monitoring
- **Email Confirmation**: New admin accounts require email confirmation before they can log in
- **Working Logout**: Users can properly log out and are redirected to the login page

#### What Was Fixed:
1. **Admin Creation**: Now properly creates Supabase authentication users instead of just database records
2. **Login Authentication**: Admin users can now successfully log in with their email and password
3. **Role Detection**: System properly detects user roles and redirects accordingly
4. **Logout Functionality**: Users can now properly log out and are redirected to login page
5. **User Control**: Admins have full control over the system and can manage other users

#### Admin User Creation Process:
1. **Authentication User**: Creates a Supabase authentication user with email/password
2. **Database Record**: Creates an administrator record in the administrators table
3. **School Assignment**: Links the admin to specific schools if applicable
4. **Email Confirmation**: Sends confirmation email (required for first login)
5. **Role Assignment**: Assigns appropriate role and permissions

#### How to Use Admin Features:
1. **Create Admin**: Go to `/administrator/admins` → "Add Administrator" tab
2. **Fill Details**: Enter full name, email, username, password, and role
3. **Set School Access**: Choose specific school or "Access to All Schools"
4. **Send Invitation**: Optionally send invitation email
5. **Email Confirmation**: New admin must confirm email before first login
6. **Login Access**: Admin can then log in with email/password

#### Troubleshooting Admin Login Issues:
- **Email Not Confirmed**: Check email for confirmation link
- **Invalid Credentials**: Verify email and password are correct
- **Account Not Found**: Ensure admin was created successfully
- **Role Issues**: Check administrator status in database

#### Benefits:
- **Secure Authentication**: Proper Supabase authentication integration
- **Role-Based Security**: Different access levels for different user types
- **Centralized Management**: Easy admin user management from one interface
- **Audit Trail**: Track admin activities and system usage
- **Scalable**: Support for multiple admin users and schools
- **Fully Functional**: Admin users can now log in, access dashboards, and log out properly

#### How to Use Default School Feature:

1. **Navigate to Settings**: Go to `/school-management/settings`
2. **Select General Tab**: The default school section is located in the General tab
3. **Set Default School**: 
   - View all available schools in the "Available Schools" list
   - Click "Set as Default" next to any school to make it your default
   - The selected school will be marked with a star icon
4. **Remove Default School**: Click "Remove Default" to clear your default school setting
5. **Quick Access**: Use the "Go to Default School" button in the header to quickly switch to your default school

#### Benefits:
- **Faster Access**: No need to manually select your primary school each time
- **Improved UX**: Streamlined workflow for users who primarily work with one school
- **Flexibility**: Easy to change default school or work with multiple schools
- **Visual Feedback**: Clear indicators show current school status and default school

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bubbly-school-vista
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Fill in your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (including CurrentSchoolContext)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (including storageUtils)
└── integrations/       # External service integrations
```

## Key Components

- **CurrentSchoolContext**: Manages the currently selected school and default school logic
- **Settings Page**: Provides interface for managing default school preferences
- **Header**: Shows "Go to Default School" button when applicable
- **Sidebar**: Displays current school information and default school status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
