# PillMatrix - Marketing Website

A professional, modern marketing website for PillMatrix, an AI-powered prescription management and healthcare coordination platform.

## 🎯 Project Overview

PillMatrix is designed to eliminate prescription errors, improve patient medication adherence, and create a secure, unified communication loop between doctors, labs, pharmacists, and patients.

This website serves as the public face of PillMatrix, showcasing the platform's features, benefits, and value proposition to healthcare professionals and institutions.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Responsive navigation header
│   └── Footer.tsx          # Multi-column footer with links
├── pages/
│   ├── Home.tsx            # Landing page with hero section
│   ├── HowItWorks.tsx      # Role-based workflow explanation
│   ├── Features.tsx        # Detailed feature showcase
│   ├── ForInstitutions.tsx # Enterprise solutions page
│   ├── Security.tsx        # Security & compliance page
│   ├── Contact.tsx         # Contact form & FAQ
│   └── Login.tsx           # Authentication portal
├── App.tsx                 # Main app component with routing
├── main.tsx                # React entry point
└── index.css               # Global styles and Tailwind
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#4A90E2` - Main brand color
- **Secondary Teal**: `#50E3C2` - Success states and accents
- **Accent Orange**: `#F5A623` - Call-to-action buttons
- **Background**: `#F7F9FA` - Light neutral background

### Typography
- Font Family: Inter (Google Fonts)
- Responsive sizing for mobile and desktop
- Clear hierarchy with bold headings

### Components
- Responsive navigation with mobile menu
- Hero sections with gradient backgrounds
- Feature cards with hover effects
- Role-based tabbed interfaces
- Contact forms with validation
- Testimonial sections
- Pricing tables

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The site will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📄 Pages

### Home Page
- Hero section with main value proposition
- Problem statement with statistics
- Solution overview showing the unified care circle
- 4-step journey overview
- Testimonials from healthcare professionals
- Final call-to-action

### How It Works
- Role-based tabbed interface
- Detailed workflows for:
  - Doctors: Prescription digitization and verification
  - Patients: Medication management and reminders
  - Pharmacists: Prescription validation and dispensing
  - Lab Technicians: Report upload and notifications
- Key benefits section
- Call-to-action

### Features
- 8 core features with detailed descriptions:
  - AI-Powered OCR
  - Smart Drug Interaction Checking
  - Instant Digital Prescriptions
  - Unified Health Records
  - AI-Powered Patient Assistant
  - Bio-Equivalence Analysis
  - Smart Medication Reminders
  - QR Code Patient Access
- Technology stack overview
- Integration capabilities

### For Institutions
- Enterprise benefits and ROI metrics
- Implementation roadmap
- Success case studies
- Flexible pricing plans
- Enterprise call-to-action

### Security
- Security pillars (Encryption, HIPAA, Audits)
- Data privacy and control
- Government ID verification explanation
- Compliance certifications
- Infrastructure security details
- Incident response procedures

### Contact
- Contact information
- Contact form with validation
- FAQ section covering common questions
- Call-to-action

### Login/Register
- Sign-in form
- Role-based registration:
  - Patient
  - Doctor
  - Pharmacist
  - Lab Technician
- Government ID field for professionals
- Password visibility toggle
- Terms and conditions acceptance

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Heroicons** - Beautiful SVG icons
- **PostCSS** - CSS processing

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Form labels and error messages

## 🔒 Security Features

- HIPAA compliance information
- Data encryption details
- Government ID verification for professionals
- Secure form handling
- Privacy policy links

## 📊 Analytics Ready

The website structure supports easy integration with:
- Google Analytics
- Mixpanel
- Segment
- Other analytics platforms

## 🚢 Deployment

### Netlify
```bash
npm run build
# Deploy the dist folder to Netlify
```

### Vercel
```bash
npm run build
# Connect your repository to Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

Create a `.env.local` file for local development:
```
VITE_API_URL=https://api.pillmatrix.com
VITE_ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📧 Support

For questions or support, contact: hello@pillmatrix.com

## 🎯 Future Enhancements

- [ ] Blog section
- [ ] Case study details page
- [ ] Webinar registration
- [ ] API documentation
- [ ] Mobile app showcase
- [ ] Video demonstrations
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced animations

---

**PillMatrix** - Transforming Healthcare Through Intelligent Prescription Management
