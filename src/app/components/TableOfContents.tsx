import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faXmark } from '@fortawesome/free-solid-svg-icons';

export interface TocSection {
  id: string;
  title: string;
  ref: React.RefObject<HTMLDivElement | null>;
}

interface TableOfContentsProps {
  sections: TocSection[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onSectionClick: (sectionId: string) => void;
  expandedSections: Set<string>;
}

export function TableOfContents({
  sections,
  scrollContainerRef,
  onSectionClick,
  expandedSections,
}: TableOfContentsProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsMobileOpen(false);

    // Scroll to section after a brief delay to allow accordion to open
    setTimeout(() => {
      const section = sections.find((s) => s.id === sectionId);
      if (section?.ref.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const sectionTop = section.ref.current.offsetTop;
        container.scrollTo({
          top: sectionTop - 24,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const tocContent = (
    <nav className="space-y-1">
      <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
        On this page
      </h4>
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);

        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className="w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]"
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isExpanded ? 'bg-[#4074A8]' : 'bg-[#D1D5DB]'
                }`}
              />
              {section.title}
            </span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop: Sticky sidebar within content area */}
      <div className="hidden lg:block w-48 flex-shrink-0">
        <div className="sticky top-8">{tocContent}</div>
      </div>

      {/* Mobile: Floating button + dropdown */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        {isMobileOpen && (
          <div className="absolute bottom-14 right-0 w-56 bg-white border border-[#E5E7EB] rounded-lg shadow-lg p-4 mb-2">
            {tocContent}
          </div>
        )}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-12 h-12 bg-[#4074A8] text-white rounded-full shadow-lg hover:bg-[#2D5276] transition-colors flex items-center justify-center"
          aria-label={isMobileOpen ? 'Close table of contents' : 'Open table of contents'}
        >
          <FontAwesomeIcon icon={isMobileOpen ? faXmark : faList} className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}

