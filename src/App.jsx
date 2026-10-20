import { useEffect, useMemo, useState } from "react";
import "./App.css";
import pokemons from "./pokemon.js";

const types = ["All", ...new Set(pokemons.map(({ type }) => type))];

const typeColors = {
    Grass: "#78c850",
    Fire: "#f08030",
    Water: "#6890f0",
    Electric: "#f8d030",
    Psychic: "#f85888",
    Normal: "#a8a878",
    Ghost: "#705898",
    Dragon: "#7038f8",
    Fighting: "#c03028",
    Rock: "#b8a038",
    Bug: "#a8b820",
    Poison: "#a040a0",
    Ground: "#e0c068",
    Fairy: "#ee99ac",
    Ice: "#98d8d8",
};

const maxHP = Math.max(...pokemons.map((pokemon) => pokemon.hp));
const maxAttack = Math.max(...pokemons.map((pokemon) => pokemon.attack));

const getPokemonImage = (id) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const sortPokemon = (a, b, sortBy) => {
    switch (sortBy) {
        case "name":
            return a.name.localeCompare(b.name);
        case "hp":
            return b.hp - a.hp;
        case "attack":
            return b.attack - a.attack;
        default:
            return a.id - b.id;
    }
};

function PokemonCard({ pokemon, favorite, onToggleFavorite }) {
    const { id, name, type, hp, attack } = pokemon;
    const color = typeColors[type] || "#8b8fa3";

    const stats = [
        { label: "HP", value: hp, max: maxHP, className: "hp-fill" },
        { label: "ATTACK", value: attack, max: maxAttack, className: "attack-fill" },
    ];

    return (
        <article className="pokemon-card">
            <button
                className={`favorite-btn ${favorite ? "active" : ""}`}
                onClick={() => onToggleFavorite(id)}
                aria-label={
                    favorite ? "Remove from favorites" : "Add to favorites"
                }
                title={favorite ? "Remove favorite" : "Add favorite"}
            >
                {favorite ? "♥" : "♡"}
            </button>

            <div
                className="pokemon-art"
                style={{ backgroundColor: `${color}20` }}
            >
                <span className="pokemon-number">
                    #{String(id).padStart(3, "0")}
                </span>

                <img
                    src={getPokemonImage(id)}
                    alt={name}
                    loading="lazy"
                />
            </div>

            <div className="pokemon-info">
                <h2>{name}</h2>

                <span
                    className="type-badge"
                    style={{ backgroundColor: color }}
                >
                    {type}
                </span>

                <div className="stats">
                    {stats.map(({ label, value, max, className }) => (
                        <div className="stat" key={label}>
                            <span>{label}</span>
                            <strong>{value}</strong>

                            <div className="stat-track">
                                <div
                                    className={`stat-fill ${className}`}
                                    style={{
                                        width: `${(value / max) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

export default function App() {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [sortBy, setSortBy] = useState("id");
    const [darkMode, setDarkMode] = useState(false);

    // Apply the selected theme to the document.
    useEffect(() => {
        document.documentElement.dataset.theme = darkMode ? "dark" : "light";

        return () => {
            delete document.documentElement.dataset.theme;
        };
    }, [darkMode]);

    // Rotate the hero Pokémon every 3 seconds.
    const [heroPokemonIndex, setHeroPokemonIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroPokemonIndex(
                (current) => (current + 1) % pokemons.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const heroPokemon = pokemons[heroPokemonIndex];

    const toggleFavorite = (id) => {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((favoriteId) => favoriteId !== id)
                : [...current, id]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedType("All");
        setShowFavorites(false);
    };

    const resetExplorer = () => {
        setSearch("");
        setSelectedType("All");
        setShowFavorites(false);
        setSortBy("id");
        setFavorites([]);
        setHeroPokemonIndex(0);
    };

    const filteredPokemon = useMemo(() => {
        const query = search.trim().toLowerCase();

        return pokemons
            .filter((pokemon) => {
                const matchesSearch = pokemon.name
                    .toLowerCase()
                    .includes(query);

                const matchesType =
                    selectedType === "All" ||
                    pokemon.type === selectedType;

                const matchesFavorite =
                    !showFavorites || favorites.includes(pokemon.id);

                return matchesSearch && matchesType && matchesFavorite;
            })
            .sort((a, b) => sortPokemon(a, b, sortBy));
    }, [search, selectedType, favorites, showFavorites, sortBy]);

    return (
        <main className="app">
            <header className="hero">
                <div className="brand">
                    <div className="brand-icon">◉</div>
                    <span>POKÉDEX / EXPLORER</span>
                </div>

                <button
                    className="theme-toggle"
                    onClick={() => setDarkMode((current) => !current)}
                    aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
                    aria-pressed={darkMode}
                >
                    {darkMode ? "☀ Light mode" : "☾ Dark mode"}
                </button>

                <div className="hero-content">
                    <p className="eyebrow">YOUR ADVENTURE STARTS HERE</p>

                    <h1>
                        Discover your
                        <br />
                        <span>next favorite.</span>
                    </h1>

                    <p className="hero-description">
                        Explore Pokémon, compare their stats, and build your
                        own collection of favorites.
                    </p>

                    <div className="hero-stats">
                        <div>
                            <strong>{pokemons.length}</strong>
                            <span>POKÉMON</span>
                        </div>

                        <div>
                            <strong>{types.length - 1}</strong>
                            <span>TYPES</span>
                        </div>

                        <div>
                            <strong>{favorites.length}</strong>
                            <span>FAVORITES</span>
                        </div>
                    </div>
                </div>

                <div className="hero-decoration" aria-hidden="true">
                    <div className="hero-circle">
                        <img
                            key={heroPokemon.id}
                            src={getPokemonImage(heroPokemon.id)}
                            alt=""
                        />
                    </div>
                </div>
            </header>

            <section className="explorer">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">THE COLLECTION</p>
                        <h2>Pokémon Explorer</h2>

                        <p className="results-count">
                            Showing {filteredPokemon.length} of {pokemons.length} Pokémon
                        </p>
                    </div>
                </div>

                <div className="toolbar">
                    <label className="search-box">
                        <span>⌕</span>

                        <input
                            type="search"
                            placeholder="Search Pokémon..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </label>

                    <button
                        className={`favorites-filter ${showFavorites ? "selected" : ""}`}
                        onClick={() => setShowFavorites((current) => !current)}
                    >
                        ♥ Favorites
                        {favorites.length > 0 && ` (${favorites.length})`}
                    </button>

                    <label className="sort-control">
                        <span>Sort:</span>

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                        >
                            <option value="id">Pokédex number</option>
                            <option value="name">Name A–Z</option>
                            <option value="hp">Highest HP</option>
                            <option value="attack">Highest attack</option>
                        </select>
                    </label>

                    <button
                        className="hard-reset-btn"
                        onClick={resetExplorer}
                        title="Reset the entire Pokédex explorer"
                    >
                        ↻ Reset Filters
                    </button>
                </div>

                <div className="type-filters">
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`type-filter ${selectedType === type ? "selected" : ""}`}
                            style={
                                selectedType === type && type !== "All"
                                    ? { backgroundColor: typeColors[type] }
                                    : undefined
                            }
                        >
                            {type !== "All" && (
                                <span
                                    className="type-dot"
                                    style={{ backgroundColor: typeColors[type] }}
                                />
                            )}

                            {type}
                        </button>
                    ))}
                </div>

                {filteredPokemon.length > 0 ? (
                    <div className="pokemon-grid">
                        {filteredPokemon.map((pokemon) => (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                favorite={favorites.includes(pokemon.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span>🔎</span>
                        <h3>No Pokémon found</h3>
                        <p>Try another search or change your filters.</p>

                        <button onClick={clearFilters}>
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            <footer>
                <span>POKÉDEX / EXPLORER</span>
                <span>
                    Fabien Haury 2026 for{" "}
                    <a
                        href="https://www.react-graph-gallery.com/react-d3-dataviz-course"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        react-d3-dataviz-course
                    </a>
                </span>
                <span>Gotta explore ’em all.</span>
            </footer>
        </main>
    );
}