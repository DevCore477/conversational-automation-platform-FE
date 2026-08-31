import Image from "next/image";
import Link from "next/link";

import { HeroGroupImgLg, HeroGroupImgSm, HexaRGBLogo } from "@/assets";

const CareersHero = () => {
  return (
    <>
      <div className="font-dm-sans relative w-full max-w-7xl mx-auto px-6 md:px-16 pb-12 md:pb-16 lg:pb-24 ">
        <div className="flex flex-col items-center py-10 lg:py-20 4xl:py-32">
          <Link href="/" className="flex md:hidden items-center gap-2 cursor-pointer mb-3">
            <Image src={HexaRGBLogo} width={60} height={40} alt="Hexa Logo" />
          </Link>
          <h1 className='text-[28px] md:text-3xl lg:text-5xl 2xl:text-6xl 4xl:text-7xl font-medium bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent lg:mb-4'>
            Join Our Team
          </h1>
          <p className="text-slate-gray font-light text-center text-lg lg:text-xl w-full max-w-2xl">
            Join a team where passion meets purpose. Discover a career where your contributions are valued and where you can truly make a difference.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={HeroGroupImgSm}
            className="md:hidden h-auto "
            alt="Hexa Logo"
          />
        </div>
        <div className="">
          <Image
            src={HeroGroupImgLg}
            className="hidden md:flex h-auto "
            alt="Hexa Logo"
          />
        </div>
      </div>
    </>
  )
}

export default CareersHero