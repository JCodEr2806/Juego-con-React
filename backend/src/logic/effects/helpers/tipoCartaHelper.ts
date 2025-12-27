import { TipoCarta } from "../../../shared/types";

export function coincideTipoCarta(
  cartaTipo: TipoCarta,
  filtro: TipoCarta | TipoCarta[] | "CUALQUIERA"
): boolean {
  if (filtro === "CUALQUIERA") return true;

  if (Array.isArray(filtro)) {
    return filtro.includes(cartaTipo);
  }

  return cartaTipo === filtro;
}
