// components/footer.tsx
import Link from 'next/link';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import {AiFillTikTok} from 'react-icons/ai';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border-t-4 border-amber-200  ">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                Debbies Cakes and Pastries
              </h2>
              <p className="text-amber-700 mb-6 text-sm lg:text-base leading-relaxed">
                Delightful treats made with love, bringing sweetness to every celebration since day one.
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="https://www.facebook.com/profile.php?id=100064248935398" 
                  className="bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                >
                  <FaFacebook size={20} />
                </Link>
                <Link 
                  href="https://www.instagram.com/debbiescakesandpastries?igsh=YzljYTk1ODg3Zg==" 
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 hover:text-pink-800 p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                >
                  <FaInstagram size={20} />
                </Link>
                <Link
                  href="https://www.tiktok.com/@debbiescakesandpastries"
                  className="bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
                >
                  <AiFillTikTok size={20} />
                </Link>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/" 
                    className="text-amber-700 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/" 
                    className="text-amber-700 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                    Menu
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/socials" 
                    className="text-amber-700 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-amber-700 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></span>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start group">
                  <div className="bg-amber-100 group-hover:bg-amber-200 p-2 rounded-lg mr-3 transition-colors duration-200">
                    <HiMail className="text-amber-700 group-hover:text-amber-800" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">Email us</p>
                    <a 
                      href="mailto:debbiescakesandpastries1@gmail.com" 
                      className="text-amber-700 hover:text-orange-600 transition-colors duration-200 text-sm lg:text-base"
                    >
                      debbiescakesandpastries1@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start group">
                  <div className="bg-pink-100 group-hover:bg-pink-200 p-2 rounded-lg mr-3 transition-colors duration-200">
                    <HiPhone className="text-pink-700 group-hover:text-pink-800" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 mb-1">Call us</p>
                    <a 
                      href="tel:+2347013035518" 
                      className="text-amber-700 hover:text-orange-600 transition-colors duration-200 text-sm lg:text-base"
                    >
                      +2347013035518
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-amber-800 border-b-2 border-amber-200 pb-2">
                Opening Hours
              </h3>
              <ul className="space-y-2 text-sm lg:text-base">
                <li className="flex justify-between text-amber-700">
                  <span>Mon - Fri</span>
                  <span className="text-amber-600">8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between text-amber-700">
                  <span>Saturday</span>
                  <span className="text-amber-600">9:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between text-amber-700">
                  <span>Sunday</span>
                  <span className="text-amber-600">10:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Footer */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-amber-700 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Debbies Cakes and Pastries. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-xs text-amber-600">
              <Link href="#" className="hover:text-amber-800 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-amber-800 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-amber-800 transition-colors">Cookie Policy</Link>
              <p className="text-purple-500 font-serif text-xl">Developed by @codebyriven</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;