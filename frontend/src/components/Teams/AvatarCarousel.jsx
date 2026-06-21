const avatars = [
  "/avatars/Alphonse_Elric.png",
  "/avatars/dragon_ball_logo.png",
  "/avatars/Edward_Elric.png",
  "/avatars/Fullmetal_Alchemist.png",
  "/avatars/Garp.png",
  "/avatars/Goku.png",
  "/avatars/Luffy.png",
  "/avatars/marine_logo.png",
  "/avatars/One_piece_Crew.png",
  "/avatars/Sailor_Moon.png",
  "/avatars/Sailor_moon_crew.png",
  "/avatars/Sakura_Card_captor.png",
  "/avatars/Sanji.png",
  "/avatars/Shanks.png",
  "/avatars/Trunks.png",
  "/avatars/vegeta.png",
  "/avatars/zoro.png",
];

export default function AvatarCarousel({ selected, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {avatars.map((avatar) => (
        <button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
          className={`
            w-32
            h-32
            min-w-32
            rounded-full
            overflow-hidden
            border-4
            transition
            hover:scale-105
            ${
              selected === avatar
                ? "border-green-500 shadow-[0_0_18px_#22c55e]"
                : "border-zinc-700"
            }
          `}
        >
          <img
            src={avatar}
            alt="Avatar disponível"
            className="
              w-full
              h-full
              object-cover
            "
            onError={(e) => {
              e.currentTarget.src = "/avatars/Goku.png";
            }}
          />
        </button>
      ))}
    </div>
  );
}