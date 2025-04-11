import { cn } from "@/lib/utils";

interface NavTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function NavTabs({ activeTab, onTabChange }: NavTabsProps) {
  const tabs = [
    { id: "warnings", label: "Warnings" },
    { id: "usage", label: "Usage & Instructions" },
    { id: "dosage", label: "Dosage" },
    { id: "side-effects", label: "Side Effects" },
    { id: "interactions", label: "Drug Interactions" }
  ];

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Medication information tabs">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={cn(
              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
              activeTab === tab.id
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(tab.id);
            }}
          >
            {tab.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
