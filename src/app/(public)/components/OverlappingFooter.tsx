import Image from "next/image";
import Link from "next/link";

import {
  FacebookIcon,
  FooterGif,
  HexaFooterText,
  HexaRGBLogo,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/assets";

import EmailSubmitForm from "./EmailSubmitForm";

export default function OverlappingFooter() {
  const SOCIALS = [
    { icon: FacebookIcon, href: "https://www.facebook.com/share/1GYJuo89Ab/" },
    { icon: InstagramIcon, href: "https://www.instagram.com/gethexa.ai/" },
    { icon: LinkedinIcon, href: "https://www.linkedin.com/company/gethexai/" },
    { icon: XIcon, href: "https://x.com/GethexaAi" },
  ];

  const FOOTER_LINKS = [
    {
      title: "Company",
      links: [
        { title: "About", href: "/about-us" },
        { title: "How We Work", href: "/how-we-work" },
        { title: "Multilingual Support", href: "/multilingual-support" },
        { title: "Blogs", href: "/blog" },
        { title: "Careers", href: "/careers" },
        { title: "Contact", href: "/connect-us" },
      ],
    },
    {
      title: "Legal",
      links: [
        // { title: "Trust Center", onClick: () => {} },
        { title: "Terms of Service", href: "/terms-of-service" },
        { title: "Privacy Policy", href: "/privacy-policy" },
      ],
    },
    {
      title: "Use Cases",
      links: [
        { title: "AI Receptionist", href: "/use-cases/receptionist" },
        { title: "Automated Customer Feedback", href: "/use-cases/customer-feedback" },
        { title: "Automatic Ordering & Reordering", href: "/use-cases/automated-orders" },
        { title: "Customer Support & Call Centers", href: "/use-cases/customer-support" },
        { title: "Healthcare & Clinics", href: "/use-cases/healthcare" },
        { title: "Sales & Lead Generation", href: "/use-cases/sales" },
        { title: "Banking & Financial Services", href: "/use-cases/banking" },
        { title: "Real Estate", href: "/use-cases/real-estate" },
        { title: "Logistics & Delivery Services", href: "/use-cases/logistics" },
        { title: "Education & Training Platforms", href: "/use-cases/education" },
      ],
    },
  ];

  return (
    <div className="font-dm-sans relative min-h-screen bg-white py-16">
      {/* Fullscreen GIF Section */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={FooterGif}
          alt="footer-animation"
          layout="fill"
          className="object-cover opacity-20"
        />
      </div>

      {/* "Hexa Ai" text centered */}
      <div className="flex items-center justify-center">
        <Image src={HexaFooterText} alt="hexa-text" />
      </div>

      {/* Footer Content with Overlapping Effect */}
      <div className="relative z-10 flex flex-col gap-12 lg:gap-20 w-full max-w-7xl mx-auto px-6 md:px-16 overflow-hidden mt-12 lg:mt-20">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex flex-col gap-3 lg:gap-6 4xl:gap-10">
            <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src={HexaRGBLogo}
                className="w-[36px] 4xl:w-[40px] h-[24px] 4xl:h-[28px]"
                alt="hexa-rgb"
              />
              <p className="font-medium text-2xl 4xl:text-[26px] text-dark-gray">
                Hexa Ai
              </p>
            </div>
            </Link>
            <div className="flex flex-col gap-1 lg:gap-4">
              <p className="text-xs lg:text-sm 4xl:text-base text-slate-gray">
                Subscribe to our newsletter for our product updates
              </p>
              <EmailSubmitForm />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            {SOCIALS.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Hexa AI social profile"
              >
                <Image
                  src={social.icon}
                  alt="social clicked"
                  className="cursor-pointer size-8  4xl:size-9"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-12 lg:flex flex-row gap-6 lg:gap-0 justify-between">
          {FOOTER_LINKS.map((footer, index) => (
            <div key={index} className={`flex flex-col gap-2 lg:gap-5 4xl:gap-7 ${index === 2 ? "col-span-2 lg:col-auto" : "" }`}>
              <p className="text-lg lg:text-lg 2xl:text-xl 4xl:text-2xl text-dark-gray mb-1">
                {footer.title}
              </p>
              {footer.links.map((link, index) => (
                <Link
                  href={link.href}
                  key={`${link.title}-${index}`}
                  className="text-base lg:text-base 4xl:text-lg text-slate-gray cursor-pointer text-start"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <p className="text-dark-gray text-sm text-center md:text-left">
          Copyright @ Hexa Ai️. All Rights Reserved
        </p>
      </div>
    </div>
  );
}
