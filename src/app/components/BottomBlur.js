import styles from './BottomBlur.module.scss'

const LAYERS = [
  { blur: 0.25, mask: 'linear-gradient(to bottom, transparent 0%, #000 12.5%, #000 25%, transparent 37.5%)' },
  { blur: 0.5, mask: 'linear-gradient(to bottom, transparent 12.5%, #000 25%, #000 37.5%, transparent 50%)' },
  { blur: 1, mask: 'linear-gradient(to bottom, transparent 25%, #000 37.5%, #000 50%, transparent 62.5%)' },
  { blur: 2, mask: 'linear-gradient(to bottom, transparent 37.5%, #000 50%, #000 62.5%, transparent 75%)' },
  { blur: 4, mask: 'linear-gradient(to bottom, transparent 50%, #000 62.5%, #000 75%, transparent 87.5%)' },
  { blur: 8, mask: 'linear-gradient(to bottom, transparent 62.5%, #000 75%, #000 87.5%, transparent 100%)' },
  { blur: 16, mask: 'linear-gradient(to bottom, transparent 75%, #000 87.5%, #000 100%)' },
  { blur: 32, mask: 'linear-gradient(to bottom, transparent 87.5%, #000 100%)' },
]

export default function BottomBlur() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className={styles.layer}
          style={{
            zIndex: i + 1,
            WebkitMaskImage: layer.mask,
            maskImage: layer.mask,
            backdropFilter: `blur(${layer.blur}px)`,
            WebkitBackdropFilter: `blur(${layer.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}
