import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { frasesFooter } from '../data/frases';
import FlameLogo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [fraseIndex, setFraseIndex] = useState(0);

  // Rotacao de frases a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % frasesFooter.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/flame.rio',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/flame.rio',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/flame.rio',
      icon: Twitter,
    },
  ];

  const quickLinks = [
    { name: 'Nossa Historia', href: '/historia' },
    { name: 'Conceito', href: '/conceito' },
    { name: 'Cardapio', href: '/cardapio' },
    { name: 'Contato', href: '/contato' },
  ];

  const legalLinks = [
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Politica de Privacidade', href: '/privacidade' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <FlameLogo size={45} />
            </Link>

            <p className="text-neutral-400 text-sm mb-6 min-h-[60px] sm:min-h-[40px] transition-all duration-500">
              {frasesFooter[fraseIndex]}
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-neutral-400">
                <MapPin className="w-4 h-4 text-magenta-400 flex-shrink-0" />
                <span>Rua Arnaldo Quintela 19, Botafogo - RJ</span>
              </div>

              <div className="flex items-center space-x-3 text-sm text-neutral-400">
                <Phone className="w-4 h-4 text-magenta-400 flex-shrink-0" />
                <span>(21) 99999-9999</span>
              </div>

              <div className="flex items-center space-x-3 text-sm text-neutral-400">
                <Mail className="w-4 h-4 text-magenta-400 flex-shrink-0" />
                <span>contato@flame.com.br</span>
              </div>

              <div className="flex items-start space-x-3 text-sm text-neutral-400">
                <Clock className="w-4 h-4 text-magenta-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div>Dom-Qui: 16h as 02h</div>
                  <div>Sex-Sab: 16h as 03h</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Links Rapidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-magenta-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Informacoes</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-magenta-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Siga-nos</h3>

            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 hover:bg-gradient-to-br hover:from-magenta-500 hover:to-cyan-500 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 shadow-lg hover:shadow-magenta-500/30"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <div>
              <h4 className="text-white font-medium text-sm mb-3">
                Receba nossas novidades
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-l-lg text-white text-sm focus:outline-none focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-magenta-500 to-cyan-500 hover:from-magenta-600 hover:to-cyan-600 text-white rounded-r-lg text-sm font-medium transition-all shadow-lg shadow-magenta-500/30">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 text-sm mb-4 md:mb-0">
              {currentYear} FLAME Lounge Bar. Todos os direitos reservados.
            </div>

            <div className="flex items-center space-x-6 text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                Desenvolvido com
                <span className="text-magenta-400">love</span>
                para o FLAME
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
