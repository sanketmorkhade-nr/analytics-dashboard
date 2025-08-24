# Analytics Dashboard Frontend

A modern React-based frontend for the Usage Analytics Dashboard, built with TypeScript, shadcn/ui components, and Recharts for data visualization.

## Features

- **Dashboard Overview**: Key metrics and trends visualization
- **Analytics**: Detailed charts and insights
- **Data Search**: Advanced search and filtering capabilities
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Live integration with backend API

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui components
- **Charts**: Recharts library
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running on port 8080

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── features/                    # Feature-specific code
│   ├── dashboard/              # Dashboard feature
│   ├── analytics/              # Analytics feature
│   └── search/                 # Search feature
├── shared/                     # Shared components and utilities
│   ├── components/             # UI components
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API services
│   └── types/                  # TypeScript types
└── pages/                      # Page components
```

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api/v1`. Make sure the backend server is running before using the frontend.

### Key Endpoints

- `GET /api/v1/metrics` - Get dashboard metrics
- `GET /api/v1/trends` - Get time-series trends
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events/search` - Search and filter events

## Development

### Adding New Components

To add new shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Use feature-based organization
- Implement proper error handling
- Add loading states for better UX

## Deployment

1. Build the application:
```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Deploy the contents of `dist/` to your web server

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running on port 8080
2. **Build Errors**: Check TypeScript errors and fix import issues
3. **Component Not Found**: Verify shadcn/ui components are properly installed

### Development Tips

- Use the browser's developer tools to debug API calls
- Check the console for error messages
- Use React DevTools for component debugging
- Monitor network requests in the Network tab

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Test your changes thoroughly
5. Update documentation as needed
