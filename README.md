# Paperclip Revenue App

A Next.js application built with TypeScript, Tailwind CSS, and modern tooling. Part of the revenue generation initiative (CMP-1).

## Repository

https://github.com/likeyco/paperclip-revenue-app

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (via GitHub integration)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/likeyco/paperclip-revenue-app.git
cd paperclip-revenue-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## CI Pipeline

The project includes automated CI via GitHub Actions that runs on every push and pull request:

- **Linting**: ESLint checks for code quality
- **Type checking**: TypeScript compilation check

See `.github/workflows/ci.yml` for configuration.

## Deployment

### Vercel Deployment (Recommended)

1. Go to [Vercel](https://vercel.com/new)
2. Import the GitHub repository: `likeyco/paperclip-revenue-app`
3. Configure project settings (defaults work fine)
4. Deploy

Vercel will automatically:
- Deploy on every push to `main`
- Create preview deployments for pull requests
- Provide a production URL

### Manual Deployment

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## Project Structure

```
├── src/
│   └── app/           # Next.js App Router pages
├── public/            # Static assets
├── .github/
│   └── workflows/     # GitHub Actions CI
├── AGENTS.md          # Agent coding guidelines
└── README.md          # This file
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
