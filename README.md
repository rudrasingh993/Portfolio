

## ✨ Features

- **Museum-Quality Design**: Inspired by Louvre aesthetics
- **Light/Dark Theme Toggle**: Smooth transitions with elegant animations  
- **Fully Responsive**: Perfect on all devices from mobile to desktop
- **Interactive Elements**: 3D profile frame, typing animations, scroll effects
- **Professional Typography**: Playfair Display + Inter + Crimson Pro
- **Smooth Animations**: CSS custom properties with elegant transitions
- **Contact Form**: Built-in validation with professional feedback
- **SEO Optimized**: Semantic HTML with proper meta tags

```

### Step 4: Customize Your Portfolio
Open the files in your favorite code editor and customize:


#### `styles.css` - Customize Colors:
```css
:root {
    /* Change accent colors to match your brand */
    --accent-primary: #your-color;
    --accent-secondary: #your-color;
    --accent-tertiary: #your-color;
}
```

## 📁 File Structure

```
museum-portfolio-template/
│
├── index.html          # Main HTML file
├── styles.css          # All styling (museum-quality CSS)
├── script.js           # Interactive functionality
└── README.md          # This file
```

## 🎨 Customization Guide

### Colors
The template uses CSS custom properties. Change the accent colors in `:root`:
```css
--accent-primary: #8b6f47;    /* Warm Bronze */
--accent-secondary: #6b5b73;  /* Muted Aubergine */  
--accent-tertiary: #7c8471;   /* Sage Green */
```

### Typography  
Three font families are used:
- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)
- **Accents**: Crimson Pro (readable serif)

### Sections
- **Hero**: Your introduction and main CTA
- **About**: Your story in three cards + skills notebook
- **Projects**: Showcase your best work
- **Skills**: Technical skills with progress bars
- **Contact**: Contact form + your information

### Theme Toggle
The light/dark theme toggle is fully functional. Colors automatically adjust using CSS custom properties.

## 🛠️ Development Tips

### Adding New Sections
Follow the existing pattern:
```html
<section id="new-section" class="new-section">
    <div class="container">
        <div class="section-header">
            <div class="section-number">05</div>
            <h2 class="section-title">
                <span class="title-word">New</span>
                <span class="title-word">Section</span>
            </h2>
        </div>
        <!-- Your content -->
    </div>
</section>
```

### Adding Animations
Use the `.fade-in` class on elements you want to animate on scroll:
```html
<div class="my-element fade-in">Content</div>
```

### Performance
- All animations use `transform` and `opacity` for smooth 60fps performance
- Images are optimized with proper `loading="lazy"` where appropriate
- CSS uses efficient selectors and minimal repaints

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

Found a bug or want to contribute? 

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Created By

**Rudra Pratap Singh** 

## 🙏 Acknowledgments

- Inspired by Harvey.ai's clean aesthetics
- Museum design principles from Louvre's digital presence
- Typography choices inspired by editorial design
- Color palette based on warm, professional tones

---

**⭐ If this template helped you create an amazing portfolio, don't forget to star this repository!**

Happy coding! 🚀
