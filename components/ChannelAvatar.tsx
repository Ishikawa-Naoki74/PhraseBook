// チャンネルアバター。アイコンURLがあれば画像を、無ければ頭文字を表示する

type Props = {
  name: string;
  iconUrl?: string | null;
  size?: number;
  /** 頭文字表示時の配色を選択状態に合わせる */
  selected?: boolean;
};

export default function ChannelAvatar({ name, iconUrl, size = 26, selected = false }: Props) {
  const radius = Math.round(size * 0.31);
  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl}
        alt=""
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: "50%",
          objectFit: "cover",
          background: "#14131d",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.round(size * 0.46),
        fontWeight: 700,
        color: selected ? "#fff" : "#b6a8e6",
        background: selected ? "linear-gradient(150deg,#8257ff,#6d3ce6)" : "rgba(124,92,255,0.14)",
      }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}
