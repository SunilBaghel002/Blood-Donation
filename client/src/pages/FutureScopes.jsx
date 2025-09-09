import React from "react";
import { Heart, ChevronRight, ArrowUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FutureScopes = () => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const futureScopes = [
    {
      title: "Plasma and Platelet Management",
      description:
        "Expand BloodChain to track and manage plasma and platelet donations, ensuring efficient allocation for critical treatments like cancer and surgeries.",
    },
    {
      title: "Organ Donation Tracking",
      description:
        "Integrate organ donation management, using blockchain to ensure ethical, transparent, and secure organ allocation processes.",
    },
    {
      title: "Vaccine Distribution",
      description:
        "Enable secure tracking of vaccine supply chains, ensuring authenticity and timely delivery during pandemics or routine immunizations.",
    },
    {
      title: "Global Healthcare Integration",
      description:
        "Partner with global health organizations to integrate BloodChain into international healthcare systems for unified resource management.",
    },
    {
      title: "AI-Powered Predictive Analytics",
      description:
        "Incorporate AI to predict blood demand, optimize inventory, and alert donors during shortages, enhancing emergency preparedness.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hover-lift {
          0% {
            transform: translateY(0);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          100% {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .hover-lift:hover {
          animation: hover-lift 0.3s ease-out forwards;
        }
      `}</style>

      <Navbar />

      {/* Header */}
      <section className="py-16 bg-red-600 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in">
            The <span className="text-yellow-300">Future</span> of BloodChain
          </h1>
          <p
            className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Discover how BloodChain plans to revolutionize global healthcare
            with blockchain technology.
          </p>
        </div>
      </section>

      {/* Future Scopes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Our Vision for Tomorrow
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain is more than blood donation—it's a platform for
            transforming healthcare resource management worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureScopes.map((scope, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Heart className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">
                  {scope.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {scope.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
            Join Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in">
            Be part of BloodChain’s journey to transform healthcare with
            blockchain.
          </p>
          <a
            href="/signup"
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center mx-auto hover-lift"
          >
            Get Involved <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      <Footer />

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all hover-lift ${
          scrollY > 300 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FutureScopes;
