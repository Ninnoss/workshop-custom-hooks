import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useReducer } from "react";

const ACTIONS = {
  IDLE: "idle",
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

function fetchReducer(state, action) {
  if (action.type === ACTIONS.PENDING) {
    return { data: null, status: ACTIONS.PENDING, errors: null };
  } else if (action.type === ACTIONS.FULFILLED) {
    return { data: action.payload, status: ACTIONS.FULFILLED, errors: null };
  } else if (action.type === ACTIONS.REJECTED) {
    return { data: null, status: ACTIONS.REJECTED, errors: action.payload };
  }
  return state;
}

async function fetchPokemon(dispatch, query) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
    const data = await res.json();
    dispatch({ type: ACTIONS.FULFILLED, payload: data });
  } catch (err) {
    dispatch({ type: ACTIONS.REJECTED, payload: ["Not found"] });
  }
}

export function usePokemon(query) {
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    status: ACTIONS.IDLE,
    errors: null,
  });

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: ACTIONS.PENDING });
      await fetchPokemon(dispatch, query);
    }
    fetchData();
  }, [query]);

  return state;
}

function Pokemon({ query }) {
  const { data: pokemon, status, errors } = usePokemon(query);

  if (status === ACTIONS.IDLE || status === ACTIONS.PENDING)
    return <h3>Loading...</h3>;
  if (status === ACTIONS.REJECTED) return <h3>Error: {errors.join(", ")}</h3>;

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value.toLowerCase());
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;

/* 
import styled from "styled-components";
import React, { useEffect, useState } from "react";

export function usePokemon(query) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
      .then(r => r.json())
      .then(data => setPokemon(data));
    //  .then(setPokemon) // this also works because the setPokemon function is passed as the callback directly. In this case, the function is 
    // still invoked with the data as an argument, as it is called internally by the .then() method. This shorthand works because the function 
    // setPokemon expects a single argument, which will be automatically passed to it by the .then() method.
    
  }, [query]);

  return { data: pokemon };
}

function Pokemon({ query }) {
  const { data: pokemon } = usePokemon(query);
  if (!pokemon) return <h3>Loading...</h3>;

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name + " front sprite"}
      />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("charmander");

  function handleSubmit(e) {
    e.preventDefault();
    setQuery(e.target.search.value.toLowerCase());
  }

  return (
    <Wrapper>
      <h1>PokéSearcher</h1>
      <Pokemon query={query} />
      <form onSubmit={handleSubmit}>
        <input type="text" name="search" defaultValue={query} />
        <button type="submit">Search</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.15);
  display: grid;
  place-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background: papayawhip;
  text-align: center;

  h1 {
    background: #ef5350;
    color: white;
    display: block;
    margin: 0;
    padding: 1rem;
    color: white;
    font-size: 2rem;
  }

  form {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }
`;

*/
