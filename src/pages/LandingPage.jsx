import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Footer from "../components/Footer";
import LaunchRoomModal from "../components/landing/LaunchRoomModal";

export default function LandingPage({ onCreateRoom, onJoinRoom }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-brand-black text-brand-white flex flex-col selection:bg-brand-red selection:text-brand-white">
      {/* Navbar with working CTA */}
      <Navbar onStartWatchingClick={openModal} />

      <main className="flex-1">
        {/* Hero Section with working "Lets KinoFlow" CTA */}
        <HeroSection onStartWatchingClick={openModal} />

        {/* Timeline */}
        <HowItWorks />

        {/* Features */}
        <Features />
      </main>

      {/* Footer with working "Launch Watch Party" button */}
      <Footer onStartWatchingClick={openModal} />

      {/* The Launch Modal */}
      <LaunchRoomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreateRoom={(nickname) => {
          closeModal();
          onCreateRoom(nickname);
        }}
        onJoinRoom={(nickname, code) => {
          closeModal();
          onJoinRoom(nickname, code);
        }}
      />
    </div>
  );
}
