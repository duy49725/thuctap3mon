import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react'; // Import icon từ Lucide
import { Button } from '@/components/ui/button'; // Sử dụng ShadCN cho button

const ShoppingFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-6">
        {/* Logo và slogan */}
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl font-bold">BookStore</h1>
          <p className="text-sm mt-2">Find your next favorite book here.</p>
        </div>

        {/* Navigation Links */}
        <div className="mb-6 lg:mb-0">
          <ul className="flex space-x-6 text-sm">
            <li><a href="/about" className="hover:text-gray-400">About Us</a></li>
            <li><a href="/contact" className="hover:text-gray-400">Contact</a></li>
            <li><a href="/faq" className="hover:text-gray-400">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-gray-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Button variant="ghost" className="text-white hover:text-gray-400">
            <Facebook size={24} />
          </Button>
          <Button variant="ghost" className="text-white hover:text-gray-400">
            <Twitter size={24} />
          </Button>
          <Button variant="ghost" className="text-white hover:text-gray-400">
            <Instagram size={24} />
          </Button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 BookStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default ShoppingFooter;
