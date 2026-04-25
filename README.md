# ChatStream Frontend

ChatStream is a high-fidelity, real-time messaging platform frontend built with **React 19**, **Vite**, and **Tailwind CSS**. It features a modern "Indigo Professional" design system with glassmorphism aesthetics and smooth animated backgrounds.

## 🚀 Features

- **Premium UI/UX**: Designed with a focus on rich aesthetics, featuring fluid gradients and glassmorphism components.
- **Modern Tech Stack**: Built using React 19 and TypeScript for a robust development experience.
- **Client-Side Routing**: Seamless transitions between authentication screens using `react-router-dom`.
- **Responsive Design**: Fully responsive layout optimized for all screen sizes.
- **Animated Backgrounds**: Custom blob-style animated backgrounds for a dynamic user experience.
- **High Performance**: Optimized with Vite for extremely fast Hot Module Replacement (HMR).

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (CDN-based with custom design system tokens)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Material Symbols](https://fonts.google.com/icons)
- **Fonts**: Inter & Manrope

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HongQuan78/Chatty.FE.git
   cd Chatty.FE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`.

## 📂 Project Structure

```text
Chatty.FE/
├── src/
│   ├── App.tsx          # Main entry point with routing configuration
│   ├── Login.tsx        # Login screen component
│   ├── Register.tsx     # Registration screen component
│   ├── main.tsx         # React DOM initialization
│   └── index.css        # Global styles
├── index.html           # HTML template with Tailwind & Design System config
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🎨 Design System

The project utilizes a custom **Indigo Professional** design system configured via Tailwind:
- **Primary Color**: `#1f108e` (Electric Indigo)
- **Secondary Color**: `#4648d4`
- **Typography**: `Manrope` for headings, `Inter` for body text.
- **Aesthetic**: Glassmorphism with `backdrop-blur-xl` and `white/80` opacity cards.

## 🤝 Backend Integration

This frontend is designed to work with the **Chatty.BE** (.NET 10) backend.
- Repo: [HongQuan78/Chatty.BE](https://github.com/HongQuan78/Chatty.BE)
- API Docs: `http://localhost:8080/swagger/index.html` (Local dev)

## 📄 License

This project is licensed under the MIT License.
