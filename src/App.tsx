import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, Menu, X, Linkedin, Instagram, Heart, ChevronLeft, ChevronRight, Building } from 'lucide-react';
import { TbApiApp, TbAutomation, TbBrandFlutter } from 'react-icons/tb';
import { MdStorefront } from 'react-icons/md';
import { PiGithubLogoBold } from 'react-icons/pi';
import { FiFacebook } from 'react-icons/fi';

interface PortfolioData {
  personal: {
    name: string;
    title: string;
    heroHeadline: string;
    heroSubheadline: string;
    email: string;
    phone: string;
    location: string;
  };
  services: Array<{
    id: number;
    title: string;
    description: string;
    icon: string;
  }>;
  portfolio: Array<{
    id: number;
    title: string;
    category: string;
    company: string;
    technologies: string[];
    headline: string;
    actions: Array<{
      label: string;
      url: string;
    }>;
    description: string;
    images: string[];
  }>;
  social: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}

function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load portfolio data
    import('./data/portfolio.json')
      .then(module => setData(module.default))
      .catch(error => console.error('Error loading portfolio data:', error));
  }, []);

  const getIcon = (iconName: string, className = "w-6 h-6") => {
    const icons = {
      flutter: <TbBrandFlutter className={className} />,
      api: <TbApiApp className={className} />,
      store: <MdStorefront className={className} />,
      automation: <TbAutomation className={className} />,
      linkedin: <Linkedin className={className} />,
      github: <PiGithubLogoBold className={className} />,
      instagram: <Instagram className={className} />,
      facebook: <FiFacebook  className={className} />,
    };
    return icons[iconName as keyof typeof icons] || <div className={className} />;
  };

  const openProjectDialog = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeProjectDialog = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject && currentImageIndex < selectedProject.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiData = {
      submitUrl: import.meta.env.VITE_API_SUBMIT_URL,
      masterKey: import.meta.env.VITE_API_MASTER_KEY,
      accessKey: import.meta.env.VITE_API_ACCESS_KEY,
      collectionId: import.meta.env.VITE_API_COLLECTION_ID,
    }

    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    try {
      const response = await fetch(apiData.submitUrl, {
        method: 'POST',
        headers: {
          'X-Master-Key': apiData.masterKey,
          'X-Access-Key': apiData.accessKey,
          'X-Collection-Id': apiData.collectionId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });
      
      if (response.ok) {
        alert('Message sent successfully! 🎉');
        (e.target as HTMLFormElement).reset();
        setShowContactForm(false);
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    setShowContactForm(true);
    setTimeout(() => {
      const contactSection = document.getElementById('contact-form');
      if (contactSection) {
        contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
        });
      }
    }, 100);
  };

  const scrollToPortfolio = () => {
    setTimeout(() => {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
        });
      }
    }, 100);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-stone-50 border-b-4 border-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-black text-black">
              {data.personal.name}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-black font-bold hover:text-pink-500 transition-colors">About</a>
              <a href="#portfolio" className="text-black font-bold hover:text-pink-500 transition-colors">Portfolio</a>
              <button 
                onClick={scrollToContact}
                className="bg-yellow-200 text-black px-6 py-3 border-3 border-black font-bold hover:bg-yellow-300 transition-colors transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Hire Me
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 border-2 border-black bg-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t-2 border-black bg-white border-x-2 mb-2 transform -rotate-1">
              <div className="space-y-2">
                <a href="#about" className="block py-2 px-4 text-black font-bold hover:bg-pink-100">About</a>
                <a href="#portfolio" className="block py-2 px-4 text-black font-bold hover:bg-pink-100">Portfolio</a>
                <button 
                  onClick={scrollToContact}
                  className="w-full text-left py-2 px-4 bg-yellow-200 text-black font-bold hover:bg-yellow-300 border-2 border-black mx-4 mb-2"
                >
                  Hire Me
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center relative">
            {/* Decorative doodles */}
            <div className="absolute -top-8 left-1/4 w-12 h-12 transform rotate-12 hidden md:block">
              <div className="w-full h-1 bg-pink-400 transform rotate-45"></div>
              <div className="w-full h-1 bg-pink-400 transform -rotate-45 -mt-1"></div>
            </div>
            <div className="absolute -top-4 right-1/3 w-8 h-8 border-2 border-blue-400 rounded-full transform -rotate-12 hidden md:block"></div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-black leading-tight mb-6 transform hover:scale-105 transition-transform">
              {data.personal.heroHeadline}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
              {data.personal.heroSubheadline}
            </p>
            
            <button 
              onClick={scrollToPortfolio}
              className="bg-pink-300 text-black px-8 py-4 text-xl font-bold border-4 border-black hover:bg-pink-400 transition-all transform hover:-translate-y-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              See Portfolio
              <ArrowRight className="inline-block ml-2 w-6 h-6" />
            </button>

            {/* More decorative elements */}
            <div className="absolute -bottom-8 left-1/3 transform rotate-45 hidden md:block">
              <div className="w-6 h-6 bg-yellow-300 border-2 border-black"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y-4 border-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16 transform -rotate-1">
            What I Do Best
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.services.map((service, index) => (
              <div 
                key={service.id} 
                className={`bg-stone-50 p-6 border-3 border-black transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="bg-blue-200 w-16 h-16 border-2 border-black flex items-center justify-center mb-4">
                  {getIcon(service.icon)}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-4 left-1/2 w-16 h-1 bg-yellow-400 transform -translate-x-1/2 rotate-12"></div>
            <h2 className="text-3xl md:text-5xl font-black transform rotate-1">My Portfolio</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {data.portfolio.map((project, index) => (
              <div 
                key={project.id}
                className={`group relative bg-white border-3 border-black transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-all hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}
              >
                <div className="aspect-video bg-gray-200 border-b-3 border-black overflow-hidden">
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 font-semibold">{project.headline}</p>
                    </div>
                    <button 
                      onClick={() => openProjectDialog(project)}
                      className="bg-pink-200 p-2 border-2 border-black hover:bg-pink-300 transition-colors transform hover:-translate-y-1"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-100 p-12 border-4 border-black transform -rotate-1 hover:rotate-0 transition-transform">
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Let's start designing your project
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Ready to turn your ideas into amazing digital experiences? Let's chat about your next project!
            </p>
            <button 
              onClick={scrollToContact}
              className="bg-pink-300 text-black px-8 py-4 text-xl font-bold border-4 border-black hover:bg-pink-400 transition-all transform hover:-translate-y-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              Send us message
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 border-t-4 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-pink-400" /> by Rahmani Mohamed Hichem
              </p>
              <p className="text-sm text-gray-400 mt-1">© 2026 All rights reserved.</p>
            </div>
            
            <div className="flex space-x-4">
              {data.social.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="bg-white text-black p-2 border-2 border-white hover:bg-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getIcon(social.icon, "w-5 h-5")}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-blue-100 border-4 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    Let's work together! ✨
                  </h2>
                  <p className="text-lg text-gray-700">
                    Tell me about your project and let's create something amazing.
                  </p>
                </div>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="bg-white border-2 border-black p-2 hover:bg-gray-100 transition-colors transform hover:-translate-y-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-6" id="contact-form">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-3 border-3 border-black bg-white focus:bg-yellow-50 transition-colors outline-none focus:border-pink-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-3 border-3 border-black bg-white focus:bg-yellow-50 transition-colors outline-none focus:border-pink-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full p-3 border-3 border-black bg-white focus:bg-yellow-50 transition-colors outline-none focus:border-pink-400 resize-none"
                    placeholder="Tell me about your project, timeline, and budget..."
                  ></textarea>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <p className="text-sm text-gray-600">
                    I'll get back to you within 24 hours! 🚀
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-pink-300 text-black px-8 py-3 text-lg font-bold border-3 border-black hover:bg-pink-400 transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message 📨'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Dialog */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto transform rotate-1 hover:rotate-0 transition-transform">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black mb-2">{selectedProject.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {selectedProject.company}
                    </span>
                    <span className="bg-blue-100 px-2 py-1 border-2 border-black font-semibold">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeProjectDialog}
                  className="bg-pink-200 border-2 border-black p-2 hover:bg-pink-300 transition-colors transform hover:-translate-y-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Gallery */}
              <div className="relative mb-6">
                <div className="aspect-video bg-gray-200 border-3 border-black overflow-hidden">
                  <img 
                    src={selectedProject.images[currentImageIndex]} 
                    alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain bg-amber-100"
                  />
                </div>
                
                {/* Image Navigation */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === selectedProject.images.length - 1}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border-2 border-black p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 border-2 border-black ${
                            index === currentImageIndex ? 'bg-pink-300' : 'bg-white'
                          } hover:bg-pink-200 transition-colors`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3">About This Project</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {selectedProject.description}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.actions.map((action: { label: string; url: string }, index: number) => (
                      <a
                        key={index}
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-200 text-black px-4 py-2 border-2 border-black font-bold hover:bg-blue-300 transition-colors transform hover:-translate-y-1"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="bg-yellow-200 px-3 py-1 border-2 border-black text-sm font-semibold transform hover:scale-105 transition-transform"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;