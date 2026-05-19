# Nutrition Web App

A modern, maintainable React web application for nutrition tracking, built with the latest technologies.

🌐 **Live Demo:** [https://harrisitto.github.io/nutrition-web/](https://harrisitto.github.io/nutrition-web/)

## 🚀 Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite with SWC (Super fast compilation)
- **State Management:** Redux Toolkit
- **Server State:** TanStack Query (React Query v5)
- **Routing:** React Router v6
- **Styling:** CSS with modern features
- **Development:** Hot Module Replacement (HMR)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx
├── pages/              # Route components
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   └── ProfilePage.tsx
├── store/              # Redux store configuration
│   └── index.ts
├── services/           # API services and utilities
│   ├── api.ts
│   └── queryClient.ts
├── hooks/              # Custom React hooks
│   └── redux.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css          # Global styles
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nutrition-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔧 Features

### ✅ Implemented
- **React Router**: Multi-page navigation (Home, Dashboard, Profile)
- **Redux Toolkit**: Configured store with TypeScript support
- **TanStack Query**: Configured for server state management
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-friendly navigation and layout
- **Development Tools**: React Query Devtools included

### 🔄 Ready for Development
- **API Integration**: Example API service functions ready to use
- **State Management**: Redux store ready for your app's state
- **Query Management**: TanStack Query setup with error handling
- **Component Architecture**: Organized folder structure for scalability

## 🎯 Next Steps

1. **Connect to Backend API:**
   - Update `API_BASE_URL` in `src/services/queryClient.ts`
   - Enable queries in components by setting `enabled: true`
   - Create feature-specific slices in `src/store/`
   - Add them to the store configuration

3. **Expand Components:**
   - Add more pages and components
   - Implement forms with validation
   - Add charts and data visualizations
4. **Styling:**
   - Add a UI library (e.g., Tailwind CSS, MUI, Chakra UI)
   - Implement your design system

## 🌐 Deployment

### GitHub Setup

1. Create a new repository on GitHub
2. Add remote origin:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Recommended Hosting
- **Vercel** (recommended for Vite projects)
- **Netlify**
- **GitHub Pages**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vite.dev/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy coding! 🎉**
