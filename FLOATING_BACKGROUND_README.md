# Floating Background Animation

A multi-layer floating background animation system similar to the GPT-5 introduction page, adapted to the neon theme of your chess trainer website.

## Features

### 🎨 **Multi-Layer Animation**
- **5 distinct layers** with different characteristics
- **18 floating shapes** (3-4 per layer)
- **Parallax depth effect** through varying speeds and sizes
- **Smooth, randomized movement** in both X and Y directions

### 🌈 **Theme-Aware Design**
- **Neon Theme**: Bright, vibrant neon colors (yellow, pink, green, orange, purple, red, magenta, lime, violet, coral, cyan)
- **Dark Theme**: Electric cyan, sea green, bright cyan, aqua, coral pink accents
- **Light Theme**: Warm orange, coral, amber, yellow tones
- **Zen Theme**: Soft blue, indigo, purple, brown, green accents

### ⚡ **Performance Optimized**
- **GPU acceleration** using CSS `translate3d` transforms
- **60 FPS frame rate limiting** for smooth performance
- **Hardware acceleration** with `will-change: transform`
- **Responsive design** that adapts to all screen sizes
- **Reduced motion support** for accessibility

### 🎭 **Visual Effects**
- **Varying blur radiuses** (15px - 50px) for depth
- **Dynamic opacity levels** (8% - 45%) for subtlety
- **Smooth rotation** and **scaling animations**
- **Pulsing effects** with sine wave calculations
- **Organic noise texture** overlay for authenticity
- **Gradient overlays** for additional depth

## Implementation

### Component Structure

```tsx
components/FloatingBackground.tsx
├── FloatingShape interface
├── Theme-specific color palettes
├── 5-layer shape generation
├── Performance-optimized animation loop
├── GPU-accelerated transforms
└── Responsive design handling
```

### CSS Enhancements

```css
app/globals.css
├── GPU acceleration classes
├── Theme-specific floating effects
├── Responsive adjustments
├── Accessibility features
└── Performance optimizations
```

### Integration

```tsx
app/layout.tsx
├── FloatingBackground component
├── Global theme provider
└── Responsive layout system
```

## Usage

### 1. **Automatic Integration**
The floating background is automatically active across your entire application when you import the `FloatingBackground` component in your layout.

### 2. **Theme Switching**
Users can switch between themes using the theme toggle, and the background will automatically adapt:
- **Neon**: Bright, vibrant neon shapes
- **Dark**: Electric cyan and sea green accents
- **Light**: Warm orange and coral tones
- **Zen**: Calming blue and purple hues



## Technical Details

### Animation Loop
```tsx
const animate = useCallback((currentTime: number) => {
  // 60 FPS limiting
  if (currentTime - lastTimeRef.current < 16.67) {
    animationRef.current = requestAnimationFrame(animate)
    return
  }
  
  // Update shape positions, rotation, scale, and pulse
  shapes.forEach((shape) => {
    shape.x += shape.speedX
    shape.y += shape.speedY
    shape.rotation += shape.rotationSpeed
    // ... more updates
  })
  
  // GPU-accelerated DOM updates
  element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`
}, [])
```

### Shape Generation
```tsx
for (let i = 0; i < 18; i++) {
  const layer = Math.floor(i / 3.6) // 5 layers
  const baseSize = 60 + (layer * 50) // Layer 0: 60px, Layer 1: 110px, etc.
  const baseBlur = 15 + (layer * 20) // Layer 0: 15px, Layer 1: 35px, etc.
  const baseOpacity = 0.45 - (layer * 0.08) // Layer 0: 0.45, Layer 1: 0.37, etc.
  const baseSpeed = 0.15 + (layer * 0.12) // Layer 0: 0.15, Layer 1: 0.27, etc.
}
```

### Performance Features
- **`willChange: 'transform'`** for GPU acceleration
- **`translate3d()`** for hardware acceleration
- **Frame rate limiting** to 60 FPS
- **Debounced resize handling**
- **Memoized gradient calculations**

## Customization

### Adding New Themes
1. Add theme colors to `getThemeColors()` function
2. Add CSS variables in `globals.css`
3. Create theme-specific animations

### Adjusting Animation Parameters
- **Shape count**: Modify the loop in `useEffect`
- **Movement speed**: Adjust `baseSpeed` calculations
- **Blur intensity**: Modify `baseBlur` values
- **Opacity levels**: Change `baseOpacity` ranges

### Performance Tuning
- **Shape count**: Reduce for lower-end devices
- **Animation complexity**: Simplify for mobile
- **Blur effects**: Reduce blur radius for performance

## Browser Support

- **Modern browsers**: Full support with GPU acceleration
- **Older browsers**: Graceful fallback with reduced effects
- **Mobile devices**: Optimized performance with responsive adjustments
- **Accessibility**: Respects `prefers-reduced-motion` setting

## Accessibility

- **Reduced motion**: Automatically disables animations when preferred
- **Screen readers**: Background marked as `aria-hidden="true"`
- **Performance**: Adapts to device capabilities
- **Focus management**: No interference with keyboard navigation

## Future Enhancements

- **Interactive shapes**: Click to interact with floating elements
- **Sound effects**: Subtle audio feedback for theme changes
- **Advanced patterns**: More complex shape geometries
- **Performance monitoring**: Real-time FPS and performance metrics
- **Custom themes**: User-defined color palettes

## Troubleshooting

### Common Issues

1. **Shapes not visible**: Check z-index and opacity settings
2. **Performance issues**: Reduce shape count or blur intensity
3. **Theme not changing**: Verify theme provider integration
4. **Mobile lag**: Check responsive performance settings

### Debug Mode
Enable debug logging by adding console logs in the animation loop:
```tsx
console.log('Frame:', frameCountRef.current, 'FPS:', 1000 / (currentTime - lastTimeRef.current))
```

## Credits

- **Inspiration**: GPT-5 introduction page design
- **Performance**: CSS transforms and GPU acceleration techniques
- **Accessibility**: WCAG guidelines and reduced motion support
- **Theme System**: Integration with existing next-themes setup

---

The floating background animation creates a subtle, engaging visual experience that enhances your chess trainer website without compromising performance or accessibility. Each theme provides a unique atmosphere while maintaining the professional, modern aesthetic of your application.
