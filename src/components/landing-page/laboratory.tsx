import { getActiveLaboratoryServiceCategories } from "@/actions/laboratory-services";

function CategoryCard({
  name,
  services,
}: {
  name: string;
  services: string[];
}) {
  return (
    <div className="break-inside-avoid bg-white border border-slate-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-base md:text-lg text-slate-900 border-l-4 border-[#437634] pl-3 mb-3">
        {name}
      </h3>
      <ul className="space-y-1.5">
        {services.map((service) => (
          <li key={service} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#437634]" />
            {service}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function LaboratoryServicesSection() {
  const { data: categories, error } =
    await getActiveLaboratoryServiceCategories();

  if (error || !categories) {
    return (
      <section className="bg-[#f5f5f5]">
        <div className="lg:px-20 px-3 py-14">
          <div className="bg-white shadow-lg border px-6 py-8 md:px-10 md:py-10">
            <p className="text-sm text-slate-500 text-center">
              Unable to load laboratory services at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f5f5f5]">
      <div className="lg:px-20 px-3 py-14">
        <div className="bg-white shadow-lg border px-6 py-8 md:px-10 md:py-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#437634] uppercase mb-1">
                Laboratory Services
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                List of Available Laboratory Tests
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-500 max-w-2xl">
                Our in-house diagnostic laboratory offers a comprehensive range
                of tests to support accurate and timely clinical decisions.
              </p>
            </div>
            <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#e8f3eb] px-4 py-2 text-xs md:text-sm text-[#256029] border border-[#c7e2cf]">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Accredited Clinical Laboratory
            </div>
          </div>

          {/* Masonry-style columns — auto-balances regardless of content length */}
          <div className="columns-1 sm:columns-2 xl:columns-3 gap-5 space-y-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                services={category.services}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}