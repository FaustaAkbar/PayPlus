import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect for header shadow and transform
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-800 w-full font-sans">
      {/* Header */}
      <header 
        className={`bg-white sticky top-0 z-10 transition-all duration-300 
        ${isScrolled ? 'shadow-lg bg-opacity-95 backdrop-blur-md' : 'shadow-sm bg-opacity-90 backdrop-blur-sm'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                id="logo" 
                className="h-10 w-auto transition-all duration-300" 
                src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" 
                alt="PayPlus Logo" 
              />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">
                Testimonials
              </a>
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700 transition duration-300">
                Log in
              </Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg">
                Sign up
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button 
                id="menu-toggle" 
                className="text-gray-500 hover:text-indigo-600 focus:outline-none" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 px-6 bg-white shadow-inner rounded-b-lg animate-fadeIn">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">
                  Testimonials
                </a>
                <a href="#faq" className="text-gray-600 hover:text-indigo-600 font-medium transition duration-300">
                  FAQ
                </a>
                <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700 transition duration-300">
                  Log in
                </Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition duration-300 text-center shadow-md">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="hero pt-32 pb-24 px-6 bg-gradient-to-b from-white to-indigo-50">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            {/* Left Column */}
            <div className="md:w-1/2 mb-16 md:mb-0 text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-left">
                Simplify Your <span className="text-indigo-600">Financial Life</span>
              </h1>
              <p className="text-xl mb-8 text-gray-600 leading-relaxed text-left max-w-lg">
                PayPlus helps you manage money, track expenses, and achieve your financial goals with ease and precision.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-indigo-700 transition duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started Free
                </Link>
                <a href="#everything" className="flex items-center justify-center sm:justify-start space-x-2 text-indigo-600 font-medium hover:text-indigo-700 transition duration-300">
                  <span>Learn more</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
              <div className="mt-10 flex items-center space-x-4">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=1" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=8" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/40?img=13" alt="User" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                    +5k
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">10,000+</span> satisfied users already
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="relative">
                <div className="relative">
                  <img 
                    src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/dasboard.png?raw=true" 
                    alt="Finance Dashboard" 
                    className="rounded-2xl shadow-2xl transition-all duration-500 transform hover:-rotate-1 hover:scale-105 z-10"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 transform rotate-3 z-1">
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="font-medium">Budgeting simplified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PayPlus?</h2>
              <p className="text-xl text-gray-600">Our powerful features help you take control of your finances with ease.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
              {/* Feature 1 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="absolute -top-8 left-8 bg-indigo-500 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-3">Smart Budgeting</h3>
                  <p className="text-gray-600 mb-4">Set and track budgets with our intuitive interface. Stay on top of your spending and save more effectively.</p>
                  <a href="#everything" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="absolute -top-8 left-8 bg-purple-500 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-3">Expense Tracking</h3>
                  <p className="text-gray-600 mb-4">Automatically categorize and analyze your spending habits to identify saving opportunities.</p>
                  <a href="#everything" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative bg-white p-8 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="absolute -top-8 left-8 bg-green-500 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-3">Goal Setting</h3>
                  <p className="text-gray-600 mb-4">Set financial goals and track your progress over time. Celebrate milestones along the way!</p>
                  <a href="#" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Screenshot Section */}
        <section id="everything" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need in One Place</h2>
              <p className="text-xl text-gray-600">Our clean and intuitive dashboard gives you full control of your finances.</p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600 rounded-full opacity-5 filter blur-3xl"></div>
              <img 
                src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/dasboard.png?raw=true" 
                alt="Finance Dashboard" 
                className="rounded-2xl shadow-2xl border border-gray-200 w-full"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-amber-500">★</span>
                  <span className="text-amber-500">★</span>
                  <span className="text-amber-500">★</span>
                  <span className="text-amber-500">★</span>
                </div>
                <span className="text-gray-800 font-medium">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-indigo-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600">Join thousands of satisfied users who have transformed their financial lives.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="flex mb-6">
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-gray-600 mb-8 text-lg italic">PayPlus mengubah cara aku ngatur keuangan. Gampang banget dipakai, fiturnya keren, dan yang bikin seru, ngatur budget jadi lebih asyik.</p>
                <div className="flex items-center pt-7.5">
                  <img src="https://i.pravatar.cc/60?img=8" alt="User" className="w-14 h-14 rounded-full border-4 border-white shadow-md mr-4" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Andreas Sanjaya Putra</h4>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl border border-gray-100">
                <div className="flex mb-6">
                  <span className="text-amber-400">★★★★★</span>
                </div>
                <p className="text-gray-600 mb-8 text-lg italic">Pakai PayPlus, ngatur uang jadi jauh lebih simpel. Fiturnya lengkap, gampang dipahami, dan bikin budgeting terasa ringan dan menyenangkan. Top deh pokoknya 😊</p>
                <div className="flex items-center">
                  <img src="https://i.pravatar.cc/60?img=1" alt="User" className="w-14 h-14 rounded-full border-4 border-white shadow-md mr-4" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Putri Andini Wijaya</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="max-w-xs">
              <img 
                className="h-12 w-auto mb-3" 
                src="https://github.com/ThePayPlus/PayPlus_FE/blob/main/public/Logo.png?raw=true" 
                alt="PayPlus Logo" 
              />
              <p className="mb-3 text-sm text-left">Simplify your financial life with intelligent budgeting, expense tracking, and goal setting.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};