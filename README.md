An innovative e-commerce platform that lets you browse products and customize them with your own AI-generated designs before purchasing.

## 🚀 Features

- **Product Catalog:** Browse a variety of customizable products pulled from Printful
- **AI Image Generation:** Create unique designs using text prompts powered by Replicate AI
- **Product Customization:** Place your AI-generated designs on products before purchase
- **Interactive Preview:** See how your designs look on products in real-time
- **Responsive Design:** Fully functional on mobile, tablet, and desktop

## 🛠️ Tech Stack

### Frontend

- React 19: Modern UI library
- React Router 7: Next-gen routing with built-in SSR capability
- Material UI 7: Component library for sleek, responsive UI
- TanStack Query: Data fetching, caching, and state management
- Swiper: Touch-enabled slider for product images
- React Hook Form: Form handling with Zod validation
- TypeScript: Static typing for improved developer experience

### Backend & Services

- Node.js: Server-side JavaScript runtime
- Printful API: Product catalog and fulfillment
- Replicate API: AI image generation
- Vite: Fast and efficient build tool

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- Printful API credentials
- Replicate API token

## 🚀 Getting Started

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Example .env
PRINTFUL_API_KEY=your_printful_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
```

### Installation

```bash
npm install
# or
yarn install
```

## 📖 Project Structure

```
picture-me/
├── README.md
├── package.json
├── tsconfig.json
├── .env
├── app/
│   ├── routes/
│   │   ├── product_listing.tsx
│   │   ├── product_detail.tsx
│   │   └── image_gen_playground.tsx
│   └── components/
│       ├── ProductCard.tsx
│       └── ImageGenerator.tsx
├── public/
│   └── assets/
└── server.js
```

## 🖼️ Key Features Explained

### Product Browsing

The product listing page (`app/routes/product_listing.tsx`) displays products fetched from the Printful API, with filtering options by category and responsive grid layouts.

### Product Customization

The product detail page (`app/routes/product_detail.tsx`) allows users to:

- Select product variants (color, size)
- Generate AI images using text prompts
- Preview the generated design on the product
- Add customized products to cart

### AI Image Generation

The app integrates with Replicate API to generate images based on text prompts. This functionality is available in the product detail page and the AI image generation playground (`app/routes/image_gen_playground.tsx`).

## 🚢 Deployment

### Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
docker build -t picture-me .
docker run -p 3000:3000 picture-me
```

### Deployment Platforms

This application can be deployed to:

- Vercel (optimized with `@vercel/react-router`)
- AWS (EC2, ECS, or Elastic Beanstalk)
- Google Cloud Run
- Heroku
- Railway
- Any platform supporting Node.js or Docker containers

## 📄 API Integration

### Printful API

Used for fetching product catalogs, variants, and generating mockups. API endpoints are called from server-side loaders to protect API credentials.

### Replicate API

Powers the AI image generation feature using Stability AI's SDXL model.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature')
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
