import {
  FaHeadset,
  FaScrewdriverWrench,
  FaShieldHalved,
  FaUserCheck,
} from "react-icons/fa6";
import SectionHeading from "@/components/ui/SectionHeading";

const ITEMS = [
  {
    icon: FaShieldHalved,
    title: "Liability Protection",
    text: "Every booking is backed by clear terms and a security deposit that protects hosts and guests.",
  },
  {
    icon: FaUserCheck,
    title: "Verified Profiles",
    text: "Hosts and creators sign in with authenticated accounts, so you always know who you are working with.",
  },
  {
    icon: FaScrewdriverWrench,
    title: "Equipment Safety",
    text: "Listings state the gear and amenities up front, and hosts keep their equipment in working order.",
  },
  {
    icon: FaHeadset,
    title: "24/7 Host Support",
    text: "Our support team is available around the clock to help with bookings, changes and questions.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="bg-base-200 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Host Guarantee & Creator Support"
          subtitle="Book and host with confidence. We have your back at every step."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex h-full flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-xl text-secondary">
                <Icon />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm opacity-70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}