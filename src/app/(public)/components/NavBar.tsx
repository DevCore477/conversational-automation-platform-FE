"use client";
import { ChevronDownIcon, ChevronUpIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { CASE_STUDY_NAV_ITEMS } from "@/app/(public)/case-studies/case-study-nav";
import { PRODUCT_DROPDOWN } from "@/app/(public)/product-nav";
import { USE_CASE_NAV_ITEMS } from "@/app/(public)/use-cases/use-case-nav";
import { HamBurgerIcon, HexaRGBLogo, } from "@/assets";
import { useBreakpoint } from "@/hooks/use-breakpoint";

import Button from "./Button";
import CaseStudyDropdown from "./CaseStudyDropdown";
import NavDropdown from "./NavDropdown";
import ProductDropdown from "./ProductDropdown";

export default function NavBar() {
  const breakPoint = useBreakpoint();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCaseStudyDropdownOpen, setCaseStudyDropdownOpen] = useState(false);
  const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUseCasesExpanded, setUseCasesExpanded] = useState(false);
  const [isCaseStudiesExpanded, setCaseStudiesExpanded] = useState(false);
  const [isProductExpanded, setProductExpanded] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const useCasesButtonRef = useRef<HTMLButtonElement>(null);
  const caseStudyDropdownRef = useRef<HTMLDivElement>(null);
  const caseStudyButtonRef = useRef<HTMLButtonElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Logic: Treat everything below 'lg' (1024px) as mobile/tablet
  // This ensures 350px, 400px, and 480px all use the mobile layout.
  const isMobile = !breakPoint || ["mobile", "xs", "sm", "md"].includes(breakPoint);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        useCasesButtonRef.current &&
        !useCasesButtonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        isCaseStudyDropdownOpen &&
        caseStudyDropdownRef.current &&
        !caseStudyDropdownRef.current.contains(event.target as Node) &&
        caseStudyButtonRef.current &&
        !caseStudyButtonRef.current.contains(event.target as Node)
      ) {
        setCaseStudyDropdownOpen(false);
      }

      if (
        isProductDropdownOpen &&
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node) &&
        productButtonRef.current &&
        !productButtonRef.current.contains(event.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isDropdownOpen, isCaseStudyDropdownOpen, isProductDropdownOpen, isMobileMenuOpen]);

  const handleMobileLinkClick = (callback?: () => void) => {
    if (callback) callback();
    setMobileMenuOpen(false);
    setUseCasesExpanded(false);
    setCaseStudiesExpanded(false);
  };

  return (
    <>
      {/* Blur overlay */}
      {(isDropdownOpen || isCaseStudyDropdownOpen || isProductDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
          onClick={() => {
            setDropdownOpen(false);
            setCaseStudyDropdownOpen(false);
            setProductDropdownOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}

      <header className="font-dm-sans sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto h-[70px] px-4 md:px-8 lg:px-12">
          {/* Hamburger (Mobile/Tablet Only) */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-dark-gray"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Image src={HamBurgerIcon} width={24} height={24} alt="menu" />}
            </button>
          )}
          {/* Logo Section in Desktop*/}
          {!isMobile && (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src={HexaRGBLogo}
              className="w-[30px] md:w-[36px] h-auto cursor-pointer"
              alt="Hexa Logo"
            />
            <span className="font-medium text-lg md:text-xl text-dark-gray cursor-pointer">Hexa Ai</span>
          </div>
          )} 

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-6 xl:gap-10">
              <div className="relative" ref={productDropdownRef}>
                <button
                  ref={productButtonRef}
                  onClick={() => {
                    setProductDropdownOpen(!isProductDropdownOpen);
                    if (isDropdownOpen) setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-blue ${
                    isProductDropdownOpen ? "text-cyan-blue" : "text-slate-gray"
                  }`}
                >
                  Product
                  {isProductDropdownOpen ? (
                    <ChevronUpIcon size={16} />
                  ) : (
                    <ChevronDownIcon size={16} />
                  )}
                </button>
                <ProductDropdown
                  isOpen={isProductDropdownOpen}
                  onNavigate={() => setProductDropdownOpen(false)}
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  ref={useCasesButtonRef}
                  onClick={() => {
                    setDropdownOpen(!isDropdownOpen);
                    if (isProductDropdownOpen) setProductDropdownOpen(false);
                    if (isCaseStudyDropdownOpen) setCaseStudyDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-blue ${
                    isDropdownOpen ? "text-cyan-blue" : "text-slate-gray"
                  }`}
                >
                  Use Cases
                  {isDropdownOpen ? (
                    <ChevronUpIcon size={16} />
                  ) : (
                    <ChevronDownIcon size={16} />
                  )}
                </button>
                <NavDropdown
                  isOpen={isDropdownOpen}
                  onNavigate={() => setDropdownOpen(false)}
                />
              </div>

              <div className="relative" ref={caseStudyDropdownRef}>
                <button
                  ref={caseStudyButtonRef}
                  onClick={() => {
                    setCaseStudyDropdownOpen(!isCaseStudyDropdownOpen);
                    if (isDropdownOpen) setDropdownOpen(false);
                    if (isProductDropdownOpen) setProductDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan-blue ${
                    isCaseStudyDropdownOpen ? "text-cyan-blue" : "text-slate-gray"
                  }`}
                >
                  Case Studies
                  {isCaseStudyDropdownOpen ? (
                    <ChevronUpIcon size={16} />
                  ) : (
                    <ChevronDownIcon size={16} />
                  )}
                </button>
                <CaseStudyDropdown
                  isOpen={isCaseStudyDropdownOpen}
                  onNavigate={() => setCaseStudyDropdownOpen(false)}
                />
              </div>

              {/* <button
                onClick={() => router.push("/pricing")}
                className="text-sm font-medium text-slate-gray hover:text-cyan-blue transition-colors"
              >
                Pricing
              </button> */}
              <button
                onClick={() => router.push("/integrations")}
                className="text-sm font-medium text-slate-gray hover:text-cyan-blue transition-colors"
              >
                Integrations
              </button>
            </nav>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 md:gap-6">
            {!isMobile && (
              <button 
                onClick={() => router.push("/login")}
                className="text-sm font-medium text-dark-gray hover:text-cyan-blue transition-colors"
              >
                Login
              </button>
            )}
            
            <Button
              text="Get Hexa AI"
              backgroundColor="bg-dark-gray"
              textColor="text-white"
              borderColor="border-text-dark"
              onClick={() => router.push("/connect-us")}
              widthClass="w-full px-4 py-2"
            />

          </div>
        </div>
      </header>

      {/* MOBILE MENU - Fixed for 350px - 480px */}
      {isMobile && isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="font-dm-sans fixed inset-x-4 top-[80px] z-50 flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col gap-1">
            <button onClick={() => handleMobileLinkClick(() => router.push("/"))} className="mobile-nav-link font-semibold text-slate-gray">Home</button>
            <button
              onClick={() => setProductExpanded(!isProductExpanded)}
              className={`flex w-full items-center justify-between p-3 rounded-xl transition-colors ${
                isProductExpanded ? "bg-blue-50 text-cyan-blue" : "text-slate-gray"
              }`}
            >
              <span className="text-sm font-semibold">Product</span>
              {isProductExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </button>

            {isProductExpanded && (
              <div className="flex flex-col gap-3 mt-2 pb-2 pl-2">
                {Object.entries(PRODUCT_DROPDOWN).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-cyan-blue mt-1">
                      {category}
                    </p>
                    {items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() =>
                          handleMobileLinkClick(() => router.push(item.path))
                        }
                        className="flex items-center gap-3 p-2 pl-4 text-xs text-slate-gray hover:text-cyan-blue text-left"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-gray shrink-0" />
                        {item.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
            
            <div className="h-px bg-gray-50 my-1" />

            {/* Use Cases - Single Column Always */}
            <button
              onClick={() => setUseCasesExpanded(!isUseCasesExpanded)}
              className={`flex w-full items-center justify-between p-3 rounded-xl transition-colors ${
                isUseCasesExpanded ? "bg-blue-50 text-cyan-blue" : "text-slate-gray"
              }`}
            >
              <span className="text-sm font-semibold">Use Cases</span>
              {isUseCasesExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </button>

            {isUseCasesExpanded && (
              <div className="flex flex-col gap-1 mt-1 pb-2">
                {USE_CASE_NAV_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMobileLinkClick(() => item.href && router.push(item.href))}
                    className="flex items-center gap-3 p-3 pl-6 text-sm text-slate-gray hover:text-cyan-blue text-left"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-gray shrink-0" />
                    {item.title}
                  </button>
                ))}
              </div>
            )}

            <div className="h-px bg-gray-50 my-1" />

            {/* Case Studies - Single Column Always */}
            <button
              onClick={() => setCaseStudiesExpanded(!isCaseStudiesExpanded)}
              className={`flex w-full items-center justify-between p-3 rounded-xl transition-colors ${
                isCaseStudiesExpanded ? "bg-blue-50 text-cyan-blue" : "text-slate-gray"
              }`}
            >
              <span className="text-sm font-semibold">Case Studies</span>
              {isCaseStudiesExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
            </button>

            {isCaseStudiesExpanded && (
              <div className="flex flex-col gap-1 mt-1 pb-2">
                {CASE_STUDY_NAV_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMobileLinkClick(() => item.href && router.push(item.href))}
                    className="flex items-center gap-3 p-3 pl-6 text-sm text-slate-gray hover:text-cyan-blue text-left"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-gray shrink-0" />
                    {item.title}
                  </button>
                ))}
              </div>
            )}

            <div className="h-px bg-gray-50 my-1" />
            
            <button onClick={() => handleMobileLinkClick(() => router.push("/integrations"))} className="mobile-nav-link font-semibold text-slate-gray">Integrations</button>
            {/* <button onClick={() => handleMobileLinkClick(() => router.push("/pricing"))} className="mobile-nav-link font-semibold text-slate-gray">Pricing</button> */}
            <button 
              onClick={() => handleMobileLinkClick(() => router.push("/login"))} 
              className="mobile-nav-link text-cyan-blue font-bold"
            >
              Login
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .mobile-nav-link {
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #4b5563;
          border-radius: 0.75rem;
          transition: background-color 0.2s;
        }
        .mobile-nav-link:hover {
          background-color: #f9fafb;
        }
      `}</style>
    </>
  );
}