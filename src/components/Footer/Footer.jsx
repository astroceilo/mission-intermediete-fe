import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import FooterAccordion from "./Parts/FooterAccordion";
import { footerSections } from "./FooterSections";
import logo from "../../assets/images/logo.png";


export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <footer className="w-full border border-other-border bg-white">
      <div className="w-full md:max-w-[1440px]! mx-auto flex flex-col gap-4 md:gap-5! p-5 md:px-10! lg:px-[120px]! md:py-10! lg:py-[60px]!">
        <div className="w-full flex flex-col md:flex-row md:justify-between gap-4 md:gap-5!">
          {/* Left */}
          <div className="w-fit flex flex-col gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="sr-only">Home</span>
              <img
                src={logo}
                className="w-[152px] h-[42px] md:w-[194.5px]! md:h-12! lg:w-[237px]! lg:h-14! object-contain"
                alt="Videobelajar Logo"
              />
            </Link>

            {/* Information */}
            <div className="w-fit flex flex-col gap-2 md:gap-3">
              <p className="font-dm font-bold text-sm md:text-lg leading-[1.4] tracking-[0.2px] text-text-dark-primary">
                Gali Potensi Anda Melalui Pembelajaran Video di hariesok.id!
              </p>
              <p className="font-dm font-normal text-sm md:text-base leading-[1.4] tracking-[0.2px] text-text-dark-primary">
                Jl. Usman Effendi No. 50 Lowokwaru, Malang
              </p>
              <p className="font-dm font-normal text-sm md:text-base leading-[1.4] tracking-[0.2px] text-text-dark-primary">
                +62-877-7123-1234
              </p>
            </div>
          </div>

          {/* Right or Accordion */}
          <div className="w-full flex flex-col justify-items-normal md:items-start justify-end md:flex-row gap-3 md:gap-6 lg:gap-12">
            {/* Menu Items */}
            {footerSections.map((section, index) => (
              <FooterAccordion
                key={section.title}
                title={section.title}
                links={section.items.map((item) => ({
                  label: item.name,
                  to: item.href,
                }))}
                isOpen={activeIndex === index}
                onToggle={() => toggleAccordion(index)}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="pt-auto md:pt-8">
          <hr className="border-other-border" />
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          {/* Copyright */}
          <span className="text-other-body-medium-h3 text-text-dark-secondary order-2 md:order-1">
            &copy;2023 Gerobak Sayur. All Rights Reserved.
          </span>

          {/* Socials */}
          <div className="flex gap-[15px] order-1 md:order-2">
            <Link
              to="#"
              rel="noreferrer"
              target="_blank"
              className="flex items-center justify-center size-[35px] rounded-full border border-grey-400 hover:border-main-secondary text-text-dark-primary hover:text-white hover:bg-main-secondary transition"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin size={20} strokeWidth={2} />
            </Link>

            <Link
              to="#"
              rel="noreferrer"
              target="_blank"
              className="flex items-center justify-center size-[35px] rounded-full border border-grey-400 hover:border-main-secondary text-text-dark-primary hover:text-white hover:bg-main-secondary transition"
            >
              <span className="sr-only">Facebook</span>
              <Facebook size={20} strokeWidth={2} />
            </Link>

            <Link
              to="#"
              rel="noreferrer"
              target="_blank"
              className="flex items-center justify-center size-[35px] rounded-full border border-grey-400 hover:border-main-secondary text-text-dark-primary hover:text-white hover:bg-main-secondary transition"
            >
              <span className="sr-only">Instagram</span>
              <Instagram size={20} strokeWidth={2} />
            </Link>

            <Link
              to="#"
              rel="noreferrer"
              target="_blank"
              className="flex items-center justify-center size-[35px] rounded-full border border-grey-400 hover:border-main-secondary text-text-dark-primary hover:text-white hover:bg-main-secondary transition"
            >
              <span className="sr-only">Twitter</span>
              <Twitter size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
