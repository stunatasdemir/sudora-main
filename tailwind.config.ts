import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'playfair': ['Playfair Display', 'serif'],
				'montserrat': ['Montserrat', 'sans-serif'],
				'inter': ['Inter', 'sans-serif'],
				'lora': ['Lora', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'glass-primary': 'hsl(var(--glass-primary))',
				'glass-secondary': 'hsl(var(--glass-secondary))',
				'glass-accent': 'hsl(var(--glass-accent))',
			},
			backgroundImage: {
				'gradient-wood': 'var(--gradient-wood)',
				'gradient-cream': 'var(--gradient-cream)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-featured': 'var(--gradient-featured)',
				'gradient-bestseller': 'var(--gradient-bestseller)',
			},
			boxShadow: {
				'wood': '0 8px 32px hsl(var(--shadow-wood))',
				'warm': '0 8px 32px hsl(var(--shadow-warm))',
				'elegant': '0 4px 20px hsl(var(--shadow-elegant))',
				'luxury': '0 20px 60px hsl(var(--shadow-elegant))',
				'glow-wood': '0 0 30px hsl(var(--shadow-wood))',
				'glow-warm': '0 0 30px hsl(var(--shadow-warm))',
			},
			backdropBlur: {
				'luxury': '20px',
				'glass': '12px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				oval: '2.5rem',
				'luxury': '3rem',
			},
			transitionTimingFunction: {
				'luxury': 'cubic-bezier(0.23, 1, 0.32, 1)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glass-shimmer': {
					'0%': { background: 'hsl(var(--glass-primary))' },
					'50%': { background: 'hsl(var(--glass-accent))' },
					'100%': { background: 'hsl(var(--glass-primary))' }
				},
				'luxury-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--shadow-wood))' },
					'50%': { boxShadow: '0 0 40px hsl(var(--shadow-warm)), 0 0 60px hsl(var(--shadow-wood))' }
				},
				'product-hover': {
					'0%': { transform: 'translateY(0) scale(1)' },
					'100%': { transform: 'translateY(-8px) scale(1.02)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'glass-shimmer': 'glass-shimmer 6s ease-in-out infinite',
				'luxury-glow': 'luxury-glow 3s ease-in-out infinite',
				'product-hover': 'product-hover 0.3s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
