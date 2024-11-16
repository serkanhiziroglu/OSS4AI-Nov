export const parseResume = (text) => {
    try {
      // Remove PDF artifacts and weird characters
      text = text.replace(/%PDF-.*?endstream/gs, ''); // Remove PDF header
      text = text.replace(/[^\x20-\x7E\n]/g, ''); // Remove non-printable characters
      
      // Convert text to lines and remove empty lines
      const lines = text.split('\n').filter(line => line.trim());
      
      const sections = {
        contact: {},
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
      };
  
      let currentSection = null;
      let currentEntry = {};
  
      for (const line of lines) {
        const cleanLine = line.trim();
        
        // Skip empty lines or PDF artifacts
        if (!cleanLine || cleanLine.includes('obj') || cleanLine.includes('endobj')) {
          continue;
        }
  
        // Detect sections
        if (cleanLine.match(/^(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS)/i)) {
          currentSection = cleanLine.toLowerCase();
          continue;
        }
  
        // Process lines based on current section
        if (currentSection) {
          switch (currentSection) {
            case 'education':
              if (cleanLine.includes('|')) {
                if (currentEntry.school) {
                  sections.education.push(currentEntry);
                }
                const [school, degree, year] = cleanLine.split('|').map(s => s.trim());
                currentEntry = { school, degree, year };
              }
              break;
  
            case 'experience':
              if (cleanLine.match(/^[\d]{4}/)) {
                if (currentEntry.company) {
                  sections.experience.push(currentEntry);
                }
                currentEntry = { 
                  period: cleanLine,
                  details: []
                };
              } else if (currentEntry.period) {
                if (!currentEntry.company) {
                  currentEntry.company = cleanLine;
                } else {
                  currentEntry.details.push(cleanLine);
                }
              }
              break;
  
            case 'skills':
              sections.skills.push(cleanLine);
              break;
  
            case 'projects':
              if (cleanLine.match(/^[•\-\*]/)) {
                if (currentEntry.name) {
                  sections.projects.push(currentEntry);
                }
                currentEntry = { 
                  name: cleanLine.replace(/^[•\-\*]\s*/, ''),
                  details: []
                };
              } else if (currentEntry.name) {
                currentEntry.details.push(cleanLine);
              }
              break;
  
            case 'certifications':
              sections.certifications.push(cleanLine);
              break;
          }
        } else {
          // Assume contact info if no section is identified
          if (cleanLine.match(/^[A-Z]/)) {
            if (!sections.contact.name) {
              sections.contact.name = cleanLine;
            }
          } else if (cleanLine.includes('@')) {
            sections.contact.email = cleanLine;
          } else if (cleanLine.match(/[\d-()]/)) {
            sections.contact.phone = cleanLine;
          }
        }
      }
  
      // Add last entry if exists
      if (currentEntry && Object.keys(currentEntry).length > 0) {
        if (currentSection === 'education') sections.education.push(currentEntry);
        if (currentSection === 'experience') sections.experience.push(currentEntry);
        if (currentSection === 'projects') sections.projects.push(currentEntry);
      }
  
      return sections;
    } catch (error) {
      console.error('Error parsing resume:', error);
      return null;
    }
  };