import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faDownload, faFilePdf, faRobot } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';

interface ExportDropdownProps {
  client: any;
  onClose: () => void;
}

export function ExportDropdown({ client, onClose }: ExportDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Generate Markdown content
  const generateMarkdown = (): string => {
    const data = client.data;
    const foundations = data.foundations || {};
    const general = foundations.general_business_information || {};
    const brand = foundations.brand_identity || {};
    const services = foundations.services_and_providers || {};
    const personality = data.personality_and_tone || {};
    const audiences = data.target_audiences || {};
    const visual = data.visual_identity || {};

    const lines: string[] = [];
    
    // Header
    lines.push(`# Brand Guidelines: ${client.client_name}`);
    lines.push('');
    lines.push(`> **Version:** ${client.current_version || '1.0'}`);
    lines.push(`> **Last Updated:** ${new Date(client.updated_at).toLocaleDateString()}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Foundations
    lines.push('## 1. Foundations');
    lines.push('');
    lines.push('### General Business Information');
    lines.push('');
    if (general.business_name) lines.push(`- **Business Name:** ${general.business_name}`);
    if (general.tagline) lines.push(`- **Tagline:** ${general.tagline}`);
    if (general.website_url) lines.push(`- **Website:** ${general.website_url}`);
    if (general.contact_page_url) lines.push(`- **Contact Page:** ${general.contact_page_url}`);
    if (general.phone_numbers?.length) lines.push(`- **Phone:** ${general.phone_numbers.join(', ')}`);
    if (general.hours_of_operation) lines.push(`- **Hours:** ${general.hours_of_operation}`);
    lines.push('');

    // Social Media
    const social = general.social_media_handles || {};
    const socialLinks = Object.entries(social).filter(([_, v]) => v);
    if (socialLinks.length > 0) {
      lines.push('**Social Media:**');
      socialLinks.forEach(([platform, url]) => {
        lines.push(`- ${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`);
      });
      lines.push('');
    }

    // Brand Identity
    lines.push('### Brand Identity');
    lines.push('');
    if (brand.mission_statement) {
      lines.push('**Mission Statement:**');
      lines.push(brand.mission_statement);
      lines.push('');
    }
    if (brand.vision_statement) {
      lines.push('**Vision Statement:**');
      lines.push(brand.vision_statement);
      lines.push('');
    }
    if (brand.brand_story) {
      lines.push('**Brand Story:**');
      lines.push(brand.brand_story);
      lines.push('');
    }
    if (brand.unique_value_proposition) {
      lines.push('**Unique Value Proposition:**');
      lines.push(brand.unique_value_proposition);
      lines.push('');
    }
    if (brand.core_values?.length) {
      lines.push('**Core Values:**');
      brand.core_values.forEach((v: string) => lines.push(`- ${v}`));
      lines.push('');
    }
    if (brand.differentiators?.length) {
      lines.push('**Differentiators:**');
      brand.differentiators.forEach((d: string) => lines.push(`- ${d}`));
      lines.push('');
    }

    // Services
    if (services.services?.length) {
      lines.push('### Services');
      lines.push('');
      services.services.forEach((s: any) => {
        if (s.page_url) {
          lines.push(`- [${s.name}](${s.page_url})`);
        } else {
          lines.push(`- ${s.name}`);
        }
      });
      lines.push('');
    }

    // Providers
    if (services.providers?.length) {
      lines.push('### Providers');
      lines.push('');
      services.providers.forEach((p: any) => {
        lines.push(`**${p.name}${p.credentials ? `, ${p.credentials}` : ''}**`);
        if (p.bio) lines.push(p.bio);
        lines.push('');
      });
    }

    // Personality & Tone (if data exists)
    if (personality.brand_personality_traits?.length || personality.voice_characteristics?.length) {
      lines.push('---');
      lines.push('');
      lines.push('## 2. Personality & Tone');
      lines.push('');
      
      if (personality.brand_personality_traits?.length) {
        lines.push('**Brand Personality Traits:**');
        personality.brand_personality_traits.forEach((t: string) => lines.push(`- ${t}`));
        lines.push('');
      }
      
      if (personality.voice_characteristics?.length) {
        lines.push('**Voice Characteristics:**');
        personality.voice_characteristics.forEach((v: string) => lines.push(`- ${v}`));
        lines.push('');
      }
    }

    // Target Audiences (if data exists)
    if (audiences.primary_audience || audiences.customer_personas?.length) {
      lines.push('---');
      lines.push('');
      lines.push('## 3. Target Audiences');
      lines.push('');
      
      if (audiences.primary_audience) {
        const primary = audiences.primary_audience;
        lines.push('### Primary Audience');
        lines.push('');
        if (primary.demographics) {
          const demo = primary.demographics;
          if (demo.age_range) lines.push(`- **Age Range:** ${demo.age_range}`);
          if (demo.gender) lines.push(`- **Gender:** ${demo.gender}`);
          if (demo.income) lines.push(`- **Income:** ${demo.income}`);
          if (demo.location) lines.push(`- **Location:** ${demo.location}`);
        }
        if (primary.pain_points?.length) {
          lines.push('');
          lines.push('**Pain Points:**');
          primary.pain_points.forEach((p: string) => lines.push(`- ${p}`));
        }
        if (primary.goals_and_motivations?.length) {
          lines.push('');
          lines.push('**Goals & Motivations:**');
          primary.goals_and_motivations.forEach((g: string) => lines.push(`- ${g}`));
        }
        lines.push('');
      }
    }

    // Visual Identity (if data exists)
    const colors = visual.color?.palette;
    if (colors?.primary?.length || colors?.secondary?.length) {
      lines.push('---');
      lines.push('');
      lines.push('## 4. Visual Identity');
      lines.push('');
      lines.push('### Color Palette');
      lines.push('');
      
      if (colors.primary?.length) {
        lines.push('**Primary Colors:**');
        colors.primary.forEach((c: any) => {
          lines.push(`- ${c.name}: ${c.hex}`);
        });
        lines.push('');
      }
      if (colors.secondary?.length) {
        lines.push('**Secondary Colors:**');
        colors.secondary.forEach((c: any) => {
          lines.push(`- ${c.name}: ${c.hex}`);
        });
        lines.push('');
      }
    }

    return lines.join('\n');
  };

  // Generate JSON content
  const generateJSON = (): string => {
    const exportData = {
      client_name: client.client_name,
      version: client.current_version,
      exported_at: new Date().toISOString(),
      data: client.data
    };
    return JSON.stringify(exportData, null, 2);
  };

  // Generate PDF content
  const generatePDF = (): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPos = 20;
    const lineHeight = 7;

    const data = client.data;
    const foundations = data.foundations || {};
    const general = foundations.general_business_information || {};
    const brand = foundations.brand_identity || {};
    const services = foundations.services_and_providers || {};
    const personality = data.personality_and_tone || {};
    const audiences = data.target_audiences || {};
    const visual = data.visual_identity || {};

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineHeight;
    };

    const addSection = (title: string) => {
      yPos += 5;
      addText(title, 14, true);
      yPos += 2;
    };

    const addSubSection = (title: string) => {
      yPos += 3;
      addText(title, 12, true);
    };

    const addBullet = (text: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(`• ${text}`, maxWidth - 5);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * lineHeight;
    };

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Brand Guidelines: ${client.client_name}`, margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Version: ${client.current_version || '1.0'} | Last Updated: ${new Date(client.updated_at).toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Foundations
    addSection('1. Foundations');
    addSubSection('General Business Information');
    if (general.business_name) addText(`Business Name: ${general.business_name}`);
    if (general.tagline) addText(`Tagline: ${general.tagline}`);
    if (general.website_url) addText(`Website: ${general.website_url}`);
    if (general.contact_page_url) addText(`Contact Page: ${general.contact_page_url}`);
    if (general.phone_numbers?.length) addText(`Phone: ${general.phone_numbers.join(', ')}`);
    if (general.hours_of_operation) addText(`Hours: ${general.hours_of_operation}`);

    // Social Media
    const social = general.social_media_handles || {};
    const socialLinks = Object.entries(social).filter(([_, v]) => v);
    if (socialLinks.length > 0) {
      addSubSection('Social Media');
      socialLinks.forEach(([platform, url]) => {
        addBullet(`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${url}`);
      });
    }

    // Brand Identity
    addSubSection('Brand Identity');
    if (brand.mission_statement) {
      addText('Mission Statement:', 10, true);
      addText(brand.mission_statement);
    }
    if (brand.vision_statement) {
      addText('Vision Statement:', 10, true);
      addText(brand.vision_statement);
    }
    if (brand.brand_story) {
      addText('Brand Story:', 10, true);
      addText(brand.brand_story);
    }
    if (brand.unique_value_proposition) {
      addText('Unique Value Proposition:', 10, true);
      addText(brand.unique_value_proposition);
    }
    if (brand.core_values?.length) {
      addText('Core Values:', 10, true);
      brand.core_values.forEach((v: string) => addBullet(v));
    }
    if (brand.differentiators?.length) {
      addText('Differentiators:', 10, true);
      brand.differentiators.forEach((d: string) => addBullet(d));
    }

    // Services
    if (services.services?.length) {
      addSubSection('Services');
      services.services.forEach((s: any) => addBullet(s.name));
    }

    // Providers
    if (services.providers?.length) {
      addSubSection('Providers');
      services.providers.forEach((p: any) => {
        addText(`${p.name}${p.credentials ? `, ${p.credentials}` : ''}`, 10, true);
        if (p.bio) addText(p.bio);
      });
    }

    // Personality & Tone
    if (personality.brand_personality_traits?.length || personality.voice_characteristics?.length) {
      addSection('2. Personality & Tone');
      if (personality.brand_personality_traits?.length) {
        addText('Brand Personality Traits:', 10, true);
        personality.brand_personality_traits.forEach((t: string) => addBullet(t));
      }
      if (personality.voice_characteristics?.length) {
        addText('Voice Characteristics:', 10, true);
        personality.voice_characteristics.forEach((v: string) => addBullet(v));
      }
    }

    // Target Audiences
    if (audiences.primary_audience || audiences.customer_personas?.length) {
      addSection('3. Target Audiences');
      if (audiences.primary_audience) {
        const primary = audiences.primary_audience;
        addSubSection('Primary Audience');
        if (primary.demographics) {
          const demo = primary.demographics;
          if (demo.age_range) addBullet(`Age Range: ${demo.age_range}`);
          if (demo.gender) addBullet(`Gender: ${demo.gender}`);
          if (demo.income) addBullet(`Income: ${demo.income}`);
          if (demo.location) addBullet(`Location: ${demo.location}`);
        }
        if (primary.pain_points?.length) {
          addText('Pain Points:', 10, true);
          primary.pain_points.forEach((p: string) => addBullet(p));
        }
        if (primary.goals_and_motivations?.length) {
          addText('Goals & Motivations:', 10, true);
          primary.goals_and_motivations.forEach((g: string) => addBullet(g));
        }
      }
    }

    // Visual Identity
    const colors = visual.color?.palette;
    if (colors?.primary?.length || colors?.secondary?.length) {
      addSection('4. Visual Identity');
      addSubSection('Color Palette');
      if (colors.primary?.length) {
        addText('Primary Colors:', 10, true);
        colors.primary.forEach((c: any) => addBullet(`${c.name}: ${c.hex}`));
      }
      if (colors.secondary?.length) {
        addText('Secondary Colors:', 10, true);
        colors.secondary.forEach((c: any) => addBullet(`${c.name}: ${c.hex}`));
      }
    }

    return doc;
  };

  // Generate AI Prompt - general purpose prompt for any AI tool
  const generateAIPrompt = (): string => {
    const data = client.data;
    const foundations = data.foundations || {};
    const general = foundations.general_business_information || {};
    const brand = foundations.brand_identity || {};
    const services = foundations.services_and_providers || {};
    const personality = data.personality_and_tone || {};
    const audiences = data.target_audiences || {};

    const brandName = general.business_name || client.client_name;
    const lines: string[] = [];

    lines.push(`Here are the brand guidelines for ${brandName}:`);
    lines.push('');

    // Basic Info
    if (general.tagline) lines.push(`Tagline: "${general.tagline}"`);
    if (general.website_url) lines.push(`Website: ${general.website_url}`);
    lines.push('');

    // Brand Identity
    if (brand.mission_statement) {
      lines.push(`Mission: ${brand.mission_statement}`);
      lines.push('');
    }
    if (brand.vision_statement) {
      lines.push(`Vision: ${brand.vision_statement}`);
      lines.push('');
    }
    if (brand.unique_value_proposition) {
      lines.push(`Value Proposition: ${brand.unique_value_proposition}`);
      lines.push('');
    }
    if (brand.core_values?.length) {
      lines.push(`Core Values: ${brand.core_values.join(', ')}`);
      lines.push('');
    }
    if (brand.differentiators?.length) {
      lines.push(`Differentiators: ${brand.differentiators.join(', ')}`);
      lines.push('');
    }

    // Services
    if (services.services?.length) {
      lines.push(`Services: ${services.services.map((s: any) => s.name).join(', ')}`);
      lines.push('');
    }

    // Personality & Voice
    if (personality.brand_personality_traits?.length) {
      lines.push(`Brand Personality: ${personality.brand_personality_traits.join(', ')}`);
      lines.push('');
    }
    if (personality.voice_characteristics?.length) {
      lines.push(`Voice Characteristics: ${personality.voice_characteristics.join(', ')}`);
      lines.push('');
    }
    if (personality.language_guidelines?.words_to_avoid?.length) {
      lines.push(`Words to Avoid: ${personality.language_guidelines.words_to_avoid.join(', ')}`);
      lines.push('');
    }
    if (personality.language_guidelines?.preferred_terminology?.length) {
      const terms = personality.language_guidelines.preferred_terminology
        .filter((t: any) => t.use && t.instead_of)
        .map((t: any) => `"${t.use}" instead of "${t.instead_of}"`)
        .join('; ');
      if (terms) {
        lines.push(`Preferred Terminology: ${terms}`);
        lines.push('');
      }
    }

    // Target Audience
    if (audiences.primary_audience?.demographics) {
      const demo = audiences.primary_audience.demographics;
      const demoInfo = [demo.age_range, demo.gender, demo.income, demo.location].filter(Boolean);
      if (demoInfo.length) {
        lines.push(`Target Audience: ${demoInfo.join(' | ')}`);
        lines.push('');
      }
    }
    if (audiences.primary_audience?.pain_points?.length) {
      lines.push(`Customer Pain Points: ${audiences.primary_audience.pain_points.join(', ')}`);
      lines.push('');
    }

    return lines.join('\n').trim();
  };

  // Download file helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  // Copy to clipboard helper
  const copyToClipboard = async (content: string, format: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${format} copied to clipboard`);
      onClose();
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleExportMarkdown = () => {
    const markdown = generateMarkdown();
    const version = client.current_version || '1.0';
    const filename = `${client.client_name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines-v${version}.md`;
    downloadFile(markdown, filename, 'text/markdown');
  };

  const handleCopyMarkdown = () => {
    const markdown = generateMarkdown();
    copyToClipboard(markdown, 'Markdown');
  };

  const handleExportJSON = () => {
    const json = generateJSON();
    const version = client.current_version || '1.0';
    const filename = `${client.client_name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines-v${version}.json`;
    downloadFile(json, filename, 'application/json');
  };

  const handleCopyJSON = () => {
    const json = generateJSON();
    copyToClipboard(json, 'JSON');
  };

  const handleExportPDF = () => {
    const doc = generatePDF();
    const version = client.current_version || '1.0';
    const filename = `${client.client_name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines-v${version}.pdf`;
    doc.save(filename);
    onClose();
  };

  const handleCopyAIPrompt = () => {
    const prompt = generateAIPrompt();
    copyToClipboard(prompt, 'AI prompt');
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-1 w-64 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50"
    >
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          Markdown
        </div>
        <button
          onClick={handleExportMarkdown}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-[#6B7280]" />
          Download .md file
        </button>
        <button
          onClick={handleCopyMarkdown}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faCopy} className="w-4 h-4 text-[#6B7280]" />
          Copy to clipboard
        </button>
        
        <div className="my-2 border-t border-[#E5E7EB]" />
        
        <div className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          JSON
        </div>
        <button
          onClick={handleExportJSON}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faDownload} className="w-4 h-4 text-[#6B7280]" />
          Download .json file
        </button>
        <button
          onClick={handleCopyJSON}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faCopy} className="w-4 h-4 text-[#6B7280]" />
          Copy to clipboard
        </button>

        <div className="my-2 border-t border-[#E5E7EB]" />

        <div className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          PDF
        </div>
        <button
          onClick={handleExportPDF}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4 text-[#6B7280]" />
          Download .pdf file
        </button>

        <div className="my-2 border-t border-[#E5E7EB]" />

        <div className="px-3 py-2 text-xs font-medium text-[#6B7280] uppercase tracking-wide">
          AI Prompt
        </div>
        <button
          onClick={handleCopyAIPrompt}
          className="w-full px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F3F4F6] rounded-md flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faRobot} className="w-4 h-4 text-[#6B7280]" />
          Copy to clipboard
        </button>
      </div>
    </div>
  );
}
