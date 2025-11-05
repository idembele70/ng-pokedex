import { Component, signal } from '@angular/core';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { Pokemon } from '../../models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CardItemComponent,
  ],
  template: `
  @for (pokemon of pokemons(); track pokemon._id) {
    <app-card-item [pokemon]="pokemon" />
  }

  `,
  styles: `
  :host {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 32px;
    width: 100%;
    max-width: 985px;
    margin: 0 auto;
  }
  `
})
export class PokedexComponent {
  protected readonly pokemons = signal<Pokemon[]>([
    {
      _id: "68ffadd6eb0b510a35c1c6c1",
      id: "011",
      name: "Metapod",
      img: "http://img.pokemondb.net/artwork/metapod.jpg",
      type: [
        "Bug"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c2",
      id: "014",
      name: "Kakuna",
      img: "http://img.pokemondb.net/artwork/kakuna.jpg",
      type: [
        "Bug",
        "Poison"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c3",
      id: "013",
      name: "Weedle",
      img: "http://img.pokemondb.net/artwork/weedle.jpg",
      type: [
        "Bug",
        "Poison"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c4",
      id: "016",
      name: "Pidgey",
      img: "http://img.pokemondb.net/artwork/pidgey.jpg",
      type: [
        "Normal",
        "Flying"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c5",
      id: "017",
      name: "Pidgeotto",
      img: "http://img.pokemondb.net/artwork/pidgeotto.jpg",
      type: [
        "Normal",
        "Flying"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c6",
      id: "015",
      name: "Beedrill",
      img: "http://img.pokemondb.net/artwork/beedrill.jpg",
      type: [
        "Bug",
        "Poison"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c7",
      id: "018",
      name: "Pidgeot",
      img: "http://img.pokemondb.net/artwork/pidgeot.jpg",
      type: [
        "Normal",
        "Flying"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c8",
      id: "012",
      name: "Butterfree",
      img: "http://img.pokemondb.net/artwork/butterfree.jpg",
      type: [
        "Bug",
        "Flying"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6c9",
      id: "019",
      name: "Rattata",
      img: "http://img.pokemondb.net/artwork/rattata.jpg",
      type: [
        "Normal"
      ]
    },
    {
      _id: "68ffadd6eb0b510a35c1c6ca",
      id: "021",
      name: "Spearow",
      img: "http://img.pokemondb.net/artwork/spearow.jpg",
      type: [
        "Normal",
        "Flying"
      ]
    }
  ]);
}
