# AI Travel Planner

An intelligent travel planning application powered by OpenAI GPT-4o that generates comprehensive, personalized travel itineraries.

## Features

### Core Functionality
- **AI-Powered Itinerary Generation**: Leverages OpenAI GPT-4o to create detailed travel plans based on user preferences
- **Multi-Step Planning Wizard**: Intuitive 5-step process to capture all trip details
- **Comprehensive Itinerary Display**: View flights, accommodation, daily activities, budget breakdown, and travel information
- **Itinerary Editing**: Modify activities with a user-friendly modal interface
- **Plan Management**: Save drafts, finalize plans, and manage multiple trips
- **PDF Export**: Download beautifully formatted travel plans for offline access
- **User Dashboard**: Manage all your travel plans in one place

### Technical Features
- **Authentication**: Secure user registration and login with NextAuth.js
- **Database**: MongoDB with Prisma ORM for robust data management
- **Real-time Updates**: Optimistic UI updates for smooth user experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Type Safety**: Full TypeScript implementation with strict mode

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: MongoDB Atlas + Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4o API
- **Charts**: Recharts
- **PDF Generation**: jsPDF + jspdf-autotable
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` or `.env.local` file in the root directory:
   ```env
   # Database
   MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/travel-planner?retryWrites=true&w=majority"
   DATABASE_URL="${MONGO_URI}"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"

   # OpenAI
   OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Creating a Travel Plan

1. **Register/Login**: Create an account or sign in
2. **Start Planning**: Click "Create New Plan" from the dashboard
3. **Complete the Wizard**:
   - **Step 1**: Enter basic trip details (destination, dates, travelers, budget)
   - **Step 2**: Specify travel style and preferences
   - **Step 3**: Review and generate your itinerary
4. **View Your Itinerary**: Explore the generated plan with tabs for:
   - Overview: Trip summary and statistics
   - Flights: Outbound and return flight details
   - Accommodation: Hotel recommendations
   - Daily Itinerary: Day-by-day activities with timeline
   - Budget: Detailed cost breakdown with visualizations
   - Travel Info: Visa, health, emergency contacts, and local tips

### Editing Your Itinerary

1. Click the "Edit" button on the plan detail page
2. Click the edit icon next to any activity
3. Modify details in the modal dialog
4. Save your changes
5. Click "Save Changes" to persist all edits

### Finalizing and Exporting

1. Review your complete itinerary
2. Click "Finalize Plan" to lock major changes
3. Click "Export PDF" to download your travel plan

## Project Structure

```
travel-planner/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── plans/         # Plan CRUD operations
│   │   │   └── ai/            # AI generation endpoint
│   │   ├── dashboard/         # Dashboard page
│   │   ├── plan/              # Plan pages
│   │   │   ├── new/          # Wizard for creating plans
│   │   │   └── [id]/         # Plan detail and display
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── components/
│   │   ├── itinerary/        # Itinerary display components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # Reusable UI components
│   │   └── wizard/           # Wizard step components
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── openai.ts         # OpenAI service
│   │   ├── pdfGenerator.ts   # PDF export functionality
│   │   └── prisma.ts         # Prisma client
│   └── types/                # TypeScript type definitions
├── .env.example              # Environment variable template
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Plans
- `GET /api/plans` - Get all plans for authenticated user
- `POST /api/plans` - Create new plan
- `GET /api/plans/[id]` - Get specific plan
- `PUT /api/plans/[id]` - Update plan
- `PATCH /api/plans/[id]` - Partially update plan (itinerary edits)
- `DELETE /api/plans/[id]` - Delete plan
- `POST /api/plans/[id]/finalize` - Finalize plan

### AI Generation
- `POST /api/ai/generate` - Generate itinerary with OpenAI

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `DATABASE_URL` | Prisma database URL (can reference MONGO_URI) | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o | Yes |

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Configure Database**
   - Ensure MongoDB Atlas allows connections from Vercel IPs
   - Run `npx prisma generate` in Vercel build settings if needed

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database

### Code Quality

- **TypeScript**: Strict mode enabled for maximum type safety
- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: (Optional) Add for code formatting consistency

## Key Features Explained

### AI Itinerary Generation

The application uses OpenAI GPT-4o with structured JSON output to generate:
- Flight recommendations with layover details
- Hotel accommodations with amenities
- Day-by-day activity schedules
- Budget breakdowns by category
- Local travel information and tips
- Emergency contact information

Generation typically takes 20-30 seconds with a progress modal showing status.

### PDF Export

Exported PDFs include:
- Trip overview and summary
- Emergency contacts (prominently displayed)
- Flight information
- Accommodation details
- Daily itinerary with activity tables
- Complete budget summary

### Security

- Passwords hashed with bcrypt
- JWT sessions via NextAuth.js
- API routes protected with authentication middleware
- CSRF protection enabled
- Environment variables for sensitive data

### Accessibility

- Keyboard navigation support
- Skip-to-content link
- ARIA labels and roles
- Screen reader compatible
- Semantic HTML structure

## Troubleshooting

### Common Issues

**Database connection errors**
- Verify MongoDB URI is correct in `.env`
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

**OpenAI API errors**
- Verify API key is valid
- Check OpenAI account has available credits
- Review rate limits in OpenAI dashboard

**Build errors**
- Delete `.next` folder and rebuild
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure all environment variables are set

## Contributing

This is a showcase project. For suggestions or issues, please open a GitHub issue.

## License

MIT License - feel free to use this project as a template for your own applications.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenAI](https://openai.com/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Database managed by [Prisma](https://www.prisma.io/)

---

**Built with Claude Code** - An AI-powered development assistant by Anthropic
