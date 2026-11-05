import { FaBolt, FaClapperboard, FaClock, FaMagnifyingGlass } from "react-icons/fa6";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: FaMagnifyingGlass,
    title: "Discover Spaces",
    text: "Search by category, price and location to find a studio that fits your project.",
  },
  {
    icon: FaClock,
    title: "Select Shoot Hours",
    text: "Pick a date and your start and end time. Availability is checked for you.",
  },
  {
    icon: FaBolt,
    title: "Book Instantly",
    text: "Send your reservation in one click and see the total price before you confirm.",
  },
  {
    icon: FaClapperboard,
    title: "Create & Produce",
    text: "Show up, set up and focus on the work while the host takes care of the space.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16">
      <SectionHeading
        title="How Booking Works"
        subtitle="From first search to final take in four simple steps."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className="relative flex h-full flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-6"
          >
            <span className="absolute right-4 top-3 text-5xl font-bold text-primary/15">
              {i + 1}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-primary-content">
              <Icon />
            </span>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm opacity-70">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}