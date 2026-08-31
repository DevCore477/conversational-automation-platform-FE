import SupplierImg from "@/assets/Product/Navigate IVR/Supplier.png";
import PrescriptionImg from "@/assets/Product/Navigate IVR/Prescription.webp";
import QuotationImg from "@/assets/Product/Navigate IVR/Quotation.png";

const WhenUseNavigateIVR = () => {
  const useCases = [
    {
      category: "B2B Sales",
      title: "Supplier Communication",
      description:
        "AI agents contacting suppliers for order updates, inventory checks, need navigates IVR systems to reach certain departments.",
      image: SupplierImg,
    },
    {
      category: "Healthcare",
      title: "Prescription Verification",
      description:
        "AI agents contacting pharmacies to verify prescriptions, request refills, need to navigates IVR to reach the department.",
      image: PrescriptionImg,
    },
    {
      category: "Financial",
      title: "Request for Quotation",
      description:
        "AI agents following up on Request for Quotation, or delivery timelines. They will need to route to right department.",
      image: QuotationImg,
    },
  ];

  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 text-center lg:text-left tracking-tight">
          When to use navigate IVR?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="flex flex-col p-4 bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              {/* Image Container */}
              <div className="h-[240px] lg:h-[170px] overflow-hidden  rounded-xl">
                <img
                  src={useCase.image.src}
                  alt={useCase.title}
                  className="w-full h-full lg: object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className=" pb-4 mt-5 flex flex-col">
                <span className="text-[11px] text-slate-gray mb-2 block uppercase tracking-wide">
                  {useCase.category}
                </span>
                <h3 className="text-[16px] 2xl:text-xl 4xl:text-2xl text-dark-gray mb-3 leading-snug tracking-tight">
                  {useCase.title}
                </h3>
                <p className="text-slate-gray text-xs 2xl:text-sm 4xl:text-base leading-relaxed mb-4">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhenUseNavigateIVR;
