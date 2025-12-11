import React, { useState, type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logoWhite from '@/assets/logos/perfect-world-logo-white.png';

/**
 * Props for the Footer component.
 */
interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** The source URL for the company logo. */
  logoSrc?: string;
  /** The name of the company, displayed next to the logo. */
  companyName?: string;
  /** A short description of the company. */
  description?: string;
  /** An array of objects for generating useful links. */
  usefulLinks?: { label: string; href: string; external?: boolean }[];
  /** An array of objects for generating project/collection links. */
  projectLinks?: { label: string; href: string; external?: boolean }[];
  /** An array of objects for generating social media links. */
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  /** The title for the newsletter subscription section. */
  newsletterTitle?: string;
  /** Async function to handle email subscription. Should return `true` for success and `false` for failure. */
  onSubscribe?: (email: string) => Promise<boolean>;
}

/**
 * A responsive and theme-adaptive footer component with a newsletter subscription form.
 * Designed following shadcn/ui and 21st.dev best practices.
 */
const Footer: FC<FooterProps> = ({
  logoSrc = '/assets/LOGOS/perfect-world-logo-white.png',
  companyName = 'Perfect World',
  description = 'Together. Not Alone. More than a slogan, it\'s a Promise for Change and Improvement.',
  usefulLinks = [
    { label: 'About Us', href: '/about', external: false },
    { label: 'Shop', href: '/shop', external: false },
    { label: 'Transparency', href: '/transparency', external: false },
    { label: "Founder's Story", href: '/founders', external: false },
    { label: 'Contact', href: 'https://shop.perfectworld.global/pages/contact', external: true },
  ],
  projectLinks = [
    { label: 'All Projects', href: '/projects', external: false },
    { label: 'Wild at Heart', href: '/shop?collection=wild-at-heart', external: false },
    { label: 'Endangered Oceans', href: '/shop?collection=endangered-oceans', external: false },
    { label: 'One World', href: '/shop?collection=one-world', external: false },
    { label: 'Cool Down', href: '/shop?collection=cool-down', external: false },
    { label: 'Talk About It', href: '/shop?collection=talk-about-it', external: false },
    { label: 'Embroidered Logo', href: '/shop?collection=embroidered-logo', external: false },
  ],
  socialLinks = [
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/perfectworld.global',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/perfectworld.global',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.01 3.66 9.17 8.44 9.96v-7.04H7.9v-2.92h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.22.2 2.22.2v2.44h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.92h-2.3v7.04C18.34 21.24 22 17.08 22 12.07z" />
        </svg>
      )
    },
    {
      label: 'TikTok',
      href: 'https://www.tiktok.com/@perfectworld.global',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    },
  ],
  newsletterTitle = 'Subscribe to our Newsletter',
  onSubscribe,
  className,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !onSubscribe || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onSubscribe(email);

    setSubscriptionStatus(success ? 'success' : 'error');
    setIsSubmitting(false);

    if (success) {
      setEmail('');
    }

    // Reset the status message after 3 seconds
    setTimeout(() => {
      setSubscriptionStatus('idle');
    }, 3000);
  };

  return (
    <footer className={cn('bg-gradient-to-br from-black via-black/95 to-black/90 text-white relative', className)} style={{ zIndex: 10, pointerEvents: 'auto' }} {...props}>
      <div className="container mx-auto max-w-7xl relative" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 lg:gap-12 relative" style={{ paddingLeft: '32px', paddingRight: '0px', paddingTop: '100px', paddingBottom: '80px', zIndex: 10 }}>
          {/* Company Info - About */}
          <div className="flex flex-col gap-3">
            <img
              src={logoWhite}
              alt="Perfect World Logo"
              className="w-full mb-2 object-contain"
            />
            <h3 className="mb-3 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-2">
              About
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mb-2">
              Together. Not Alone.<br />
              More than a slogan, it's a Promise for Change and Improvement.
            </p>
            <div className="text-gray-400 text-xs space-y-1.5">
              <p>Nicholas Freitag</p>
              <a
                href="mailto:info@perfectworld.global"
                className="block hover:text-white transition-colors cursor-pointer relative"
                style={{ zIndex: 20 }}
              >
                info@perfectworld.global
              </a>
              <p>+49 15129109696</p>
              <p>Am Hochwald 5</p>
              <p>82319 Starnberg, Germany</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="mb-3 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-2">
              Quick Links
            </h3>
            {usefulLinks.map((link) => (
              <div key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
                    style={{ zIndex: 20 }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
                    style={{ zIndex: 20 }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Our Projects */}
          <div className="flex flex-col gap-3">
            <h3 className="mb-3 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-2">
              Our Projects
            </h3>
            {projectLinks.map((link) => (
              <div key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
                    style={{ zIndex: 20 }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
                    style={{ zIndex: 20 }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Legal/Support */}
          <div className="flex flex-col gap-3">
            <h3 className="mb-3 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-2">
              Support
            </h3>
            <a
              href="https://shop.perfectworld.global/policies/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
              style={{ zIndex: 20 }}
            >
              Privacy Policy
            </a>
            <a
              href="https://shop.perfectworld.global/policies/refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
              style={{ zIndex: 20 }}
            >
              Refund Policy
            </a>
            <a
              href="https://shop.perfectworld.global/policies/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
              style={{ zIndex: 20 }}
            >
              Terms of Service
            </a>
            <a
              href="https://shop.perfectworld.global/pages/legal-notice"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm mb-2 cursor-pointer relative"
              style={{ zIndex: 20 }}
            >
              Legal Notice
            </a>
            <a
              href="https://shop.perfectworld.global/policies/shipping-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-400 hover:text-white transition-colors text-xs md:text-sm cursor-pointer relative"
              style={{ zIndex: 20 }}
            >
              Shipping Policy
            </a>
          </div>

          {/* Newsletter & Social */}
          <div className="flex flex-col gap-3">
            <h3 className="mb-3 uppercase text-gray-400 text-xs font-semibold tracking-wider border-b border-white/10 pb-2">
              Stay Connected
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                required
                aria-label="Email for newsletter"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
              <Button
                type="submit"
                disabled={isSubmitting || subscriptionStatus !== 'idle'}
                className="w-full px-8 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {(subscriptionStatus === 'success' || subscriptionStatus === 'error') && (
                <div className="text-center text-xs">
                  {subscriptionStatus === 'success' ? (
                    <span className="font-semibold text-green-500">Subscribed! 🎉</span>
                  ) : (
                    <span className="font-semibold text-red-500">Failed. Try again.</span>
                  )}
                </div>
              )}
            </form>

            {/* Social Icons */}
            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white flex items-center justify-center transition-colors group cursor-pointer relative"
                  style={{ zIndex: 20 }}
                >
                  <div className="text-gray-400 group-hover:text-black transition-colors">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ paddingLeft: '32px', paddingRight: '32px', paddingTop: '32px', paddingBottom: '40px' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-gray-400 text-xs md:text-sm">
              © {new Date().getFullYear()} Perfect World. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}>
              Together. Not Alone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
