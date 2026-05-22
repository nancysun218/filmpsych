# FilmPsych - replit.md

## Overview

FilmPsych is a static website for a psychology-focused content platform that explores psychological concepts through the lens of films, TV shows, literature, and other creative media. The site publishes blog articles analyzing the psychology behind popular media (movies like "The Perks of Being a Wallflower," "Turning Red," "Fight Club," TV shows like "Gilmore Girls," "Gossip Girl," "Shameless," etc.) and appears to be associated with a 501(c)(3) nonprofit organization that offers internship programs for high school students.

The website serves as both an educational resource for psychology concepts and a platform for student internship programs in visual storytelling, creative writing, and psychology research.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Static HTML Website**
- The project is a purely static website with no backend server or framework
- Each blog post is a separate standalone HTML file (blog1.html through blog39.html)
- Main landing page is index.html
- All pages share a common stylesheet (style.css) and JavaScript file (script.js)

**Design Pattern: Component-Based Styling**
- Each blog page contains its own inline `<style>` block for page-specific hero sections and layouts
- Common styles are centralized in style.css using CSS custom properties (CSS variables) for theming
- Color scheme uses soft purples, pinks, sage greens, and blues defined in :root variables

**Typography and Assets**
- Google Fonts integration: Playfair Display (headings), Inter (body text), Montserrat, Fredoka One
- Font Awesome icons via CDN
- Images stored in attached_assets/ directory

**Navigation Pattern**
- Dropdown-based navigation with JavaScript toggle functionality
- Section-based single-page navigation on the main index
- Blog posts link back to main site

### JavaScript Architecture

**Vanilla JavaScript Approach**
- No frameworks or build tools - plain ES6 JavaScript
- Event-driven architecture for navigation and dropdowns
- DOM manipulation for section visibility toggling
- Click-outside pattern for closing dropdowns

### Content Structure

**Blog Post Template Pattern**
- Each blog follows a consistent structure: hero section, container, category badge, title, meta info, content sections
- Hero sections use CSS gradients with varying color schemes per post theme
- Flexbox layouts for hero content with text and images side-by-side
- Decorative SVG patterns in pseudo-elements for texture

**Content Categories**
- Film/Movie analysis
- TV show analysis  
- Literature analysis
- Art analysis
- General psychology topics
- Internship program information

## External Dependencies

### CDN Resources
- **Google Fonts** - Typography (Playfair Display, Inter, Montserrat, Fredoka One)
- **Font Awesome 6.0.0** - Icon library via cdnjs.cloudflare.com

### Static Assets
- Images stored locally in `attached_assets/` directory
- Text content files in `attached_assets/` for blog article source material

### No Backend Dependencies
- No database
- No server-side processing
- No API integrations
- No build tools or package managers
- Pure static file hosting compatible