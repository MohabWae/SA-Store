function SearchBar({ search, setSearch }) {
  return (
    <div className="search-wrapper">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for products..."
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;