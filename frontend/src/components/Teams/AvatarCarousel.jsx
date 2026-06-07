import Alphonse_Elric from "../../assets/avatars/Alphonse_Elric.png";
import dragon_ball from "../../assets/avatars/dragon_ball_logo.png";
import Edward_Elric from "../../assets/avatars/Edward_Elric.png";
import Fullmetal_Alchemist from "../../assets/avatars/Fullmetal_Alchemist.png";
import Garp from "../../assets/avatars/Garp.png";
import Goku from "../../assets/avatars/Goku.png";
import Luffy from "../../assets/avatars/Luffy.png";
import marine_logo from "../../assets/avatars/marine_logo.png";
import One_Piece_Crew from "../../assets/avatars/One_piece_Crew.png";
import Sailor_moon_crew from "../../assets/avatars/Sailor_moon_crew.png";
import Sailor_Moon  from "../../assets/avatars/Sailor_Moon.png";
import Sakura_Card_Captor from "../../assets/avatars/Sakura_Card_captor.png";
import Sanji from "../../assets/avatars/Sanji.png";
import Shanks from "../../assets/avatars/Shanks.png";
import Trunks from "../../assets/avatars/Trunks.png";
import vegeta from "../../assets/avatars/vegeta.png";
import zoro from "../../assets/avatars/zoro.png";


const avatars = [
    Alphonse_Elric,
    dragon_ball,
    Edward_Elric,
    Fullmetal_Alchemist,
    Garp,
    Goku,
    Luffy,
    marine_logo,
    One_Piece_Crew,
    Sailor_Moon,
    Sailor_moon_crew,
    Sakura_Card_Captor,
    Sanji,
    Shanks,
    Trunks,
    vegeta,
    zoro,
  
];

export default function AvatarCarousel({
  selected,
  onSelect
}) {
  return (
    <div
      className="
        flex
        gap-4
        overflow-x-auto
        pb-2
      "
    >
      {avatars.map((avatar) => (
        <img
          key={avatar}
          src={avatar}
          alt=""
          onClick={() =>
            onSelect(avatar)
          }
          className={`
            w-20
            h-20
            rounded-full
            cursor-pointer
            border-4
            ${
              selected === avatar
                ? "border-green-500"
                : "border-transparent"
            }
          `}
        />
      ))}
    </div>
  );
}

console.log(avatars);