 const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div>
          <p className="text-sm">&copy; {new Date().getFullYear()} Grocery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
