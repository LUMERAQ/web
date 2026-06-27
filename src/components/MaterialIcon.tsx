type Props = {
  name: string;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function MaterialIcon({ name, fill, className = '', style }: Props) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: fill ? `'FILL' 1` : undefined, ...style }}
    >
      {name}
    </span>
  );
}
