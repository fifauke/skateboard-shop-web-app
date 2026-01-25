import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortBar(props: Props) {
  return (
    <select
      className="regInput"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    >
      <option value="">Sortowanie</option>
      <option value="price_asc">Cena (rosnąco)</option>
      <option value="price_desc">Cena (malejąco)</option>
      <option value="name_desc">Nazwa (Z-A)</option>
      <option value="name_asc">Nazwa (A-Z)</option>
    </select>
  );
}
