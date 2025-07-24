# AG-Dynamic-Datatable

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

## Project Overview

AG-Dynamic-Datatable is a powerful and flexible React application designed to display and manage dynamic tabular data with advanced features. Built specifically to showcase artwork collections from the Art Institute of Chicago, this application demonstrates enterprise-grade data table functionality with real-time filtering, sorting, and pagination capabilities.

## Live Demo

[View Live Application](https://ag-dynamic-datatable.netlify.app/)

## Features

### Dynamic Data Rendering

- Automatically generates table columns based on data structure
- Supports various data types including text, numbers, dates, and images
- Flexible column configuration with custom renderers
- Real-time data updates and synchronization

### Advanced Table Functionality

- Multi-column sorting with priority indicators
- Advanced filtering with search and category options
- Pagination with customizable page sizes
- Row selection with bulk operations
- Export functionality (CSV, JSON, Excel)

### Modern User Experience

- Responsive design optimized for all screen sizes
- Smooth animations and transitions
- Loading states and error handling
- Accessibility compliance (WCAG 2.1 AA)
- Dark and light theme support

### Performance Optimization

- Virtual scrolling for large datasets
- Lazy loading of images and content
- Debounced search and filtering
- Optimized re-rendering with React.memo
- Efficient state management

### Data Visualization

- Interactive artwork gallery view
- Detailed item preview modals
- Statistical insights and analytics
- Customizable dashboard layouts

## Technology Stack

| Category        | Technology     | Version | Purpose                      |
|----------------|----------------|---------|------------------------------|
| Frontend       | React          | 18.x    | Component-based UI library   |
| Language       | TypeScript     | 5.x     | Type-safe development        |
| Styling        | Tailwind CSS   | 3.x     | Utility-first styling        |
| Data Fetching  | React Query    | 4.x     | Server state management      |
| Icons          | Lucide React   | Latest  | Icon components              |
| Build Tool     | Vite           | 5.x     | Fast dev and build tool      |
| Testing        | Vitest         | Latest  | Unit testing                 |
| Linting        | ESLint         | Latest  | Code quality and formatting  |

## Prerequisites

- Node.js v16.x or above
- npm v7.x or above
- Git

**Recommended System Requirements:**

- OS: Windows 10+, macOS 10.15+, or Linux
- RAM: 4GB minimum (8GB recommended)
- Storage: At least 500MB free space

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/aaditya09750/AG-Dynamic-Datatable.git
cd AG-Dynamic-Datatable
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_API_URL=https://api.artic.edu/api/v1
VITE_ARTWORKS_ENDPOINT=/artworks
VITE_PAGE_SIZE=25
VITE_MAX_ITEMS=1000
VITE_ENABLE_VIRTUAL_SCROLL=true
```

### Run the Development Server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

## Project Structure

```
AG-Dynamic-Datatable/
├── public/
├── src/
│   ├── components/
│   │   ├── DataTable/
│   │   ├── Filters/
│   │   ├── Pagination/
│   │   └── Modal/
│   ├── hooks/
│   │   ├── useDataTable.ts
│   │   ├── useFilters.ts
│   │   └── usePagination.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── artwork.ts
│   │   └── datatable.ts
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── tests/
├── docs/
├── .env.example
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

| Command               | Description                       |
|-----------------------|-----------------------------------|
| `npm run dev`         | Start development server          |
| `npm run build`       | Build for production              |
| `npm run preview`     | Preview production build          |
| `npm run test`        | Run unit tests                    |
| `npm run test:watch`  | Watch mode for tests              |
| `npm run lint`        | Run ESLint                        |
| `npm run lint:fix`    | Auto-fix linting issues           |
| `npm run type-check`  | Check TypeScript types            |

## API Documentation

### `ArtworkData` Interface

```ts
interface ArtworkData {
  id: number;
  title: string;
  artist_display: string;
  place_of_origin: string;
  inscriptions: string;
  date_display: string;
  medium_display: string;
  dimensions: string;
  credit_line: string;
  image_id: string;
  alt_text: string;
  thumbnail: {
    lqip: string;
    width: number;
    height: number;
    alt_text: string;
  };
}
```

### `DataTableColumn` Interface

```ts
interface DataTableColumn<T = any> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number';
    options?: Array<{ label: string; value: any }>;
  };
}
```

### `PaginationState` Interface

```ts
interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

## Usage Examples

### Basic DataTable

```tsx
import { useDataTable } from './hooks/useDataTable';
import { DataTable } from './components/DataTable';

function ArtworkCollection() {
  const { data, loading, error, pagination } = useDataTable({
    endpoint: '/artworks',
    pageSize: 25
  });

  if (loading) return <div>Loading artworks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <DataTable
      data={data}
      columns={artworkColumns}
      pagination={pagination}
    />
  );
}
```

### Custom Column Configuration

```tsx
const artworkColumns: DataTableColumn<ArtworkData>[] = [
  {
    key: 'title',
    header: 'Title',
    sortable: true,
    filterable: true,
    width: '300px',
    render: (value, row) => (
      <div className="font-medium text-blue-600 hover:underline cursor-pointer">
        {value}
      </div>
    )
  },
  {
    key: 'artist_display',
    header: 'Artist',
    sortable: true,
    filterable: true,
    filter: {
      type: 'text'
    }
  },
  {
    key: 'date_display',
    header: 'Date',
    sortable: true,
    align: 'center'
  }
];
```

### Advanced Filtering

```tsx
const { data, filters, updateFilter } = useDataTable({
  endpoint: '/artworks',
  initialFilters: {
    place_of_origin: '',
    date_range: { start: '', end: '' },
    has_image: true
  }
});

// Update filter
updateFilter('place_of_origin', 'France');
```

## Configuration

### `.env` Variables

```env
VITE_API_URL=https://api.artic.edu/api/v1
VITE_ARTWORKS_ENDPOINT=/artworks
VITE_PAGE_SIZE=25
VITE_MAX_ITEMS=1000
VITE_ENABLE_VIRTUAL_SCROLL=true
VITE_ENABLE_EXPORT=true
VITE_ENABLE_SELECTION=true
VITE_THEME=light
VITE_IMAGE_BASE_URL=https://www.artic.edu/iiif/2
```

### Tailwind Config

```js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        secondary: '#059669',
        accent: '#DC2626',
        neutral: '#6B7280',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test DataTable.test.tsx

# Watch mode for development
npm run test:watch
```

### Test Structure

```
tests/
├── components/
│   ├── DataTable.test.tsx
│   ├── Filters.test.tsx
│   └── Pagination.test.tsx
├── hooks/
│   ├── useDataTable.test.ts
│   └── useFilters.test.ts
├── lib/
│   └── utils.test.ts
└── __mocks__/
    ├── api.ts
    └── data.ts
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production

```env
VITE_API_URL=https://api.artic.edu/api/v1
VITE_ARTWORKS_ENDPOINT=/artworks
VITE_PAGE_SIZE=25
VITE_MAX_ITEMS=1000
VITE_ENABLE_VIRTUAL_SCROLL=true
```

## Performance Optimization

### Virtual Scrolling

- Handles large datasets efficiently
- Renders only visible rows
- Smooth scrolling experience
- Configurable buffer size

### Caching Strategy

- API response caching with React Query
- Image lazy loading and caching
- Optimistic updates for better UX
- Smart cache invalidation

### Bundle Optimization

- Code splitting by routes
- Tree shaking for unused code
- Image optimization and compression
- Lazy loading of non-critical components

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and ensure tests pass
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Maintain consistent code style with ESLint
- Update documentation for API changes
- Ensure accessibility compliance

### Code Style

- Use descriptive variable and function names
- Add JSDoc comments for complex functions
- Follow React hooks best practices
- Implement proper error boundaries
- Use semantic HTML elements

## Troubleshooting

### Common Issues

**API Connection Issues:**
- Verify API endpoint URLs in environment variables
- Check network connectivity and CORS settings
- Ensure API key is valid if required

**Performance Issues:**
- Enable virtual scrolling for large datasets
- Reduce page size if memory usage is high
- Check for memory leaks in useEffect hooks

**Build Issues:**
- Clear node_modules and reinstall dependencies
- Verify Node.js and npm versions
- Check for TypeScript errors

## License Information

No license specified. All rights reserved by the author.

## Contact/Support Information

For questions, support, or feature requests:
- Email: aadigunjal0975@gmail.com
- GitHub Issues: [Create an issue](https://github.com/aaditya09750/AG-Dynamic-Datatable/issues)
- Live Demo: [https://ag-dynamic-datatable.netlify.app/](https://ag-dynamic-datatable.netlify.app/)

## Acknowledgments

- Art Institute of Chicago for providing the public API
- React community for excellent libraries and tools
- Contributors and users who provide feedback and suggestions
